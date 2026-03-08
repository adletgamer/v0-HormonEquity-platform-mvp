// Maps NavigatorResult → scored care route recommendations
import { CARE_ROUTES, type CareRouteId } from './care-routes'
import type { NavigatorResult } from '@/components/care-navigator'

export interface RouteRecommendation {
  routeId: CareRouteId
  score: number
  reasoning: string[]
  whyForYou: string
}

const IMPACT_SCORE: Record<string, number> = {
  nada: 0,
  algo: 3,
  bastante: 6,
  mucho: 10,
}

const DURATION_SCORE: Record<string, number> = {
  menos_3: 1,
  '3_6': 3,
  '6_12': 6,
  mas_12: 9,
}

export function recommendRoutes(input: NavigatorResult): RouteRecommendation[] {
  const symptoms = input.selectedSymptoms
  const sleepScore = IMPACT_SCORE[input.sleepImpact] ?? 0
  const workScore = IMPACT_SCORE[input.workImpact] ?? 0
  const emotionalScore = IMPACT_SCORE[input.emotionalImpact] ?? 0
  const durationScore = DURATION_SCORE[input.duration] ?? 0
  const overallImpact = (sleepScore + workScore + emotionalScore) / 3

  const physicalSymptoms = symptoms.filter(s =>
    ['sofocos', 'cambios_menstruales', 'sequedad_vaginal', 'dolor_pelvico', 'fatiga'].includes(s)
  )
  const emotionalSymptoms = symptoms.filter(s =>
    ['cambios_humor', 'depresion_ansiedad', 'niebla_mental', 'insomnio'].includes(s)
  )
  const hormonalSymptoms = symptoms.filter(s =>
    ['sofocos', 'cambios_menstruales', 'ganancia_peso'].includes(s)
  )

  const scores: RouteRecommendation[] = []

  // --- Teleorientación ---
  {
    let score = 0
    const reasoning: string[] = []

    if (input.isFirstTime) { score += 25; reasoning.push('Es tu primera vez buscando orientación') }
    if (overallImpact <= 5) { score += 20; reasoning.push('Impacto moderado en tu día a día') }
    if (durationScore <= 3) { score += 15; reasoning.push('Síntomas recientes') }
    if (symptoms.length <= 4) { score += 10; reasoning.push('Pocos síntomas reportados') }
    if (input.modality === 'virtual' || input.modality === 'cualquiera') { score += 10; reasoning.push('Compatible con tu preferencia de modalidad') }
    if (input.budget === 'bajo') { score += 10; reasoning.push('Dentro de tu presupuesto') }

    scores.push({
      routeId: 'teleorientacion',
      score: Math.min(100, score),
      reasoning,
      whyForYou: 'Ideal para ordenar prioridades y dar el primer paso con una especialista desde casa.',
    })
  }

  // --- Ginecología ---
  {
    let score = 0
    const reasoning: string[] = []

    if (physicalSymptoms.length >= 2) { score += 30; reasoning.push('Tienes síntomas físicos/hormonales significativos') }
    if (overallImpact >= 5) { score += 20; reasoning.push('Impacto importante en tu calidad de vida') }
    if (durationScore >= 3) { score += 15; reasoning.push('Síntomas persistentes que ameritan evaluación') }
    if (symptoms.includes('cambios_menstruales')) { score += 10; reasoning.push('Cambios en tu ciclo menstrual') }
    if (symptoms.includes('sofocos')) { score += 10; reasoning.push('Sofocos que requieren evaluación hormonal') }
    if (!input.isFirstTime) { score += 5; reasoning.push('Ya has buscado orientación antes') }

    scores.push({
      routeId: 'ginecologia',
      score: Math.min(100, score),
      reasoning,
      whyForYou: 'Para evaluar síntomas hormonales físicos con una especialista que entiende la perimenopausia.',
    })
  }

  // --- Endocrinología ---
  {
    let score = 0
    const reasoning: string[] = []

    if (hormonalSymptoms.length >= 2) { score += 25; reasoning.push('Patrón hormonal que requiere evaluación especializada') }
    if (overallImpact >= 7) { score += 25; reasoning.push('Síntomas severos que impactan significativamente') }
    if (durationScore >= 6) { score += 20; reasoning.push('Síntomas prolongados que necesitan manejo avanzado') }
    if (symptoms.includes('ganancia_peso')) { score += 10; reasoning.push('Ganancia de peso asociada a cambios metabólicos') }
    if (!input.isFirstTime) { score += 10; reasoning.push('Caso que podría beneficiarse de especialización endócrina') }

    scores.push({
      routeId: 'endocrinologia',
      score: Math.min(100, score),
      reasoning,
      whyForYou: 'Para casos donde los síntomas hormonales son persistentes o complejos y necesitan manejo especializado.',
    })
  }

  // --- Paquete Integral ---
  {
    let score = 0
    const reasoning: string[] = []

    if (symptoms.length >= 5) { score += 30; reasoning.push('Múltiples síntomas que requieren enfoque integral') }
    if (overallImpact >= 7) { score += 25; reasoning.push('Impacto severo en tu vida diaria') }
    if (physicalSymptoms.length >= 2 && emotionalSymptoms.length >= 2) {
      score += 20; reasoning.push('Combinación de síntomas físicos y emocionales')
    }
    if (input.budget === 'alto' || input.budget === 'flexible') { score += 10; reasoning.push('Tu presupuesto permite una evaluación completa') }

    scores.push({
      routeId: 'paquete_integral',
      score: Math.min(100, score),
      reasoning,
      whyForYou: 'Claridad integral con varios especialistas coordinados. Ideal cuando hay varios síntomas y quieres previsibilidad.',
    })
  }

  // --- Psicología ---
  {
    let score = 0
    const reasoning: string[] = []

    if (emotionalSymptoms.length >= 2) { score += 30; reasoning.push('Impacto emocional y cognitivo significativo') }
    if (emotionalScore >= 6) { score += 25; reasoning.push('La carga emocional está afectando tu bienestar') }
    if (symptoms.includes('insomnio') && symptoms.includes('cambios_humor')) {
      score += 15; reasoning.push('Patrón de insomnio y cambios de humor')
    }
    if (sleepScore >= 6) { score += 10; reasoning.push('El sueño se está viendo muy afectado') }
    if (symptoms.includes('depresion_ansiedad')) { score += 15; reasoning.push('Ansiedad o estado emocional que necesita acompañamiento') }

    scores.push({
      routeId: 'psicologia',
      score: Math.min(100, score),
      reasoning,
      whyForYou: 'Para el impacto emocional y mental. Porque cuidar cómo te sientes es igual de importante.',
    })
  }

  return scores.sort((a, b) => b.score - a.score)
}

export function generateSummary(input: NavigatorResult): string {
  const parts: string[] = []

  const symptomLabels: Record<string, string> = {
    sofocos: 'sofocos',
    cambios_menstruales: 'cambios en el ciclo',
    insomnio: 'problemas de sueño',
    fatiga: 'fatiga',
    cambios_humor: 'cambios de humor',
    depresion_ansiedad: 'ansiedad',
    niebla_mental: 'dificultad para concentrarte',
    ganancia_peso: 'cambios de peso',
    sequedad_vaginal: 'sequedad vaginal',
    dolor_pelvico: 'molestias pélvicas',
  }

  const labels = input.selectedSymptoms.map(s => symptomLabels[s] || s)

  if (labels.length > 0) {
    parts.push(`Nos contaste que estás experimentando ${labels.join(', ')}`)
  }

  const impactAreas: string[] = []
  if (input.sleepImpact === 'bastante' || input.sleepImpact === 'mucho') impactAreas.push('sueño')
  if (input.workImpact === 'bastante' || input.workImpact === 'mucho') impactAreas.push('trabajo')
  if (input.emotionalImpact === 'bastante' || input.emotionalImpact === 'mucho') impactAreas.push('bienestar emocional')

  if (impactAreas.length > 0) {
    parts.push(`y que esto está afectando tu ${impactAreas.join(', ')}`)
  }

  return parts.join(', ') + '.'
}
