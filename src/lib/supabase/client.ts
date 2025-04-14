import { createClient } from '@supabase/supabase-js';

// Deze client wordt in de browser gebruikt
// Probleem: Het SSL-certificaat van db.moonxqecnqpnkvyfgszv.supabase.co is ongeldig
// Oplossing: Gebruik de correcte URL zonder 'db.' prefix
const supabaseUrlFromEnv = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Corrigeer URL formaat indien nodig
const supabaseUrl = supabaseUrlFromEnv.includes('db.moonxqecnqpnkvyfgszv') 
  ? 'https://moonxqecnqpnkvyfgszv.supabase.co' 
  : supabaseUrlFromEnv;

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Controleer of URL en key zijn ingesteld
if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is niet ingesteld in je .env bestand!');
}

if (!supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is niet ingesteld in je .env bestand!');
}

// Gebruik een standaard URL tijdens ontwikkeling als deze ontbreekt
const fallbackUrl = 'https://moonxqecnqpnkvyfgszv.supabase.co';
console.log('[Supabase] Initialiseren client met URL:', supabaseUrl || fallbackUrl);

export const supabase = createClient(
  supabaseUrl || fallbackUrl, 
  supabaseAnonKey
); 