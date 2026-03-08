// Configuración de 5 rutas de cuidado para HormonEquity

export const CARE_ROUTES = {
  teleorientacion: {
    id: 'teleorientacion',
    name: 'Teleorientación Especializada',
    description: 'Consulta virtual con especialista en ginecología perimenopáusica',
    icon: '📱',
    color: 'from-blue-500 to-cyan-500',
    duration: '30-45 minutos',
    costRange: { min: 80, max: 150 },
    currency: 'PEN',
    providers: ['Ginecólogo', 'Ginecóloga'],
    bestFor: ['Síntomas leves', 'Consulta inicial', 'Falta de acceso local'],
    includes: [
      'Consulta personalizada',
      'Análisis de síntomas',
      'Recomendaciones iniciales',
      'Acceso a grabación',
    ],
    criteria: {
      minSeverity: 1,
      symptoms: ['sofocos', 'cambios_humor', 'insomnio'],
    },
  },

  ginecologia: {
    id: 'ginecologia',
    name: 'Atención Ginecológica Completa',
    description: 'Evaluación integral con exámenes físicos y análisis',
    icon: '🏥',
    color: 'from-pink-500 to-rose-500',
    duration: '60 minutos',
    costRange: { min: 150, max: 300 },
    currency: 'PEN',
    providers: ['Ginecólogo', 'Ginecóloga especialista'],
    bestFor: ['Síntomas moderados', 'Historial complejo', 'Requiere examen físico'],
    includes: [
      'Evaluación completa',
      'Examen de pelvis',
      'Laboratorios básicos',
      'Seguimiento 1 mes',
    ],
    criteria: {
      minSeverity: 5,
      symptoms: ['cambios_menstruales', 'dolor_pelvico', 'sequedad_vaginal'],
    },
  },

  endocrinologia: {
    id: 'endocrinologia',
    name: 'Manejo Hormonal Avanzado',
    description: 'Terapia hormonal personalizada con especialista en endocrinología',
    icon: '💊',
    color: 'from-purple-500 to-indigo-500',
    duration: '45-60 minutos',
    costRange: { min: 250, max: 450 },
    currency: 'PEN',
    providers: ['Endocrinólogo', 'Endocrinóloga especialista'],
    bestFor: ['Síntomas severos', 'Requiere TRH', 'Comorbilidades endócrinas'],
    includes: [
      'Panel hormonal completo',
      'Análisis metabolismo',
      'Plan TRH personalizado',
      'Seguimiento trimestral',
    ],
    criteria: {
      minSeverity: 7,
      symptoms: [
        'sofocos_severos',
        'cambios_menstruales_severos',
        'ganancia_peso',
      ],
    },
  },

  paquete_integral: {
    id: 'paquete_integral',
    name: 'Paquete Integral Multidisciplinario',
    description: 'Atención completa con ginecología + endocrinología + psicología',
    icon: '🌟',
    color: 'from-amber-500 to-orange-500',
    duration: 'Programa 3 meses',
    costRange: { min: 800, max: 1500 },
    currency: 'PEN',
    providers: [
      'Ginecólogo',
      'Endocrinólogo',
      'Psicólogo',
      'Nutricionista',
    ],
    bestFor: ['Síntomas muy severos', 'Impacto significativo en calidad de vida'],
    includes: [
      'Evaluación integral (3 especialistas)',
      'Plan hormonal personalizado',
      'Sesiones psicológicas (4)',
      'Consulta nutrición',
      'Seguimiento mensual',
    ],
    criteria: {
      minSeverity: 8,
      symptoms: [
        'sofocos_severos',
        'cambios_menstruales_severos',
        'depresion_ansiedad',
      ],
    },
  },

  psicologia: {
    id: 'psicologia',
    name: 'Apoyo Psicológico Especializado',
    description: 'Sesiones de terapia para manejo emocional y cognitivo',
    icon: '🧠',
    color: 'from-teal-500 to-green-500',
    duration: '50 minutos/sesión',
    costRange: { min: 100, max: 200 },
    currency: 'PEN',
    providers: ['Psicólogo', 'Psicóloga clínica', 'Terapeuta'],
    bestFor: ['Impacto emocional significativo', 'Ansiedad, depresión'],
    includes: [
      'Sesión semanal (4 iniciales)',
      'Técnicas cognitivo-conductuales',
      'Plan manejo estrés',
      'Acceso a recursos',
    ],
    criteria: {
      minSeverity: 5,
      symptoms: ['depresion_ansiedad', 'cambios_humor', 'niebla_mental'],
    },
  },
}

export type CareRouteId = keyof typeof CARE_ROUTES
export type CareRoute = (typeof CARE_ROUTES)[CareRouteId]

export function getCareRoute(id: CareRouteId): CareRoute {
  return CARE_ROUTES[id]
}

export function getAllCareRoutes(): CareRoute[] {
  return Object.values(CARE_ROUTES)
}

export function formatCostRange(route: CareRoute): string {
  const { costRange, currency } = route
  if (typeof costRange === 'object' && costRange !== null && 'min' in costRange && 'max' in costRange) {
    return `S/${costRange.min}–S/${costRange.max}`
  }
  return String(costRange)
}
