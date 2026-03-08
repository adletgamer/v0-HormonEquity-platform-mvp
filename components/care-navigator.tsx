'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Shield, Mic, MicOff, Volume2, VolumeX, Send, ArrowLeft } from 'lucide-react'
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
  { label: '35\u201339', value: '35-39' },
  { label: '40\u201344', value: '40-44' },
  { label: '45\u201349', value: '45-49' },
  { label: '50\u201354', value: '50-54' },
  { label: '55+', value: '55+' },
]

const DURATION_OPTIONS: StepOption[] = [
  { label: 'Menos de 3 meses', value: 'menos_3' },
  { label: '3 a 6 meses', value: '3_6' },
  { label: '6 a 12 meses', value: '6_12' },
  { label: 'M\u00e1s de 1 a\u00f1o', value: 'mas_12' },
]

const IMPACT_OPTIONS: StepOption[] = [
  { label: 'Nada', value: 'nada' },
  { label: 'Un poco', value: 'algo' },
  { label: 'Bastante', value: 'bastante' },
  { label: 'Mucho', value: 'mucho' },
]

const MODALITY_OPTIONS: StepOption[] = [
  { label: 'Virtual', value: 'virtual', emoji: '\uD83D\uDCBB' },
  { label: 'Presencial', value: 'presencial', emoji: '\uD83C\uDFE5' },
  { label: 'Cualquiera', value: 'cualquiera', emoji: '\u2728' },
]

const BUDGET_OPTIONS: StepOption[] = [
  { label: 'Menos de S/150', value: 'bajo' },
  { label: 'S/150 \u2013 S/400', value: 'medio' },
  { label: 'S/400 \u2013 S/800', value: 'alto' },
  { label: 'Lo que sea necesario', value: 'flexible' },
]

const STEP_TYPES: StepType[] = ['name', 'age', 'symptoms', 'duration', 'sleep', 'work', 'emotional', 'first_time', 'modality', 'budget']

const STEP_MESSAGES: Record<StepType, string> = {
  name: 'Hola. Soy el asistente de HormonEquity.\n\nPuedes contarme qu\u00e9 s\u00edntomas est\u00e1s sintiendo o c\u00f3mo te has estado sintiendo \u00faltimamente.\n\nPrimero, \u00bfc\u00f3mo te llamas?',
  age: '',
  symptoms: '',
  duration: '\u00bfHace cu\u00e1nto tiempo empezaste a notar estos cambios?',
  sleep: '\u00bfC\u00f3mo est\u00e1 afectando tu descanso?',
  work: '\u00bfY en tu d\u00eda a d\u00eda — trabajo, actividades?',
  emotional: '\u00bfC\u00f3mo te ha afectado emocionalmente?',
  first_time: '\u00bfEs la primera vez que buscas orientaci\u00f3n para esto?',
  modality: '\u00bfC\u00f3mo preferir\u00edas recibir atenci\u00f3n?',
  budget: '\u00bfCu\u00e1l es tu presupuesto aproximado para este primer paso?',
}

interface CareNavigatorProps {
  onComplete: (result: NavigatorResult) => void
}

export function CareNavigator({ onComplete }: CareNavigatorProps) {
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState<ChatBubble[]>([])
  const [textInput, setTextInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)
  const [started, setStarted] = useState(false)
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
  const homeHref = pathname?.startsWith('/protegido') ? '/protegido/inicio' : '/'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // When voice transcript changes and is final, set it as input
  useEffect(() => {
    if (voice.transcript) {
      setTextInput(voice.transcript)
    }
  }, [voice.transcript])

  const addAssistantMessage = useCallback((content: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `msg-${++msgIdRef.current}`,
        role: 'assistant',
        content,
      }])
      setIsTyping(false)
      voice.speak(content)
    }, 700)
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

  // --- Start conversation ---
  const startConversation = () => {
    setStarted(true)
    addAssistantMessage(STEP_MESSAGES.name)
  }

  // --- Voice onboarding: start with mic ---
  const startWithVoice = () => {
    setStarted(true)
    addAssistantMessage(STEP_MESSAGES.name)
    // Small delay then start listening
    setTimeout(() => {
      if (voice.sttSupported) {
        voice.startListening()
      }
    }, 1800)
  }

  // --- Apply a matched value to the current step ---
  const applyStepValue = (value: string, label: string) => {
    switch (currentStepType) {
      case 'name': {
        const name = value
        setResult(prev => ({ ...prev, name }))
        addUserMessage(name)
        setTimeout(() => {
          addAssistantMessage(`Encantada de conocerte, ${name}.\n\n\u00bfEn qu\u00e9 rango de edad te encuentras?`)
          setCurrentStep(1)
        }, 200)
        break
      }
      case 'age':
        setResult(prev => ({ ...prev, ageRange: value }))
        advanceStep(label, `Gracias, ${result.name}. Cu\u00e9ntame, \u00bfqu\u00e9 s\u00edntomas has notado? Puedes elegir varios o describirmelos con tus palabras.`)
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
        // Voice summarization
        const sympLabels = (result.selectedSymptoms || []).map(v => SYMPTOM_OPTIONS.find(o => o.value === v)?.label || v)
        const summaryMsg = `Gracias por compartir, ${result.name}. Lo que entiendo es que tus s\u00edntomas \u2014 ${sympLabels.slice(0, 3).join(', ')} \u2014 est\u00e1n afectando tu d\u00eda a d\u00eda. Estoy preparando la mejor ruta de cuidado para ti...`
        setTimeout(() => {
          addAssistantMessage(summaryMsg)
          setTimeout(() => onComplete(finalResult), 2000)
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

    if (currentStepType === 'symptoms') {
      const sympResult = parseSymptoms(text)
      if (sympResult) {
        addUserMessage(text)
        const merged = [...new Set([...selectedSymptoms, ...sympResult.matched])]
        setSelectedSymptoms(merged)
        setTimeout(() => {
          addAssistantMessage(`Detect\u00e9: ${sympResult.labels.join(', ')}. Los agregu\u00e9 a tu selecci\u00f3n. \u00bfQuieres agregar m\u00e1s o presiona \u201cContinuar\u201d?`)
        }, 200)
        return
      }
    }

    const parsed = processUserInput(text, currentStepType, result.name || '')

    if (parsed.type === 'match' && parsed.value) {
      applyStepValue(parsed.value, parsed.optionLabel || text)
      return
    }

    addUserMessage(text)
    setTimeout(() => {
      addAssistantMessage(parsed.response)
    }, 200)
  }

  // --- Button handlers ---
  const handleOption = (opt: StepOption) => applyStepValue(opt.value, opt.label)
  const handleFirstTime = (isFirst: boolean) => applyStepValue(String(isFirst), isFirst ? 'S\u00ed, es mi primera vez' : 'No, ya he buscado antes')

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

  const handleMicToggle = () => {
    if (voice.isListening) voice.stopListening()
    else voice.startListening()
  }

  // --- Welcome screen (before conversation starts) ---
  if (!started) {
    return (
      <div className="flex flex-col h-full min-h-screen bg-background">
        {/* Minimal top bar */}
        <div className="max-w-2xl mx-auto w-full px-6 pt-6">
          <Link href={homeHref} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-4 h-4" />
            Inicio
          </Link>
        </div>

        {/* Centered welcome */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md animate-fade-up">
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Heart className="w-8 h-8 text-primary fill-primary/20" />
            </div>

            {voice.sttError && (
              <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                {voice.sttError}
              </p>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
              HormonEquity
            </h1>
            <p className="text-muted-foreground mb-10 leading-relaxed text-balance">
              Cu\u00e9ntame c\u00f3mo te has sentido \u00faltimamente. Puedes hablarme o escribirme.
            </p>

            <div className="space-y-3">
              {/* Voice-first CTA */}
              <button
                onClick={startWithVoice}
                disabled={!voice.sttSupported}
                className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground rounded-2xl h-14 text-sm font-medium shadow-sm shadow-primary/20 hover:shadow-md hover:bg-primary/90 transition-all"
              >
                <div className="w-8 h-8 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                  <Mic className="w-4.5 h-4.5" />
                </div>
                {voice.sttSupported ? 'Hablar con voz' : 'Voz no disponible en este navegador'}
              </button>

              {/* Text fallback */}
              <button
                onClick={startConversation}
                className="w-full flex items-center justify-center gap-2 bg-card border border-border text-foreground rounded-2xl h-14 text-sm font-medium hover:border-primary/30 hover:shadow-sm transition-all"
              >
                Prefiero escribir
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8 text-xs text-muted-foreground/50">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Confidencial</span>
              <span>3 minutos</span>
              <span>Sin registro</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Chat interface ---
  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {/* Header — minimal, calm */}
      <div className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-primary fill-primary/30" />
              </div>
              <span className="font-medium text-sm text-foreground">HormonEquity</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={voice.toggleTts}
                className={`p-1.5 rounded-lg transition-colors ${voice.ttsEnabled ? 'bg-primary/10 text-primary' : 'text-muted-foreground/50 hover:text-muted-foreground'}`}
                title={voice.ttsEnabled ? 'Silenciar voz' : 'Activar voz'}
              >
                {voice.ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <span className="text-[11px] text-muted-foreground/60 tabular-nums">
                {currentStep + 1}/{totalSteps}
              </span>
            </div>
          </div>
          {/* Thin progress bar */}
          <div className="w-full bg-border/50 rounded-full h-1">
            <div
              className="bg-primary/60 h-1 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
              style={{ animationDelay: `${Math.min(idx * 50, 200)}ms` }}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 bg-primary/8 rounded-lg flex items-center justify-center mr-2.5 mt-1 flex-shrink-0">
                  <Heart className="w-3.5 h-3.5 text-primary/60" />
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
                  : 'bg-card border border-border/60 shadow-sm rounded-2xl rounded-bl-md text-foreground'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="w-7 h-7 bg-primary/8 rounded-lg flex items-center justify-center mr-2.5 mt-1 flex-shrink-0">
                <Heart className="w-3.5 h-3.5 text-primary/60" />
              </div>
              <div className="bg-card border border-border/60 shadow-sm px-4 py-3.5 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse-soft" />
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse-soft delay-200" />
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse-soft delay-400" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!isTyping && !completed && (
        <div className="border-t border-border/50 bg-background/80 backdrop-blur-md">
          <div className="max-w-2xl mx-auto px-4 py-3 space-y-3">
            {/* Option chips */}
            {currentStep === 1 && (
              <div className="flex flex-wrap gap-2">
                {AGE_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => handleOption(opt)}
                    className="px-4 py-2 rounded-full text-sm border border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-2.5">
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => toggleSymptom(opt.value)}
                      className={`px-3 py-2 rounded-full text-sm border transition-all ${
                        selectedSymptoms.includes(opt.value)
                          ? 'bg-primary/10 border-primary/40 text-foreground font-medium'
                          : 'bg-card border-border/60 text-foreground/70 hover:border-primary/30'
                      }`}>
                      <span className="mr-1">{opt.emoji}</span>{opt.label}
                    </button>
                  ))}
                </div>
                {selectedSymptoms.length > 0 && (
                  <Button onClick={handleSymptomsConfirm}
                    className="w-full rounded-xl bg-primary hover:bg-primary/90 h-11 text-sm font-medium">
                    Continuar con {selectedSymptoms.length} s\u00edntoma{selectedSymptoms.length > 1 ? 's' : ''}
                  </Button>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => handleOption(opt)}
                    className="px-4 py-2 rounded-full text-sm border border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {(currentStep === 4 || currentStep === 5 || currentStep === 6) && (
              <div className="flex flex-wrap gap-2">
                {IMPACT_OPTIONS.map((opt) => (
                  <button key={opt.value}
                    onClick={() => handleOption(opt)}
                    className="px-4 py-2 rounded-full text-sm border border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {currentStep === 7 && (
              <div className="flex gap-2">
                <button onClick={() => handleFirstTime(true)}
                  className="flex-1 px-4 py-2.5 rounded-full text-sm border border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                  S\u00ed, primera vez
                </button>
                <button onClick={() => handleFirstTime(false)}
                  className="flex-1 px-4 py-2.5 rounded-full text-sm border border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                  Ya he buscado antes
                </button>
              </div>
            )}

            {currentStep === 8 && (
              <div className="flex gap-2">
                {MODALITY_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => handleOption(opt)}
                    className="flex-1 px-3 py-2.5 rounded-full text-sm border border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all text-center">
                    <span className="mr-1">{opt.emoji}</span>{opt.label}
                  </button>
                ))}
              </div>
            )}

            {currentStep === 9 && (
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => handleOption(opt)}
                    className="px-4 py-2 rounded-full text-sm border border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Text + voice input */}
            <form onSubmit={handleFreeText} className="flex items-center gap-2">
              {voice.sttSupported && (
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    voice.isListening
                      ? 'bg-primary/10 border border-primary/30 text-primary animate-pulse-soft'
                      : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30'
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
                className="flex-1 rounded-xl bg-card border-border/60 h-10 text-sm"
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-primary/90 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {(voice.isListening || voice.sttError) && (
              <div className="rounded-xl border border-border/60 bg-card px-3 py-2 text-xs">
                {voice.isListening ? (
                  <p className="text-primary">Te escucho... habla con naturalidad y presiona el micrófono para detener.</p>
                ) : (
                  <p className="text-amber-700">{voice.sttError}</p>
                )}
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-center gap-1.5 justify-center">
              <Shield className="w-3 h-3 text-muted-foreground/40" />
              <p className="text-[10px] text-muted-foreground/40">
                No diagnosticamos. Te orientamos y conectamos con especialistas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
