'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, ArrowRight, Shield, Mic, MicOff, Volume2, VolumeX, Send } from 'lucide-react'
import { processUserInput, parseSymptoms, type StepType } from '@/lib/chat-intelligence'
import { useVoice } from '@/hooks/use-voice'

// --- Types ---
export interface NavigatorResult {
  name: string
  ageRange: string
  selectedSymptoms: string[]
  duration: string
  sleepImpact: string
  workImpact: string
  emotionalImpact: string
  isFirstTime: boolean
  modality: string
  budget: string
}

interface ChatBubble {
  id: string
  role: 'assistant' | 'user'
  content: string
}

interface StepOption {
  label: string
  value: string
  emoji?: string
}

// --- Step Definitions ---
const SYMPTOM_OPTIONS: StepOption[] = [
  { label: 'Sofocos o sudores', value: 'sofocos', emoji: '\uD83D\uDD25' },
  { label: 'Cambios en el ciclo', value: 'cambios_menstruales', emoji: '\uD83D\uDCC5' },
  { label: 'Insomnio o mal sue\u00f1o', value: 'insomnio', emoji: '\uD83C\uDF19' },
  { label: 'Fatiga o agotamiento', value: 'fatiga', emoji: '\uD83D\uDE34' },
  { label: 'Cambios de humor', value: 'cambios_humor', emoji: '\uD83C\uDFAD' },
  { label: 'Ansiedad o irritabilidad', value: 'depresion_ansiedad', emoji: '\uD83D\uDCAD' },
  { label: 'Niebla mental', value: 'niebla_mental', emoji: '\uD83C\uDF2B\uFE0F' },
  { label: 'Ganancia de peso', value: 'ganancia_peso', emoji: '\u2696\uFE0F' },
  { label: 'Sequedad vaginal', value: 'sequedad_vaginal', emoji: '\uD83D\uDCA7' },
  { label: 'Dolor p\u00e9lvico', value: 'dolor_pelvico', emoji: '\uD83E\uDE7A' },
]

const AGE_OPTIONS: StepOption[] = [
  { label: '35\u201339 a\u00f1os', value: '35-39' },
  { label: '40\u201344 a\u00f1os', value: '40-44' },
  { label: '45\u201349 a\u00f1os', value: '45-49' },
  { label: '50\u201354 a\u00f1os', value: '50-54' },
  { label: '55+ a\u00f1os', value: '55+' },
]

const DURATION_OPTIONS: StepOption[] = [
  { label: 'Menos de 3 meses', value: 'menos_3' },
  { label: '3 a 6 meses', value: '3_6' },
  { label: '6 a 12 meses', value: '6_12' },
  { label: 'M\u00e1s de 1 a\u00f1o', value: 'mas_12' },
]

const IMPACT_OPTIONS: StepOption[] = [
  { label: 'No me afecta', value: 'nada' },
  { label: 'Un poco', value: 'algo' },
  { label: 'Bastante', value: 'bastante' },
  { label: 'Mucho', value: 'mucho' },
]

const MODALITY_OPTIONS: StepOption[] = [
  { label: 'Virtual / telemedicina', value: 'virtual', emoji: '\uD83D\uDCBB' },
  { label: 'Presencial', value: 'presencial', emoji: '\uD83C\uDFE5' },
  { label: 'Cualquiera est\u00e1 bien', value: 'cualquiera', emoji: '\u2728' },
]

const BUDGET_OPTIONS: StepOption[] = [
  { label: 'Menos de S/150', value: 'bajo' },
  { label: 'S/150 \u2013 S/400', value: 'medio' },
  { label: 'S/400 \u2013 S/800', value: 'alto' },
  { label: 'Lo que sea necesario', value: 'flexible' },
]

const STEP_TYPES: StepType[] = ['name', 'age', 'symptoms', 'duration', 'sleep', 'work', 'emotional', 'first_time', 'modality', 'budget']

const STEP_MESSAGES: Record<StepType, string> = {
  name: '\u00a1Hola! \uD83D\uDC9A Soy tu compa\u00f1era de orientaci\u00f3n en HormonEquity. Estoy aqu\u00ed para ayudarte a entender lo que sientes y encontrar el mejor camino de cuidado para ti.\n\n\u00bfC\u00f3mo te llamas?',
  age: '',
  symptoms: '',
  duration: '\u00bfHace cu\u00e1nto tiempo empezaste a notar estos cambios?',
  sleep: '\u00bfC\u00f3mo est\u00e1 afectando tu sue\u00f1o?',
  work: '\u00bfY en tu trabajo o actividades diarias?',
  emotional: '\u00bfC\u00f3mo te ha afectado emocionalmente?',
  first_time: '\u00bfEs la primera vez que buscas orientaci\u00f3n sobre estos s\u00edntomas?',
  modality: '\u00bfC\u00f3mo preferir\u00edas recibir atenci\u00f3n?',
  budget: '\u00bfCu\u00e1l es tu presupuesto aproximado para este primer paso?',
}

interface CareNavigatorProps {
  onComplete: (result: NavigatorResult) => void
}

export function CareNavigator({ onComplete }: CareNavigatorProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState<ChatBubble[]>([])
  const [textInput, setTextInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)
  const msgIdRef = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Voice
  const voice = useVoice({ language: 'es-PE' })

  // Collected data
  const [result, setResult] = useState<Partial<NavigatorResult>>({
    selectedSymptoms: [],
    isFirstTime: true,
  })

  const currentStepType = STEP_TYPES[currentStep] || 'name'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    addAssistantMessage(STEP_MESSAGES.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When voice transcript changes and is final, set it as input
  useEffect(() => {
    if (voice.transcript && !voice.isListening) {
      setTextInput(voice.transcript)
    }
  }, [voice.transcript, voice.isListening])

  const nextId = () => {
    msgIdRef.current += 1
    return `msg-${msgIdRef.current}`
  }

  const addAssistantMessage = useCallback((content: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `msg-${++msgIdRef.current}`,
        role: 'assistant',
        content,
      }])
      setIsTyping(false)
      // Speak if TTS enabled
      voice.speak(content)
    }, 600)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice.speak])

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: `msg-${++msgIdRef.current}`,
      role: 'user',
      content,
    }])
  }

  const advanceStep = (userLabel: string, nextMessage: string) => {
    addUserMessage(userLabel)
    setTimeout(() => {
      addAssistantMessage(nextMessage)
      setCurrentStep(prev => prev + 1)
    }, 200)
  }

  // --- Apply a matched value to the current step ---
  const applyStepValue = (value: string, label: string) => {
    switch (currentStepType) {
      case 'name': {
        const name = value
        setResult(prev => ({ ...prev, name }))
        addUserMessage(name)
        setTimeout(() => {
          addAssistantMessage(`Encantada de conocerte, ${name} \uD83D\uDE0A\n\n\u00bfEn qu\u00e9 rango de edad te encuentras?`)
          setCurrentStep(1)
        }, 200)
        break
      }
      case 'age':
        setResult(prev => ({ ...prev, ageRange: value }))
        advanceStep(label, `Gracias, ${result.name}. Ahora cu\u00e9ntame, \u00bfqu\u00e9 s\u00edntomas has notado? Puedes elegir varios.`)
        break
      case 'duration':
        setResult(prev => ({ ...prev, duration: value }))
        advanceStep(label, STEP_MESSAGES.sleep)
        break
      case 'sleep':
        setResult(prev => ({ ...prev, sleepImpact: value }))
        advanceStep(label, STEP_MESSAGES.work)
        break
      case 'work':
        setResult(prev => ({ ...prev, workImpact: value }))
        advanceStep(label, STEP_MESSAGES.emotional)
        break
      case 'emotional':
        setResult(prev => ({ ...prev, emotionalImpact: value }))
        advanceStep(label, STEP_MESSAGES.first_time)
        break
      case 'first_time':
        setResult(prev => ({ ...prev, isFirstTime: value === 'true' }))
        advanceStep(label, STEP_MESSAGES.modality)
        break
      case 'modality':
        setResult(prev => ({ ...prev, modality: value }))
        advanceStep(label, STEP_MESSAGES.budget)
        break
      case 'budget': {
        const finalResult: NavigatorResult = {
          name: result.name || '',
          ageRange: result.ageRange || '',
          selectedSymptoms: result.selectedSymptoms || [],
          duration: result.duration || '',
          sleepImpact: result.sleepImpact || '',
          workImpact: result.workImpact || '',
          emotionalImpact: result.emotionalImpact || '',
          isFirstTime: result.isFirstTime ?? true,
          modality: result.modality || '',
          budget: value,
        }
        addUserMessage(label)
        setCompleted(true)
        setTimeout(() => {
          addAssistantMessage(`\u00a1Gracias por compartir todo esto conmigo, ${result.name}! \uD83D\uDC9A\n\nEstoy preparando tus recomendaciones personalizadas...`)
          setTimeout(() => onComplete(finalResult), 1500)
        }, 200)
        break
      }
    }
  }

  // --- Free text handler ---
  const handleFreeText = (e: React.FormEvent) => {
    e.preventDefault()
    const text = textInput.trim()
    if (!text || isTyping || completed) return
    setTextInput('')

    // For symptoms step, try to parse symptoms from text and add to selection
    if (currentStepType === 'symptoms') {
      const sympResult = parseSymptoms(text)
      if (sympResult) {
        addUserMessage(text)
        // Merge parsed symptoms with already-selected
        const merged = [...new Set([...selectedSymptoms, ...sympResult.matched])]
        setSelectedSymptoms(merged)
        setTimeout(() => {
          addAssistantMessage(`Detect\u00e9: ${sympResult.labels.join(', ')}. Los agregu\u00e9 a tu selecci\u00f3n. \u00bfQuieres agregar m\u00e1s o presiona "Continuar"?`)
        }, 200)
        return
      }
    }

    // Use intelligence module
    const parsed = processUserInput(text, currentStepType, result.name || '')

    if (parsed.type === 'match' && parsed.value) {
      applyStepValue(parsed.value, parsed.optionLabel || text)
      return
    }

    // For non-matching responses, show user msg + assistant response, don't advance
    addUserMessage(text)
    setTimeout(() => {
      addAssistantMessage(parsed.response)
    }, 200)
  }

  // --- Button handlers (delegate to applyStepValue) ---
  const handleAge = (opt: StepOption) => applyStepValue(opt.value, opt.label)
  const handleDuration = (opt: StepOption) => applyStepValue(opt.value, opt.label)
  const handleSleep = (opt: StepOption) => applyStepValue(opt.value, opt.label)
  const handleWork = (opt: StepOption) => applyStepValue(opt.value, opt.label)
  const handleEmotional = (opt: StepOption) => applyStepValue(opt.value, opt.label)
  const handleFirstTime = (isFirst: boolean) => applyStepValue(String(isFirst), isFirst ? 'S\u00ed, es mi primera vez' : 'No, ya he buscado antes')
  const handleModality = (opt: StepOption) => applyStepValue(opt.value, opt.label)
  const handleBudget = (opt: StepOption) => applyStepValue(opt.value, opt.label)

  const handleSymptomsConfirm = () => {
    if (selectedSymptoms.length === 0) return
    const labels = selectedSymptoms.map(v => SYMPTOM_OPTIONS.find(o => o.value === v)?.label || v)
    setResult(prev => ({ ...prev, selectedSymptoms }))
    advanceStep(labels.join(', '), STEP_MESSAGES.duration)
  }

  const toggleSymptom = (value: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const totalSteps = STEP_TYPES.length
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100)

  // Mic toggle
  const handleMicToggle = () => {
    if (voice.isListening) {
      voice.stopListening()
    } else {
      voice.startListening()
    }
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent fill-accent" />
              <span className="font-semibold text-foreground">HormonEquity</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Voice controls */}
              <button
                onClick={voice.toggleTts}
                className={`p-1.5 rounded-lg transition ${voice.ttsEnabled ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                title={voice.ttsEnabled ? 'Silenciar voz' : 'Activar voz'}
              >
                {voice.ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <span className="text-xs text-muted-foreground">
                Paso {currentStep + 1} de {totalSteps}
              </span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-card border border-border shadow-sm rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-border shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!isTyping && !completed && (
        <div className="border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto px-4 py-3">
            {/* Option Buttons per Step */}
            <div className="mb-3">
              {currentStep === 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {AGE_OPTIONS.map((opt) => (
                    <Button key={opt.value} variant="outline" onClick={() => handleAge(opt)}
                      className="rounded-xl h-auto py-2.5 text-sm hover:bg-primary/10 hover:border-primary transition">
                      {opt.label}
                    </Button>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {SYMPTOM_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => toggleSymptom(opt.value)}
                        className={`text-left px-3 py-2 rounded-xl text-sm border transition ${
                          selectedSymptoms.includes(opt.value)
                            ? 'bg-primary/10 border-primary text-foreground font-medium'
                            : 'bg-card border-border text-foreground/80 hover:border-primary/40'
                        }`}>
                        <span className="mr-1.5">{opt.emoji}</span> {opt.label}
                      </button>
                    ))}
                  </div>
                  <Button onClick={handleSymptomsConfirm} disabled={selectedSymptoms.length === 0}
                    className="w-full rounded-xl bg-primary hover:bg-primary/90">
                    Continuar ({selectedSymptoms.length} seleccionados)
                  </Button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-2 gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <Button key={opt.value} variant="outline" onClick={() => handleDuration(opt)}
                      className="rounded-xl h-auto py-2.5 text-sm hover:bg-primary/10 hover:border-primary transition">
                      {opt.label}
                    </Button>
                  ))}
                </div>
              )}

              {(currentStep === 4 || currentStep === 5 || currentStep === 6) && (
                <div className="grid grid-cols-2 gap-2">
                  {IMPACT_OPTIONS.map((opt) => (
                    <Button key={opt.value} variant="outline"
                      onClick={() => currentStep === 4 ? handleSleep(opt) : currentStep === 5 ? handleWork(opt) : handleEmotional(opt)}
                      className="rounded-xl h-auto py-2.5 text-sm hover:bg-primary/10 hover:border-primary transition">
                      {opt.label}
                    </Button>
                  ))}
                </div>
              )}

              {currentStep === 7 && (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => handleFirstTime(true)}
                    className="rounded-xl h-auto py-2.5 text-sm hover:bg-primary/10 hover:border-primary transition">
                    S\u00ed, es mi primera vez
                  </Button>
                  <Button variant="outline" onClick={() => handleFirstTime(false)}
                    className="rounded-xl h-auto py-2.5 text-sm hover:bg-primary/10 hover:border-primary transition">
                    No, ya he buscado antes
                  </Button>
                </div>
              )}

              {currentStep === 8 && (
                <div className="grid grid-cols-3 gap-2">
                  {MODALITY_OPTIONS.map((opt) => (
                    <Button key={opt.value} variant="outline" onClick={() => handleModality(opt)}
                      className="rounded-xl h-auto py-2.5 text-sm hover:bg-primary/10 hover:border-primary transition flex flex-col gap-1">
                      <span>{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </Button>
                  ))}
                </div>
              )}

              {currentStep === 9 && (
                <div className="grid grid-cols-2 gap-2">
                  {BUDGET_OPTIONS.map((opt) => (
                    <Button key={opt.value} variant="outline" onClick={() => handleBudget(opt)}
                      className="rounded-xl h-auto py-2.5 text-sm hover:bg-primary/10 hover:border-primary transition">
                      {opt.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Persistent text input — always visible */}
            <form onSubmit={handleFreeText} className="flex gap-2">
              {voice.sttSupported && (
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`flex-shrink-0 p-2.5 rounded-xl border transition ${
                    voice.isListening
                      ? 'bg-red-50 border-red-300 text-red-500 animate-pulse'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                  title={voice.isListening ? 'Dejar de escuchar' : 'Hablar con voz'}
                >
                  {voice.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
              <Input
                ref={inputRef}
                placeholder={currentStep === 0 ? 'Escribe tu nombre...' : 'Escribe o pregunta algo...'}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="flex-1 rounded-xl bg-card border-border"
              />
              <Button type="submit" disabled={!textInput.trim()} className="rounded-xl bg-primary hover:bg-primary/90 flex-shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>

            {/* Disclaimer */}
            <div className="flex items-center gap-1.5 mt-2.5 justify-center">
              <Shield className="w-3 h-3 text-muted-foreground/60" />
              <p className="text-[11px] text-muted-foreground/60">
                HormonEquity no diagnostica. Te orientamos y conectamos con especialistas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
