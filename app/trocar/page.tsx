"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, CheckCircle, RefreshCw } from "lucide-react";
import { carregarParticipantes, salvarParticipantes, supabase, Participante } from "@/services/storage";

type Etapa = "buscar" | "confirmar" | "escolher" | "sucesso";

export default function TrocarNumero() {
  const [etapa, setEtapa] = useState<Etapa>("buscar");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservaAtual, setReservaAtual] = useState<Participante | null>(null);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [novoNumero, setNovoNumero] = useState<number | null>(null);

  function gerarTamanho(numero: number) {
    if (numero <= 30) return "P";
    if (numero <= 85) return "M";
    if (numero <= 135) return "G";
    return "GG";
  }

  async function buscarReserva() {
    if (!telefone.trim()) return;
    setLoading(true);
    const todos = await carregarParticipantes();
    const fone = telefone.replace(/\D/g, "");
    const encontrado = todos.find(p => p.telefone.replace(/\D/g, "") === fone);
    setParticipantes(todos);
    setLoading(false);

    if (!encontrado) {
      alert("Nenhuma reserva encontrada com esse telefone. Verifique o número digitado.");
      return;
    }

    if (encontrado.status === "entregue" || encontrado.status === "confirmado_pix") {
      alert("Sua reserva já foi confirmada e não pode ser alterada. Em caso de dúvida, fale com o organizador.");
      return;
    }

    setReservaAtual(encontrado);
    setEtapa("confirmar");
  }

  async function confirmarTroca() {
    if (!novoNumero || !reservaAtual) return;
    setLoading(true);

    // Verifica se o novo número ainda está livre
    const todosAtuais = await carregarParticipantes();
    const jaTomado = todosAtuais.find(p => p.numero === novoNumero);
    if (jaTomado) {
      alert("Esse número acabou de ser reservado por outra pessoa. Escolha outro!");
      setParticipantes(todosAtuais);
      setNovoNumero(null);
      setLoading(false);
      return;
    }

    // Exclui a reserva antiga
    await supabase.from("participantes").delete().eq("numero", reservaAtual.numero);

    // Cria a nova reserva com os mesmos dados
    await salvarParticipantes([{ ...reservaAtual, numero: novoNumero }]);

    setLoading(false);
    setEtapa("sucesso");
  }

  // — BUSCAR —
  if (etapa === "buscar") {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100 max-w-sm w-full p-8 border border-blue-100 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="text-blue-600" size={28} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-800 mb-1">Trocar Número</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Chá Rifa do Benício 💙</p>
          <p className="text-gray-500 text-sm mb-6">Digite o telefone que você usou na reserva para encontrarmos seu número.</p>

          <input
            type="tel"
            value={telefone}
            onChange={e => setTelefone(e.target.value)}
            onKeyDown={e => e.key === "Enter" && buscarReserva()}
            placeholder="(81) 99999-9999"
            className="w-full p-4 mb-4 rounded-2xl bg-gray-50 border-2 border-gray-100 outline-none text-center font-bold text-gray-900 focus:border-blue-400 transition-all"
          />
          <button
            onClick={buscarReserva}
            disabled={loading || !telefone.trim()}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Search size={16} /> {loading ? "Buscando..." : "Buscar minha reserva"}
          </button>

          <Link href="/">
            <button className="mt-4 flex items-center justify-center gap-2 text-blue-300 hover:text-blue-600 text-xs font-bold uppercase tracking-widest w-full transition-colors">
              <ArrowLeft size={14} /> Voltar
            </button>
          </Link>
        </div>
      </main>
    );
  }

  // — CONFIRMAR RESERVA ENCONTRADA —
  if (etapa === "confirmar" && reservaAtual) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100 max-w-sm w-full p-8 border border-blue-100 text-center">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Reserva encontrada ✅</p>

          <div className="bg-blue-50 rounded-[2rem] p-6 mb-6 border border-blue-100">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Seu número atual</p>
            <p className="text-6xl font-black text-blue-700">{String(reservaAtual.numero).padStart(3, "0")}</p>
            <p className="text-sm font-black text-gray-700 mt-2 uppercase">{reservaAtual.nome}</p>
            <p className="text-xs text-gray-400 font-bold">Fralda tamanho {gerarTamanho(reservaAtual.numero)}</p>
          </div>

          <p className="text-gray-500 text-sm mb-6">Quer trocar esse número? Escolha um novo na próxima tela.</p>

          <button
            onClick={() => setEtapa("escolher")}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            Sim, quero trocar meu número
          </button>
          <button
            onClick={() => { setEtapa("buscar"); setReservaAtual(null); }}
            className="mt-3 w-full text-gray-400 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:text-gray-600 transition-all"
          >
            Não, cancelar
          </button>
        </div>
      </main>
    );
  }

  // — ESCOLHER NOVO NÚMERO —
  if (etapa === "escolher") {
    const livres = participantes.filter(
      p => p.status !== "entregue" && p.status !== "confirmado_pix" && p.numero !== reservaAtual?.numero
    );
    const numerosOcupados = new Set(livres.map(p => p.numero));

    return (
      <main className="min-h-screen bg-blue-50 p-4 pb-20 font-sans">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setEtapa("confirmar")} className="bg-white p-3 rounded-full shadow-sm text-gray-400 hover:text-blue-600 transition-all">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Escolha seu novo número</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Número atual: {String(reservaAtual?.numero).padStart(3, "0")}</p>
            </div>
          </div>

          {/* Legenda */}
          <div className="flex gap-4 mb-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm justify-center">
            <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-500 uppercase"><div className="w-4 h-4 rounded-md bg-white border-2 border-gray-200"></div>Livre</div>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-yellow-600 uppercase"><div className="w-4 h-4 rounded-md bg-yellow-400"></div>Ocupado</div>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase"><div className="w-4 h-4 rounded-md bg-blue-500 ring-2 ring-blue-300"></div>Selecionado</div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 mb-6">
            {Array.from({ length: 150 }, (_, i) => i + 1).map(num => {
              const ocupado = numerosOcupados.has(num) && num !== reservaAtual?.numero;
              const atual = num === reservaAtual?.numero;
              const selecionado = num === novoNumero;

              let cor = "bg-white border-gray-100 text-gray-900";
              if (atual) cor = "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed";
              else if (ocupado) cor = "bg-yellow-400 border-yellow-400 text-white cursor-not-allowed";
              else if (selecionado) cor = "bg-blue-600 border-blue-600 text-white ring-2 ring-blue-300 scale-110";

              return (
                <button
                  key={num}
                  onClick={() => !ocupado && !atual && setNovoNumero(num)}
                  disabled={ocupado || atual}
                  className={`rounded-xl border-2 p-1.5 text-center transition-all shadow-sm ${cor} ${!ocupado && !atual ? "hover:scale-105 hover:border-blue-400" : ""}`}
                >
                  <p className="text-sm font-black">{String(num).padStart(3, "0")}</p>
                  <p className="text-[6px] uppercase font-black">{gerarTamanho(num)}</p>
                </button>
              );
            })}
          </div>

          {novoNumero && (
            <div className="fixed bottom-6 left-4 right-4 max-w-lg mx-auto">
              <button
                onClick={confirmarTroca}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-300 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
              >
                <CheckCircle size={20} />
                {loading ? "Trocando..." : `Confirmar troca para o número ${String(novoNumero).padStart(3, "0")}`}
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  // — SUCESSO —
  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100 max-w-sm w-full p-8 border border-blue-100 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-500" size={36} />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-800 mb-2">Troca realizada! 🎉</h1>
        <p className="text-gray-500 text-sm mb-6">
          Seu novo número é o{" "}
          <span className="text-blue-700 font-black text-2xl">{String(novoNumero).padStart(3, "0")}</span>
          {" "}— fralda tamanho <span className="font-black">{novoNumero ? gerarTamanho(novoNumero) : ""}</span>. Obrigado pela participação! 💙
        </p>
        <Link href="/">
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            Voltar para o início
          </button>
        </Link>
      </div>
    </main>
  );
}
