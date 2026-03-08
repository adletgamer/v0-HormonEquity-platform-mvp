import { FEATHERLESS_MODEL, getFeatherlessClient } from '@/lib/ai/featherless-client'
import { buildSymptomAnalysisPrompt, type SymptomAnalysisInput } from '@/lib/ai/prompts'

export interface SymptomAnalysisResult {
  summary: string
  detectedSymptoms: string[]
  severityBySymptom: Record<string, number>
  durationMonths: number
  sleepImpact: number
  workImpact: number
  emotionalImpact: number
  riskFlags: string[]
  recommendedNextStep: string
}

function clamp(value: unknown, fallback = 0) {
  const n = Number(value)
  if (Number.isNaN(n)) return fallback
  return Math.max(0, Math.min(10, Math.round(n)))
}

function safeJsonParse(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function fallbackAnalysis(input: SymptomAnalysisInput): SymptomAnalysisResult {
  const narrative = input.narrative.toLowerCase()
  const matched: string[] = []

  const map: Array<[RegExp, string]> = [
    [/sofoco|bochorno|calor|sudor/i, 'sofocos'],
    [/menstr|regla|periodo|ciclo/i, 'cambios_menstruales'],
    [/insomnio|dormir|desvelo/i, 'insomnio'],
    [/fatig|cansancio|agot/i, 'fatiga'],
    [/humor|irrita|animo/i, 'cambios_humor'],
    [/ansied|depres|angust|triste/i, 'depresion_ansiedad'],
    [/niebla|memoria|concentra/i, 'niebla_mental'],
    [/peso|engord/i, 'ganancia_peso'],
    [/sequedad|vaginal/i, 'sequedad_vaginal'],
    [/pelv|vientre|abdom|dolor/i, 'dolor_pelvico'],
  ]

  for (const [pattern, symptom] of map) {
    if (pattern.test(narrative)) matched.push(symptom)
  }

  return {
    summary: matched.length
      ? `Se detectan síntomas compatibles con: ${matched.join(', ')}.`
      : 'No se detectaron síntomas específicos con suficiente claridad.',
    detectedSymptoms: matched,
    severityBySymptom: Object.fromEntries(matched.map((s) => [s, 6])),
    durationMonths: Number(input.durationMonths ?? 0),
    sleepImpact: clamp(input.sleepImpact),
    workImpact: clamp(input.workImpact),
    emotionalImpact: clamp(input.emotionalImpact),
    riskFlags: [],
    recommendedNextStep: 'Continuar con evaluación clínica estructurada.',
  }
}

export async function analyzeSymptomsWithAI(input: SymptomAnalysisInput): Promise<SymptomAnalysisResult> {
  const { system, user } = buildSymptomAnalysisPrompt(input)

  try {
    const client = getFeatherlessClient()
    const completion = await client.chat.completions.create({
      model: FEATHERLESS_MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    })

    const raw = completion.choices[0]?.message?.content || ''
    const parsed = safeJsonParse(raw)

    if (!parsed) {
      return fallbackAnalysis(input)
    }

    return {
      summary: String(parsed.summary || ''),
      detectedSymptoms: Array.isArray(parsed.detectedSymptoms)
        ? parsed.detectedSymptoms.map((v) => String(v))
        : [],
      severityBySymptom: typeof parsed.severityBySymptom === 'object' && parsed.severityBySymptom
        ? Object.fromEntries(
            Object.entries(parsed.severityBySymptom as Record<string, unknown>).map(([k, v]) => [
              k,
              clamp(v),
            ]),
          )
        : {},
      durationMonths: Number(parsed.durationMonths ?? input.durationMonths ?? 0),
      sleepImpact: clamp(parsed.sleepImpact, clamp(input.sleepImpact)),
      workImpact: clamp(parsed.workImpact, clamp(input.workImpact)),
      emotionalImpact: clamp(parsed.emotionalImpact, clamp(input.emotionalImpact)),
      riskFlags: Array.isArray(parsed.riskFlags) ? parsed.riskFlags.map((v) => String(v)) : [],
      recommendedNextStep: String(parsed.recommendedNextStep || ''),
    }
  } catch (error) {
    console.error('Featherless analysis failed:', error)
    return fallbackAnalysis(input)
  }
}
