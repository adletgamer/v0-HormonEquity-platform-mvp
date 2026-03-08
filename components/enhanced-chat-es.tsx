'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { SymptomProfile } from '@/lib/scoring-engine'
import { ChatSessionData, ChatMessage } from '@/lib/types'
import { triageSymptoms } from '@/lib/triage-engine'
import { EmergencyWarning } from './emergency-warning'
import type { TriageResult } from '@/lib/triage-engine'

interface EnhancedChatEsProps {
  userId: string
  onComplete: (sessionData: ChatSessionData, recommendedRoutes: string[]) => void
  userName?: string
}

const EVALUATION_STAGES = [
  {
    stage: 1,
    type: 'greeting',
    question: '¡Hola! Soy HormonEquity, tu compañera de salud. ¿Cuál es tu nombre?',
  },
  {
    stage: 2,
    type: 'age',
    question: '¿Cuántos años tienes?',
  },
  {
    stage: 3,
    type: 'sofocos',
    question: '¿Experimentas sofocos o sudores nocturnos? (0=No, 10=Muy severos)',
  },
  {
    stage: 4,
    type: 'menstruacion',
    question: '¿Cómo han sido tus cambios menstruales? (0=Sin cambios, 10=Cambios severos)',
  },
  {
    stage: 5,
    type: 'mood',
    question: '¿Has notado cambios en tu humor o irritabilidad? (0=No, 10=Muy severos)',
  },
  {
    stage: 6,
    type: 'insomnio',
    question: '¿Cómo está tu sueño? (0=Duermo bien, 10=Insomnio severo)',
  },
  {
    stage: 7,
    type: 'fatiga',
    question: '¿Sientes fatiga o agotamiento? (0=No, 10=Muy severo)',
  },
  {
    stage: 8,
    type: 'dolor',
    question: '¿Tienes dolor pélvico o molestias? (0=No, 10=Muy severo)',
  },
  {
    stage: 9,
    type: 'sequedad',
    question: '¿Experimentas sequedad vaginal? (0=No, 10=Muy severa)',
  },
  {
    stage: 10,
    type: 'peso',
    question: '¿Has notado ganancia de peso? (0=No, 10=Mucha ganancia)',
  },
  {
    stage: 11,
    type: 'mental',
    question: '¿Tienes problemas de concentración o "niebla mental"? (0=No, 10=Muy severo)',
  },
  {
    stage: 12,
    type: 'depression',
    question: '¿Has experimentado depresión o ansiedad? (0=No, 10=Muy severos)',
  },
  {
    stage: 13,
    type: 'duration',
    question: '¿Hace cuántos meses comenzaron estos síntomas?',
  },
  {
    stage: 14,
    type: 'impact',
    question: '¿Cuánto afectan estos síntomas tu calidad de vida? (0=No afecta, 10=Muy severo)',
  },
]

export function EnhancedChatEs({ userId, onComplete, userName }: EnhancedChatEsProps) {
  const [currentStage, setCurrentStage] = useState(1)
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null)
  const [sessionData, setSessionData] = useState<Partial<ChatSessionData>>({
    userId,
    name: userName || '',
    symptoms: [],
    medicalHistory: [],
    medications: [],
    goals: [],
    impactOnLife: 0,
    messages: [],
    completed: false,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Agregar mensaje inicial del bot
    if (messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: '1',
        role: 'assistant',
        content: EVALUATION_STAGES[0].question,
        timestamp: new Date(),
      }
      setMessages([initialMessage])
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    setIsLoading(true)

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)

    // Procesar respuesta
    const updatedSessionData = { ...sessionData, messages: newMessages }

    if (currentStage === 1) {
      // Nombre
      updatedSessionData.name = userInput
    } else if (currentStage === 2) {
      // Edad
      updatedSessionData.age = parseInt(userInput) || 0
    } else if (currentStage === 3) {
      // Sofocos
      const severity = parseInt(userInput) || 0
      if (!updatedSessionData.symptoms) updatedSessionData.symptoms = []
      updatedSessionData.symptoms.push({
        symptom: 'sofocos',
        severity,
      })
    } else if (currentStage === 4) {
      // Menstruación
      const severity = parseInt(userInput) || 0
      if (!updatedSessionData.symptoms) updatedSessionData.symptoms = []
      updatedSessionData.symptoms.push({
        symptom: 'cambios_menstruales',
        severity,
      })
    } else if (currentStage === 5) {
      // Humor
      const severity = parseInt(userInput) || 0
      if (!updatedSessionData.symptoms) updatedSessionData.symptoms = []
      updatedSessionData.symptoms.push({
        symptom: 'cambios_humor',
        severity,
      })
    } else if (currentStage === 6) {
      // Insomnio
      const severity = parseInt(userInput) || 0
      if (!updatedSessionData.symptoms) updatedSessionData.symptoms = []
      updatedSessionData.symptoms.push({
        symptom: 'insomnio',
        severity,
      })
    } else if (currentStage === 7) {
      // Fatiga
      const severity = parseInt(userInput) || 0
      if (!updatedSessionData.symptoms) updatedSessionData.symptoms = []
      updatedSessionData.symptoms.push({
        symptom: 'fatiga',
        severity,
      })
    } else if (currentStage === 8) {
      // Dolor
      const severity = parseInt(userInput) || 0
      if (!updatedSessionData.symptoms) updatedSessionData.symptoms = []
      updatedSessionData.symptoms.push({
        symptom: 'dolor_pelvico',
        severity,
      })
    } else if (currentStage === 9) {
      // Sequedad
      const severity = parseInt(userInput) || 0
      if (!updatedSessionData.symptoms) updatedSessionData.symptoms = []
      updatedSessionData.symptoms.push({
        symptom: 'sequedad_vaginal',
        severity,
      })
    } else if (currentStage === 10) {
      // Peso
      const severity = parseInt(userInput) || 0
      if (!updatedSessionData.symptoms) updatedSessionData.symptoms = []
      updatedSessionData.symptoms.push({
        symptom: 'ganancia_peso',
        severity,
      })
    } else if (currentStage === 11) {
      // Niebla mental
      const severity = parseInt(userInput) || 0
      if (!updatedSessionData.symptoms) updatedSessionData.symptoms = []
      updatedSessionData.symptoms.push({
        symptom: 'niebla_mental',
        severity,
      })
    } else if (currentStage === 12) {
      // Depresión
      const severity = parseInt(userInput) || 0
      if (!updatedSessionData.symptoms) updatedSessionData.symptoms = []
      updatedSessionData.symptoms.push({
        symptom: 'depresion_ansiedad',
        severity,
      })
    } else if (currentStage === 13) {
      // Duración
      const months = parseInt(userInput) || 0
      if (updatedSessionData.symptoms) {
        updatedSessionData.symptoms.forEach((s) => {
          s.duration_months = months
        })
      }
    } else if (currentStage === 14) {
      // Impacto
      updatedSessionData.impactOnLife = parseInt(userInput) || 0
    }

    setSessionData(updatedSessionData)

    // Preparar respuesta del bot
    let botResponse = ''
    if (currentStage < 14) {
      botResponse = EVALUATION_STAGES[currentStage].question
    } else {
      botResponse =
        '¡Gracias por completar la evaluación! Estoy analizando tus síntomas para recomendarte las mejores opciones de cuidado...'
    }

    // Simular pequeño delay para que se vea más natural
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (currentStage < 14) {
        setCurrentStage(currentStage + 1)
      } else {
        // Finalizar evaluación
        handleCompleteEvaluation(updatedSessionData)
      }

      setUserInput('')
      setIsLoading(false)
    }, 500)
  }

  const handleCompleteEvaluation = async (data: Partial<ChatSessionData>) => {
    try {
      const response = await fetch('/api/evaluacion/completar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          sessionData: data,
        }),
      })

      if (!response.ok) throw new Error('Error al completar evaluación')

      const result = await response.json()
      onComplete(result.sessionData, result.recommendedRoutes)
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content:
            'Hubo un error al procesar tu evaluación. Por favor, intenta nuevamente.',
          timestamp: new Date(),
        },
      ])
    }
  }

  return (
    <div className="flex flex-col h-full max-h-screen bg-background">
      {/* Progress Bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Paso {currentStage} de 14
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round((currentStage / 14) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStage / 14) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-foreground rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none">
              <Spinner />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {currentStage <= 14 && (
        <div className="border-t border-border px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type={
                currentStage === 2 || currentStage === 13 || currentStage === 14
                  ? 'number'
                  : currentStage >= 3 && currentStage <= 12
                    ? 'number'
                    : 'text'
              }
              placeholder={
                currentStage === 1
                  ? 'Tu nombre...'
                  : currentStage === 2
                    ? 'Tu edad...'
                    : currentStage >= 3 && currentStage <= 12
                      ? '0-10'
                      : currentStage === 13
                        ? 'Número de meses...'
                        : '0-10'
              }
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              min={currentStage >= 3 && currentStage <= 12 ? 0 : undefined}
              max={currentStage >= 3 && currentStage <= 12 ? 10 : undefined}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!userInput.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? <Spinner /> : 'Enviar'}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
