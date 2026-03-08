'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Send, ArrowLeft, Heart } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  stage: number;
  messages: Message[];
  userProfile: {
    name?: string;
    age?: string;
    symptoms?: string[];
    medicalHistory?: string[];
    currentMedications?: string[];
    goals?: string[];
  };
}

const CHAT_STAGES = [
  {
    id: 'welcome',
    prompt: "Hi there! I'm here to help you navigate your health journey. What's your name?",
    field: 'name',
    followUp: null
  },
  {
    id: 'age',
    prompt: (name: string) => `Nice to meet you, ${name}! To give you the best guidance, could you tell me your age range? (e.g., 40-45, 45-50, 50+)`,
    field: 'age',
    followUp: null
  },
  {
    id: 'symptoms',
    prompt: (name: string, age: string) => `Thanks for sharing that. What symptoms have you been experiencing? Feel free to list as many as you'd like (e.g., hot flashes, night sweats, mood changes, sleep issues, etc.)`,
    field: 'symptoms',
    followUp: null
  },
  {
    id: 'medical-history',
    prompt: "Any relevant medical history we should know about? (e.g., family history of osteoporosis, previous thyroid issues, etc.)",
    field: 'medicalHistory',
    followUp: null
  },
  {
    id: 'medications',
    prompt: "What medications or supplements are you currently taking?",
    field: 'currentMedications',
    followUp: null
  },
  {
    id: 'goals',
    prompt: "What are your main health goals right now? What would make you feel better?",
    field: 'goals',
    followUp: null
  },
  {
    id: 'summary',
    prompt: (profile: any) => 
      `Thank you for sharing this with me, ${profile.name}. Here's what I've learned about you:\n\n` +
      `Age: ${profile.age}\n` +
      `Symptoms: ${profile.symptoms?.join(', ') || 'Not specified'}\n` +
      `Medical History: ${profile.medicalHistory?.join(', ') || 'None mentioned'}\n` +
      `Current Medications: ${profile.currentMedications?.join(', ') || 'None'}\n` +
      `Health Goals: ${profile.goals?.join(', ') || 'Not specified'}\n\n` +
      `Based on this information, I'll now provide personalized non-diagnostic guidance. Would you like me to explain what might be happening and suggest next steps?`,
    field: null,
    followUp: null
  },
  {
    id: 'guidance',
    prompt: (profile: any) =>
      `Based on what you've shared, here's some personalized guidance:\n\n` +
      `Your Experience: It sounds like you're experiencing a combination of symptoms common in perimenopause. Many women experience similar patterns.\n\n` +
      `Next Steps:\n` +
      `1. Consider scheduling a consultation with a healthcare provider who specializes in menopause\n` +
      `2. Track your symptoms over the next 2-4 weeks to identify patterns\n` +
      `3. Discuss treatment options including lifestyle modifications, supplements, or hormone therapy\n\n` +
      `We can help you find compassionate providers and show you transparent pricing options. Ready to explore that?`,
    field: null,
    followUp: null
  }
];

export default function ChatInterface() {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat session
  useEffect(() => {
    const newSession: ChatSession = {
      id: Math.random().toString(36).substr(2, 9),
      stage: 0,
      messages: [],
      userProfile: {}
    };
    setSession(newSession);
    
    // Send initial greeting
    const initialMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'assistant',
      content: CHAT_STAGES[0].prompt,
      timestamp: Date.now()
    };
    setMessages([initialMessage]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    // Update profile and advance stage
    const stage = CHAT_STAGES[session.stage];
    let updatedProfile = { ...session.userProfile };

    if (stage.field === 'name') {
      updatedProfile.name = input;
    } else if (stage.field === 'age') {
      updatedProfile.age = input;
    } else if (stage.field === 'symptoms') {
      updatedProfile.symptoms = input.split(',').map(s => s.trim());
    } else if (stage.field === 'medicalHistory') {
      updatedProfile.medicalHistory = input.split(',').map(s => s.trim());
    } else if (stage.field === 'currentMedications') {
      updatedProfile.currentMedications = input.split(',').map(s => s.trim());
    } else if (stage.field === 'goals') {
      updatedProfile.goals = input.split(',').map(s => s.trim());
    }

    const nextStage = Math.min(session.stage + 1, CHAT_STAGES.length - 1);
    const nextStageConfig = CHAT_STAGES[nextStage];

    let assistantResponse = '';
    if (typeof nextStageConfig.prompt === 'function') {
      if (nextStageConfig.id === 'summary' || nextStageConfig.id === 'guidance') {
        assistantResponse = nextStageConfig.prompt(updatedProfile);
      } else {
        assistantResponse = nextStageConfig.prompt(updatedProfile.name || '', updatedProfile.age || '');
      }
    } else {
      assistantResponse = nextStageConfig.prompt;
    }

    const assistantMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'assistant',
      content: assistantResponse,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, assistantMessage]);
    
    setSession({
      ...session,
      stage: nextStage,
      messages: [...session.messages, userMessage, assistantMessage],
      userProfile: updatedProfile
    });

    setIsLoading(false);

    if (nextStage === CHAT_STAGES.length - 1) {
      setShowSummary(true);
    }

    inputRef.current?.focus();
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
    setShowSummary(false);
    const newSession: ChatSession = {
      id: Math.random().toString(36).substr(2, 9),
      stage: 0,
      messages: [],
      userProfile: {}
    };
    setSession(newSession);
    
    const initialMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'assistant',
      content: CHAT_STAGES[0].prompt,
      timestamp: Date.now()
    };
    setMessages([initialMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-accent fill-accent" />
            <span className="font-semibold text-foreground">HormonEquity</span>
            <span className="text-xs text-foreground/50 ml-2">Intake Assessment</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="container mx-auto max-w-2xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-card text-foreground border border-border rounded-bl-none'
                } whitespace-pre-wrap text-sm md:text-base leading-relaxed`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-card text-foreground border border-border rounded-bl-none">
                <Spinner className="w-4 h-4" />
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto max-w-2xl px-4 py-4">
          {showSummary && session?.userProfile?.name && (
            <Card className="mb-4 p-4 bg-accent/5 border-accent/20">
              <p className="text-sm text-foreground/80 mb-3">
                Your intake assessment is complete! 🎉
              </p>
              <p className="text-sm text-foreground/70 mb-4">
                Based on your information, you can now explore personalized care options and transparent pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => alert('Next Phase: View recommendations and pricing')}
                >
                  View Recommendations
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => alert('Next Phase: Browse providers')}
                >
                  Browse Providers
                </Button>
              </div>
            </Card>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your response..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || (showSummary && session?.stage === CHAT_STAGES.length - 1)}
              className="flex-1 bg-card text-foreground border-border placeholder:text-foreground/50"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-foreground/50 mt-2 text-center">
            Your information is secure and confidential
          </p>
        </div>
      </div>
    </div>
  );
}
