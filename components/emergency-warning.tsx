import { AlertCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { TriageResult } from '@/lib/triage-engine'

interface EmergencyWarningProps {
  triageResult: TriageResult
}

export function EmergencyWarning({ triageResult }: EmergencyWarningProps) {
  if (triageResult.severity === 'opcional' || triageResult.severity === 'recomendado') {
    return null
  }

  const isEmergency = triageResult.severity === 'emergencia'

  return (
    <Card
      className={`border-2 p-6 mb-6 ${
        isEmergency
          ? 'bg-red-50 border-red-500'
          : 'bg-yellow-50 border-yellow-500'
      }`}
    >
      <div className="flex items-start gap-4">
        {isEmergency ? (
          <div className="text-4xl flex-shrink-0">🚨</div>
        ) : (
          <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
        )}

        <div className="flex-1">
          <h3
            className={`text-xl font-bold mb-2 ${
              isEmergency ? 'text-red-900' : 'text-yellow-900'
            }`}
          >
            {isEmergency
              ? 'SITUACIÓN DE EMERGENCIA MÉDICA'
              : 'Situación Prioritaria - Requiere Atención Inmediata'}
          </h3>

          <div className="mb-4 space-y-2">
            {triageResult.recommendations.map((rec, idx) => (
              <p
                key={idx}
                className={`text-sm ${
                  isEmergency
                    ? 'text-red-800'
                    : 'text-yellow-800'
                }`}
              >
                • {rec}
              </p>
            ))}
          </div>

          {isEmergency && triageResult.emergencyResources.length > 0 && (
            <div className="mt-4 pt-4 border-t-2 border-red-200">
              <p className="font-bold text-red-900 mb-3">
                Números de Emergencia por País:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {triageResult.emergencyResources.map((resource, idx) => (
                  <div key={idx} className="bg-white/50 rounded p-2">
                    <p className="font-semibold text-sm text-red-900">
                      {resource.pais}
                    </p>
                    <a
                      href={`tel:${resource.numero.replace(/\D/g, '')}`}
                      className="text-lg font-bold text-red-600 hover:text-red-700"
                    >
                      {resource.numero}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isEmergency && (
            <div className="mt-4">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <Phone className="w-4 h-4 mr-2" />
                Contactar Médico Ahora
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
