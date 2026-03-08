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

    // Calcular recomendaciones
    const routeScores = scoreRoutes(symptomProfile)
    const topRoutes = routeScores.slice(0, 3).map((r) => r.routeId)

    // Guardar evaluación en base de datos
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        symptom_summary: JSON.stringify(sessionData.symptoms || []),
        medical_history: sessionData.medicalHistory?.join(', ') || '',
        medications: sessionData.medications?.join(', ') || '',
        goals: sessionData.goals?.join(', ') || '',
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Error saving evaluation' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        sessionData: {
          ...sessionData,
          id: data?.[0]?.id || '',
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
