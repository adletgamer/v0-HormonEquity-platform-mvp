/**
 * Chat Intelligence Module
 * Handles free-text parsing, FAQ responses, validation, and conversational fallbacks.
 * All in Spanish with warm, non-clinical tone.
 */

// --- Types ---
export type StepType = 'name' | 'age' | 'symptoms' | 'duration' | 'sleep' | 'work' | 'emotional' | 'first_time' | 'modality' | 'budget'

export interface ParseResult {
  type: 'match' | 'question' | 'unclear' | 'greeting' | 'thanks' | 'emergency'
  value?: string
  optionLabel?: string
  response: string
}

// --- FAQ Knowledge Base ---
const FAQ_RESPONSES: { patterns: RegExp[]; answer: string }[] = [
  {
    patterns: [/qu[eé]\s*(es|hace|ofrece)\s*hormonequity/i, /qu[eé]\s*es\s*esto/i, /para\s*qu[eé]\s*(sirve|es)/i],
    answer: 'HormonEquity es tu compañera de orientación en salud hormonal femenina. Te ayudo a entender tus síntomas, encontrar la ruta de cuidado más adecuada y darte claridad sobre costos. No diagnostico — te conecto con especialistas. 💚',
  },
  {
    patterns: [/diagn[oó]stic/i, /me\s*puede[ns]?\s*diagnosticar/i, /qu[eé]\s*tengo/i, /esto\s*es\s*menopausia/i],
    answer: 'No puedo darte un diagnóstico — eso solo lo puede hacer un profesional de salud. Lo que sí puedo hacer es ayudarte a organizar lo que sientes y orientarte hacia el especialista correcto. ¿Seguimos con la evaluación? 😊',
  },
  {
    patterns: [/cu[aá]nto\s*(cuesta|vale|cobran|sale)/i, /precio/i, /costo/i, /tarifa/i],
    answer: 'Los costos dependen de la ruta que mejor se ajuste a ti. Una teleorientación empieza desde S/80, y al final de esta conversación te mostraré un desglose claro con opciones de pago. ¿Continuamos para poder darte cifras personalizadas?',
  },
  {
    patterns: [/es\s*gratis/i, /cobran\s*por\s*esto/i, /pagar/i],
    answer: 'Esta orientación es completamente gratuita. Solo pagarías si decides agendar con un especialista, y antes de eso te mostraré todos los costos de forma transparente. Sin sorpresas. 💚',
  },
  {
    patterns: [/segur[oa]/i, /privacidad/i, /datos/i, /confidencial/i],
    answer: 'Tu información es completamente confidencial. No compartimos datos personales con terceros. Todo lo que me cuentes aquí se usa solo para darte la mejor orientación posible.',
  },
  {
    patterns: [/emergencia/i, /sangrado\s*(fuerte|abundante|excesivo)/i, /dolor\s*(muy\s*)?fuerte/i, /desmay/i, /urgen/i],
    answer: '⚠️ Si estás experimentando una emergencia médica (sangrado abundante, dolor severo, desmayo), por favor llama a emergencias o acude al centro médico más cercano de inmediato.\n\nLínea de emergencias Perú: 113 (SAMU)\n\nSi no es una emergencia pero quieres continuar, estoy aquí para ti.',
  },
  {
    patterns: [/m[eé]dic[oa]/i, /especialista/i, /doctor/i, /profesional/i, /qui[eé]n\s*(me\s*)?(atiende|ve|atienda)/i],
    answer: 'Trabajamos con ginecólogas, endocrinólogas, psicólogas y nutricionistas especializadas en salud hormonal femenina. Al final de esta evaluación, te recomendaré el tipo de especialista más adecuado para ti.',
  },
  {
    patterns: [/perimenopausia/i, /menopausia/i, /qu[eé]\s*es\s*(la\s*)?perimeno/i],
    answer: 'La perimenopausia es la transición hormonal que puede empezar desde los 35-40 años. Incluye cambios en el ciclo, sofocos, cambios de humor, fatiga y más. Es normal y tratable — y precisamente para eso estoy aquí, para orientarte. 😊',
  },
  {
    patterns: [/c[oó]mo\s*funciona/i, /qu[eé]\s*sigue/i, /qu[eé]\s*pasa\s*despu[eé]s/i, /proceso/i],
    answer: 'Es simple: te hago unas preguntas cortas sobre lo que sientes, y al final te doy una recomendación personalizada con costos claros y opciones de pago. Todo toma unos 3-4 minutos. ¿Seguimos?',
  },
  {
    patterns: [/no\s*(quiero|s[eé]|entiendo)/i, /no\s*me\s*(interesa|conviene)/i],
    answer: 'Está bien, no hay presión. Si prefieres, puedes usar los botones de abajo para responder más rápido. Y si tienes alguna duda, solo pregúntame. Estoy aquí para ti, a tu ritmo. 💚',
  },
]

// --- Text-to-Option Matchers per Step ---

function parseAge(text: string): ParseResult | null {
  const clean = text.toLowerCase().replace(/[^a-záéíóúñ0-9\s]/g, '')
  const numMatch = clean.match(/(\d{2})/)
  if (numMatch) {
    const age = parseInt(numMatch[1])
    if (age >= 35 && age <= 39) return { type: 'match', value: '35-39', optionLabel: '35–39 años', response: '' }
    if (age >= 40 && age <= 44) return { type: 'match', value: '40-44', optionLabel: '40–44 años', response: '' }
    if (age >= 45 && age <= 49) return { type: 'match', value: '45-49', optionLabel: '45–49 años', response: '' }
    if (age >= 50 && age <= 54) return { type: 'match', value: '50-54', optionLabel: '50–54 años', response: '' }
    if (age >= 55) return { type: 'match', value: '55+', optionLabel: '55+ años', response: '' }
    if (age < 35) return { type: 'unclear', response: `Entiendo que tienes ${age} años. Nuestra orientación está diseñada para mujeres desde los 35 años, pero si estás experimentando síntomas, igual puedo ayudarte. ¿Quieres elegir el rango más cercano?` }
  }

  if (/treinta\s*y\s*cinco|treinta\s*y\s*seis|treinta\s*y\s*siete|treinta\s*y\s*ocho|treinta\s*y\s*nueve/i.test(clean))
    return { type: 'match', value: '35-39', optionLabel: '35–39 años', response: '' }
  if (/cuarenta(?!\s*y)|cuarenta\s*y\s*(uno|dos|tres|cuatro)/i.test(clean))
    return { type: 'match', value: '40-44', optionLabel: '40–44 años', response: '' }
  if (/cuarenta\s*y\s*(cinco|seis|siete|ocho|nueve)/i.test(clean))
    return { type: 'match', value: '45-49', optionLabel: '45–49 años', response: '' }
  if (/cincuenta(?!\s*y)|cincuenta\s*y\s*(uno|dos|tres|cuatro)/i.test(clean))
    return { type: 'match', value: '50-54', optionLabel: '50–54 años', response: '' }
  if (/cincuenta\s*y\s*(cinco|seis|siete|ocho|nueve)|sesenta|setenta/i.test(clean))
    return { type: 'match', value: '55+', optionLabel: '55+ años', response: '' }

  return null
}

function parseDuration(text: string): ParseResult | null {
  const clean = text.toLowerCase()
  if (/menos\s*de\s*3|pocas?\s*semanas|rec[ié]en|hace\s*poco|un\s*mes|dos\s*meses/i.test(clean))
    return { type: 'match', value: 'menos_3', optionLabel: 'Menos de 3 meses', response: '' }
  if (/3\s*a\s*6|tres\s*a\s*seis|medio\s*a[ñn]o|algunos\s*meses|varios\s*meses/i.test(clean))
    return { type: 'match', value: '3_6', optionLabel: '3 a 6 meses', response: '' }
  if (/6\s*a\s*12|seis\s*a\s*doce|casi\s*un\s*a[ñn]o|medio\s*a[ñn]o\s*o\s*m[aá]s/i.test(clean))
    return { type: 'match', value: '6_12', optionLabel: '6 a 12 meses', response: '' }
  if (/m[aá]s\s*de\s*(un\s*)?a[ñn]o|a[ñn]os|mucho\s*tiempo|bastante\s*tiempo|hace\s*rato/i.test(clean))
    return { type: 'match', value: 'mas_12', optionLabel: 'Más de 1 año', response: '' }
  return null
}

function parseImpact(text: string): ParseResult | null {
  const clean = text.toLowerCase()
  if (/^no$|no\s*me\s*afecta|nada|para\s*nada|normal|bien|ning[uú]n/i.test(clean))
    return { type: 'match', value: 'nada', optionLabel: 'No me afecta', response: '' }
  if (/un\s*poco|algo|leve|a\s*veces|de\s*vez\s*en\s*cuando|poquito/i.test(clean))
    return { type: 'match', value: 'algo', optionLabel: 'Un poco', response: '' }
  if (/bastante|regular|considerable|moderado|seguido|frecuente/i.test(clean))
    return { type: 'match', value: 'bastante', optionLabel: 'Bastante', response: '' }
  if (/mucho|demasiado|terribl|horrible|fatal|muy\s*mal|insoportable|todo\s*el\s*tiempo/i.test(clean))
    return { type: 'match', value: 'mucho', optionLabel: 'Mucho', response: '' }
  return null
}

function parseFirstTime(text: string): ParseResult | null {
  const clean = text.toLowerCase()
  if (/^s[ií]$|primera\s*vez|nunca\s*(he|habia|había)|no\s*he\s*(ido|buscado|consultado)|jamás/i.test(clean))
    return { type: 'match', value: 'true', optionLabel: 'Sí, es mi primera vez', response: '' }
  if (/^no$|ya\s*(he|fui|busqu[eé]|consult[eé])|antes|anterior|ya\s*me\s*(vieron|atendieron)/i.test(clean))
    return { type: 'match', value: 'false', optionLabel: 'No, ya he buscado antes', response: '' }
  return null
}

function parseModality(text: string): ParseResult | null {
  const clean = text.toLowerCase()
  if (/virtual|online|tele|remot|desde\s*casa|por\s*internet|videollamada/i.test(clean))
    return { type: 'match', value: 'virtual', optionLabel: 'Virtual / telemedicina', response: '' }
  if (/presencial|persona|consultorio|cl[ií]nica|ir\s*a|fisic/i.test(clean))
    return { type: 'match', value: 'presencial', optionLabel: 'Presencial', response: '' }
  if (/cualquier|da\s*igual|no\s*importa|ambos|las\s*dos|lo\s*que\s*sea/i.test(clean))
    return { type: 'match', value: 'cualquiera', optionLabel: 'Cualquiera está bien', response: '' }
  return null
}

function parseBudget(text: string): ParseResult | null {
  const clean = text.toLowerCase()
  const numMatch = clean.match(/(\d+)/)
  if (numMatch) {
    const amount = parseInt(numMatch[1])
    if (amount < 150) return { type: 'match', value: 'bajo', optionLabel: 'Menos de S/150', response: '' }
    if (amount <= 400) return { type: 'match', value: 'medio', optionLabel: 'S/150 – S/400', response: '' }
    if (amount <= 800) return { type: 'match', value: 'alto', optionLabel: 'S/400 – S/800', response: '' }
    return { type: 'match', value: 'flexible', optionLabel: 'Lo que sea necesario', response: '' }
  }
  if (/poco|bajo|econ[oó]mic|barato|m[ií]nimo|ajustado/i.test(clean))
    return { type: 'match', value: 'bajo', optionLabel: 'Menos de S/150', response: '' }
  if (/lo\s*que\s*sea|no\s*importa|flexible|sin\s*l[ií]mite|necesario/i.test(clean))
    return { type: 'match', value: 'flexible', optionLabel: 'Lo que sea necesario', response: '' }
  return null
}

function parseSymptoms(text: string): { matched: string[]; labels: string[] } | null {
  const clean = text.toLowerCase()
  const symptomMap: { pattern: RegExp; value: string; label: string }[] = [
    { pattern: /sofoco|sudor|calor|bochorno|acalorada/i, value: 'sofocos', label: 'Sofocos o sudores' },
    { pattern: /ciclo|menstr|regla|periodo|per[ií]odo/i, value: 'cambios_menstruales', label: 'Cambios en el ciclo' },
    { pattern: /insomnio|dormir|sue[ñn]o|despierto|desvelo|noche/i, value: 'insomnio', label: 'Insomnio o mal sueño' },
    { pattern: /fatig|cansan|agota|energia|energ[ií]a|exhaust/i, value: 'fatiga', label: 'Fatiga o agotamiento' },
    { pattern: /humor|irritab|enojad|lloro|llorar|sensib/i, value: 'cambios_humor', label: 'Cambios de humor' },
    { pattern: /ansied|ansiosa|depresi|triste|angustia|nervio/i, value: 'depresion_ansiedad', label: 'Ansiedad o irritabilidad' },
    { pattern: /niebla|mental|concentra|olvido|memoria|confus/i, value: 'niebla_mental', label: 'Niebla mental' },
    { pattern: /peso|engord|kilos|gorda|subido/i, value: 'ganancia_peso', label: 'Ganancia de peso' },
    { pattern: /sequ|vaginal|lubric|resec/i, value: 'sequedad_vaginal', label: 'Sequedad vaginal' },
    { pattern: /dolor|p[eé]lvic|abdom|calambre|barriga/i, value: 'dolor_pelvico', label: 'Dolor pélvico' },
  ]

  const matched: string[] = []
  const labels: string[] = []
  for (const s of symptomMap) {
    if (s.pattern.test(clean) && !matched.includes(s.value)) {
      matched.push(s.value)
      labels.push(s.label)
    }
  }
  return matched.length > 0 ? { matched, labels } : null
}

// --- Common Patterns ---
function isGreeting(text: string): boolean {
  return /^(hola|hey|buenas|buenos?\s*d[ií]as|buenas?\s*(tardes|noches)|hi|hello|qu[eé]\s*tal)/i.test(text.trim())
}

function isThanks(text: string): boolean {
  return /^(gracias|thanks|muchas?\s*gracias|te\s*agradezco|genial|perfecto|ok|okay|vale|dale)/i.test(text.trim())
}

function isQuestion(text: string): boolean {
  return /\?/.test(text) || /^(qu[eé]|c[oó]mo|cu[aá]ndo|cu[aá]nto|d[oó]nde|por\s*qu[eé]|qui[eé]n|para\s*qu[eé]|es\s+)/i.test(text.trim())
}

// --- Main Parser ---
export function processUserInput(text: string, currentStep: StepType, userName: string): ParseResult {
  const trimmed = text.trim()

  // Empty input
  if (!trimmed) {
    return { type: 'unclear', response: 'No alcancé a leer eso. ¿Podrías intentar de nuevo? También puedes usar los botones de abajo. 😊' }
  }

  // Check for emergency keywords first
  if (/emergencia|sangrado\s*(fuerte|abundante|excesivo)|desmay|urgen|112|911/i.test(trimmed)) {
    return {
      type: 'emergency',
      response: '⚠️ Si estás experimentando una emergencia médica, por favor llama a emergencias o acude al centro médico más cercano.\n\nLínea de emergencias Perú: 113 (SAMU)\n\nSi no es una emergencia, estoy aquí para ayudarte. ¿Seguimos?',
    }
  }

  // Check greetings
  if (isGreeting(trimmed)) {
    const greetings = [
      `¡Hola${userName ? ', ' + userName : ''}! 😊 Qué gusto. ¿Seguimos con la evaluación?`,
      `¡Hola! Me alegra que estés aquí. ¿Continuamos?`,
      `¡Buenas! 💚 Estoy aquí para ti. ¿Seguimos?`,
    ]
    return { type: 'greeting', response: greetings[Math.floor(Math.random() * greetings.length)] }
  }

  // Check thanks
  if (isThanks(trimmed)) {
    return { type: 'thanks', response: '¡Con mucho gusto! 💚 ¿Seguimos con la siguiente pregunta?' }
  }

  // Check FAQ questions
  if (isQuestion(trimmed) || trimmed.length > 60) {
    for (const faq of FAQ_RESPONSES) {
      if (faq.patterns.some(p => p.test(trimmed))) {
        return { type: 'question', response: faq.answer }
      }
    }
  }

  // Try step-specific parsing
  switch (currentStep) {
    case 'name': {
      // Validate name: no numbers, reasonable length, not just symbols
      const nameClean = trimmed.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g, '').trim()
      if (nameClean.length < 2) {
        return { type: 'unclear', response: 'No pude captar bien tu nombre. ¿Podrías escribirlo de nuevo?' }
      }
      if (nameClean.length > 50) {
        return { type: 'unclear', response: '¿Me podrías dar solo tu primer nombre? Así nos sentimos más cercanas. 😊' }
      }
      return { type: 'match', value: nameClean, optionLabel: nameClean, response: '' }
    }

    case 'age': {
      const ageResult = parseAge(trimmed)
      if (ageResult) return ageResult
      return { type: 'unclear', response: 'No pude entender tu edad. ¿Podrías decirme tu edad con un número (por ejemplo "tengo 45 años") o usar los botones de abajo?' }
    }

    case 'symptoms': {
      const sympResult = parseSymptoms(trimmed)
      if (sympResult) {
        return {
          type: 'match',
          value: JSON.stringify(sympResult.matched),
          optionLabel: sympResult.labels.join(', '),
          response: `Entiendo. Detecté que mencionas: ${sympResult.labels.join(', ')}. ¿Quieres agregar más síntomas con los botones o continuamos con estos?`,
        }
      }
      return { type: 'unclear', response: 'Cuéntame más sobre lo que sientes. Por ejemplo: "tengo sofocos y no puedo dormir bien". También puedes elegir de los botones de abajo. 😊' }
    }

    case 'duration': {
      const durResult = parseDuration(trimmed)
      if (durResult) return durResult
      return { type: 'unclear', response: '¿Podrías decirme hace cuánto tiempo empezaron estos cambios? Por ejemplo: "hace unos 6 meses" o "hace más de un año". También puedes usar los botones.' }
    }

    case 'sleep':
    case 'work':
    case 'emotional': {
      const impactResult = parseImpact(trimmed)
      if (impactResult) return impactResult
      const contextMap = { sleep: 'tu sueño', work: 'tu trabajo', emotional: 'emocionalmente' }
      return { type: 'unclear', response: `¿Qué tanto te afecta en ${contextMap[currentStep]}? Puedes decir "mucho", "un poco", "bastante" o "nada", o usar los botones.` }
    }

    case 'first_time': {
      const ftResult = parseFirstTime(trimmed)
      if (ftResult) return ftResult
      return { type: 'unclear', response: '¿Es la primera vez que buscas ayuda para estos síntomas? Un simple "sí" o "no" está perfecto. 😊' }
    }

    case 'modality': {
      const modResult = parseModality(trimmed)
      if (modResult) return modResult
      return { type: 'unclear', response: '¿Preferirías atención virtual (videollamada), presencial (en consultorio), o cualquiera de las dos?' }
    }

    case 'budget': {
      const budResult = parseBudget(trimmed)
      if (budResult) return budResult
      return { type: 'unclear', response: '¿Cuánto podrías invertir en este primer paso? Puede ser un monto aproximado en soles o puedes elegir de las opciones de abajo.' }
    }

    default:
      break
  }

  // Generic fallback
  const fallbacks = [
    `Gracias por compartir eso${userName ? ', ' + userName : ''}. Para poder orientarte mejor, ¿podrías usar los botones de abajo o responder la pregunta actual?`,
    `Entiendo. Para avanzar, ¿podrías responder la pregunta que te hice? También puedes usar los botones. 💚`,
    `No quiero malinterpretar lo que me dices. ¿Podrías usar los botones o reformular tu respuesta?`,
  ]
  return { type: 'unclear', response: fallbacks[Math.floor(Math.random() * fallbacks.length)] }
}

export { parseSymptoms }
