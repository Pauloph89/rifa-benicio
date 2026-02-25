import { createClient } from '@supabase/supabase-js';

// --- CONEXÃO DIRETA (Para evitar erro de variável não encontrada) ---
const supabaseUrl = "https://xsxfsvoejgqoyfolosyg.supabase.co";
// COLE SUA CHAVE ABAIXO DENTRO DAS ASPAS
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzeGZzdm9lamdxb3lmb2xvc3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTc5ODUsImV4cCI6MjA4NzU3Mzk4NX0.iOzSZRfGKOJP2HaUTAmtA6maJuuFpWVOo6PakYbjCy8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ... (mantenha as importações e chaves de conexão)

export interface Participante {
  numero: number;
  nome: string;
  telefone: string;
  tipoEntrega: 'presencial' | 'pix';
  status: 'pendente_pix' | 'presencial_pendente' | 'confirmado_pix' | 'entregue';
  data: string;
  expiraEm: number | null;
  valor: number; // <-- ADICIONE ISSO
}

export async function salvarParticipantes(participantes: Participante[]) {
  for (const p of participantes) {
    const { error } = await supabase
      .from('participantes')
      .upsert({
        numero: p.numero,
        nome: p.nome,
        telefone: p.telefone,
        tipoEntrega: p.tipoEntrega,
        status: p.status,
        data: p.data,
        expiraEm: p.expiraEm,
        valor: p.valor // <-- ADICIONE ISSO
      }, { onConflict: 'numero' });

    if (error) console.error(error);
  }
}

// --- CARREGAR (Busca a lista completa do banco) ---
export async function carregarParticipantes(): Promise<Participante[]> {
  const { data, error } = await supabase
    .from('participantes')
    .select('*');

  if (error) {
    console.error('Erro ao buscar dados:', error.message);
    return [];
  }
  
  return data || [];
}