// Sistema completo de disclaimers para cumplimiento legal y médico

export const DISCLAIMER_TIPOS = {
  MEDICAL: 'medical',
  LEGAL: 'legal',
  CONSENT: 'consent',
  EMERGENCY: 'emergency',
  PRIVACY: 'privacy'
} as const

export interface Disclaimer {
  id: string
  titulo: string
  contenido: string
  tipo: keyof typeof DISCLAIMER_TIPOS
  requiereAceptacion: boolean
  mostrarEn: 'onboarding' | 'chat' | 'resultados' | 'multiple'
}

export const DISCLAIMERS: Record<string, Disclaimer> = {
  medical_principal: {
    id: 'medical_principal',
    titulo: 'Importante: No Diagnóstico Médico',
    contenido: `HormonEquity NO es un servicio de diagnóstico médico.

La información y orientación proporcionada:
- NO reemplaza la consulta con médicos especialistas
- Es solo orientación educativa basada en síntomas reportados
- NO constituyeasesoramiento médico profesional
- NO diagnostica condiciones médicas

SOLO UN MÉDICO PUEDE:
✓ Hacer diagnósticos
✓ Prescribir tratamientos
✓ Ordenar exámenes de laboratorio
✓ Proporcionar atención médica definitiva

USAR HORMONEQUITY PARA:
• Entender tus síntomas
• Saber qué especialista consultar
• Encontrar recursos educativos
• Preparar preguntas para tu médico

Siempre consulta con un médico antes de iniciar cualquier tratamiento.`,
    tipo: 'medical',
    requiereAceptacion: true,
    mostrarEn: 'multiple'
  },

  emergencia_critica: {
    id: 'emergencia_critica',
    titulo: '🚨 Situación de Emergencia Detectada',
    contenido: `Se han detectado síntomas que requieren atención médica INMEDIATA.

NO ESPERES POR RESPUESTAS ONLINE.

LLAMA A EMERGENCIAS AHORA:
• México: 911
• Argentina: 107
• Colombia: 123
• Chile: 133
• Perú: 105
• Brasil: 192

Si experimentas:
- Sangrado vaginal abundante y prolongado
- Dolor en el pecho
- Dificultad para respirar
- Pensamientos de autolesión
- Accidente cerebrovascular

BUSCA ATENCIÓN PRESENCIAL INMEDIATAMENTE.

HormonEquity es un servicio de orientación, NO una emergencia.
Para emergencias médicas, acude a un hospital o llama a servicios de emergencia.`,
    tipo: 'emergency',
    requiereAceptacion: true,
    mostrarEn: 'chat'
  },

  consentimiento_informado: {
    id: 'consentimiento_informado',
    titulo: 'Consentimiento Informado',
    contenido: `Al utilizar HormonEquity, ACEPTAS que:

1. ENTIENDO QUE NO ES DIAGNÓSTICO
   □ Comprendo que HormonEquity NO diagnostica
   □ Entiendo que solo médicos pueden diagnosticar

2. BUSCARÉ ATENCIÓN MÉDICA SI LO NECESITO
   □ Contactaré a un médico si tengo síntomas graves
   □ Reportaré cambios en mi salud a mis médicos

3. RESPONSABILIDAD PERSONAL
   □ Entiendo que soy responsable de mis decisiones de salud
   □ No culparé a HormonEquity por decisiones médicas

4. PRIVACIDAD Y DATOS
   □ Mis datos se guardan de forma segura en Supabase
   □ No compartiré mis datos sin autorización
   □ Puedo solicitar eliminar mis datos en cualquier momento

5. CAMBIOS EN SÍNTOMAS
   □ Si mis síntomas empeoran, buscaré atención médica
   □ No confiaré solo en HormonEquity para salud crítica

ACEPTO TODOS ESTOS TÉRMINOS para usar HormonEquity.`,
    tipo: 'consent',
    requiereAceptacion: true,
    mostrarEn: 'onboarding'
  },

  responsabilidad_legal: {
    id: 'responsabilidad_legal',
    titulo: 'Limitaciones de Responsabilidad',
    contenido: `HormonEquity es una plataforma educativa.

HORMONEQUITY NO:
✗ Proporciona diagnósticos médicos
✗ Prescribe medicinas
✗ Reemplaza médicos
✗ Es responsable de decisiones médicas que tomes
✗ Garantiza resultados específicos

LIMITACIONES:
• La información es basada en auto-reporte (no verificado médicamente)
• Los síntomas pueden tener múltiples causas
• Cada persona es única - tu caso puede ser diferente

TÚ ERES RESPONSABLE DE:
• Buscar atención médica cuando sea necesario
• Compartir esta información con tus médicos
• Tomar decisiones informadas sobre tu salud
• Reportar cambios críticos a profesionales

EXCLUSIÓN DE GARANTÍAS:
HormonEquity se proporciona "TAL COMO ESTÁ" sin garantías de exactitud,
completitud o idoneidad para propósitos específicos.`,
    tipo: 'legal',
    requiereAceptacion: true,
    mostrarEn: 'multiple'
  },

  privacidad_datos: {
    id: 'privacidad_datos',
    titulo: 'Privacidad y Seguridad de Datos',
    contenido: `Tus datos están protegidos con los más altos estándares.

DÓNDE SE GUARDAN TUS DATOS:
🔒 Base de datos Supabase (cifrada)
🔒 Servidores seguros con acceso restringido
🔒 Cumplimos con estándares de privacidad internacional

CÓMO PROTEGEMOS TUS DATOS:
✓ Encriptación de datos en tránsito y reposo
✓ Contraseñas hasheadas con bcrypt
✓ Row Level Security (cada usuario ve solo sus datos)
✓ No compartimos datos con terceros
✓ Sin publicidad basada en datos personales

TUS DERECHOS:
• Acceder a tus datos en cualquier momento
• Solicitar una copia de tus datos
• Solicitar correcciones
• Solicitar eliminación (derecho al olvido)
• Retirar consentimiento

CONTACTO PARA PRIVACIDAD:
Escribenos a: privacidad@hormonequity.com

Política completa disponible en: www.hormonequity.com/privacidad`,
    tipo: 'privacy',
    requiereAceptacion: true,
    mostrarEn: 'onboarding'
  }
}

export function getDisclaimersPorPunto(punto: 'onboarding' | 'chat' | 'resultados'): Disclaimer[] {
  return Object.values(DISCLAIMERS).filter(d => 
    d.mostrarEn === punto || d.mostrarEn === 'multiple'
  )
}

export function getAllRequiredDisclaimers(): Disclaimer[] {
  return Object.values(DISCLAIMERS).filter(d => d.requiereAceptacion)
}

export function getDisclaimerTexto(id: string): string | null {
  const disclaimer = DISCLAIMERS[id]
  return disclaimer ? disclaimer.contenido : null
}
