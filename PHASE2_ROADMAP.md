# Phase 2 & 3 Implementation Roadmap

## Quick Start for Phase 2

When you're ready to add recommendations and cost clarity, follow these steps:

### 1. Database Setup (Supabase)

```bash
# After connecting Supabase integration:
# These tables will store assessment data
```

**Create these tables in Supabase SQL Editor:**

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Assessment responses
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  session_id TEXT NOT NULL,
  name TEXT,
  age TEXT,
  symptoms TEXT[],
  medical_history TEXT[],
  medications TEXT[],
  goals TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Recommendations generated from assessments
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id),
  recommendation_type TEXT, -- 'lifestyle', 'supplement', 'medication', 'therapy'
  title TEXT NOT NULL,
  description TEXT,
  cost_range TEXT, -- e.g., "$0-50/month"
  insurance_coverage TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow users to see their own data)
CREATE POLICY "Users can see their own assessments"
  ON assessments
  FOR SELECT
  USING (true); -- Will be updated to (user_id = auth.uid()) with auth
```

### 2. Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=sk-... (if using OpenAI)
ANTHROPIC_API_KEY=sk-ant-... (if using Claude)
```

### 3. Update Chat Component for Persistence

**File: `components/chat-interface.tsx`**

Add this at the top after imports:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

When assessment is complete, save to database:

```typescript
const handleAssessmentComplete = async (profile: ChatSession['userProfile']) => {
  const { data, error } = await supabase
    .from('assessments')
    .insert([
      {
        session_id: session?.id,
        name: profile.name,
        age: profile.age,
        symptoms: profile.symptoms,
        medical_history: profile.medicalHistory,
        medications: profile.currentMedications,
        goals: profile.goals,
      },
    ])
    .select();

  if (!error) {
    // Redirect to recommendations page with assessment_id
    router.push(`/recommendations?assessment=${data[0].id}`);
  }
};
```

### 4. Create Recommendations Page

**File: `app/recommendations/page.tsx`**

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RecommendationsPage() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('assessment');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recommendations from Supabase
    // or generate them using AI API
  }, [assessmentId]);

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-foreground mb-8">Your Personalized Recommendations</h1>
      {/* Display recommendations cards with pricing */}
    </div>
  );
}
```

### 5. Replace Mock Chat Responses with AI

**File: `app/api/chat/route.ts`**

Replace the mock responses with Claude or OpenAI:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateResponse(request: ChatRequest): Promise<string> {
  const { stage, userMessage, userProfile } = request;

  const prompt = `
    You are a compassionate healthcare assistant helping women navigate perimenopause.
    Current stage: ${stage}
    User profile: ${JSON.stringify(userProfile)}
    User message: ${userMessage}
    
    Respond warmly and supportively. Ask the next appropriate question.
  `;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: prompt },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

## Recommendation Generation Strategy

### Symptom-Based Recommendations

Create a mapping of symptoms to recommendations:

```typescript
const RECOMMENDATION_DATABASE = {
  'hot flashes': [
    { type: 'lifestyle', title: 'Layer Clothing', cost: 'Free' },
    { type: 'supplement', title: 'Black Cohosh', cost: '$10-20/month' },
    { type: 'medication', title: 'HRT', cost: '$30-100/month', insurance: 'Often covered' },
  ],
  'night sweats': [
    { type: 'lifestyle', title: 'Cool Sleep Environment', cost: 'Free' },
    { type: 'supplement', title: 'Sage Extract', cost: '$15-25/month' },
  ],
  // ... more symptoms
};
```

### Cost Transparency Data Structure

```typescript
interface Recommendation {
  id: string;
  title: string;
  type: 'lifestyle' | 'supplement' | 'medication' | 'therapy';
  description: string;
  cost: {
    min: number;
    max: number;
    currency: string;
    frequency: 'one-time' | 'monthly';
  };
  insurance: {
    coverage: 'often' | 'sometimes' | 'rarely';
    notes: string;
  };
  provider: {
    type: string; // 'OB-GYN', 'Naturopath', 'Online doctor'
    exampleCosts: string;
  };
  efficacy: string; // "Effective for 60-70% of users"
  sideEffects: string[];
  duration: string; // "Results in 2-4 weeks"
}
```

## Voice Integration (ElevenLabs)

For Phase 2.5, add voice input/output:

```typescript
import ElevenLabs from 'elevenlabs-js';

const client = new ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Generate speech from text
const audio = await client.generate({
  voice: 'Rachel', // Or another voice ID
  text: assistantResponse,
});

// For speech-to-text, use Whisper API
const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1',
});
```

## Provider Directory (Phase 3)

**Data Structure for Providers:**

```typescript
interface Provider {
  id: string;
  name: string;
  specialty: 'OB-GYN' | 'Naturopath' | 'Psychiatrist' | 'Nurse Practitioner';
  licenses: string[];
  rating: number; // 4.5
  reviewCount: number;
  location: string;
  telehealth: boolean;
  insurance: string[]; // Insurance networks accepted
  initialConsultationCost: number;
  followUpCost: number;
  availability: {
    nextAvailable: Date;
    weeklySlots: number;
  };
  specialties: string[]; // e.g., ['HRT', 'Holistic approach', 'LGBTQ+ friendly']
  bio: string;
  imageUrl: string;
}
```

## Testing Phase 2

**Checklist:**

- [ ] Supabase tables created and accessible
- [ ] Chat responses integrated with real AI API
- [ ] Assessment data saves to database
- [ ] Recommendations page loads data correctly
- [ ] Cost display is clear and transparent
- [ ] Insurance coverage notes are helpful
- [ ] Mobile responsiveness maintained
- [ ] Error handling for API failures

## Deployment Checklist

Before going live:

- [ ] All environment variables are set in production
- [ ] Database backups are configured
- [ ] HIPAA compliance reviewed (if applicable)
- [ ] Privacy policy updated
- [ ] Terms of service reviewed
- [ ] Rate limiting on API endpoints
- [ ] Error logging configured
- [ ] Analytics/monitoring set up

## Timeline Estimate

- **Phase 1 (Complete)**: 1-2 days
- **Phase 2 (Recommendations)**: 3-5 days
  - Database setup: 1 day
  - AI integration: 1 day
  - Recommendations page: 1-2 days
  - Cost data curation: 1 day
- **Phase 2.5 (Voice)**: 2-3 days
- **Phase 3 (Provider Booking)**: 3-5 days
  - Provider directory: 1-2 days
  - Booking calendar: 1-2 days
  - Email/notifications: 1 day

## Common Challenges & Solutions

### Challenge: Accurate Symptom Mapping
**Solution**: Start with common symptoms, expand based on user feedback. Consider working with medical advisors.

### Challenge: Insurance Coverage Accuracy
**Solution**: Link to insurance provider databases or provide disclaimers that users verify with their insurer.

### Challenge: AI Response Quality
**Solution**: Implement prompt engineering best practices, test with various inputs, gather user feedback.

### Challenge: Performance at Scale
**Solution**: Implement caching, pagination for recommendations, CDN for static assets.

## Security Considerations

- ✅ Use Supabase's built-in authentication
- ✅ Implement Row Level Security (RLS) for all tables
- ✅ Hash sensitive data
- ✅ Use HTTPS only
- ✅ Implement rate limiting on API endpoints
- ✅ Regular security audits
- ✅ GDPR compliance for data storage
- ✅ Privacy policy transparency

## Questions to Ask Medical Advisors

- What are the most common symptoms we should focus on?
- What are typical treatment costs for different scenarios?
- What insurance questions come up most often?
- Are there any liability concerns we should know about?
- Should we require medical disclaimers?

Good luck building Phase 2! 🎉
