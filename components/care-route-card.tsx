import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import type { CareRoute } from '@/lib/care-routes'

interface CareRouteCardProps {
  route: CareRoute
  score?: number
  reasoning?: string[]
  isRecommended?: boolean
  onSelect?: () => void
}

export function CareRouteCard({
  route,
  score,
  reasoning,
  isRecommended,
  onSelect,
}: CareRouteCardProps) {
  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all ${
        isRecommended ? 'ring-2 ring-primary' : ''
      }`}
    >
      {/* Header con gradiente */}
      <div className={`bg-gradient-to-r ${route.color} text-white p-6`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-4xl mb-2">{route.icon}</div>
            <h3 className="text-xl font-bold">{route.name}</h3>
          </div>
          {isRecommended && (
            <div className="bg-white/20 rounded-full p-2">
              <Check className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-foreground/80 text-sm">{route.description}</p>

        {/* Score y reasoning */}
        {score !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Coincidencia: {score}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${score}%` }}
              ></div>
            </div>

            {reasoning && reasoning.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  Por qué es apropiada:
                </p>
                <ul className="text-xs text-foreground/70 space-y-1">
                  {reasoning.slice(0, 2).map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Duración y costo */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Duración</p>
            <p className="font-semibold text-sm text-foreground">
              {route.duration}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Costo</p>
            <p className="font-semibold text-sm text-foreground">
              ${route.costRange.min}-${route.costRange.max}{' '}
              <span className="text-xs text-muted-foreground">
                {route.currency}
              </span>
            </p>
          </div>
        </div>

        {/* What's included */}
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">
            Incluye:
          </p>
          <ul className="space-y-1">
            {route.includes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                <span className="text-primary mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Providers */}
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">
            Especialistas:
          </p>
          <div className="flex flex-wrap gap-1">
            {route.providers.map((provider, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-secondary/30 text-xs rounded text-foreground"
              >
                {provider}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={onSelect}
          className={`w-full mt-4 ${
            isRecommended
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/90 text-foreground'
          }`}
        >
          {isRecommended ? 'Opción Recomendada' : 'Explorar Opción'}
        </Button>
      </div>
    </Card>
  )
}
