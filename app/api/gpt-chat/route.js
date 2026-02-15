import { NextResponse } from 'next/server';

/**
 * AI Chat API - Ready for free models integration
 * 
 * Supported Free Models:
 * 1. Groq (https://groq.com) - Free tier with llama3, mixtral models
 * 2. Google Gemini (https://ai.google.dev) - Free with gemini-pro
 * 3. Hugging Face Inference API - Free tier available
 * 
 * Setup Instructions:
 * 1. Get your API key from one of the providers
 * 2. Add to .env.local:
 *    - GROQ_API_KEY=your_groq_key
 *    - GOOGLE_AI_API_KEY=your_gemini_key
 *    - HUGGINGFACE_API_KEY=your_hf_key
 * 3. Set AI_PROVIDER in .env.local (groq, gemini, or huggingface)
 */

// Configuration - Choose your AI provider
const AI_PROVIDER = process.env.AI_PROVIDER || 'mock'; // 'groq', 'gemini', 'huggingface', or 'mock'
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Groq API Integration (Fast & Free)
async function callGroqAPI(message, context, history) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', // or 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant for EzyStudy, an educational platform. Context: ${context}. Provide clear, accurate, and helpful responses to student queries.`
        },
        ...history.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Google Gemini API Integration (Free & Powerful)
async function callGeminiAPI(message, context, history) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are a helpful AI assistant for EzyStudy. Context: ${context}.\n\nConversation History:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nUser: ${message}\n\nProvide a clear and helpful response:`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.95,
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// Hugging Face API Integration
async function callHuggingFaceAPI(message, context, history) {
  const prompt = `Context: ${context}\n\nConversation:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\nUser: ${message}\nAssistant:`;

  const response = await fetch(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HuggingFace API error: ${error}`);
  }

  const data = await response.json();
  return data[0].generated_text;
}

// Mock implementation (fallback)
async function mockAIResponse(message, context) {
  await new Promise(res => setTimeout(res, 1000));
  return `This is a mock AI response. Your message was: "${message}" (Context: ${context})\n\nTo enable real AI, please:\n1. Get a free API key from Groq, Google Gemini, or HuggingFace\n2. Add it to your .env.local file\n3. Set the AI_PROVIDER variable\n\nRecommended: Groq API (fastest and free)`;
}

export async function POST(req) {
  try {
    const { message, context, history = [], stream = true } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    let reply;

    // Route to appropriate AI provider
    try {
      switch (AI_PROVIDER) {
        case 'groq':
          if (!GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY not configured in environment variables');
          }
          reply = await callGroqAPI(message, context, history);
          break;

        case 'gemini':
          if (!GOOGLE_AI_API_KEY) {
            throw new Error('GOOGLE_AI_API_KEY not configured in environment variables');
          }
          reply = await callGeminiAPI(message, context, history);
          break;

        case 'huggingface':
          if (!HUGGINGFACE_API_KEY) {
            throw new Error('HUGGINGFACE_API_KEY not configured in environment variables');
          }
          reply = await callHuggingFaceAPI(message, context, history);
          break;

        default:
          reply = await mockAIResponse(message, context);
      }

      return NextResponse.json({
        ok: true,
        reply,
        provider: AI_PROVIDER
      });

    } catch (apiError) {
      console.error('AI API Error:', apiError);

      // Fallback to mock if API fails
      const fallbackReply = await mockAIResponse(message, context);
      return NextResponse.json({
        ok: true,
        reply: `⚠️ AI service temporarily unavailable. Using fallback response:\n\n${fallbackReply}`,
        provider: 'fallback',
        error: apiError.message
      });
    }

  } catch (error) {
    console.error('Request Error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid request: ' + error.message
      },
      { status: 400 }
    );
  }
}
