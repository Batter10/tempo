import OpenAI from 'openai';

// OpenAI client voor server-side gebruik
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;

// Functie voor het genereren van embeddings
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });

  return response.data[0].embedding;
}

// Functie voor het genereren van antwoorden
export async function generateAnswer(
  question: string, 
  context: string, 
  language: string = 'nl'
): Promise<string> {
  // Gebruiksvriendelijke instructie in de opgegeven taal
  const systemPrompt = language === 'nl' 
    ? `Je bent een vriendelijke HR-assistent. Beantwoord de vraag op basis van de gegeven documentatie. 
       Geef een natuurlijk, net antwoord in dezelfde taal als de vraag. 
       Vermijd juridische termen zoals 'volgens de wet'. 
       Als je het niet weet, zeg: "Hmm, ik weet het niet zeker. Wil je het anders vragen, of zal ik HR een seintje geven?"`
    : `You are a friendly HR assistant. Answer the question based on the provided documentation. 
       Give a natural, polite answer in the same language as the question. 
       Avoid legal terms like 'according to the law'. 
       If you don't know, say: "Hmm, I'm not sure. Would you like to rephrase your question, or should I notify HR?"`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Vraag: ${question}\nDocumenten: ${context}` }
    ],
    temperature: 0.5,
    max_tokens: 500,
  });

  return response.choices[0].message.content || 'Er is een fout opgetreden bij het genereren van een antwoord.';
} 