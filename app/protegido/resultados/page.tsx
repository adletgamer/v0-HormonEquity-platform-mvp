'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CareRouteCard } from '@/components/care-route-card'
import { CARE_ROUTES, getAllCareRoutes } from '@/lib/care-routes'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'

interface RouteScore {
  routeId: string
  score: number
  reasoning: string[]
}

export default function ResultadosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [routeScores, setRouteScores] = useState<RouteScore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [nextStep, setNextStep] = useState('')

  useEffect(() => {
    // Obtener scores de los parámetros
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
  const secondaryOptions = routeScores.slice(1, 3)

  const handleSelectRoute = (routeId: string) => {
    // Guardar selección y ir a booking/next step
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
            <Button variant="outline">Volver</Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Top Recommendation */}
        {topRecommendation && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Opción Recomendada
              </h2>
              <p className="text-lg text-foreground/70">
                Basado en tu evaluación, esta es la opción que mejor se adapta a tu situación
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
              <CareRouteCard
                route={CARE_ROUTES[topRecommendation.routeId as keyof typeof CARE_ROUTES]}
                score={topRecommendation.score}
                reasoning={topRecommendation.reasoning}
                isRecommended={true}
                onSelect={() => handleSelectRoute(topRecommendation.routeId)}
              />
            </div>

            {/* CTA Button */}
            <div className="text-center mb-16">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => handleSelectRoute(topRecommendation.routeId)}
              >
                Continuar con {CARE_ROUTES[topRecommendation.routeId as keyof typeof CARE_ROUTES].name}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                O explora otras opciones abajo
              </p>
            </div>
          </div>
        )}

        {/* Other Options */}
        {secondaryOptions.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Otras Opciones que Podrían Ayudarte
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {secondaryOptions.map((score) => (
                <CareRouteCard
                  key={score.routeId}
                  route={CARE_ROUTES[score.routeId as keyof typeof CARE_ROUTES]}
                  score={score.score}
                  reasoning={score.reasoning}
                  onSelect={() => handleSelectRoute(score.routeId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Routes */}
        {routeScores.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Todas las Opciones Disponibles
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routeScores.map((score) => (
                <CareRouteCard
                  key={score.routeId}
                  route={CARE_ROUTES[score.routeId as keyof typeof CARE_ROUTES]}
                  score={score.score}
                  reasoning={score.reasoning}
                  onSelect={() => handleSelectRoute(score.routeId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 pt-12 border-t border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Preguntas Frecuentes
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="font-semibold text-foreground mb-2">
                ¿Puedo cambiar de opción después?
              </h4>
              <p className="text-sm text-foreground/70">
                Sí, puedes cambiar entre opciones en cualquier momento según tus necesidades.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold text-foreground mb-2">
                ¿Qué pasa si tengo más preguntas?
              </h4>
              <p className="text-sm text-foreground/70">
                Nuestro equipo está disponible para aclarar cualquier duda sobre las opciones.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold text-foreground mb-2">
                ¿Incluye seguimiento?
              </h4>
              <p className="text-sm text-foreground/70">
                Sí, cada opción incluye seguimiento según tu plan elegido.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold text-foreground mb-2">
                ¿Puedo usar seguro?
              </h4>
              <p className="text-sm text-foreground/70">
                Algunos servicios pueden ser cubiertos. Pregunta durante la reserva.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
