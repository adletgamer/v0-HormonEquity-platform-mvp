import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import type { Disclaimer } from '@/lib/disclaimers'

interface DisclaimerModalProps {
  disclaimer: Disclaimer | null
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

export function DisclaimerModal({
  disclaimer,
  isOpen,
  onAccept,
  onDecline
}: DisclaimerModalProps) {
  if (!disclaimer) return null

  const isEmergency = disclaimer.id === 'emergencia_critica'

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            {isEmergency ? (
              <div className="text-3xl">🚨</div>
            ) : (
              <AlertCircle className="w-6 h-6 text-accent mt-1" />
            )}
            <div>
              <DialogTitle className="text-2xl">{disclaimer.titulo}</DialogTitle>
              {isEmergency && (
                <DialogDescription className="text-red-600 font-semibold mt-1">
                  SITUACIÓN CRÍTICA - Lee esto completamente
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed bg-muted p-4 rounded-lg">
            {disclaimer.contenido}
          </pre>
        </div>

        {isEmergency && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 my-4">
            <p className="text-red-900 font-bold text-center">
              ⚠️ Si tienes una emergencia médica, CUELGA AHORA y llama a emergencias.
              No esperes respuestas online.
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={onDecline}>
            {isEmergency ? 'Entendido' : 'Declinar'}
          </Button>
          <Button onClick={onAccept} className="bg-primary hover:bg-primary/90">
            Aceptar y Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
