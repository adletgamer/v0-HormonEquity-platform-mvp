export interface SymptomAnalysisInput {
  narrative: string
  age?: number
  durationMonths?: number
  sleepImpact?: number
  workImpact?: number
  emotionalImpact?: number
}

export function buildSymptomAnalysisPrompt(input: SymptomAnalysisInput) {
  const system = `Eres una asistente clínica de triaje para perimenopausia.\nDevuelve SOLO JSON válido. Sin markdown, sin texto extra.`

  const user = `Analiza el caso y devuelve este esquema exacto:\n{
  "summary": "string breve en español",
  "detectedSymptoms": ["sofocos|cambios_menstruales|cambios_humor|insomnio|fatiga|dolor_pelvico|sequedad_vaginal|ganancia_peso|depresion_ansiedad|niebla_mental"],
  "severityBySymptom": {"<symptom>": 0-10},
  "durationMonths": number,
  "sleepImpact": 0-10,
  "workImpact": 0-10,
  "emotionalImpact": 0-10,
  "riskFlags": ["string"],
  "recommendedNextStep": "string"
}\n\nDatos del caso:\n- Edad: ${input.age ?? 'no especificada'}\n- Duración (meses): ${input.durationMonths ?? 'no especificada'}\n- Impacto sueño: ${input.sleepImpact ?? 'no especificado'}\n- Impacto trabajo: ${input.workImpact ?? 'no especificado'}\n- Impacto emocional: ${input.emotionalImpact ?? 'no especificado'}\n- Relato de síntomas: ${input.narrative}`

  return { system, user }
}
