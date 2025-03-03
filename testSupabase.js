// testSupabase.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://feqrptfhxulzohiaxcsy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlcXJwdGZoeHVsem9oaWF4Y3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5NjcyNTcsImV4cCI6MjA0MDU0MzI1N30.5YdAzftkN904B9hv3QMQZETChsrkWaIhdwpQz5c49jc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('clientes').select('*');

    if (error) {
      console.error('Erro ao consultar o Supabase:', error.message);
    } else {
      console.log('Dados retornados:', data);
    }
  } catch (err) {
    console.error('Erro durante a conexão com o Supabase:', err);
  }
}

testSupabaseConnection();
