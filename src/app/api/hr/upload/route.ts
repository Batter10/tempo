import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { extractTextFromPDFBuffer, extractTextFromDOCXBuffer, extractTextFromTXTBuffer, splitTextIntoChunks } from '@/lib/document-utils';
import { generateEmbedding } from '@/lib/openai';
import { revalidatePath } from 'next/cache';

// route: /api/hr/upload - Document upload API endpoint
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minuten timeout

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('Geen bestand in verzoek gevonden');
      return NextResponse.json({ error: 'Geen bestand ontvangen' }, { status: 400 });
    }

    // Controleer bestandstype
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!validTypes.includes(file.type)) {
      console.error('Ongeldig bestandstype:', file.type);
      return NextResponse.json(
        { error: 'Ongeldig bestandstype. Upload een PDF, DOC, DOCX of TXT bestand.' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // Log de authenticatiestatus om te debuggen
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Authenticatiefout: ' + authError.message }, { status: 401 });
    }
    
    if (!user) {
      console.error('Geen geauthenticeerde gebruiker');
      return NextResponse.json({ error: 'Niet geauthenticeerd' }, { status: 401 });
    }

    try {
      console.log(`Begin verwerking van bestand: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      
      // Upload naar Supabase storage
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hr-documents')
        .upload(`${Date.now()}_${file.name}`, buffer, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Fout bij uploaden naar storage:', uploadError);
        return NextResponse.json({ error: 'Bestand uploaden naar opslag mislukt: ' + uploadError.message }, { status: 500 });
      }

      const storagePath = uploadData?.path;
      if (!storagePath) {
        console.error('Geen storagePath ontvangen van Supabase');
        return NextResponse.json({ error: 'Opslagpad probleem' }, { status: 500 });
      }

      // Tekstextractie op basis van bestandstype
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDFBuffer(buffer);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        text = await extractTextFromDOCXBuffer(buffer);
      } else if (file.type === 'text/plain') {
        text = await extractTextFromTXTBuffer(buffer);
      }

      if (!text.trim()) {
        console.warn('Geen tekst geëxtraheerd uit document');
        
        // Sla het document op als metadata zonder chunks
        const { error: docError } = await supabase
          .from('hr.documents')
          .insert({
            filename: file.name,
            storage_path: storagePath,
            content_length: 0,
            chunks_count: 0
          });

        if (docError) {
          console.error('Fout bij opslaan document metadata:', docError);
          return NextResponse.json({ error: 'Document metadata opslaan mislukt: ' + docError.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Document opgeslagen, maar geen tekst geëxtraheerd.' });
      }

      // Tekst opsplitsen in chunks
      const chunks = splitTextIntoChunks(text);
      console.log(`Tekst opgesplitst in ${chunks.length} chunks`);

      // Opslaan in document tabel
      const { data: documentData, error: docError } = await supabase
        .from('hr.documents')
        .insert({
          filename: file.name,
          storage_path: storagePath,
          content_length: text.length,
          chunks_count: chunks.length
        })
        .select()
        .single();

      if (docError) {
        console.error('Fout bij opslaan document:', docError);
        return NextResponse.json({ error: 'Document opslaan mislukt: ' + docError.message }, { status: 500 });
      }

      const documentId = documentData.id;

      // Genereer embeddings en sla chunks op
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        try {
          const embedding = await generateEmbedding(chunk);
          
          const { error: chunkError } = await supabase
            .from('hr.document_chunks')
            .insert({
              document_id: documentId,
              chunk_index: i,
              content: chunk,
              embedding: embedding
            });

          if (chunkError) {
            console.error(`Fout bij opslaan chunk ${i}:`, chunkError);
            // Ga door met de volgende chunk
          }
        } catch (embeddingError) {
          console.error(`Fout bij genereren embedding voor chunk ${i}:`, embeddingError);
          // Ga door met de volgende chunk
        }
      }

      revalidatePath('/hr');
      return NextResponse.json({ success: true, chunks: chunks.length });

    } catch (processingError) {
      console.error('Fout bij verwerken bestand:', processingError);
      return NextResponse.json(
        { error: `Fout bij verwerken bestand: ${processingError instanceof Error ? processingError.message : 'Onbekende fout'}` }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Algemene fout in upload API:', error);
    return NextResponse.json(
      { error: `Server fout: ${error instanceof Error ? error.message : 'Onbekende fout'}` }, 
      { status: 500 }
    );
  }
}

// Verwijder oude code (commented out for safety)
/*
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/openai';
import { extractPdfText, splitIntoChunks, isValidFileType, DocumentMetadata } from '@/lib/document-utils';

export const maxDuration = 300; // 5 minuten timeout

export async function POST_ORIGINAL(request: NextRequest) {
  try {
    // ... (oude code hier) ...
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error bij verwerken van document' },
      { status: 500 }
    );
  }
}
*/ 