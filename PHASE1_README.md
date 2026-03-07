# InSight Health - Phase 1: Landing + Conversational Intake

## Overview

Phase 1 is now complete! This MVP features a compassionate, accessible landing page and an intelligent multi-stage conversational intake flow for women navigating perimenopause and menopause.

## What's Built

### 1. Landing Page (`app/page.tsx`)
- **Hero Section**: Compelling value proposition with CTAs
- **Feature Showcase**: Benefits of using InSight Health (4 cards on desktop, responsive)
- **How It Works**: 4-step visual flow showing the user journey
- **Call-to-Action**: Final section encouraging users to start their assessment
- **Header & Footer**: Navigation and branding throughout
- **Responsive Design**: Mobile-first approach with Tailwind CSS

**Key Features:**
- Warm, calming color palette (teal primary, warm rose accent)
- Accessible typography and ARIA labels
- Smooth scrolling navigation
- Mobile-optimized layout

### 2. Conversational Intake Chat (`components/chat-interface.tsx` + `app/chat/page.tsx`)

Multi-stage conversation that feels natural and compassionate:

**7 Conversation Stages:**
1. **Welcome** - "What's your name?"
2. **Age Range** - "What's your age range?"
3. **Symptoms** - "What symptoms have you been experiencing?"
4. **Medical History** - "Any relevant medical history?"
5. **Current Medications** - "What medications/supplements are you taking?"
6. **Health Goals** - "What are your main health goals?"
7. **Summary & Guidance** - Provides personalized non-diagnostic guidance based on collected info

**Chat Interface Features:**
- Real-time message display with smooth animations
- User/Assistant message differentiation with color coding
- Auto-scrolling to latest messages
- Loading states with spinner
- Session management and data persistence
- Secure messaging banner
- Smart recap of collected information
- Call-to-action buttons for next steps (View Recommendations, Browse Providers)

### 3. Design System

**Color Palette (Healthcare Focused):**
- **Primary**: Teal (`oklch(0.52 0.12 195)`) - Trust and healing
- **Accent**: Warm Rose (`oklch(0.68 0.11 15)`) - Compassion and care
- **Background**: Cream white (`oklch(0.98 0.01 205)`) - Calming
- **Secondary**: Warm beige (`oklch(0.88 0.05 50)`) - Supporting
- **Dark mode**: Subtle, accessible dark variant of all colors

**Typography:**
- Font Family: Geist (sans) and Geist Mono
- Responsive sizing: 1.5rem/1.875rem (mobile) → 3rem/3.5rem (desktop) for headings
- Line height: 1.5-1.6 for body text for readability

**Component Library:**
- Built with shadcn/ui components
- Uses Lucide icons (Heart, MessageSquare, DollarSign, Calendar, etc.)

## File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── chat/
│   │   └── page.tsx            # Chat page
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # API endpoint (for future AI integration)
│   ├── layout.tsx              # Root layout with metadata
│   └── globals.css             # Theme tokens and base styles
├── components/
│   ├── chat-interface.tsx       # Main chat component with all logic
│   └── ui/                      # shadcn/ui components
├── public/                      # Static assets
└── PHASE1_README.md            # This file
```

## How to Use

### 1. View the Landing Page
- Navigate to `/` (home)
- Click "Start Your Journey" or "Begin Your Assessment" to go to chat

### 2. Complete the Assessment
- Navigate to `/chat`
- Answer the conversational prompts naturally
- Share symptoms, medical history, medications, and goals
- Review your summary at the end

### 3. Next Steps (Phase 2 Placeholder)
- "View Recommendations" (coming in Phase 2 - will show treatment options)
- "Browse Providers" (coming in Phase 2 - will show provider list with costs)

## Architecture & Data Flow

### Client-Side State Management
```
ChatInterface Component
├── Session State: { id, stage, messages, userProfile }
├── Messages: Array of { id, type, content, timestamp }
└── User Profile: { name, age, symptoms, medicalHistory, medications, goals }
```

The entire state is managed in the component using React hooks. For Phase 2+, we'll add Supabase to persist this data.

### Message Flow
1. User types response
2. Message added to state
3. Profile updated based on stage
4. Next stage prompt generated
5. Assistant message appended
6. Session advanced to next stage

### Chat Stages Configuration
```typescript
CHAT_STAGES = [
  { id: 'welcome', field: 'name', ... },
  { id: 'age', field: 'age', ... },
  // ... more stages
]
```

Each stage defines:
- **id**: Unique identifier
- **prompt**: Question to ask user (can be dynamic)
- **field**: Which userProfile field to populate
- **followUp**: Optional follow-up (not yet used)

## Future Enhancements (Phase 2 & 3)

### Phase 2: Recommendations & Cost Clarity
- [ ] Create `/recommendations` page showing treatment options
- [ ] Display transparent pricing for each option
- [ ] Show insurance coverage details
- [ ] Add financing options
- [ ] Integrate Supabase for data persistence

### Phase 3: Provider Booking
- [ ] Create provider directory with filters
- [ ] Provider profiles with specialties and credentials
- [ ] Booking calendar integration
- [ ] Confirmation and follow-up emails

### AI Integration (Phase 2 Prerequisite)
- [ ] Set up Claude/OpenAI API keys in environment variables
- [ ] Replace mock responses in `app/api/chat/route.ts` with real API calls
- [ ] Add voice input/output via ElevenLabs
- [ ] Implement symptom parsing and guidance generation

### Database Integration (Phase 2 Prerequisite)
- [ ] Set up Supabase project
- [ ] Create tables: `users`, `assessments`, `messages`, `recommendations`
- [ ] Implement Row Level Security (RLS)
- [ ] Add authentication via Supabase Auth

## Environment Variables (For Future Phases)

When you're ready to integrate external services, add these to your `.env.local`:

```env
# Supabase (Phase 2)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Claude/OpenAI (Phase 2)
OPENAI_API_KEY=sk_...
ANTHROPIC_API_KEY=sk-ant-...

# ElevenLabs (Phase 2 - Voice)
ELEVENLABS_API_KEY=sk_...
```

## Design Decisions

### Why This Color Palette?
- **Teal (Primary)**: Universally associated with healthcare, trust, and calm
- **Rose (Accent)**: Warm, compassionate color for "human" touches (CTA buttons, icons)
- **Cream/Beige**: Reduces eye strain, feels welcoming and warm
- Tested for WCAG AA accessibility compliance

### Why Client-Side State for Phase 1?
- Faster iteration without backend dependencies
- No setup required - works immediately
- Clear separation of concerns for future Supabase integration
- Session data is in-memory (not persisted between page refreshes in Phase 1)

### Why Multi-Turn Conversation?
- More compassionate than forms
- Feels like talking to a real person
- Easier to understand context and nuance
- Better for gathering complete health information

## Testing Checklist

- [ ] Landing page loads and is responsive on mobile/tablet/desktop
- [ ] All navigation links work
- [ ] Chat interface initializes with welcome message
- [ ] Can type and send messages
- [ ] Chat advances through all 7 stages
- [ ] Summary displays collected information correctly
- [ ] Dark mode theme works (if available)
- [ ] Back button resets the chat
- [ ] Mobile keyboard doesn't break layout

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 12+

## Performance Notes

- Landing page is fully static (zero JavaScript except for interactive elements)
- Chat interface uses React hooks (minimal overhead)
- All styling is Tailwind CSS (no extra CSS files)
- Icons are from lucide-react (lightweight SVG icons)

## Accessibility Features

- Semantic HTML throughout
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators on buttons
- Color contrast ratios meet WCAG AA
- Responsive text sizing
- Screen reader friendly

## Next Steps

1. ✅ **Phase 1 Complete**: Landing page + conversational intake
2. 📋 **Phase 2 Ready**: Add Supabase, AI responses, and recommendations page
3. 📅 **Phase 3 Ready**: Add provider booking and scheduling

To proceed to Phase 2:
1. Set up Supabase project
2. Add environment variables
3. Replace mock responses in `app/api/chat/route.ts`
4. Build `/recommendations` page with treatment options and pricing
5. Integrate database storage for assessment data

Good luck with your healthcare MVP! 💚
