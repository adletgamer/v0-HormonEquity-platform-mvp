'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

function ConfirmEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the token from the URL
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'email') {
          setError('Token de confirmación inválido')
          setLoading(false)
          return
        }

        // Verify the token
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        })

        if (verifyError) {
          setError('El token ha expirado o es inválido')
        } else {
          setSuccess(true)
          // Redirect after 3 seconds
          setTimeout(() => {
            router.push('/auth/ingresar')
          }, 3000)
        }
      } catch (err: any) {
        setError(err.message || 'Error al confirmar tu email')
      } finally {
        setLoading(false)
      }
    }

    handleEmailConfirmation()
  }, [supabase, router, searchParams])

  if (loading) {
    return (
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
          <p className="mt-4 text-muted-foreground">Confirmando tu email...</p>
        </Card>
      </div>
    )
  }

  if (success) {
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

            <h1 className="text-3xl font-bold text-foreground mb-4">¡Email Confirmado!</h1>

            <p className="text-muted-foreground mb-6">
              Tu correo electrónico ha sido confirmado exitosamente. Tu cuenta está lista para usar.
            </p>

            <p className="text-sm text-muted-foreground mb-6">
              Redirigiendo a la página de ingreso en unos momentos...
            </p>

            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
              <Link href="/auth/ingresar">Ir a Ingresar</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
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

          <h1 className="text-3xl font-bold text-foreground mb-4">Error de Confirmación</h1>

          <p className="text-muted-foreground mb-6">
            {error || 'Ocurrió un error al confirmar tu email'}
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
              <Link href="/auth/registrarse">Intentar de Nuevo</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function ConfirmEmail() {
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
            <p className="mt-4 text-muted-foreground">Confirmando tu email...</p>
          </Card>
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  )
}
