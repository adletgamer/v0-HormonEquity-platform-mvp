'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CARE_ROUTES, formatCostRange, type CareRouteId } from '@/lib/care-routes'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, ArrowLeft, CreditCard } from 'lucide-react'

function ReservarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const rutaId = searchParams.get('ruta') as CareRouteId | null
  const sessionId = searchParams.get('sessionId')

  const [route, setRoute] = useState<typeof CARE_ROUTES[CareRouteId] | null>(null)
  const [amount, setAmount] = useState(0)
  const [cuotas, setCuotas] = useState(6)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaPreferida: '',
    notas: '',
  })

  useEffect(() => {
    if (rutaId && rutaId in CARE_ROUTES) {
      const r = CARE_ROUTES[rutaId as CareRouteId]
      setRoute(r)
      const mid = Math.round((r.costRange.min + r.costRange.max) / 2)
      setAmount(mid)
    } else {
      router.push('/protegido/resultados')
    }
  }, [rutaId, router])

  const cuotaMensual = cuotas > 0 ? Math.round((amount / cuotas) * 100) / 100 : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!rutaId) {
      setSubmitError('No se encontró la ruta seleccionada. Vuelve a resultados e inténtalo otra vez.')
      return
    }

    if (!sessionId) {
      setSubmitError('No encontramos la sesión de síntomas. Vuelve a completar la evaluación para continuar.')
      return
    }

    setLoading(true)

    const mode = rutaId === 'teleorientacion' ? 'virtual' : 'presencial'

    const { error } = await supabase.from('booking_requests').insert({
      route_id: rutaId,
      session_id: sessionId,
      mode,
      preferred_date: form.fechaPreferida || null,
      status: 'pending',
    })

    if (error) {
      console.error('Error creating booking request:', error)
      setSubmitError('No pudimos guardar tu solicitud en este momento. Inténtalo nuevamente en unos segundos.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Solicitud Enviada
          </h1>
          <p className="text-muted-foreground mb-8">
            Nos pondremos en contacto contigo en las próximas 24–48 horas para confirmar tu cita y los detalles de pago.
          </p>
          <Link href="/protegido/inicio">
            <Button className="bg-primary hover:bg-primary/90">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/protegido/resultados" className="flex items-center gap-2 text-foreground/70 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Volver a resultados
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Solicitar Atención</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Resumen de ruta */}
        <Card className="p-6 mb-8 border-primary/20 bg-primary/5">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{route.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-foreground">{route.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{route.description}</p>
              <p className="text-sm font-semibold text-primary mt-2">
                {formatCostRange(route)}
              </p>
            </div>
          </div>
        </Card>

        {/* Simulador financiero */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Simulador de Pago</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Monto a financiar (USD)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  min={route.costRange.min}
                  max={route.costRange.max}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="max-w-[140px]"
                />
                <span className="text-sm text-muted-foreground self-center">
                  (${route.costRange.min}–${route.costRange.max})
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm">Número de cuotas</Label>
              <div className="flex gap-2 mt-2">
                {[3, 6, 12].map((n) => (
                  <Button
                    key={n}
                    variant={cuotas === n ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCuotas(n)}
                  >
                    {n} cuotas
                  </Button>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Cuota mensual aproximada</p>
              <p className="text-2xl font-bold text-primary">${cuotaMensual} USD</p>
            </div>
          </div>
        </Card>

        {/* Formulario de solicitud */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Datos de Contacto</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
            <div>
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Tu nombre"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="tu@correo.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                placeholder="+52 55 1234 5678"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha preferida (aproximada)</Label>
              <Input
                id="fecha"
                type="date"
                value={form.fechaPreferida}
                onChange={(e) => setForm((f) => ({ ...f, fechaPreferida: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="notas">Notas adicionales</Label>
              <Textarea
                id="notas"
                value={form.notas}
                onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
                placeholder="Horario preferido, preguntas, etc."
                rows={3}
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default function ReservarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <ReservarContent />
    </Suspense>
  )
}
