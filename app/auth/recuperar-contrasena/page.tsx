'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function RecoverPassword() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/actualizar-contrasena`,
      })

      if (recoveryError) {
        setError(recoveryError.message)
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de recuperación')
    } finally {
      setLoading(false)
    }
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">Correo Enviado</h1>

            <p className="text-muted-foreground mb-6">
              Hemos enviado las instrucciones para recuperar tu contraseña a tu correo electrónico. Por favor revisa tu bandeja de entrada.
            </p>

            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
              <Link href="/auth/ingresar">Volver a Ingresar</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Recuperar Contraseña</h1>
          <p className="text-muted-foreground mb-6">
            Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRecovery} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Correo Electrónico
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? 'Enviando...' : 'Enviar Instrucciones'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/auth/ingresar" className="text-primary font-medium hover:underline">
              Volver a Ingresar
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
