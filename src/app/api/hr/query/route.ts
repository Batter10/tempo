import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateAnswer, generateEmbedding } from '@/lib/openai';
import { detectLanguage } from '@/lib/document-utils';

// Aantal chunks om te retourneren bij een similarity search
const TOP_CHUNKS = 5;

// Interface voor de embedding resultaten
interface EmbeddingResult {
  document_id: string;
  chunk_text: string;
  similarity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Vraag ontbreekt of is ongeldig' },
        { status: 400 }
      );
    }

    // Detecteer de taal van de vraag
    const language = detectLanguage(question);

    // Genereer een embedding voor de vraag
    const embedding = await generateEmbedding(question);
    
    // Maak matching op basis van embeddings
    const { data: embeddings, error: embeddingsError } = await supabaseAdmin.rpc(
      'match_documents',
      {
        query_embedding: JSON.stringify(embedding), // Stuur de embedding als JSON string
        match_threshold: 0.5,
        match_count: TOP_CHUNKS
      }
    );

    if (embeddingsError) {
      console.error('Error bij embeddings zoeken:', embeddingsError);
      return NextResponse.json(
        { error: 'Kon geen relevante documenten vinden' },
        { status: 500 }
      );
    }

    if (!embeddings || embeddings.length === 0) {
      const noResultsMessage = language === 'nl'
        ? "Hmm, ik kon geen relevante informatie vinden in de HR-documenten. Wil je je vraag anders formuleren, of zal ik de HR-afdeling een seintje geven?"
        : "Hmm, I couldn't find any relevant information in the HR documents. Would you like to rephrase your question, or should I notify the HR department?";

      // Sla de vraag en het antwoord op in de geschiedenis
      await supabaseAdmin
        .from('hr.chat_history')
        .insert({
          question,
          answer: noResultsMessage,
          metadata: { language, found_documents: false }
        });

      return NextResponse.json({ answer: noResultsMessage });
    }

    // Combineer de relevante stukken tekst met hun scores
    const context = embeddings
      .map((item: EmbeddingResult) => `[Score: ${Math.round(item.similarity * 100)}%] ${item.chunk_text}`)
      .join('\n\n');

    // Genereer een antwoord
    const answer = await generateAnswer(question, context, language);

    // Sla de vraag en het antwoord op in de geschiedenis
    await supabaseAdmin
      .from('hr.chat_history')
      .insert({
        question,
        answer,
        metadata: { 
          language, 
          found_documents: true,
          document_ids: embeddings.map((item: EmbeddingResult) => item.document_id),
          similarity_scores: embeddings.map((item: EmbeddingResult) => item.similarity)
        }
      });

    return NextResponse.json({ answer });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error bij het beantwoorden van de vraag' },
      { status: 500 }
    );
  }
} 