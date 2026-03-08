'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { DISCLAIMERS, getAllRequiredDisclaimers } from '@/lib/disclaimers'

export default function OrientacionPage() {
  const router = useRouter()
  const [acceptedDisclaimers, setAcceptedDisclaimers] = useState<Set<string>>(
    new Set()
  )
  const [currentStep, setCurrentStep] = useState(0)

  const requiredDisclaimers = getAllRequiredDisclaimers()

  const handleAcceptDisclaimer = (disclaimerId: string) => {
    const newAccepted = new Set(acceptedDisclaimers)
    newAccepted.add(disclaimerId)
    setAcceptedDisclaimers(newAccepted)
  }

  const handleNextStep = () => {
    if (currentStep < requiredDisclaimers.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleComplete = () => {
    if (acceptedDisclaimers.size === requiredDisclaimers.length) {
      // Guardar que el usuario vio los disclaimers
      localStorage.setItem('disclaimers_accepted', JSON.stringify({
        timestamp: new Date().toISOString(),
        acceptedIds: Array.from(acceptedDisclaimers)
      }))
      router.push('/protegido/inicio')
    }
  }

  const currentDisclaimer = requiredDisclaimers[currentStep]
  const isAccepted = acceptedDisclaimers.has(currentDisclaimer.id)
  const allAccepted = acceptedDisclaimers.size === requiredDisclaimers.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Bienvenida a HormonEquity
          </h1>
          <p className="text-lg text-muted-foreground">
            Por tu seguridad, necesitamos que entiendas cómo funciona nuestra plataforma
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              Paso {currentStep + 1} de {requiredDisclaimers.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(((currentStep + 1) / requiredDisclaimers.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / requiredDisclaimers.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Content */}
        <Card className="bg-white border-border shadow-lg mb-8">
          {/* Icon */}
          <div className="flex items-start gap-4 p-8">
            {currentDisclaimer.id === 'emergencia_critica' ? (
              <div className="text-4xl">🚨</div>
            ) : currentDisclaimer.id === 'consentimiento_informado' ? (
              <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            )}

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {currentDisclaimer.titulo}
              </h2>

              {/* Disclaimer Content */}
              <div className="prose prose-sm max-w-none mb-6">
                <pre className="whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed">
                  {currentDisclaimer.contenido}
                </pre>
              </div>

              {/* Acceptance Checkbox */}
              <div className="bg-secondary/10 rounded-lg p-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAccepted}
                    onChange={() => handleAcceptDisclaimer(currentDisclaimer.id)}
                    className="w-5 h-5 mt-1 cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-foreground">
                    Entiendo y acepto lo anterior. HormonEquity no es un servicio de
                    diagnóstico médico y asumo responsabilidad de mi salud.
                  </span>
                </label>
              </div>

              {/* Important Note */}
              {currentDisclaimer.id === 'emergencia_critica' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-900 font-semibold">
                    ⚠️ Si experimentas una emergencia médica, CUELGA AHORA y llama a
                    emergencias. No esperes por respuestas online.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Anterior
          </Button>

          <div className="flex gap-3">
            {currentStep < requiredDisclaimers.length - 1 ? (
              <Button
                onClick={handleNextStep}
                disabled={!isAccepted}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!allAccepted}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Completar y Continuar
              </Button>
            )}
          </div>
        </div>

        {/* Summary */}
        {currentStep === requiredDisclaimers.length - 1 && (
          <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-foreground mb-3">
              Resumen de Aceptación
            </h3>
            <ul className="space-y-2">
              {requiredDisclaimers.map(d => (
                <li key={d.id} className="flex items-center gap-2 text-sm">
                  {acceptedDisclaimers.has(d.id) ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-border rounded-full" />
                  )}
                  <span className="text-foreground">{d.titulo}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  )
}
