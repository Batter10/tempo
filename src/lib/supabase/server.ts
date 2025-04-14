import { createClient } from '@supabase/supabase-js';

// Deze client wordt alleen op de server gebruikt
// Probleem: Het SSL-certificaat van db.moonxqecnqpnkvyfgszv.supabase.co is ongeldig
// Oplossing: Gebruik de correcte URL zonder 'db.' prefix
const supabaseUrlFromEnv = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Corrigeer URL formaat indien nodig
const supabaseUrl = supabaseUrlFromEnv.includes('db.moonxqecnqpnkvyfgszv') 
  ? 'https://moonxqecnqpnkvyfgszv.supabase.co' 
  : supabaseUrlFromEnv;

const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

// Controleer of URL en key zijn ingesteld
if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is niet ingesteld in je .env bestand!');
}

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_KEY is niet ingesteld in je .env bestand!');
}

// Gebruik een standaard URL tijdens ontwikkeling als deze ontbreekt
const fallbackUrl = 'https://moonxqecnqpnkvyfgszv.supabase.co';
console.log('[Supabase Server] Initialiseren admin client met URL:', supabaseUrl || fallbackUrl);

export const supabaseAdmin = createClient(
  supabaseUrl || fallbackUrl, 
  supabaseServiceKey
); 