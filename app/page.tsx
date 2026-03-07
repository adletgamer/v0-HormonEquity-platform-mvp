'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, MessageSquare, DollarSign, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [supabase])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-accent fill-accent" />
            <span className="text-xl font-bold text-foreground">InSight Health</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#about" className="text-foreground/70 hover:text-foreground transition">
              Acerca de
            </Link>
            <Link href="#features" className="text-foreground/70 hover:text-foreground transition">
              Características
            </Link>
            <Link href="#how" className="text-foreground/70 hover:text-foreground transition">
              Cómo Funciona
            </Link>
          </nav>
          <div className="flex gap-2">
            {user ? (
              <Link href="/protegido/inicio">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Mi Cuenta
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/ingresar">
                  <Button variant="outline">Ingresar</Button>
                </Link>
                <Link href="/auth/registrarse">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Tu Compañera de Perimenopausia, No tu Juez
            </h1>
            <p className="text-lg text-foreground/80 mb-8 text-balance leading-relaxed">
              Obtén orientación personalizada para manejar síntomas de perimenopausia y menopausia. Conversaciones claras, costos transparentes y atención compasiva, todo desde tu compañera de salud de confianza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link href="/protegido/inicio">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                    Comenzar Evaluación
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/registrarse">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                    Empezar Tu Viaje
                  </Button>
                </Link>
              )}
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 w-full sm:w-auto">
                Saber Más
              </Button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            <Card className="bg-accent/10 border-accent/20 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Pregunta Libremente</h3>
              <p className="text-sm text-foreground/70">Sin juzgar, solo conversaciones honestas sobre tu salud</p>
            </Card>
            <Card className="bg-secondary/20 border-secondary/30 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-secondary/30 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Orientación de Síntomas</h3>
              <p className="text-sm text-foreground/70">Entiende tus síntomas y los próximos pasos</p>
            </Card>
            <Card className="bg-accent/10 border-accent/20 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Precios Claros</h3>
              <p className="text-sm text-foreground/70">Sabe exactamente qué cuesta antes de reservar</p>
            </Card>
            <Card className="bg-secondary/20 border-secondary/30 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-secondary/30 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Reserva Fácil</h3>
              <p className="text-sm text-foreground/70">Conecta con especialistas que entienden tu situación</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-secondary/5 py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Por Qué Elegir InSight?
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-balance">
              Creado específicamente para mujeres que navegan la perimenopausia con características diseñadas para apoyar tu viaje de salud
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: 'Evaluación Conversacional',
                description:
                  'Comparte tu historia naturalmente a través de conversación inteligente, no formularios abrumadores. Nuestro AI hace las preguntas correctas en el momento correcto.',
              },
              {
                icon: DollarSign,
                title: 'Costos Transparentes',
                description:
                  'Sin sorpresas. Ve los costos de tratamiento, opciones de financiamiento y qué cubre tu seguro antes de tomar decisiones.',
              },
              {
                icon: Heart,
                title: 'Atención Compasiva',
                description:
                  'Proveedores especializados en menopausia que entienden tus necesidades de salud únicas. Finalmente, alguien que te entiende.',
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-8 border-border/50 hover:border-primary/30 transition">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
            ¿Cómo Funciona?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Conversa',
                desc: 'Cuéntanos sobre tus síntomas e historial de salud en una conversación natural',
              },
              {
                step: '2',
                title: 'Orientación',
                desc: 'Obtén orientación personalizada y sin diagnóstico basada en tu situación única',
              },
              {
                step: '3',
                title: 'Precios',
                desc: 'Ve precios transparentes para opciones de cuidado disponibles y próximos pasos',
              },
              {
                step: '4',
                title: 'Reserva',
                desc: 'Conéctate con especialistas compasivos cuando estés lista',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-foreground/70 text-center text-sm text-balance">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Lista para Ser Escuchada?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-balance">
            Comienza tu evaluación confidencial hoy. Obtén claridad sobre tus síntomas y encuentra el cuidado adecuado para ti.
          </p>
          {user ? (
            <Link href="/protegido/inicio">
              <Button size="lg" className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary">
                Ir a Mi Evaluación
              </Button>
            </Link>
          ) : (
            <Link href="/auth/registrarse">
              <Button size="lg" className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary">
                Comenzar Ahora
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 py-8">
        <div className="container mx-auto px-4 text-center text-foreground/60 text-sm">
          <p>© 2024 InSight Health. Todos los derechos reservados. Diseñado con compasión para la salud de la mujer.</p>
        </div>
      </footer>
    </main>
  )
}
