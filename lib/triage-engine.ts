// Sistema de Triage para detectar emergencias médicas
// Detecta síntomas graves que requieren atención inmediata

export type TriageSeverity = 'emergencia' | 'prioritario' | 'recomendado' | 'opcional'

export interface TriageResult {
  severity: TriageSeverity
  requiresImmediate: boolean
  redFlags: string[]
  recommendations: string[]
  emergencyResources: EmergencyResource[]
}

export interface EmergencyResource {
  pais: string
  linea: string
  numero: string
  disponible: string
}

const RED_FLAGS_EMERGENCIA = {
  sangrado_severo: [
    'sangrado vaginal abundante',
    'empapando más de una toalla por hora',
    'sangrado por más de 7 días'
  ],
  sintomas_cardiacos: [
    'dolor en el pecho',
    'presión en el pecho',
    'dificultad para respirar',
    'taquicardia severa',
    'palpitaciones fuertes'
  ],
  salud_mental_critica: [
    'ideación suicida',
    'pensamiento de autolesión',
    'crisis de ansiedad severa',
    'episodio psicótico'
  ],
  neurologia_critica: [
    'accidente cerebrovascular',
    'debilidad facial',
    'parálisis',
    'pérdida de visión',
    'dolor de cabeza severo con rigidez de nuca'
  ]
}

const RED_FLAGS_PRIORITARIO = {
  cambios_severos: [
    'cambio brusco en sangrado',
    'síntomas nuevos severos',
    'dolor incapacitante'
  ],
  signos_vitales: [
    'presión arterial muy alta',
    'frecuencia cardíaca anormal',
    'temperatura elevada'
  ],
  emocionales: [
    'depresión severa',
    'ansiedad incapacitante',
    'cambios de humor extremos'
  ]
}

export function triageSymptoms(symptoms: string[], severity: number[]): TriageResult {
  const lowerSymptoms = symptoms.map(s => s.toLowerCase())
  const redFlags: string[] = []
  let maxSeverity: TriageSeverity = 'opcional'

  // Verificar red flags emergencia
  for (const [category, flags] of Object.entries(RED_FLAGS_EMERGENCIA)) {
    for (const flag of flags) {
      if (lowerSymptoms.some(s => s.includes(flag))) {
        redFlags.push(`🚨 EMERGENCIA: ${flag}`)
        maxSeverity = 'emergencia'
        break
      }
    }
    if (maxSeverity === 'emergencia') break
  }

  // Si no hay emergencia, verificar prioritarios
  if (maxSeverity !== 'emergencia') {
    for (const [category, flags] of Object.entries(RED_FLAGS_PRIORITARIO)) {
      for (const flag of flags) {
        if (lowerSymptoms.some(s => s.includes(flag))) {
          redFlags.push(`⚠️ PRIORITARIO: ${flag}`)
          if (maxSeverity === 'opcional') {
            maxSeverity = 'prioritario'
          }
          break
        }
      }
    }
  }

  // Severidad basada en puntajes
  if (maxSeverity === 'opcional') {
    const avgSeverity = severity.length > 0 ? severity.reduce((a, b) => a + b) / severity.length : 0
    if (avgSeverity >= 7) {
      maxSeverity = 'prioritario'
    } else if (avgSeverity >= 5) {
      maxSeverity = 'recomendado'
    } else {
      maxSeverity = 'opcional'
    }
  }

  const recommendations = getRecommendations(maxSeverity, redFlags)
  const emergencyResources = getEmergencyResources(maxSeverity)

  return {
    severity: maxSeverity,
    requiresImmediate: maxSeverity === 'emergencia',
    redFlags,
    recommendations,
    emergencyResources
  }
}

function getRecommendations(severity: TriageSeverity, redFlags: string[]): string[] {
  const recs: string[] = []

  if (severity === 'emergencia') {
    recs.push('⚠️ SITUACIÓN DE EMERGENCIA MÉDICA DETECTADA')
    recs.push('Llama a emergencias de inmediato')
    recs.push('No esperes por orientación online en situaciones críticas')
    recs.push('Busca atención presencial inmediata')
  } else if (severity === 'prioritario') {
    recs.push('Requiere atención médica prioritaria')
    recs.push('Contacta a tu médico o visita urgencias hoy')
    recs.push('No posterguees esta evaluación')
    recs.push('Considera cuidado presencial especializado')
  } else if (severity === 'recomendado') {
    recs.push('Se recomienda cuidado médico profesional')
    recs.push('Una evaluación ginecológica sería beneficiosa')
    recs.push('HormonEquity puede ayudarte a encontrar especialistas')
  } else {
    recs.push('Síntomas leves compatibles con perimenopausia')
    recs.push('Consulta puede ser por telemedicina')
    recs.push('Monitorea tus síntomas y reporta cambios')
  }

  return recs
}

function getEmergencyResources(severity: TriageSeverity): EmergencyResource[] {
  if (severity === 'emergencia' || severity === 'prioritario') {
    return [
      {
        pais: 'México',
        linea: 'Emergencias',
        numero: '911',
        disponible: '24/7'
      },
      {
        pais: 'Argentina',
        linea: 'SAME',
        numero: '107',
        disponible: '24/7'
      },
      {
        pais: 'Colombia',
        linea: 'Emergencias',
        numero: '123',
        disponible: '24/7'
      },
      {
        pais: 'Chile',
        linea: 'Carabineros',
        numero: '133',
        disponible: '24/7'
      },
      {
        pais: 'Perú',
        linea: 'PNP',
        numero: '105',
        disponible: '24/7'
      },
      {
        pais: 'Brasil',
        linea: 'SAMU',
        numero: '192',
        disponible: '24/7'
      }
    ]
  }

  return []
}

export function shouldShowEmergencyWarning(triageResult: TriageResult): boolean {
  return triageResult.severity === 'emergencia' || triageResult.severity === 'prioritario'
}
