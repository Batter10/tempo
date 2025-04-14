import pdfParse from 'pdf-parse';

// Maximum lengte van een chunk
const MAX_CHUNK_SIZE = 500;

// Interface voor document metadata
export interface DocumentMetadata {
  filename: string;
  filePath: string;
  contentType: string;
}

// Functie om bestandstypes te valideren
export function isValidFileType(filename: string): boolean {
  const validExtensions = ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'];
  const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return validExtensions.includes(extension);
}

// Functie om PDF inhoud te extraheren
export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Kon de PDF niet verwerken');
  }
}

// Functie om tekst te splitsen in chunks
export function splitIntoChunks(text: string): string[] {
  // Schoon de tekst op
  const cleanText = text
    .replace(/\n+/g, ' ') // Vervang nieuwe regels door spaties
    .replace(/\s+/g, ' ') // Vervang meerdere spaties door één spatie
    .trim();

  const chunks: string[] = [];
  
  // Splits tekst in zinnen (ruw)
  const sentences = cleanText.split(/(?<=[.!?])\s+/);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    // Als de huidige chunk plus de nieuwe zin groter wordt dan MAX_CHUNK_SIZE
    if (currentChunk.length + sentence.length > MAX_CHUNK_SIZE) {
      // Voeg huidige chunk toe aan array en reset
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = sentence;
    } else {
      // Voeg de zin toe aan de huidige chunk
      currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
    }
  }
  
  // Voeg het laatste stuk toe als er nog tekst over is
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// Functie om de taal van een vraag te detecteren
export function detectLanguage(text: string): 'nl' | 'en' {
  // Eenvoudige detectie op basis van eerste woorden
  const dutchStarters = ['hoe', 'wat', 'wanneer', 'waarom', 'wie', 'welke', 'waar', 'is', 'kan', 'mag', 'moet', 'zal'];
  const englishStarters = ['how', 'what', 'when', 'why', 'who', 'which', 'where', 'is', 'can', 'may', 'must', 'will'];
  
  const firstWord = text.trim().toLowerCase().split(/\s+/)[0];
  
  if (englishStarters.includes(firstWord)) {
    return 'en';
  }
  
  // Default is Nederlands (gezien de doelgroep)
  return 'nl';
} 