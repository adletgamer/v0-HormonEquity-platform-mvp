'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CareRouteCard } from '@/components/care-route-card'
import { CARE_ROUTES } from '@/lib/care-routes'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'

interface RouteScore {
  routeId: string
  score: number
  reasoning: string[]
}

function ResultadosContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [routeScores, setRouteScores] = useState<RouteScore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const scoresParam = searchParams.get('scores')
    const nameParam = searchParams.get('name')

    if (scoresParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(scoresParam))
        setRouteScores(parsed)
      } catch (e) {
        console.error('Error parsing scores:', e)
      }
    }

    if (nameParam) {
      setUserName(decodeURIComponent(nameParam))
    }

    setIsLoading(false)
  }, [searchParams])

  const topRecommendation = routeScores[0]

  const handleSelectRoute = (routeId: string) => {
    router.push(`/protegido/reservar?ruta=${routeId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tus Resultados</h1>
            {userName && (
              <p className="text-sm text-muted-foreground">
                Recomendaciones personalizadas para {userName}
              </p>
            )}
          </div>
          <Link href="/protegido/inicio">
            <Button variant="outline">Nueva Evaluación</Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Top Recommendation */}
        {topRecommendation && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-8 bg-primary rounded" />
              <h2 className="text-3xl font-bold text-foreground">Recomendación Principal</h2>
              <span className="ml-auto text-sm font-semibold px-3 py-1 bg-primary/20 text-primary rounded-full">
                {topRecommendation.score}% de coincidencia
              </span>
            </div>
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6">
              <div className="space-y-4">
                {CARE_ROUTES[topRecommendation.routeId as keyof typeof CARE_ROUTES] && (
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {CARE_ROUTES[topRecommendation.routeId as keyof typeof CARE_ROUTES].name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {CARE_ROUTES[topRecommendation.routeId as keyof typeof CARE_ROUTES].description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">Duración:</span>{' '}
                        {CARE_ROUTES[topRecommendation.routeId as keyof typeof CARE_ROUTES].duration}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">Costo aproximado:</span>{' '}
                        {CARE_ROUTES[topRecommendation.routeId as keyof typeof CARE_ROUTES].costRange}
                      </p>
                    </div>
                    {topRecommendation.reasoning && topRecommendation.reasoning.length > 0 && (
                      <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
                        <p className="text-sm font-semibold text-foreground mb-2">Por qué esta ruta:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {topRecommendation.reasoning.map((reason, idx) => (
                            <li key={idx}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Button
                      className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
                      onClick={() => handleSelectRoute(topRecommendation.routeId)}
                    >
                      Solicitar {CARE_ROUTES[topRecommendation.routeId as keyof typeof CARE_ROUTES].name}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* All Options */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Todas las Opciones de Cuidado</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {routeScores.map((score, idx) => {
              const route = CARE_ROUTES[score.routeId as keyof typeof CARE_ROUTES]
              if (!route) return null
              return (
                <Card
                  key={idx}
                  className={`p-6 cursor-pointer transition hover:shadow-lg ${
                    idx === 0 ? 'border-2 border-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-foreground">{route.name}</h3>
                    <span className="text-lg font-bold text-primary">{score.score}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{route.description}</p>
                  <div className="space-y-2 mb-4 text-sm">
                    <p>
                      <span className="font-semibold text-foreground">Duración:</span> {route.duration}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Costo:</span> {route.costRange}
                    </p>
                  </div>
                  <Button
                    variant={idx === 0 ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => handleSelectRoute(score.routeId)}
                  >
                    Seleccionar
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-12 p-8 bg-secondary/5">
          <h3 className="text-lg font-semibold text-foreground mb-3">¿Necesitas ayuda?</h3>
          <p className="text-muted-foreground mb-4">
            Si tienes dudas sobre tus resultados o necesitas más información, nuestro equipo está disponible para ayudarte.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Contacta con Nosotros</Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default function ResultadosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      }
    >
      <ResultadosContent />
    </Suspense>
  )
}
