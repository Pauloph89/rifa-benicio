"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, CheckCircle, Heart, Lock, Users, Trophy, ExternalLink } from "lucide-react";
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
  const [loginLoading, setLoginLoading] = useState(false);
  const [loadingNumero, setLoadingNumero] = useState<number | null>(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (!autenticado) return;
    carregarParticipantes().then(setParticipantes);
  }, [autenticado]);

  async function fazerLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha: senhaInput }),
    });
    setLoginLoading(false);
    if (res.ok) setAutenticado(true);
    else alert("Senha incorreta! ❌");
  }

  async function confirmarReserva(participante: Participante) {
    setLoadingNumero(participante.numero);
    const novoStatus = participante.tipoEntrega === 'pix' ? 'confirmado_pix' : 'entregue';
    await salvarParticipantes([{ ...participante, status: novoStatus, expiraEm: null }]);
    const dados = await carregarParticipantes();
    setParticipantes(dados);
    setLoadingNumero(null);
    alert(`Número ${participante.numero} confirmado com sucesso! ✅`);
  }

  async function excluirReserva(numero: number) {
    if (!confirm(`Tem certeza que deseja excluir a reserva do número ${numero}?`)) return;
    setLoadingNumero(numero);
    const { error } = await supabase.from('participantes').delete().eq('numero', numero);
    if (!error) {
      const dados = await carregarParticipantes();
      setParticipantes(dados);
    } else {
      alert("Erro ao excluir do banco de dados.");
    }
    setLoadingNumero(null);
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
          <button type="submit" disabled={loginLoading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-60">
            {loginLoading ? "Verificando..." : "Entrar no Painel"}
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
        <div className="mb-6">
          {/* Linha 1: voltar + título + botões */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <Link href="/numeros">
              <button className="bg-white p-3 rounded-2xl shadow-sm text-gray-400 hover:text-blue-600 transition-all hover:scale-105 shrink-0">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <h1 className="text-lg md:text-3xl font-black text-center flex items-center gap-2 uppercase tracking-tighter text-gray-800 flex-1">
              Gestão Benício <Heart size={20} className="text-blue-500 fill-blue-500 shrink-0" />
            </h1>
            <div className="flex gap-2 shrink-0">
              <Link href="/sorteio">
                <button className="bg-yellow-400 text-white p-3 rounded-2xl shadow-sm hover:bg-yellow-500 transition-all" title="Sorteio">
                  <Trophy size={16} />
                </button>
              </Link>
              <Link href="/banner" target="_blank">
                <button className="bg-blue-600 text-white p-3 rounded-2xl shadow-sm hover:bg-blue-700 transition-all" title="Banner">
                  <ExternalLink size={16} />
                </button>
              </Link>
            </div>
          </div>
          {/* Linha 2: labels dos botões visíveis só em telas maiores */}
          <div className="hidden md:flex justify-end gap-2 pr-1">
            <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Sorteio</span>
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-3">Banner</span>
          </div>
        </div>

        {/* RESUMO DE ARRECADAÇÃO E NÚMEROS */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white p-4 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Números Reservados</p>
            <p className="text-3xl md:text-4xl font-black text-blue-600">{participantes.length}</p>
          </div>
          <div className="bg-white p-4 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Arrecadado (PIX)</p>
            <p className="text-xl md:text-4xl font-black text-green-600">
              R$ {participantes
                .filter(p => p.status === 'confirmado_pix')
                .reduce((total, p) => total + (Number(p.valor) || 0), 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* RELATÓRIO DE FRALDAS */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {['P', 'M', 'G', 'GG'].map(tam => {
            const qtd = participantes.filter(p => {
              if (tam === 'P') return p.numero <= 30;
              if (tam === 'M') return p.numero > 30 && p.numero <= 85;
              if (tam === 'G') return p.numero > 85 && p.numero <= 135;
              if (tam === 'GG') return p.numero > 135;
              return false;
            }).length;
            return (
              <div key={tam} className="bg-white p-3 rounded-2xl border border-blue-100 text-center shadow-sm">
                <p className="text-[9px] font-black text-blue-400 uppercase">Tam. {tam}</p>
                <p className="text-xl font-black text-gray-800">{qtd}</p>
              </div>
            );
          })}
        </div>

        {/* LISTA DE RESERVAS */}
        <div className="space-y-3">
          <div className="flex flex-col gap-2 mb-2">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <Users size={14} /> Lista de Reservas Ativas
            </h2>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome..."
              className="bg-white border border-gray-100 rounded-2xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-blue-300 transition-all shadow-sm w-full"
            />
          </div>

          {participantes.length > 0 ? (
            participantes
              .filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
              .sort((a,b) => a.numero - b.numero).map((p) => (
              <div key={p.numero} className="flex items-center gap-3 bg-white p-4 md:p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                {/* Número do Cartão */}
                <span className="bg-blue-600 text-white w-12 h-11 md:w-16 md:h-14 flex items-center justify-center rounded-xl font-black text-base md:text-xl shrink-0 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                  {p.numero.toString().padStart(3, "0")}
                </span>
                
                {/* Informações do Participante */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-800 uppercase text-xs md:text-base truncate tracking-tight">{p.nome}</p>
                  <p className="text-[10px] font-bold text-gray-400 mb-1">{p.telefone}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg ${
                      p.status.includes('confirmado') || p.status === 'entregue'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {p.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">
                      R$ {Number(p.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-1.5 shrink-0">
                  {!(p.status === 'confirmado_pix' || p.status === 'entregue') && (
                    <button
                      onClick={() => confirmarReserva(p)}
                      disabled={loadingNumero === p.numero}
                      className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                      aria-label="Confirmar entrega"
                    >
                      {loadingNumero === p.numero ? <span className="text-xs font-black">...</span> : <CheckCircle size={20} />}
                    </button>
                  )}
                  <button
                    onClick={() => excluirReserva(p.numero)}
                    disabled={loadingNumero === p.numero}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                    aria-label="Excluir reserva"
                  >
                    {loadingNumero === p.numero ? <span className="text-xs font-black">...</span> : <Trash2 size={20} />}
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