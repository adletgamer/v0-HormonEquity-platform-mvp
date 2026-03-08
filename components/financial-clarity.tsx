'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CARE_ROUTES, type CareRouteId } from '@/lib/care-routes'
import { CreditCard, Calculator, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'

interface PaymentOption {
  label: string
  description: string
  breakdown: string[]
  highlight?: boolean
}

function getEstimatedTotal(routeId: CareRouteId): { min: number; max: number; items: { label: string; min: number; max: number }[] } {
  const route = CARE_ROUTES[routeId]
  const base = route.costRange

  const estimations: Record<string, { label: string; min: number; max: number }[]> = {
    teleorientacion: [
      { label: 'Consulta virtual', min: base.min, max: base.max },
      { label: 'Seguimiento (si aplica)', min: 0, max: 80 },
    ],
    ginecologia: [
      { label: 'Consulta especialista', min: base.min, max: base.max },
      { label: 'Exámenes iniciales', min: 100, max: 200 },
      { label: 'Seguimiento 1 mes', min: 80, max: 150 },
    ],
    endocrinologia: [
      { label: 'Consulta endocrinóloga', min: base.min, max: base.max },
      { label: 'Panel hormonal completo', min: 150, max: 300 },
      { label: 'Análisis metabolismo', min: 100, max: 200 },
      { label: 'Seguimiento trimestral', min: 120, max: 200 },
    ],
    paquete_integral: [
      { label: 'Evaluación integral (3 especialistas)', min: 500, max: 900 },
      { label: 'Plan hormonal personalizado', min: 120, max: 250 },
      { label: 'Sesiones psicológicas (4)', min: 200, max: 400 },
      { label: 'Consulta nutrición', min: 80, max: 150 },
      { label: 'Seguimiento mensual', min: 100, max: 200 },
    ],
    psicologia: [
      { label: 'Sesión inicial', min: base.min, max: base.max },
      { label: '3 sesiones adicionales', min: base.min * 3, max: base.max * 3 },
      { label: 'Material de apoyo', min: 0, max: 20 },
    ],
  }

  const items = estimations[routeId] || [{ label: 'Consulta', min: base.min, max: base.max }]
  const totalMin = items.reduce((sum, i) => sum + i.min, 0)
  const totalMax = items.reduce((sum, i) => sum + i.max, 0)

  return { min: totalMin, max: totalMax, items }
}

function getPaymentOptions(totalMin: number, totalMax: number): PaymentOption[] {
  const avg = Math.round((totalMin + totalMax) / 2)

  return [
    {
      label: 'Pago único',
      description: 'Paga todo de una vez',
      breakdown: [`Total: S/${totalMin}–S/${totalMax}`],
    },
    {
      label: '3 cuotas',
      description: 'Divide tu pago en 3 meses',
      breakdown: [
        `Cuota mensual: ~S/${Math.round(avg / 3)}`,
        `Total: ~S/${avg}`,
        'Sin intereses',
      ],
      highlight: true,
    },
    {
      label: 'Inicial + saldo',
      description: 'Paga una parte ahora y el resto después',
      breakdown: [
        `Inicial (30%): ~S/${Math.round(avg * 0.3)}`,
        `Saldo restante: ~S/${Math.round(avg * 0.7)}`,
        'A pagar en 60 días',
      ],
    },
    {
      label: 'BNPL simulado',
      description: 'Compra ahora, paga después',
      breakdown: [
        `4 pagos de ~S/${Math.round(avg / 4)}`,
        'Cada 2 semanas',
        `Total: ~S/${avg}`,
      ],
    },
  ]
}

interface FinancialClarityProps {
  routeId: CareRouteId
  isExpanded?: boolean
}

export function FinancialClarity({ routeId, isExpanded = false }: FinancialClarityProps) {
  const [expanded, setExpanded] = useState(isExpanded)
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null)

  const route = CARE_ROUTES[routeId]
  const estimation = getEstimatedTotal(routeId)
  const paymentOptions = getPaymentOptions(estimation.min, estimation.max)

  return (
    <div className="space-y-4">
      {/* Cost Summary Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/30 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground text-sm">Claridad financiera</p>
            <p className="text-xs text-muted-foreground">
              Costo estimado inicial: S/{estimation.min}–S/{estimation.max}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Cost Breakdown */}
          <Card className="p-5 border-border">
            <h4 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Desglose estimado: {route.name}
            </h4>
            <div className="space-y-2">
              {estimation.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/80">{item.label}</span>
                  <span className="text-foreground font-medium">
                    {item.min === 0 && item.max === 0
                      ? 'Incluido'
                      : item.min === item.max
                        ? `S/${item.min}`
                        : `S/${item.min}–S/${item.max}`}
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
                <span className="font-semibold text-foreground text-sm">Total estimado</span>
                <span className="font-bold text-primary">
                  S/{estimation.min}–S/{estimation.max}
                </span>
              </div>
            </div>
          </Card>

          {/* Payment Options */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Opciones de pago simuladas</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPayment(selectedPayment === idx ? null : idx)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedPayment === idx
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : option.highlight
                        ? 'border-primary/30 bg-primary/[0.02]'
                        : 'border-border bg-card hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-foreground text-sm">{option.label}</p>
                    {option.highlight && (
                      <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{option.description}</p>
                  <div className="space-y-1">
                    {option.breakdown.map((line, lineIdx) => (
                      <p key={lineIdx} className="text-xs text-foreground/70 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-primary/60 flex-shrink-0" />
                        {line}
                      </p>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-muted-foreground/60 text-center leading-relaxed">
            Estos costos son estimaciones referenciales y pueden variar según el proveedor y tu ubicación. 
            Las opciones de pago son simulaciones para ayudarte a planificar.
          </p>
        </div>
      )}
    </div>
  )
}
