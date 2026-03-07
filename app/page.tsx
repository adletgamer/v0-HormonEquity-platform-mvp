'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, MessageSquare, DollarSign, Calendar } from 'lucide-react';

export default function Home() {
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
            <Link href="#about" className="text-foreground/70 hover:text-foreground transition">About</Link>
            <Link href="#features" className="text-foreground/70 hover:text-foreground transition">Features</Link>
            <Link href="#how" className="text-foreground/70 hover:text-foreground transition">How It Works</Link>
          </nav>
          <Link href="/chat">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Your Perimenopause Companion, Not Your Judge
            </h1>
            <p className="text-lg text-foreground/80 mb-8 text-balance leading-relaxed">
              Get personalized guidance for managing perimenopause and menopause symptoms. Clear conversations, transparent costs, and compassionate care—all from your trusted health companion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/chat">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                  Begin Your Assessment
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            <Card className="bg-accent/10 border-accent/20 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Ask Anything</h3>
              <p className="text-sm text-foreground/70">No judgment, just honest conversations about your health</p>
            </Card>
            <Card className="bg-secondary/20 border-secondary/30 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-secondary/30 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Symptom Guidance</h3>
              <p className="text-sm text-foreground/70">Understand your symptoms and next best steps</p>
            </Card>
            <Card className="bg-accent/10 border-accent/20 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Clear Pricing</h3>
              <p className="text-sm text-foreground/70">Know exactly what care costs before you book</p>
            </Card>
            <Card className="bg-secondary/20 border-secondary/30 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-secondary/30 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Easy Booking</h3>
              <p className="text-sm text-foreground/70">Schedule with providers who get your concerns</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-secondary/5 py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose InSight?</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-balance">
              Built specifically for women navigating perimenopause with features designed to support your health journey
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Conversational Intake",
                description: "Share your story naturally through intelligent conversation, not overwhelming forms. Our AI asks the right questions at the right time."
              },
              {
                icon: DollarSign,
                title: "Transparent Costs",
                description: "No surprises. See treatment costs, financing options, and what your insurance covers before making decisions."
              },
              {
                icon: Heart,
                title: "Compassionate Care",
                description: "Providers who specialize in menopause and understand your unique health needs. Finally, someone who gets it."
              }
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Chat", desc: "Tell us about your symptoms and health history in a natural conversation" },
              { step: "2", title: "Guidance", desc: "Get personalized non-diagnostic guidance based on your unique situation" },
              { step: "3", title: "Costs", desc: "See transparent pricing for available care options and next steps" },
              { step: "4", title: "Book", desc: "Connect with compassionate providers when you're ready" }
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Feel Heard?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-balance">
            Start your confidential assessment today. Get clarity on your symptoms and find the right care for you.
          </p>
          <Link href="/chat">
            <Button size="lg" className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary">
              Start Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 py-8">
        <div className="container mx-auto px-4 text-center text-foreground/60 text-sm">
          <p>© 2024 InSight Health. All rights reserved. Designed with compassion for women's health.</p>
        </div>
      </footer>
    </main>
  );
}
