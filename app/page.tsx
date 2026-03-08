import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, MessageCircle, Mic, Sparkles, ArrowRight, Shield, Clock, CreditCard, Stethoscope } from 'lucide-react'
import { RevealOnScroll } from '@/components/reveal-on-scroll'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary/[0.05] to-accent/[0.08] fx-grain">
      {/* Header — minimal, breathable */}
      <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Heart className="w-4.5 h-4.5 text-primary fill-primary/30" />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">HormonEquity</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/auth/ingresar">
              <Button
                variant="ghost"
                className="rounded-full h-11 px-5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent hover:border-border/70 transition-all duration-300"
              >
                Ingresar
              </Button>
            </Link>
            <Link href="/auth/registrarse">
              <Button
                variant="outline"
                className="rounded-full h-11 px-5 text-sm font-medium border-accent/30 bg-accent/[0.08] text-accent hover:bg-accent/[0.14] hover:border-accent/50 shadow-sm transition-all duration-300"
              >
                Registrarte
              </Button>
            </Link>
            <Link href="/evaluar">
              <Button className="rounded-full h-11 px-6 sm:px-7 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20 transition-all duration-300 hover:shadow-md hover:shadow-primary/30 fx-shimmer-border">
                Comenzar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — conversational-first, centered, calm */}
      <section className="relative overflow-hidden fx-aurora">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/50 via-violet-100/20 to-transparent" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[68vw] h-[68vw] max-w-[760px] max-h-[760px] rounded-full bg-primary/[0.06] blur-3xl animate-aurora-float" />
          <div className="absolute top-24 -right-24 w-[42vw] h-[42vw] max-w-[460px] max-h-[460px] rounded-full bg-accent/[0.08] blur-3xl animate-drift-x" />
        </div>
        <div className="max-w-3xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center relative">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 rounded-full px-4 py-1.5 text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Orientación con voz e inteligencia conversacional
            </div>
          </div>

          <h1 className="font-display text-4xl md:text-[3.25rem] font-bold text-foreground mb-6 leading-tight tracking-tight animate-fade-up delay-100 text-balance">
            Cuéntame cómo te has sentido últimamente
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up delay-200 text-balance">
            Soy tu compañera de orientación hormonal. Puedes hablarme o escribirme — te escucho sin juzgar y te conecto con el cuidado adecuado.
          </p>

          {/* Conversational CTA — looks like a chat prompt */}
          <div className="animate-fade-up delay-300">
            <Link href="/evaluar">
              <div className="group max-w-lg mx-auto bg-card border border-border/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer fx-shimmer-border fx-hover-lift">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-muted-foreground">Escribe o habla con voz...</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center">
                      <Mic className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ArrowRight className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground/70 mt-6 animate-fade-up delay-400">
            Conversación gratuita · Sin registro · 3 minutos
          </p>
        </div>
      </section>

      {/* Progressive disclosure: How it works — 3 simple steps */}
      <RevealOnScroll className="py-20 md:py-24 bg-card/50" delayMs={70}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
              Tu camino hacia la claridad
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-balance">
              Un flujo simple y humano — sin formularios largos, sin esperas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MessageCircle, label: 'Paso 1', desc: 'Habla o escribe cómo te sientes.', color: 'bg-primary/10 text-primary' },
              { icon: Sparkles, label: 'Paso 2', desc: 'Recibe orientación personalizada.', color: 'bg-accent/10 text-accent' },
              { icon: Stethoscope, label: 'Paso 3', desc: 'Conéctate con el cuidado adecuado.', color: 'bg-emerald-100 text-emerald-700' },
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                <Card className="p-6 border-border/60 hover:border-primary/25 transition-all duration-300 hover:shadow-md h-full fx-hover-lift">
                  <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <step.icon className="w-5.5 h-5.5" />
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mb-1.5">{step.label}</div>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-2">{step.desc}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </Card>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      {/* Smart feature cards — airy, microinteractions */}
      <RevealOnScroll className="py-20 md:py-24" delayMs={120}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
              Diseñado para ti, no para un sistema
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-balance">
              Tecnología calmada al servicio de tu bienestar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: MessageCircle,
                title: 'Conversacional',
                desc: 'No hay formularios. Solo una conversación natural donde tú llevas el ritmo.',
                badge: 'Voz + texto',
              },
              {
                icon: CreditCard,
                title: 'Costos transparentes',
                desc: 'Ves el desglose real antes de decidir. Con opciones de pago que se adaptan a ti.',
                badge: 'Sin sorpresas',
              },
              {
                icon: Heart,
                title: 'Cuidado compasivo',
                desc: 'Especialistas en salud hormonal que entienden tu experiencia. Finalmente, alguien que escucha.',
                badge: 'Verificados',
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-7 border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md group fx-hover-lift">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 bg-primary/8 rounded-2xl flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[11px] font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      {/* CTA — warm, not aggressive */}
      <RevealOnScroll className="py-20 md:py-24" delayMs={140}>
        <div className="max-w-2xl mx-auto px-6">
          <Card className="p-10 md:p-14 text-center bg-primary/[0.04] border-primary/10 fx-shimmer-border">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-7 h-7 text-primary fill-primary/20" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight">
              ¿Lista para ser escuchada?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed text-balance">
              No necesitas saber qué tienes. Solo cuéntame cómo te sientes y juntas encontramos el camino.
            </p>
            <Link href="/evaluar">
              <Button size="lg" className="rounded-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground px-8 text-sm font-medium shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-all">
                Comenzar conversación
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground/60">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Confidencial</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 3 minutos</span>
              <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> Con voz</span>
            </div>
          </Card>
        </div>
      </RevealOnScroll>

      {/* Footer — minimal */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary/40 fill-primary/20" />
            <span className="text-sm text-muted-foreground/60">HormonEquity</span>
          </div>
          <p className="text-xs text-muted-foreground/50">
            No diagnosticamos. Te orientamos y conectamos con especialistas verificados.
          </p>
        </div>
      </footer>
    </main>
  )
}
