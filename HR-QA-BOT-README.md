# HR Q&A Bot

De HR Q&A Bot is een AI-assistent die vragen van medewerkers over HR-beleid, arbeidsvoorwaarden en bedrijfsprocedures beantwoordt op basis van geüploade HR-documenten.

## Functionaliteiten

- **Documentverwerking**: Upload PDF-documenten zoals personeelsgidsen, fietsplannen en andere HR-documenten
- **Taaldetectie**: Beantwoordt vragen in dezelfde taal als de vraag (Nederlands of Engels)
- **Gebruiksvriendelijke chat-interface**: Eenvoudige communicatie voor eindgebruikers
- **Feedbacksysteem**: Gebruikers kunnen aangeven of antwoorden nuttig waren
- **Inzichtelijke metadata**: Bekijk welke documenten zijn gebruikt voor antwoorden

## Installatie

1. Zorg ervoor dat je Supabase- en OpenAI-sleutels hebt (zie `.env.example`)
2. Maak de benodigde tabellen in Supabase (zie SQL hieronder)
3. Configureer de HR Q&A Bot via het dashboard

### Benodigde Supabase tabellen

De volgende tabellen zijn nodig in Supabase:

```sql
-- Schema voor HR-gerelateerde tabellen
CREATE SCHEMA IF NOT EXISTS hr;

-- Tabel voor HR-documenten
CREATE TABLE hr.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  content_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabel voor HR-document chunks
CREATE TABLE hr.document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES hr.documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(document_id, chunk_index)
);

-- Tabel voor HR-embeddings
CREATE TABLE hr.embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_chunk_id UUID NOT NULL REFERENCES hr.document_chunks(id) ON DELETE CASCADE,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabel voor HR Q&A chatgeschiedenis
CREATE TABLE hr.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_feedback BOOLEAN,
  metadata JSONB
);

-- Tabel voor template configuraties
CREATE TABLE hr.template_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id TEXT NOT NULL,
  template_name TEXT NOT NULL,
  user_groups TEXT[] NOT NULL DEFAULT ARRAY['Iedereen'],
  language_detection BOOLEAN NOT NULL DEFAULT TRUE,
  custom_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Functie voor document matching
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding TEXT,
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  document_id UUID,
  chunk_text TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
  embedding_vector VECTOR(1536);
BEGIN
  -- Controleer of het een JSON array is (direct embedding van client)
  IF query_embedding LIKE '[%]' THEN
    embedding_vector := query_embedding::VECTOR(1536);
  ELSE
    -- Anders zoeken we op basis van de tekst zelf
    RAISE EXCEPTION 'Direct zoeken op tekst wordt niet ondersteund, gebruik de embedding API';
  END IF;
  
  -- Return de best matchende document chunks
  RETURN QUERY
  SELECT
    dc.document_id,
    dc.chunk_text,
    1 - (e.embedding <=> embedding_vector) AS similarity
  FROM
    hr.embeddings e
    JOIN hr.document_chunks dc ON e.document_chunk_id = dc.id
  WHERE 1 - (e.embedding <=> embedding_vector) > match_threshold
  ORDER BY
    similarity DESC
  LIMIT match_count;
END;
$$;
```

### Supabase Storage Bucket instellen

Maak een `hr_documents` bucket aan in Supabase Storage:

```sql
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('hr_documents', 'hr_documents', false, false, 10485760, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
ON CONFLICT (id) DO NOTHING;
```

## Gebruiksaanwijzing

### Voor Beheerders

1. Log in bij het dashboard
2. Ga naar "Gekozen Templates" en selecteer "HR Personeelsgids Q&A"
3. Klik op "Configureren"
4. Geef de bot een naam (bijv. "HR Assistent")
5. Upload HR-documenten (PDF, Word, tekst)
6. Activeer de bot

### Voor Gebruikers

1. Log in bij het dashboard
2. Ga naar "Actieve Agents" en klik op "Chat" bij de HR Q&A Bot
3. Stel vragen in natuurlijke taal, bijvoorbeeld:
   - "Hoeveel vakantiedagen heb ik per jaar?"
   - "Wat is de procedure voor ziekmelding?"
   - "How does the bicycle plan work?" (Engels wordt ook ondersteund)
4. Geef feedback op antwoorden via de duimpjes

## Technische details

De HR Q&A Bot is gebouwd op basis van:

- **NextJS 14**: Frontend en API-routes
- **OpenAI Embeddings**: Voor semantisch zoeken (text-embedding-ada-002)
- **OpenAI LLM**: Voor antwoorden (GPT-4)
- **Supabase**: Database en bestandsopslag
- **Tailwind CSS**: Voor de gebruikersinterface

De bot gebruikt het volgende proces:

1. **Document opslag**: Bestanden worden geüpload naar Supabase Storage
2. **Document verwerking**: Tekst wordt geëxtraheerd en in chunks gesplitst
3. **Embedding generatie**: Chunks worden omgezet naar OpenAI embeddings
4. **Vraag verwerking**: 
   - De vraag wordt omgezet naar een embedding
   - De meest relevante chunks worden gevonden op basis van similarity
   - Een antwoord wordt gegenereerd met GPT-4 op basis van de relevante chunks
5. **Feedback verwerking**: Gebruikersfeedback wordt opgeslagen voor toekomstige verbetering

## Tips voor effectief gebruik

- Upload actuele en complete HR-documenten
- Formuleer vragen duidelijk en specifiek
- Geef feedback op antwoorden voor continue verbetering
- Voeg meer documenten toe als bepaalde onderwerpen ontbreken

## Beveiligingsoverwegingen

- Alle documenten worden privé opgeslagen in Supabase
- Beveiligingsbeleid beperkt toegang tot geautoriseerde gebruikers
- Geen gevoelige informatie wordt gedeeld met externe partijen
- Alle communicatie verloopt via beveiligde verbindingen 