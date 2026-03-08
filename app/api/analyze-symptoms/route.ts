import { NextRequest, NextResponse } from 'next/server'
import { analyzeSymptomsWithAI } from '@/lib/ai/symptom-analysis'
import { recommendRoutesFromSymptoms } from '@/lib/ai/symptom-routing'
import { createClient } from '@/lib/supabase/server'

interface AnalyzeSymptomsRequest {
  narrative: string
  age?: number
  durationMonths?: number
  sleepImpact?: number
  workImpact?: number
  emotionalImpact?: number
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalyzeSymptomsRequest

    if (!body?.narrative || typeof body.narrative !== 'string') {
      return NextResponse.json({ error: 'narrative is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const analysis = await analyzeSymptomsWithAI({
      narrative: body.narrative,
      age: body.age,
      durationMonths: body.durationMonths,
      sleepImpact: body.sleepImpact,
      workImpact: body.workImpact,
      emotionalImpact: body.emotionalImpact,
    })

    const topRecommendations = recommendRoutesFromSymptoms({
      detectedSymptoms: analysis.detectedSymptoms,
      durationMonths: Number(analysis.durationMonths || 0),
      sleepImpact: Number(analysis.sleepImpact || 0),
      workImpact: Number(analysis.workImpact || 0),
      emotionalImpact: Number(analysis.emotionalImpact || 0),
    })

    const symptomsForDb = analysis.detectedSymptoms.map((symptom) => ({
      symptom,
      severity: Number(analysis.severityBySymptom[symptom] || 0),
      duration_months: Number(analysis.durationMonths || 0),
    }))

    const { data: sessionRow, error: sessionError } = await supabase
      .from('symptom_sessions')
      .insert({
        user_id: user.id,
        symptoms: symptomsForDb,
        sleep_impact: Number(analysis.sleepImpact || 0),
        work_impact: Number(analysis.workImpact || 0),
        emotional_impact: Number(analysis.emotionalImpact || 0),
        duration_months: Number(analysis.durationMonths || 0),
        summary_generated: analysis.summary,
      })
      .select('id')
      .single()

    if (sessionError) {
      console.error('Error creating symptom_sessions in analyze-symptoms:', sessionError)
      return NextResponse.json({ error: 'Error saving symptom session' }, { status: 500 })
    }

    const recommendationsPayload = topRecommendations.map((rec) => ({
      session_id: sessionRow.id,
      route_type: rec.routeId,
      explanation: rec.explanation,
      confidence_score: rec.confidence,
    }))

    const { error: recommendationsError } = await supabase
      .from('recommendations')
      .insert(recommendationsPayload)

    if (recommendationsError) {
      console.error('Error creating recommendations in analyze-symptoms:', recommendationsError)
      return NextResponse.json({ error: 'Error saving recommendations' }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        sessionId: sessionRow.id,
        analysis,
        recommendations: topRecommendations,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('analyze-symptoms API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
