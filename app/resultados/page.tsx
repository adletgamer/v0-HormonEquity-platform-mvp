'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FinancialClarity } from '@/components/financial-clarity'
import { CARE_ROUTES, type CareRouteId } from '@/lib/care-routes'
import { recommendRoutes, generateSummary, type RouteRecommendation } from '@/lib/route-recommender'
import type { NavigatorResult } from '@/components/care-navigator'
import Link from 'next/link'
import { Heart, ArrowRight, Shield, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react'

function ResultadosContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [result, setResult] = useState<NavigatorResult | null>(null)
  const [recommendations, setRecommendations] = useState<RouteRecommendation[]>([])
  const [summary, setSummary] = useState('')
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (!dataParam) {
      router.push('/evaluar')
      return
    }

    try {
      const parsed: NavigatorResult = JSON.parse(decodeURIComponent(dataParam))
      setResult(parsed)
      const recs = recommendRoutes(parsed)
      setRecommendations(recs)
      setSummary(generateSummary(parsed))

      // Animate in after a short delay
      setTimeout(() => setShowResults(true), 300)
    } catch {
      router.push('/evaluar')
    }
  }, [searchParams, router])

  if (!result || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Preparando tus recomendaciones...</p>
        </div>
      </div>
    )
  }

  const topRec = recommendations[0]
  const topRoute = CARE_ROUTES[topRec.routeId]
  const otherRecs = recommendations.slice(1).filter(r => r.score > 10)

  return (
    <div className={`min-h-screen bg-gradient-to-b from-background to-secondary/10 transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent fill-accent" />
            <span className="font-semibold text-foreground">HormonEquity</span>
          </Link>
          <Link href="/evaluar">
            <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              Nueva evaluación
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Summary Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              {result.name}, aquí está lo que entendimos
            </h1>
          </div>
          <Card className="p-5 bg-primary/[0.03] border-primary/10">
            <p className="text-foreground/80 leading-relaxed text-[15px]">
              {summary}
            </p>
          </Card>
        </section>

        {/* Top Recommendation */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full" />
            <h2 className="text-xl font-bold text-foreground">Ruta sugerida</h2>
            <span className="ml-auto text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
              {topRec.score}% coincidencia
            </span>
          </div>

          <Card className="overflow-hidden border-primary/20">
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{topRoute.icon}</span>
                  <h3 className="text-xl font-bold text-foreground">{topRoute.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{topRoute.description}</p>
              </div>

              {/* Why this route */}
              <div className="bg-secondary/10 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">¿Por qué esta ruta?</p>
                <p className="text-sm text-foreground/70 leading-relaxed">{topRec.whyForYou}</p>
                <ul className="space-y-1.5 mt-2">
                  {topRec.reasoning.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground/70">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-card border border-border rounded-xl p-3">
                  <p className="text-muted-foreground text-xs mb-0.5">Duración</p>
                  <p className="font-medium text-foreground">{topRoute.duration}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-3">
                  <p className="text-muted-foreground text-xs mb-0.5">Costo consulta</p>
                  <p className="font-medium text-foreground">
                    S/{topRoute.costRange.min}–S/{topRoute.costRange.max}
                  </p>
                </div>
              </div>

              {/* What's included */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Incluye:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {topRoute.includes.map((item, idx) => (
                    <p key={idx} className="text-sm text-foreground/70 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              {/* Financial Clarity */}
              <FinancialClarity routeId={topRec.routeId} isExpanded={true} />

              {/* CTA */}
              <Link href={`/protegido/reservar?ruta=${topRec.routeId}`}>
                <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-sm gap-2 mt-2">
                  Solicitar {topRoute.name}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        {/* Other Options */}
        {otherRecs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Opciones relacionadas</h2>
            <div className="space-y-3">
              {otherRecs.map((rec) => {
                const route = CARE_ROUTES[rec.routeId]
                return (
                  <Card key={rec.routeId} className="p-5 hover:border-primary/20 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{route.icon}</span>
                        <h3 className="font-semibold text-foreground">{route.name}</h3>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {rec.score}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rec.whyForYou}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">S/{route.costRange.min}–S/{route.costRange.max}</span>
                        <span className="text-muted-foreground ml-1">· {route.duration}</span>
                      </p>
                      <FinancialClarity routeId={rec.routeId} />
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <Card className="p-5 bg-muted/30 border-border/50">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Importante</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                HormonEquity no diagnostica ni reemplaza la atención médica profesional. 
                Esta orientación se basa en lo que nos compartiste y tiene como objetivo 
                ayudarte a dar el primer paso. Siempre consulta con un profesional de salud 
                para decisiones médicas.
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground/60 pb-8">
          <p>© 2025 HormonEquity. Cuidado hormonal equitativo para todas.</p>
        </div>
      </div>
    </div>
  )
}

export default function ResultadosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground text-sm">Cargando resultados...</p>
          </div>
        </div>
      }
    >
      <ResultadosContent />
    </Suspense>
  )
}
