import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text ontbreekt of is ongeldig' },
        { status: 400 }
      );
    }

    const embedding = await generateEmbedding(text);

    return NextResponse.json({ embedding });
  } catch (error) {
    console.error('Error generating embedding:', error);
    return NextResponse.json(
      { error: 'Server error bij het genereren van embedding' },
      { status: 500 }
    );
  }
} 