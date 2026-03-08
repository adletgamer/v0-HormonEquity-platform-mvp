'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ConversationData {
  nombre: string
  edad: string
  sintomas: string[]
  antecedentes_medicos: string
  medicamentos: string
  objetivos: string
}

const STAGES = [
  { id: 'inicio', prompt: '¡Hola! Soy tu asistente de salud de HormonEquity. Para empezar, ¿cuál es tu nombre?' },
  { id: 'edad', prompt: '¿Cuántos años tienes?' },
  { id: 'sintomas', prompt: '¿Cuáles son los síntomas que estás experimentando? Por favor, describelos.' },
  { id: 'antecedentes', prompt: '¿Tienes antecedentes médicos relevantes que debamos conocer? (Ej: diabetes, hipertensión, etc.)' },
  { id: 'medicamentos', prompt: '¿Estás tomando algún medicamento actualmente?' },
  { id: 'objetivos', prompt: '¿Cuál es tu objetivo principal al usar HormonEquity?' },
  { id: 'confirmacion', prompt: '¡Perfecto! Resumamos tu información:' },
]

const RESPUESTAS_AUTOMATICAS: Record<string, string> = {
  inicio: '¡Gracias por visitarnos! Vamos a recopilar información importante sobre tu salud.',
  edad: 'Entendido. Esto nos ayuda a personalizar mejor las recomendaciones.',
  sintomas: 'Tus síntomas son muy comunes durante esta etapa. Continuemos.',
  antecedentes: 'Gracias por compartir esto. Es importante para una evaluación completa.',
  medicamentos: 'Excelente información. Los medicamentos son relevantes para nuestras recomendaciones.',
  objetivos: 'Perfecto. Basándose en toda esta información, podemos ayudarte mejor.',
}

export default function ChatInterfaceEs({ userId }: { userId: string }) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [currentStage, setCurrentStage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [conversationData, setConversationData] = useState<Partial<ConversationData>>({})
  const [showSummary, setShowSummary] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Inicializar el chat
  useEffect(() => {
    const initialMessage: Message = {
      role: 'assistant',
      content: STAGES[0].prompt,
    }
    setMessages([initialMessage])
  }, [])

  const saveConversation = async () => {
    if (!userId) return

    try {
      const { error } = await supabase.from('chat_sessions').insert({
        user_id: userId,
        symptom_summary: conversationData.sintomas?.join(', ') || '',
        medical_history: conversationData.antecedentes_medicos || '',
        medications: conversationData.medicamentos || '',
        goals: conversationData.objetivos || '',
      })

      if (error) {
        console.error('Error saving conversation:', error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Actualizar datos según la etapa actual
    const stageId = STAGES[currentStage].id
    const newConversationData = { ...conversationData }

    switch (stageId) {
      case 'inicio':
        newConversationData.nombre = input
        break
      case 'edad':
        newConversationData.edad = input
        break
      case 'sintomas':
        newConversationData.sintomas = [input]
        break
      case 'antecedentes':
        newConversationData.antecedentes_medicos = input
        break
      case 'medicamentos':
        newConversationData.medicamentos = input
        break
      case 'objetivos':
        newConversationData.objetivos = input
        break
    }

    setConversationData(newConversationData)

    // Simular respuesta del asistente
    setTimeout(() => {
      let assistantResponse = ''

      if (currentStage < STAGES.length - 1) {
        assistantResponse = RESPUESTAS_AUTOMATICAS[stageId] || 'Gracias por tu respuesta.'
        setCurrentStage((prev) => Math.min(prev + 1, STAGES.length - 1))

        // Mostrar la siguiente pregunta
        const nextMessage: Message = {
          role: 'assistant',
          content: STAGES[currentStage + 1].prompt,
        }

        setMessages((prev) => [...prev, { role: 'assistant', content: assistantResponse }])
        setMessages((prev) => [...prev, nextMessage])
      } else {
        // Mostrar resumen final
        const summary = `
Perfecto, ${newConversationData.nombre}. Aquí está tu resumen:

**Información Básica:**
- Nombre: ${newConversationData.nombre}
- Edad: ${newConversationData.edad} años

**Síntomas:**
${newConversationData.sintomas?.map((s) => `- ${s}`).join('\n')}

**Antecedentes Médicos:**
${newConversationData.antecedentes_medicos}

**Medicamentos Actuales:**
${newConversationData.medicamentos}

**Objetivo Principal:**
${newConversationData.objetivos}

---

Con esta información, podemos ofrecerte:
✓ Recomendaciones personalizadas
✓ Acceso a especialistas certificados
✓ Planes de seguimiento adaptados a tu caso
✓ Recursos educativos exclusivos

¿Te gustaría proceder con una consulta especializada?
        `

        assistantResponse = summary
        setShowSummary(true)
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: assistantResponse }])
      setLoading(false)
    }, 1000)

    // Guardar en base de datos si es el resumen final
    if (currentStage === STAGES.length - 1) {
      saveConversation()
    }
  }

  const handleBookConsultation = async () => {
    // Aquí se implementaría la lógica para agendar una consulta
    alert('Función de agendamiento disponible en la próxima fase')
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b">
          <h2 className="font-bold text-foreground">Evaluación de Salud - HormonEquity</h2>
          <p className="text-sm text-muted-foreground">
            Etapa {currentStage + 1} de {STAGES.length}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-muted text-foreground rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white space-y-3">
          {showSummary && (
            <Button
              onClick={handleBookConsultation}
              className="w-full bg-accent hover:bg-accent/90 text-white"
            >
              Agendar Consulta Especializada
            </Button>
          )}

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu respuesta aquí..."
              disabled={loading || showSummary}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim() || showSummary}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Enviar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
