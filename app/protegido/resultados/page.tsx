'use client'

import { useEffect, useState, Suspense } from 'react'
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

function ResultadosContent() {
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
