"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, CheckCircle, Heart, Lock, Users, DollarSign } from "lucide-react";
import { 
  carregarParticipantes, 
  salvarParticipantes, 
  supabase, 
  Participante 
} from "@/services/storage";

export default function Admin() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [autenticado, setAutenticado] = useState(false);
  const [senhaInput, setSenhaInput] = useState("");
  const SENHA_MESTRE = "benicio2026"; 

  // Função para buscar dados atualizados do Supabase
  async function atualizarLista() {
    const dados = await carregarParticipantes();
    setParticipantes(dados);
  }

  // Só busca os dados se o usuário estiver autenticado
  useEffect(() => {
    if (autenticado) {
      atualizarLista();
    }
  }, [autenticado]);

  function fazerLogin(e: React.FormEvent) {
    e.preventDefault();
    if (senhaInput === SENHA_MESTRE) {
      setAutenticado(true);
    } else {
      alert("Senha incorreta! ❌");
    }
  }

  // Confirma o recebimento do PIX ou da Fralda
  async function confirmarReserva(participante: Participante) {
    const novoStatus = participante.tipoEntrega === 'pix' ? 'confirmado_pix' : 'entregue';
    
    const atualizado: Participante = { 
      ...participante, 
      status: novoStatus, 
      expiraEm: null 
    };

    await salvarParticipantes([atualizado]);
    await atualizarLista();
    alert(`Número ${participante.numero} confirmado com sucesso! ✅`);
  }

  // Remove a reserva do banco de dados definitivamente
  async function excluirReserva(numero: number) {
    if (confirm(`Tem certeza que deseja excluir a reserva do número ${numero}?`)) {
      const { error } = await supabase
        .from('participantes')
        .delete()
        .eq('numero', numero);

      if (!error) {
        await atualizarLista();
      } else {
        alert("Erro ao excluir do banco de dados.");
      }
    }
  }

  // --- TELA DE LOGIN ---
  if (!autenticado) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center p-6 font-sans">
        <form onSubmit={fazerLogin} className="bg-white p-8 rounded-[3rem] shadow-2xl max-w-sm w-full border border-blue-100 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-black mb-2 uppercase tracking-tighter text-gray-800">Acesso Restrito</h1>
          <p className="text-gray-900 text-[10px] font-bold uppercase mb-6 tracking-widest">Área de Gestão do Benício</p>
          <input 
            type="password" 
            value={senhaInput} 
            onChange={(e) => setSenhaInput(e.target.value)} 
            className="w-full p-5 mb-4 rounded-2xl bg-gray-50 border-2 border-gray-100 outline-none text-center font-bold text-gray-900 focus:border-blue-400 transition-all" 
            placeholder="Senha Mestra" 
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            Entrar no Painel
          </button>
        </form>
      </main>
    );
  }

  // --- PAINEL PRINCIPAL ---
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-10 pb-20 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/numeros">
            <button className="bg-white p-4 rounded-2xl shadow-sm text-gray-900 hover:text-blue-600 transition-all hover:scale-105">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-center flex items-center gap-3 uppercase tracking-tighter text-gray-800">
            Gestão Benício <Heart size={28} className="text-blue-500 fill-blue-500" />
          </h1>
          <div className="w-12"></div>
        </div>

        {/* RESUMO DE ARRECADAÇÃO E NÚMEROS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2 italic">Total de Números Reservados</p>
            <p className="text-4xl font-black text-blue-600">{participantes.length}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2 italic">Arrecadação Real (PIX)</p>
            <p className="text-4xl font-black text-green-600">
              R$ {participantes
                .filter(p => p.status === 'confirmado_pix')
                .reduce((total, p) => total + (Number(p.valor) || 0), 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        {/* RELATÓRIO DE FRALDAS */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  {['P', 'M', 'G', 'GG'].map(tam => {
    const qtd = participantes.filter(p => {
        // Lógica para identificar o tamanho pelo número
        if (tam === 'P') return p.numero <= 30;
        if (tam === 'M') return p.numero > 30 && p.numero <= 85;
        if (tam === 'G') return p.numero > 85 && p.numero <= 135;
        if (tam === 'GG') return p.numero > 135;
        return false;
    }).length;

    return (
      <div key={tam} className="bg-white p-4 rounded-2xl border border-blue-100 text-center shadow-sm">
        <p className="text-[10px] font-black text-blue-400 uppercase">Tamanho {tam}</p>
        <p className="text-xl font-black text-gray-800">{qtd}</p>
      </div>
    );
  })}
</div>

        {/* LISTA DE RESERVAS */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em] ml-4 mb-4 flex items-center gap-2">
            <Users size={16} /> Lista de Reservas Ativas
          </h2>
          
          {participantes.length > 0 ? (
            participantes.sort((a,b) => a.numero - b.numero).map((p) => (
              <div key={p.numero} className="flex items-center gap-4 bg-white p-5 md:p-7 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                {/* Número do Cartão */}
                <span className="bg-blue-600 text-white w-16 h-14 flex items-center justify-center rounded-2xl font-black text-xl shrink-0 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                  {p.numero.toString().padStart(3, "0")}
                </span>
                
                {/* Informações do Participante */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-800 uppercase text-sm md:text-base truncate tracking-tight">{p.nome}</p>
                  <p className="text-[10px] font-bold text-gray-900 mb-1">{p.telefone}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${
                      p.status.includes('confirmado') || p.status === 'entregue' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {p.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">
                      R$ {Number(p.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2">
                  {/* Confirmar */}
                  {!(p.status === 'confirmado_pix' || p.status === 'entregue') && (
                    <button 
                      onClick={() => confirmarReserva(p)}
                      className="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                      title="Confirmar"
                    >
                      <CheckCircle size={24} />
                    </button>
                  )}
                  
                  {/* Excluir */}
                  <button 
                    onClick={() => excluirReserva(p.numero)}
                    className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    title="Excluir"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[3.5rem] border-2 border-dashed border-gray-100">
              <p className="text-gray-300 font-bold uppercase tracking-widest italic text-sm">O banco de dados está vazio no momento.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}