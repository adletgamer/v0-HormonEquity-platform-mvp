'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'error_code'
  const errorDescription = searchParams.get('error_description') || 'Ocurrió un error desconocido'

  const getErrorMessage = (code: string): string => {
    switch (code) {
      case 'invalid_credentials':
        return 'Las credenciales ingresadas son inválidas'
      case 'email_not_confirmed':
        return 'Por favor confirma tu correo electrónico'
      case 'over_email_send_rate_limit':
        return 'Se han intentado demasiados correos. Intenta más tarde'
      case 'invalid_grant':
        return 'Token de sesión inválido o expirado'
      default:
        return errorDescription
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <div className="p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">Error de Autenticación</h1>

          <p className="text-muted-foreground mb-6">
            {getErrorMessage(error)}
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
              <Link href="/auth/ingresar">Intenta Ingresar de Nuevo</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿Necesitas ayuda?{' '}
            <Link href="/" className="text-primary font-medium hover:underline">
              Contacta con nosotros
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
          <Card className="w-full max-w-md p-8 text-center">
            <div className="inline-block animate-spin">
              <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="mt-4 text-muted-foreground">Procesando autenticación...</p>
          </Card>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  )
}
