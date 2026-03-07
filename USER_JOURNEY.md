# InSight Health - User Journey Map

## Phase 1: Landing → Intake → Summary

### Step 1: User Discovers Landing Page

**URL**: `/`

**What They See:**
- Professional header with logo and navigation
- Hero section with compelling headline
- Feature cards showing benefits
- "How It Works" 4-step flow
- Call-to-action buttons throughout
- Social proof section (coming in Phase 2)

**User Thinking:**
> "This seems legitimate and professional. I feel understood."

**Key Actions:**
- Scroll to explore
- Click "Start Your Journey" or "Begin Your Assessment"
- Learn about the service

**Mobile View:**
- Single column layout
- Stacked cards
- Touch-friendly buttons
- Full-screen hero

---

### Step 2: User Enters Chat Flow

**URL**: `/chat`

**Initial Screen:**
- Clean chat interface
- First message from AI assistant
- Input box ready for response
- Secure messaging banner

**First Message:**
```
"Hi there! I'm here to help you navigate your health journey. 
What's your name?"
```

**User Thinking:**
> "This feels different from a form. It's like talking to someone."

---

### Step 3: Name Collection

**User Response**: "Sarah"

**AI Response**:
```
"Nice to meet you, Sarah! To give you the best guidance, 
could you tell me your age range? (e.g., 40-45, 45-50, 50+)"
```

**Data Collected**: 
- `name: "Sarah"`

**UI Changes:**
- User's message appears in blue bubble (right side)
- AI's message appears in gray bubble (left side)
- Auto-scrolls to new message
- Loading spinner briefly shows before response

---

### Step 4: Age Range

**User Response**: "45-50"

**AI Response**:
```
"Thanks for sharing that. What symptoms have you been experiencing? 
Feel free to list as many as you'd like (e.g., hot flashes, night sweats, 
mood changes, sleep issues, etc.)"
```

**Data Collected**:
- `age: "45-50"`

**Progress**: 2/7 stages complete

---

### Step 5: Symptom Intake

**User Response**: "hot flashes, night sweats, mood changes, trouble sleeping"

**AI Response**:
```
"Thanks for sharing that. Any relevant medical history we should 
know about? (e.g., family history of osteoporosis, previous thyroid 
issues, etc.)"
```

**Data Collected**:
- `symptoms: ["hot flashes", "night sweats", "mood changes", "trouble sleeping"]`

**UI Details:**
- Long text wraps naturally
- Comma-separated items parsed automatically
- Message appears immediately on send

**Progress**: 3/7 stages complete

---

### Step 6: Medical History

**User Response**: "family history of osteoporosis"

**AI Response**:
```
"Thanks for sharing that medical history. It's important context. 
What medications or supplements are you currently taking?"
```

**Data Collected**:
- `medicalHistory: ["family history of osteoporosis"]`

**Progress**: 4/7 stages complete

---

### Step 7: Current Medications

**User Response**: "multivitamin, vitamin D, occasional ibuprofen"

**AI Response**:
```
"I've noted your current medications. This helps ensure 
recommendations are appropriate. What are your main health goals 
right now? What would make you feel better?"
```

**Data Collected**:
- `medications: ["multivitamin", "vitamin D", "occasional ibuprofen"]`

**Progress**: 5/7 stages complete

---

### Step 8: Health Goals

**User Response**: "sleep better, have more energy, manage hot flashes naturally"

**AI Response**: *Loading spinner appears*

```
"Thank you for sharing this with me, Sarah. Here's what I've learned 
about you:

Age: 45-50
Symptoms: hot flashes, night sweats, mood changes, trouble sleeping
Medical History: family history of osteoporosis
Current Medications: multivitamin, vitamin D, occasional ibuprofen
Health Goals: sleep better, have more energy, manage hot flashes naturally

Based on this information, I'll now provide personalized non-diagnostic 
guidance. Would you like me to explain what might be happening and 
suggest next steps?"
```

**Data Collected**:
- `goals: ["sleep better", "have more energy", "manage hot flashes naturally"]`

**Visual Change**: Summary box appears showing collected data
**Progress**: 6/7 stages complete

---

### Step 9: Guidance & Recommendations

**AI Response**:
```
"Based on what you've shared, here's some personalized guidance:

Your Experience: It sounds like you're experiencing a combination 
of symptoms common in perimenopause. Many women experience similar patterns.

Next Steps:
1. Consider scheduling a consultation with a healthcare provider who 
   specializes in menopause
2. Track your symptoms over the next 2-4 weeks to identify patterns
3. Discuss treatment options including lifestyle modifications, supplements, 
   or hormone therapy

We can help you find compassionate providers and show you transparent 
pricing options. Ready to explore that?"
```

**UI Changes:**
- New section appears below chat with action buttons
- "View Recommendations" button (Phase 2)
- "Browse Providers" button (Phase 3)
- Assessment marked as complete

**Data Collected**: Complete profile captured

**Progress**: 7/7 stages complete ✅

---

### Step 10: Post-Assessment (Phase 1)

**Buttons Appear:**

```
┌─────────────────────────────────────┐
│ Your intake assessment is complete! 🎉
│                                      │
│ Based on your information, you can  │
│ now explore personalized care      │
│ options and transparent pricing.    │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ View Recommendations (Phase 2)  │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Browse Providers (Phase 3)      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**User Thinking:**
> "Great! I feel heard. Now I want to see what options are available."

**What Happens Next** (Phase 2+):
- View Recommendations → See treatment options with pricing
- Browse Providers → Find specialists in their area
- Book Appointment → Schedule with a provider

---

## User Emotional Journey

```
Landing Page
    ↓
    Curiosity: "What is this?"
    ↓
Click CTA
    ↓
    Apprehension: "Will this be like other forms?"
    ↓
Chat Introduction
    ↓
    Relief: "It's conversational, not a form"
    ↓
Name Question
    ↓
    Engagement: "This feels personal"
    ↓
More Questions
    ↓
    Comfort: "I'm being heard"
    ↓
Symptom Summary
    ↓
    Validation: "The AI understands my situation"
    ↓
Guidance Provided
    ↓
    Empowerment: "I have next steps"
    ↓
Call-to-Action
    ↓
    Hope: "I can get real help"
```

---

## Mobile User Experience

### Mobile Landing
- Hero image/text stacked vertically
- Feature cards scroll vertically (1 column)
- Buttons full width for easy tapping
- Navigation simplified to mobile menu

### Mobile Chat
- Full-screen chat interface
- Larger touch targets for messages
- Keyboard-aware (moves above keyboard)
- Portrait and landscape responsive

### Mobile Summary
- Scrollable profile recap
- Action buttons full width
- Same compassionate messaging

---

## Chat Accessibility Features

**For All Users:**
- ✅ Large, readable text (16px minimum)
- ✅ High contrast colors (4.5:1 ratio)
- ✅ Clear message differentiation (colors + positioning)
- ✅ Auto-scrolling to new messages

**For Keyboard Users:**
- ✅ Tab through messages
- ✅ Enter to send message
- ✅ Focus indicators on buttons
- ✅ No keyboard traps

**For Screen Readers:**
- ✅ Semantic HTML structure
- ✅ ARIA labels on interactive elements
- ✅ Message roles announced
- ✅ Loading states described

**For Motor Disabilities:**
- ✅ Large buttons and text areas
- ✅ No time limits
- ✅ Keyboard alternative to mouse
- ✅ Scroll-friendly layout

---

## Common User Paths

### Path A: Quick Assessment (3 minutes)
```
Landing → See headline → Click CTA → Chat → Quick answers → Summary → Exit
```

### Path B: Thorough Assessment (5-7 minutes)
```
Landing → Scroll features → Read how it works → Click CTA → 
Chat → Detailed answers → Read summary → Click next steps
```

### Path C: Return User (Phase 2+)
```
Landing → Already assessed → Skip to Recommendations → 
View options → See pricing → Browse providers → Book
```

### Path D: Skeptical User
```
Landing → Read copy → Read features → Learn more → Chat → 
Understand process → Complete assessment → Feel informed
```

---

## Success Metrics

**Phase 1 (Current):**
- ✅ User reaches landing page
- ✅ User clicks CTA
- ✅ User enters chat
- ✅ User completes 7 stages
- ✅ User sees summary

**Phase 2 (Next):**
- 📊 User clicks "View Recommendations"
- 📊 User explores pricing options
- 📊 User reads about providers

**Phase 3 (Future):**
- 📊 User books appointment
- 📊 User completes intake
- 📊 User attends consultation

---

## Error Scenarios (Phase 1)

**Scenario: User doesn't answer**
- Message input remains empty
- Send button stays disabled
- Gentle prompt: "Please share your response"

**Scenario: User goes back**
- Back button resets conversation
- All data cleared (except in Phase 2 with login)
- Option to restart fresh

**Scenario: Page refreshed**
- Chat restarts from beginning
- Session ID regenerates
- Data not persisted (Phase 1 limitation)

In Phase 2 with Supabase:
- User data saved
- Can resume session
- History available

---

## Language & Tone Examples

### Welcome
> "Hi there! I'm here to help you navigate your health journey."

### Acknowledgment
> "Thanks for sharing that. It's important context."

### Summary
> "Thank you for sharing this with me. Here's what I've learned..."

### Guidance
> "Based on what you've shared, here's some personalized guidance..."

### Reassurance
> "Your information is secure and confidential"

---

## Design Decisions in Action

### Why Conversational?
- ✅ Feels human and compassionate
- ✅ Reduces form anxiety
- ✅ Easier to provide context
- ❌ Takes slightly longer

### Why One Question at a Time?
- ✅ Reduces cognitive overload
- ✅ Builds conversation flow
- ✅ Shows progress
- ❌ Could feel slow

### Why Summary Before Guidance?
- ✅ Shows understanding
- ✅ Allows for error checking
- ✅ Builds trust
- ✅ Prepares user for recommendations

---

## Phase 2 Preview

After completing assessment, user would see:

```
RECOMMENDATIONS
├── Lifestyle Changes (Free)
│   ├── Sleep optimization
│   └── Stress management
│
├── Supplements ($20-50/month)
│   ├── Black cohosh
│   └── Sage extract
│
├── Medications ($30-150/month)
│   └── Hormone therapy options
│
└── Therapy ($75-150/session)
    └── Talk to specialists

PROVIDERS NEAR YOU
├── Dr. Sarah Chen (OB-GYN)
│   ├── $150 first visit
│   ├── Insurance: Aetna, Blue Cross
│   └── Next available: Tomorrow
│
└── Dr. James Rodriguez (Naturopath)
    ├── $100 first visit
    ├── Insurance: Varies
    └── Next available: Next week
```

---

## Key Takeaways

1. **User feels heard** - Not processed through a form
2. **Data is structured** - But collected naturally
3. **Progress is visible** - User knows where they are
4. **Guidance is personalized** - Based on their actual situation
5. **Next steps are clear** - Ready for Phase 2

---

This journey creates a foundation of trust and understanding that makes Phase 2 and Phase 3 feel like natural next steps.

💚 **Every interaction matters. Every user deserves care.**
