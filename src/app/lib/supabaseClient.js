// lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('supabaseUrl', supabaseUrl);  // Deve mostrar a URL do Supabase
console.log('supabaseAnonKey', supabaseAnonKey);  
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
