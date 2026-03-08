/**
 * useVoice Hook — ElevenLabs TTS + browser STT integration
 * 
 * Prepares the environment for voice I/O:
 * - TTS: Sends text to ElevenLabs API, plays audio response
 * - STT: Uses browser's native SpeechRecognition (Web Speech API)
 * 
 * Requires NEXT_PUBLIC_ELEVENLABS_API_KEY env var for TTS.
 * STT works without any API key (browser-native).
 */

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// --- ElevenLabs TTS Config ---
const ELEVENLABS_API_KEY = typeof window !== 'undefined'
  ? process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || ''
  : ''

// Default voice: "Rachel" — warm, feminine, calm (change voice_id as needed)
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'
const TTS_MODEL = 'eleven_multilingual_v2'

// --- Types ---
export interface UseVoiceOptions {
  voiceId?: string
  autoSpeak?: boolean
  language?: string
}

export interface UseVoiceReturn {
  // TTS
  speak: (text: string) => Promise<void>
  stopSpeaking: () => void
  isSpeaking: boolean
  ttsEnabled: boolean
  toggleTts: () => void
  // STT
  startListening: () => void
  stopListening: () => void
  isListening: boolean
  transcript: string
  sttSupported: boolean
  // General
  voiceReady: boolean
}

export function useVoice(options: UseVoiceOptions = {}): UseVoiceReturn {
  const {
    voiceId = DEFAULT_VOICE_ID,
    autoSpeak = false,
    language = 'es-PE',
  } = options

  // TTS state
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(autoSpeak)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)

  // STT state
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [sttSupported, setSttSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Check if ElevenLabs is configured
  const voiceReady = !!ELEVENLABS_API_KEY

  // --- STT Setup (Web Speech API) ---
  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSttSupported(false)
      return
    }

    setSttSupported(true)
    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }
      setTranscript(finalTranscript || interimTranscript)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.warn('STT error:', event.error)
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [language])

  // --- TTS: ElevenLabs ---
  const speak = useCallback(async (text: string) => {
    if (!ELEVENLABS_API_KEY || !ttsEnabled) return

    // Clean text for speech (remove emojis, markdown)
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{FE00}-\u{FE0F}|\u{1F900}-\u{1F9FF}|\u{200D}|\u{20E3}|\u{FE0F}]/gu, '')
      .replace(/[*_~`#]/g, '')
      .trim()

    if (!cleanText) return

    try {
      setIsSpeaking(true)

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: TTS_MODEL,
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      })

      if (!response.ok) {
        console.error('ElevenLabs TTS error:', response.status)
        setIsSpeaking(false)
        return
      }

      const blob = await response.blob()

      // Cleanup previous audio
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }

      const url = URL.createObjectURL(blob)
      audioUrlRef.current = url

      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        setIsSpeaking(false)
      }

      audio.onerror = () => {
        setIsSpeaking(false)
      }

      await audio.play()
    } catch (error) {
      console.error('TTS error:', error)
      setIsSpeaking(false)
    }
  }, [voiceId, ttsEnabled])

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsSpeaking(false)
  }, [])

  const toggleTts = useCallback(() => {
    if (isSpeaking) stopSpeaking()
    setTtsEnabled(prev => !prev)
  }, [isSpeaking, stopSpeaking])

  // --- STT Controls ---
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return
    setTranscript('')
    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (e) {
      console.warn('Could not start STT:', e)
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }
    }
  }, [])

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    ttsEnabled,
    toggleTts,
    startListening,
    stopListening,
    isListening,
    transcript,
    sttSupported,
    voiceReady,
  }
}
