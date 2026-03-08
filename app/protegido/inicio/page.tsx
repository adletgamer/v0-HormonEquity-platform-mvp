'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EnhancedChatEs } from '@/components/enhanced-chat-es'
import Link from 'next/link'
import type { ChatSessionData } from '@/lib/types'

export default function ProtectedHome() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/ingresar')
          return
        }

        setUser(user)

        // Obtener perfil del usuario
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/auth/ingresar')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleChatComplete = (sessionData: ChatSessionData, recommendedRoutes: string[], routeScores?: { routeId: string; score: number; reasoning: string[] }[]) => {
    // Usar scores reales del API o fallback para demo
    const scores = routeScores && routeScores.length > 0
      ? routeScores
      : recommendedRoutes.map((id, i) => ({
          routeId: id,
          score: 80 - i * 10,
          reasoning: ['Recomendación basada en tu evaluación'],
        }))

    const scoresParam = encodeURIComponent(JSON.stringify(scores))
    const nameParam = encodeURIComponent(sessionData.name || '')
    router.push(
      `/protegido/resultados?scores=${scoresParam}&name=${nameParam}`
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
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
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex flex-col">
        <div className="border-b border-border bg-white/50 backdrop-blur-md px-4 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Evaluación de Síntomas</h1>
            <Button
              variant="outline"
              onClick={() => setShowChat(false)}
              className="bg-white hover:bg-gray-50"
            >
              Cerrar
            </Button>
          </div>
        </div>
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <EnhancedChatEs
            userId={user?.id}
            userName={profile?.first_name}
            onComplete={handleChatComplete}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">HormonEquity</div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <Card className="mb-12 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              ¡Hola, {profile?.first_name || 'Amiga'}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Bienvenida a HormonEquity, tu plataforma de salud integral para la perimenopausia y menopausia
            </p>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-2">Evaluación Personalizada</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cuéntanos sobre tus síntomas y experiencia para recibir recomendaciones personalizadas
            </p>
            <Button
              onClick={() => setShowChat(true)}
              className="bg-primary hover:bg-primary/90 text-white w-full"
            >
              Comenzar Evaluación
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-2">Información Confiable</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Acceso a información médicamente verificada sobre la perimenopausia y menopausia
            </p>
            <Button variant="outline" className="w-full">
              Explorar Recursos
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-2">Especialistas</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Conecta con médicos especializados en salud de la mujer en tu región
            </p>
            <Button variant="outline" className="w-full">
              Ver Especialistas
            </Button>
          </Card>
        </div>

        {/* About Section */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Sobre HormonEquity</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-3">¿Por qué HormonEquity?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-accent mr-3">✓</span>
                  <span>Atención especializada en salud femenina</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3">✓</span>
                  <span>Médicos certificados y confiables</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3">✓</span>
                  <span>Precios transparentes y asequibles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3">✓</span>
                  <span>Disponible 24/7 desde tu hogar</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Próximas Características</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3">→</span>
                  <span>Seguimiento de síntomas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">→</span>
                  <span>Planes de tratamiento personalizados</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">→</span>
                  <span>Comunidad de apoyo entre mujeres</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">→</span>
                  <span>Integración con historial médico</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 HormonEquity. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
