import { createClient } from '@/lib/supabase/server'
import { scoreRoutes, type SymptomProfile } from '@/lib/scoring-engine'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionData } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verificar que el usuario está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Construir perfil de síntomas para scoring
    const symptomProfile: SymptomProfile = {
      symptoms: {
        sofocos: 0,
        cambios_menstruales: 0,
        cambios_humor: 0,
        insomnio: 0,
        fatiga: 0,
        dolor_pelvico: 0,
        sequedad_vaginal: 0,
        ganancia_peso: 0,
        depresion_ansiedad: 0,
        niebla_mental: 0,
      },
      duration_months: 0,
      impact_on_life: sessionData.impactOnLife || 0,
      medical_history: sessionData.medicalHistory || [],
    }

    // Mapear síntomas al perfil
    if (sessionData.symptoms && Array.isArray(sessionData.symptoms)) {
      sessionData.symptoms.forEach((sym: any) => {
        if (symptomProfile.symptoms.hasOwnProperty(sym.symptom)) {
          symptomProfile.symptoms[sym.symptom as keyof typeof symptomProfile.symptoms] = sym.severity || 0
          if (sym.duration_months) {
            symptomProfile.duration_months = sym.duration_months
          }
        }
      })
    }

    const symptoms = Array.isArray(sessionData.symptoms) ? sessionData.symptoms : []
    const durationMonths = symptoms.reduce(
      (max: number, sym: any) => Math.max(max, Number(sym?.duration_months) || 0),
      0,
    )

    const sleepImpact = Number(
      symptoms.find((sym: any) => sym?.symptom === 'insomnio')?.severity || 0,
    )

    const emotionalSignals = symptoms.filter((sym: any) =>
      ['cambios_humor', 'depresion_ansiedad', 'niebla_mental'].includes(sym?.symptom),
    )
    const emotionalImpact = emotionalSignals.length
      ? Math.round(
          emotionalSignals.reduce(
            (acc: number, sym: any) => acc + (Number(sym?.severity) || 0),
            0,
          ) / emotionalSignals.length,
        )
      : 0

    const workImpact = Number(sessionData.impactOnLife || 0)
    const topSymptomsText = symptoms
      .filter((sym: any) => Number(sym?.severity) > 0)
      .sort((a: any, b: any) => Number(b?.severity || 0) - Number(a?.severity || 0))
      .slice(0, 4)
      .map((sym: any) => `${sym.symptom} (${sym.severity}/10)`)
      .join(', ')

    const summaryGenerated = topSymptomsText
      ? `Síntomas predominantes: ${topSymptomsText}.`
      : 'No se registraron síntomas con severidad mayor a 0.'

    // Calcular recomendaciones
    const routeScores = scoreRoutes(symptomProfile)
    const topRoutes = routeScores.slice(0, 3).map((r) => r.routeId)

    // Guardar sesión base del intake
    const { data: sessionRow, error: sessionError } = await supabase
      .from('symptom_sessions')
      .insert({
        user_id: userId,
        symptoms,
        sleep_impact: sleepImpact,
        work_impact: workImpact,
        emotional_impact: emotionalImpact,
        duration_months: durationMonths,
        summary_generated: summaryGenerated,
      })
      .select('id')
      .single()

    if (sessionError) {
      console.error('Database error creating symptom_sessions:', sessionError)
      return NextResponse.json(
        { error: 'Error saving symptom session' },
        { status: 500 }
      )
    }

    const recommendationsPayload = routeScores.slice(0, 3).map((score) => ({
      session_id: sessionRow.id,
      route_type: score.routeId,
      explanation: score.reasoning.join('. '),
      confidence_score: score.score,
    }))

    const { error: recommendationsError } = await supabase
      .from('recommendations')
      .insert(recommendationsPayload)

    if (recommendationsError) {
      console.error('Database error creating recommendations:', recommendationsError)
      return NextResponse.json(
        { error: 'Error saving recommendations' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        sessionData: {
          ...sessionData,
          id: sessionRow?.id || '',
          completed: true,
          recommendedRoutes: topRoutes,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        recommendedRoutes: topRoutes,
        routeScores: routeScores.map((rs) => ({
          routeId: rs.routeId,
          score: rs.score,
          reasoning: rs.reasoning,
        })),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
