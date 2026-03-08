// Sistema de escalamiento para casos críticos

export type EscalationLevel = 'normal' | 'urgent' | 'emergency'

export interface EscalationCase {
  sessionId: string
  userId: string
  level: EscalationLevel
  symptoms: string[]
  timestamp: Date
  action: string
  resources: EscalationResource[]
}

export interface EscalationResource {
  nombre: string
  descripcion: string
  pais: string
  contacto: string
  url?: string
  tipo: 'emergencia' | 'urgente' | 'especiialista'
}

export function evaluateEscalation(
  symptoms: string[],
  severity: number[]
): EscalationLevel {
  const lowerSymptoms = symptoms.map(s => s.toLowerCase())

  // Emergencias críticas
  const emergencyPatterns = [
    'sangrado abundante',
    'dolor pecho',
    'dificultad respirar',
    'suicida',
    'autolesión',
    'accidente cerebrovascular',
    'debilidad facial',
    'parálisis',
    'pérdida visión'
  ]

  for (const pattern of emergencyPatterns) {
    if (lowerSymptoms.some(s => s.includes(pattern))) {
      return 'emergency'
    }
  }

  // Casos urgentes
  const avgSeverity = severity.length > 0 ? severity.reduce((a, b) => a + b) / severity.length : 0
  if (avgSeverity >= 7) {
    return 'urgent'
  }

  return 'normal'
}

export function getEscalationActions(level: EscalationLevel): string[] {
  const actions: Record<EscalationLevel, string[]> = {
    emergency: [
      'LLAMAR A EMERGENCIAS INMEDIATAMENTE',
      'No esperes respuesta online',
      'Busca atención presencial de emergencia',
      'Informa a tus familiares',
      'Guarda esta conversación como referencia'
    ],
    urgent: [
      'Contacta a tu médico HOY',
      'Considera ir a urgencias',
      'No postergueses esta evaluación',
      'Busca atención presencial especializada',
      'Prepara esta información para tu médico'
    ],
    normal: [
      'Busca atención médica en los próximos días',
      'Programa una cita con especialista',
      'Monitorea tus síntomas',
      'Comparte esta información con tu médico'
    ]
  }

  return actions[level]
}

export function getEscalationResources(
  level: EscalationLevel,
  pais: string
): EscalationResource[] {
  const resources: EscalationResource[] = []

  if (level === 'emergency') {
    // Recursos de emergencia por país
    const emergencyNumbers: Record<string, EscalationResource> = {
      Mexico: {
        nombre: 'Emergencias México',
        descripcion: 'Llamada a emergencias',
        pais: 'México',
        contacto: '911',
        tipo: 'emergencia'
      },
      Argentina: {
        nombre: 'SAME Argentina',
        descripcion: 'Servicio de Emergencias Médicas',
        pais: 'Argentina',
        contacto: '107',
        tipo: 'emergencia'
      },
      Colombia: {
        nombre: 'Emergencias Colombia',
        descripcion: 'Línea de Emergencias',
        pais: 'Colombia',
        contacto: '123',
        tipo: 'emergencia'
      },
      Chile: {
        nombre: 'Carabineros Chile',
        descripcion: 'Emergencias Médicas',
        pais: 'Chile',
        contacto: '133',
        tipo: 'emergencia'
      },
      Peru: {
        nombre: 'PNP Perú',
        descripcion: 'Policia Nacional del Perú',
        pais: 'Perú',
        contacto: '105',
        tipo: 'emergencia'
      },
      Brazil: {
        nombre: 'SAMU Brasil',
        descripcion: 'Serviço de Atendimento Móvel de Urgência',
        pais: 'Brasil',
        contacto: '192',
        tipo: 'emergencia'
      }
    }

    if (emergencyNumbers[pais]) {
      resources.push(emergencyNumbers[pais])
    }

    // Agregar recursos de crisis mental si aplica
    resources.push({
      nombre: 'Línea de Crisis',
      descripcion: 'Si tienes pensamiento suicida o necesitas apoyo emocional',
      pais: pais,
      contacto: 'Busca "línea de crisis" + tu país en Google',
      tipo: 'emergencia'
    })
  }

  if (level === 'urgent') {
    resources.push({
      nombre: 'Urgencias Médicas',
      descripcion: 'Busca clínicas u hospitales de urgencia en tu zona',
      pais: pais,
      contacto: 'Google Maps: "urgencias cerca de mí"',
      tipo: 'urgente'
    })

    resources.push({
      nombre: 'Telemedicina',
      descripcion: 'Consulta online urgente con médicos especialistas',
      pais: pais,
      contacto: 'Busca plataformas de telemedicina en tu país',
      tipo: 'urgente'
    })
  }

  return resources
}

export function createEscalationLog(
  sessionId: string,
  userId: string,
  symptoms: string[],
  severity: number[]
): EscalationCase {
  const level = evaluateEscalation(symptoms, severity)
  const actions = getEscalationActions(level)
  
  // Detectar país del usuario (esto sería del perfil en producción)
  const pais = 'México' // Valor por defecto, obtener del usuario real

  const resources = getEscalationResources(level, pais)

  return {
    sessionId,
    userId,
    level,
    symptoms,
    timestamp: new Date(),
    action: actions[0],
    resources
  }
}

export function shouldAutoEscalate(level: EscalationLevel): boolean {
  return level === 'emergency' || level === 'urgent'
}
