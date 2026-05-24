"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Users, Lock, RotateCcw, PartyPopper } from "lucide-react";
import { carregarParticipantes, Participante } from "@/services/storage";

type Fase = "carregando" | "pronto" | "sorteando" | "resultado";

const SENHA_MESTRE = "benicio2026";

export default function Sorteio() {
  const [autenticado, setAutenticado] = useState(false);
  const [senhaInput, setSenhaInput] = useState("");
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [fase, setFase] = useState<Fase>("carregando");
  const [exibindo, setExibindo] = useState<Participante | null>(null);
  const [vencedor, setVencedor] = useState<Participante | null>(null);

  const elegiveis = participantes.filter(
    (p) => p.status === "entregue" || p.status === "confirmado_pix"
  );
  const pendentes = participantes.filter(
    (p) => p.status === "presencial_pendente" || p.status === "pendente_pix"
  );

  useEffect(() => {
    if (autenticado) {
      carregarParticipantes().then((dados) => {
        setParticipantes(dados);
        setFase("pronto");
      });
    }
  }, [autenticado]);

  function fazerLogin(e: React.FormEvent) {
    e.preventDefault();
    if (senhaInput === SENHA_MESTRE) setAutenticado(true);
    else alert("Senha incorreta! ❌");
  }

  function realizarSorteio() {
    if (elegiveis.length === 0) return;
    setFase("sorteando");
    setVencedor(null);

    const ganhador = elegiveis[Math.floor(Math.random() * elegiveis.length)];
    let ciclos = 0;
    const totalCiclos = 45;

    function proximoFrame() {
      const aleatorio = elegiveis[Math.floor(Math.random() * elegiveis.length)];
      setExibindo(aleatorio);
      ciclos++;

      let delay = 60;
      if (ciclos >= totalCiclos * 0.85) delay = 600;
      else if (ciclos >= totalCiclos * 0.7) delay = 350;
      else if (ciclos >= totalCiclos * 0.55) delay = 180;
      else if (ciclos >= totalCiclos * 0.4) delay = 100;

      if (ciclos < totalCiclos) {
        setTimeout(proximoFrame, delay);
      } else {
        setExibindo(ganhador);
        setVencedor(ganhador);
        setTimeout(() => setFase("resultado"), 700);
      }
    }

    proximoFrame();
  }

  function reiniciar() {
    setVencedor(null);
    setExibindo(null);
    setFase("pronto");
  }

  // — LOGIN —
  if (!autenticado) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center p-6 font-sans">
        <form onSubmit={fazerLogin} className="bg-white p-8 rounded-[3rem] shadow-2xl max-w-sm w-full border border-blue-100 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-black mb-1 uppercase tracking-tighter text-gray-800">Área do Sorteio</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">Chá Rifa do Benício 💙</p>
          <input
            type="password"
            value={senhaInput}
            onChange={(e) => setSenhaInput(e.target.value)}
            className="w-full p-5 mb-4 rounded-2xl bg-gray-50 border-2 border-gray-100 outline-none text-center font-bold text-gray-900 focus:border-blue-400 transition-all"
            placeholder="Senha Mestra"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            Entrar
          </button>
        </form>
      </main>
    );
  }

  // — CARREGANDO —
  if (fase === "carregando") {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center font-sans">
        <p className="text-blue-400 font-black uppercase tracking-widest animate-pulse">Carregando participantes...</p>
      </main>
    );
  }

  // — SORTEANDO —
  if (fase === "sorteando") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center gap-8 font-sans px-6">
        <p className="text-white/70 text-xs font-black uppercase tracking-[0.3em] animate-pulse">🎲 Sorteando...</p>
        <div className="bg-white/10 border border-white/20 rounded-[3rem] p-10 text-center w-full max-w-sm shadow-2xl">
          <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-3">Número</p>
          <p className="text-white font-black text-8xl tabular-nums leading-none drop-shadow-2xl">
            {exibindo ? String(exibindo.numero).padStart(3, "0") : "---"}
          </p>
          <p className="text-white/60 font-black text-lg mt-4 uppercase tracking-tight truncate">
            {exibindo?.nome ?? "..."}
          </p>
        </div>
        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">aguarde...</p>
      </main>
    );
  }

  // — RESULTADO —
  if (fase === "resultado" && vencedor) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-yellow-400 via-orange-400 to-yellow-500 flex flex-col items-center justify-center gap-6 font-sans px-6">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <PartyPopper size={48} className="text-white drop-shadow-lg" />
          <p className="text-white font-black text-xl uppercase tracking-widest drop-shadow">Temos um vencedor!</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 text-center w-full max-w-sm shadow-2xl">
          <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">🏆 Número Sorteado</p>
          <p className="text-gray-800 font-black text-8xl tabular-nums leading-none">
            {String(vencedor.numero).padStart(3, "0")}
          </p>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-800 font-black text-2xl uppercase tracking-tight">{vencedor.nome}</p>
            <p className="text-gray-400 font-bold text-sm mt-1">{vencedor.telefone}</p>
            <span className={`inline-block mt-3 text-[9px] font-black uppercase px-3 py-1 rounded-lg ${
              vencedor.status === "confirmado_pix"
                ? "bg-green-100 text-green-600"
                : "bg-blue-100 text-blue-600"
            }`}>
              {vencedor.status === "confirmado_pix" ? "PIX confirmado" : "Fralda entregue"}
            </span>
          </div>
        </div>

        <p className="text-white/80 font-black text-sm text-center drop-shadow">
          Parabéns! 🎉 Prêmio de <span className="font-black">R$ 150,00 no PIX</span>
        </p>

        <button
          onClick={reiniciar}
          className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/30 transition-all"
        >
          <RotateCcw size={14} /> Sortear novamente
        </button>
      </main>
    );
  }

  // — PRONTO PARA SORTEAR —
  return (
    <main className="min-h-screen bg-gray-50 p-6 pb-20 font-sans">
      <div className="max-w-md mx-auto">

        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <button className="bg-white p-4 rounded-2xl shadow-sm text-gray-400 hover:text-blue-600 transition-all">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-800 flex items-center gap-2">
            Sorteio <Trophy size={24} className="text-yellow-500" />
          </h1>
        </div>

        {/* Contadores */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-[2rem] p-6 text-center border border-gray-100 shadow-sm">
            <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-1">✅ Aptos ao sorteio</p>
            <p className="text-5xl font-black text-gray-800">{elegiveis.length}</p>
            <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">entregues + confirmados</p>
          </div>
          <div className="bg-white rounded-[2rem] p-6 text-center border border-gray-100 shadow-sm">
            <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest mb-1">⏳ Excluídos</p>
            <p className="text-5xl font-black text-gray-800">{pendentes.length}</p>
            <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">pendentes</p>
          </div>
        </div>

        {/* Lista dos aptos */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Users size={12} /> Participantes aptos
            </p>
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
            {elegiveis.length === 0 ? (
              <p className="text-center py-8 text-gray-300 font-bold text-sm italic">Nenhum participante confirmado ainda.</p>
            ) : (
              elegiveis.sort((a, b) => a.numero - b.numero).map((p) => (
                <div key={p.numero} className="flex items-center gap-3 px-6 py-3">
                  <span className="bg-blue-600 text-white text-xs font-black w-10 h-8 flex items-center justify-center rounded-xl shrink-0">
                    {String(p.numero).padStart(3, "0")}
                  </span>
                  <span className="font-bold text-gray-700 text-sm truncate">{p.nome}</span>
                  <span className={`ml-auto text-[8px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                    p.status === "confirmado_pix" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    {p.status === "confirmado_pix" ? "PIX" : "Fralda"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Botão sortear */}
        {elegiveis.length > 0 ? (
          <button
            onClick={realizarSorteio}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all hover:scale-105 flex items-center justify-center gap-3"
          >
            <Trophy size={24} /> Realizar Sorteio
          </button>
        ) : (
          <div className="w-full bg-gray-100 text-gray-400 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest text-center">
            Aguardando confirmações...
          </div>
        )}

        <p className="text-center text-gray-300 text-[10px] font-bold uppercase tracking-widest mt-4">
          Somente números entregues e confirmados participam
        </p>
      </div>
    </main>
  );
}
