// Motor de scoring para mapear síntomas a rutas de cuidado
import { CARE_ROUTES, type CareRouteId } from './care-routes'

export interface SymptomProfile {
  symptoms: {
    sofocos: number // 0-10
    cambios_menstruales: number
    cambios_humor: number
    insomnio: number
    fatiga: number
    dolor_pelvico: number
    sequedad_vaginal: number
    ganancia_peso: number
    depresion_ansiedad: number
    niebla_mental: number
  }
  duration_months: number
  impact_on_life: number // 0-10 (cómo afecta su vida diaria)
  medical_history: string[]
}

export interface RouteScore {
  routeId: CareRouteId
  score: number // 0-100
  reasoning: string[]
}

export function calculateSymptomSeverity(profile: SymptomProfile): number {
  const symptomValues = Object.values(profile.symptoms)
  const average = symptomValues.reduce((a, b) => a + b, 0) / symptomValues.length
  return Math.min(10, average)
}

export function scoreRoutes(profile: SymptomProfile): RouteScore[] {
  const severity = calculateSymptomSeverity(profile)
  const scores: RouteScore[] = []

  // Scoring para Teleorientación
  const teleScore = scoreTeleorientacion(profile, severity)
  scores.push(teleScore)

  // Scoring para Ginecología
  const ginoScore = scoreGinecologia(profile, severity)
  scores.push(ginoScore)

  // Scoring para Endocrinología
  const endoScore = scoreEndocrinologia(profile, severity)
  scores.push(endoScore)

  // Scoring para Paquete Integral
  const paqueteScore = scorePaqueteIntegral(profile, severity)
  scores.push(paqueteScore)

  // Scoring para Psicología
  const psicoScore = scorePsicologia(profile, severity)
  scores.push(psicoScore)

  // Ordenar por puntuación descendente
  return scores.sort((a, b) => b.score - a.score)
}

function scoreTeleorientacion(profile: SymptomProfile, severity: number): RouteScore {
  let score = 0
  const reasoning: string[] = []

  // Ideal para síntomas leves a moderados
  if (severity <= 5) {
    score += 30
    reasoning.push('Síntomas leves a moderados')
  } else if (severity <= 7) {
    score += 15
    reasoning.push('Síntomas moderados pueden beneficiarse de consulta inicial')
  }

  // Buena para consulta inicial
  if (profile.duration_months <= 6) {
    score += 20
    reasoning.push('Síntomas recientes, ideal para evaluación inicial')
  }

  // Si no hay impacto severo en vida
  if (profile.impact_on_life <= 5) {
    score += 20
    reasoning.push('Impacto leve a moderado en calidad de vida')
  }

  // Sin comorbilidades complejas
  if (profile.medical_history.length <= 2) {
    score += 15
    reasoning.push('Historial médico simple')
  }

  // Baja accesibilidad = mejor para tele
  score += 5 // Base score siempre presente

  return {
    routeId: 'teleorientacion',
    score: Math.min(100, score),
    reasoning,
  }
}

function scoreGinecologia(profile: SymptomProfile, severity: number): RouteScore {
  let score = 0
  const reasoning: string[] = []

  // Síntomas ginecológicos específicos
  const ginoSymptoms =
    profile.symptoms.cambios_menstruales +
    profile.symptoms.dolor_pelvico +
    profile.symptoms.sequedad_vaginal
  if (ginoSymptoms > 15) {
    score += 40
    reasoning.push('Síntomas ginecológicos significativos')
  } else if (ginoSymptoms > 10) {
    score += 25
    reasoning.push('Síntomas ginecológicos moderados')
  } else if (ginoSymptoms > 0) {
    score += 10
    reasoning.push('Algunos síntomas ginecológicos presentes')
  }

  // Severidad moderada a alta
  if (severity >= 5) {
    score += 20
    reasoning.push('Severidad justifica evaluación completa')
  }

  // Duración > 6 meses
  if (profile.duration_months > 6) {
    score += 15
    reasoning.push('Síntomas persistentes requieren evaluación física')
  }

  // Impacto en vida
  if (profile.impact_on_life > 5) {
    score += 15
    reasoning.push('Impacto significativo en calidad de vida')
  }

  return {
    routeId: 'ginecologia',
    score: Math.min(100, score),
    reasoning,
  }
}

function scoreEndocrinologia(profile: SymptomProfile, severity: number): RouteScore {
  let score = 0
  const reasoning: string[] = []

  // Síntomas metabólicos/hormonales
  const endoSymptoms =
    profile.symptoms.sofocos +
    profile.symptoms.cambios_menstruales +
    profile.symptoms.ganancia_peso
  if (endoSymptoms > 20) {
    score += 35
    reasoning.push('Síntomas hormonales significativos')
  } else if (endoSymptoms > 15) {
    score += 20
    reasoning.push('Patrón hormonal notable')
  }

  // Severidad alta
  if (severity >= 7) {
    score += 30
    reasoning.push('Severidad alta requiere manejo hormonal especializado')
  } else if (severity >= 5) {
    score += 15
  }

  // Historia de diabetes, tiroides, etc
  if (
    profile.medical_history.includes('diabetes') ||
    profile.medical_history.includes('hipotiroidismo') ||
    profile.medical_history.includes('tiroides')
  ) {
    score += 25
    reasoning.push('Comorbilidad endócrina requiere especialista')
  }

  // Ganancia de peso significativa
  if (profile.symptoms.ganancia_peso >= 7) {
    score += 15
    reasoning.push('Ganancia de peso significativa')
  }

  return {
    routeId: 'endocrinologia',
    score: Math.min(100, score),
    reasoning,
  }
}

function scorePaqueteIntegral(profile: SymptomProfile, severity: number): RouteScore {
  let score = 0
  const reasoning: string[] = []

  // Solo para casos severos
  if (severity >= 8) {
    score += 40
    reasoning.push('Síntomas muy severos requieren enfoque integral')
  } else if (severity >= 7) {
    score += 20
    reasoning.push('Severidad alta podría beneficiarse de enfoque multidisciplinario')
  }

  // Múltiples síntomas de diferentes categorías
  const symptomCount = Object.values(profile.symptoms).filter((s) => s > 0).length
  if (symptomCount >= 7) {
    score += 30
    reasoning.push('Síntomas múltiples requieren equipo multidisciplinario')
  }

  // Impacto severo en vida
  if (profile.impact_on_life >= 8) {
    score += 25
    reasoning.push('Impacto muy severo en calidad de vida')
  }

  // Síntomas psicológicos + físicos
  const psycoSymptoms = profile.symptoms.depresion_ansiedad + profile.symptoms.niebla_mental
  const physicalSymptoms = profile.symptoms.sofocos + profile.symptoms.cambios_menstruales
  if (psycoSymptoms > 10 && physicalSymptoms > 10) {
    score += 20
    reasoning.push('Combinación de síntomas físicos y psicológicos')
  }

  return {
    routeId: 'paquete_integral',
    score: Math.min(100, score),
    reasoning,
  }
}

function scorePsicologia(profile: SymptomProfile, severity: number): RouteScore {
  let score = 0
  const reasoning: string[] = []

  // Síntomas emocionales
  const emotionalScore =
    profile.symptoms.depresion_ansiedad +
    profile.symptoms.cambios_humor +
    profile.symptoms.niebla_mental
  if (emotionalScore > 15) {
    score += 40
    reasoning.push('Síntomas emocionales/cognitivos significativos')
  } else if (emotionalScore > 10) {
    score += 25
    reasoning.push('Impacto emocional notable')
  } else if (emotionalScore > 0) {
    score += 10
  }

  // Historia de depresión/ansiedad
  if (
    profile.medical_history.includes('depresion') ||
    profile.medical_history.includes('ansiedad') ||
    profile.medical_history.includes('salud mental')
  ) {
    score += 30
    reasoning.push('Antecedente de depresión/ansiedad')
  }

  // Impacto en vida > 5
  if (profile.impact_on_life > 5) {
    score += 15
    reasoning.push('Impacto en funcionamiento diario')
  }

  // Insomnio + cambios humor
  if (profile.symptoms.insomnio > 5 && profile.symptoms.cambios_humor > 5) {
    score += 15
    reasoning.push('Patrón de insomnio y cambios de humor')
  }

  return {
    routeId: 'psicologia',
    score: Math.min(100, score),
    reasoning,
  }
}

export function getTopRecommendations(
  scores: RouteScore[],
  count: number = 3,
): RouteScore[] {
  return scores.slice(0, count)
}
