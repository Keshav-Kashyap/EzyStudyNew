import { NextResponse } from 'next/server';
import { processGroqChatRequest } from './_backend/chat-service.js';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const payload = await req.json();
    const result = await processGroqChatRequest(payload);
    return NextResponse.json(result.body, { status: result.status });

  } catch (error) {
    console.error('Request parsing error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid request: ' + error.message
      },
      { status: 400 }
    );
  }
}
