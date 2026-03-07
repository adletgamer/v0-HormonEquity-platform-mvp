'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function SignUpSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <div className="p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">¡Registro Exitoso!</h1>

          <p className="text-muted-foreground mb-6">
            Hemos enviado un correo de confirmación a tu dirección de email. Por favor, revisa tu bandeja de entrada y confirma tu cuenta para continuar.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-700 text-sm">
              💡 Si no ves el correo en unos minutos, revisa tu carpeta de spam
            </p>
          </div>

          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
            <Link href="/">Volver al Inicio</Link>
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿Ya confirmaste tu email?{' '}
            <Link href="/auth/ingresar" className="text-primary font-medium hover:underline">
              Ingresa aquí
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
