import type { CareRouteId } from '@/lib/care-routes'

export interface RouteRecommendation {
  routeId: CareRouteId
  confidence: number
  explanation: string
}

export interface RoutingInput {
  detectedSymptoms: string[]
  durationMonths: number
  sleepImpact: number
  workImpact: number
  emotionalImpact: number
}

export function recommendRoutesFromSymptoms(input: RoutingInput): RouteRecommendation[] {
  const scores: Record<CareRouteId, number> = {
    teleorientacion: 35,
    ginecologia: 20,
    endocrinologia: 15,
    paquete_integral: 10,
    psicologia: 15,
  }

  const reasons: Record<CareRouteId, string[]> = {
    teleorientacion: ['Es un buen primer paso para orientar prioridades clínicas.'],
    ginecologia: [],
    endocrinologia: [],
    paquete_integral: [],
    psicologia: [],
  }

  const has = (sym: string) => input.detectedSymptoms.includes(sym)
  const overallImpact = Math.round((input.sleepImpact + input.workImpact + input.emotionalImpact) / 3)

  if (has('cambios_menstruales') || has('dolor_pelvico') || has('sequedad_vaginal')) {
    scores.ginecologia += 25
    reasons.ginecologia.push('Predominio de síntomas ginecológicos.')
  }

  if (has('sofocos') || has('ganancia_peso')) {
    scores.endocrinologia += 20
    reasons.endocrinologia.push('Patrón hormonal compatible con evaluación endocrina.')
  }

  if (has('depresion_ansiedad') || has('cambios_humor') || has('niebla_mental') || input.emotionalImpact >= 6) {
    scores.psicologia += 25
    reasons.psicologia.push('Carga emocional/cognitiva relevante.')
  }

  if (input.durationMonths >= 8) {
    scores.ginecologia += 10
    scores.endocrinologia += 10
    reasons.ginecologia.push('Persistencia de síntomas por varios meses.')
    reasons.endocrinologia.push('Persistencia prolongada, posible manejo especializado.')
  }

  if (overallImpact >= 7 || input.detectedSymptoms.length >= 5) {
    scores.paquete_integral += 35
    reasons.paquete_integral.push('Múltiples frentes afectados, conviene enfoque multidisciplinario.')
  }

  if (overallImpact <= 5 && input.detectedSymptoms.length <= 3) {
    scores.teleorientacion += 20
    reasons.teleorientacion.push('Impacto leve-moderado, ideal iniciar con teleorientación.')
  }

  return (Object.keys(scores) as CareRouteId[])
    .map((routeId) => ({
      routeId,
      confidence: Math.min(100, scores[routeId]),
      explanation: reasons[routeId].join(' '),
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
}
