'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FinancialClarity } from '@/components/financial-clarity'
import { CARE_ROUTES } from '@/lib/care-routes'
import { recommendRoutes, generateSummary, type RouteRecommendation } from '@/lib/route-recommender'
import type { NavigatorResult } from '@/components/care-navigator'
import Link from 'next/link'
import { Heart, ArrowRight, Shield, RotateCcw, Sparkles, CheckCircle2, Clock, CalendarCheck, ChevronDown } from 'lucide-react'

function ResultadosContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [result, setResult] = useState<NavigatorResult | null>(null)
  const [recommendations, setRecommendations] = useState<RouteRecommendation[]>([])
  const [summary, setSummary] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [expandedOther, setExpandedOther] = useState<string | null>(null)

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
      setTimeout(() => setShowResults(true), 300)
    } catch {
      router.push('/evaluar')
    }
  }, [searchParams, router])

  if (!result || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 animate-fade-up">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 text-primary animate-pulse-soft" />
          </div>
          <p className="text-muted-foreground text-sm">Preparando tus recomendaciones...</p>
        </div>
      </div>
    )
  }

  const topRec = recommendations[0]
  const topRoute = CARE_ROUTES[topRec.routeId]
  const otherRecs = recommendations.slice(1).filter(r => r.score > 10)

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-700 ${showResults ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-3xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-primary fill-primary/30" />
            </div>
            <span className="font-medium text-sm text-foreground">HormonEquity</span>
          </Link>
          <Link href="/evaluar">
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-3 py-1.5 rounded-full border border-border/60 hover:border-primary/30">
              <RotateCcw className="w-3 h-3" />
              Nueva evaluación
            </button>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        {/* Summary — voice summarization style */}
        <section className="animate-fade-up">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                {result.name}, esto es lo que entendí
              </h1>
            </div>
          </div>
          <Card className="p-5 bg-primary/[0.03] border-primary/10">
            <p className="text-foreground/80 leading-relaxed text-[15px]">
              {summary}
            </p>
          </Card>
        </section>

        {/* COMPONENT 2: Recommendation Card — Top route */}
        <section className="animate-fade-up delay-100">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1.5 h-7 bg-primary rounded-full" />
            <h2 className="text-lg font-bold text-foreground">Ruta sugerida</h2>
            <span className="ml-auto text-[11px] font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              {topRec.score}% coincidencia
            </span>
          </div>

          <Card className="overflow-hidden border-primary/15 shadow-sm">
            <div className="p-6 md:p-8 space-y-5">
              {/* Route header */}
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-2xl">{topRoute.icon}</span>
                  <h3 className="text-xl font-bold text-foreground tracking-tight">{topRoute.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{topRoute.description}</p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-3.5">
                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Duración</p>
                    <p className="text-sm font-medium text-foreground">{topRoute.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-3.5">
                  <Heart className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Costo estimado</p>
                    <p className="text-sm font-medium text-foreground">S/{topRoute.costRange.min}–S/{topRoute.costRange.max}</p>
                  </div>
                </div>
              </div>

              {/* Why this route */}
              <div className="bg-secondary/30 rounded-2xl p-5 space-y-3">
                <p className="text-sm font-semibold text-foreground">¿Por qué esta ruta para ti?</p>
                <p className="text-sm text-foreground/70 leading-relaxed">{topRec.whyForYou}</p>
                <div className="space-y-2 pt-1">
                  {topRec.reasoning.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-foreground/70">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Includes */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Incluye:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topRoute.includes.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
                      <span className="w-1.5 h-1.5 bg-primary/50 rounded-full flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPONENT 4: Cost Clarity Card */}
              <FinancialClarity routeId={topRec.routeId} isExpanded={true} />

              {/* COMPONENT 5: Booking Card */}
              <div className="bg-primary/[0.04] border border-primary/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Agenda tu primera sesión</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cuando estés lista, solicita tu cita con especialistas verificados en salud hormonal.
                </p>
                <Link href={`/protegido/reservar?ruta=${topRec.routeId}`}>
                  <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-sm font-medium gap-2 shadow-sm shadow-primary/15 hover:shadow-md transition-all">
                    Solicitar {topRoute.name}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        {/* COMPONENT 3: Care Path Cards — other options */}
        {otherRecs.length > 0 && (
          <section className="animate-fade-up delay-200">
            <h2 className="text-lg font-bold text-foreground mb-4">Otras opciones para ti</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {otherRecs.map((rec) => {
                const route = CARE_ROUTES[rec.routeId]
                const isExpanded = expandedOther === rec.routeId
                return (
                  <Card
                    key={rec.routeId}
                    className={`p-5 transition-all duration-300 hover:shadow-sm cursor-pointer group ${isExpanded ? 'border-primary/20 shadow-sm' : 'border-border/50 hover:border-primary/15'}`}
                    onClick={() => setExpandedOther(isExpanded ? null : rec.routeId)}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center">
                        <span className="text-lg">{route.icon}</span>
                      </div>
                      <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {rec.score}%
                      </span>
                    </div>

                    <h3 className="font-semibold text-foreground mb-1.5">{route.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{rec.whyForYou}</p>

                    {/* Badge row */}
                    <div className="flex items-center gap-3 text-xs text-foreground/70 mb-2">
                      <span className="font-medium">S/{route.costRange.min}–S/{route.costRange.max}</span>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="text-muted-foreground">{route.duration}</span>
                    </div>

                    {/* Expand indicator */}
                    <div className="flex items-center gap-1 text-[11px] text-primary/60 group-hover:text-primary transition">
                      <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      {isExpanded ? 'Menos' : 'Ver detalles'}
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border/50 space-y-3 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <FinancialClarity routeId={rec.routeId} isExpanded={true} />
                        <Link href={`/protegido/reservar?ruta=${rec.routeId}`}>
                          <Button variant="outline" className="w-full rounded-xl h-10 text-sm gap-1.5 border-primary/20 text-primary hover:bg-primary/5">
                            Solicitar
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="animate-fade-up delay-300">
          <div className="flex items-start gap-3 bg-muted/30 rounded-2xl p-5 border border-border/30">
            <Shield className="w-4 h-4 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground/70 mb-1">Importante</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                HormonEquity no diagnostica ni reemplaza la atención médica profesional. 
                Esta orientación se basa en lo que nos compartiste y tiene como objetivo 
                ayudarte a dar el primer paso.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-[11px] text-muted-foreground/40 pb-8">
          <p>HormonEquity · Cuidado hormonal equitativo para todas</p>
        </div>
      </div>
    </div>
  )
}

export default function ResultadosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-primary animate-pulse-soft" />
            </div>
            <p className="text-muted-foreground text-sm">Cargando resultados...</p>
          </div>
        </div>
      }
    >
      <ResultadosContent />
    </Suspense>
  )
}
