import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  sessionId: string;
  stage: number;
  userMessage: string;
  userProfile: {
    name?: string;
    age?: string;
    symptoms?: string[];
    medicalHistory?: string[];
    currentMedications?: string[];
    goals?: string[];
  };
}

// Mock response handler - will be replaced with Claude/OpenAI integration
async function generateResponse(request: ChatRequest): Promise<string> {
  const { stage, userMessage, userProfile } = request;

  // This is a mock implementation
  // In Phase 2, this will call the actual AI API (Claude, OpenAI, or similar)
  
  const responses: { [key: number]: string } = {
    0: `Thank you for sharing your name. Let's continue with your assessment.`,
    1: `Got it! That helps me understand your situation better.`,
    2: `These symptoms are quite common in your age range. Let's gather more information.`,
    3: `Thanks for sharing that medical history. It's important context.`,
    4: `I've noted your current medications. This helps ensure recommendations are appropriate.`,
    5: `These are great goals to work towards. Based on everything you've shared, I can provide personalized guidance.`,
    6: `Based on your symptoms and situation, I recommend scheduling a consultation with a menopause specialist.`,
  };

  return responses[stage] || `Thank you for that information. Let's continue.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    
    // Validate request
    if (!body.sessionId || body.stage === undefined || !body.userMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate response (mock for now)
    const response = await generateResponse(body);

    // In production, this would save to database
    // For now, we're handling everything client-side with state
    
    return NextResponse.json({
      success: true,
      response,
      sessionId: body.sessionId,
      stage: body.stage + 1
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
