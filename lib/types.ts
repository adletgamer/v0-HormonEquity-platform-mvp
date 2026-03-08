// Tipos para el chat y evaluación de síntomas

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface SymptomResponse {
  symptom: string
  severity: number // 0-10
  duration_months?: number
}

export interface ChatSessionData {
  id: string
  userId: string
  name: string
  age: number
  symptoms: SymptomResponse[]
  medicalHistory: string[]
  medications: string[]
  goals: string[]
  impactOnLife: number // 0-10
  messages: ChatMessage[]
  completed: boolean
  recommendedRoutes?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface EvaluationStep {
  stage: number
  question: string
  type: 'text' | 'scale' | 'checkbox' | 'number'
  key: string
  placeholder?: string
}
