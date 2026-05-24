"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Gift, Baby } from "lucide-react";

const PRAZO_FRALDA = new Date("2026-06-06T23:59:59");
const DATA_SORTEIO = new Date("2026-06-13T00:00:00");

function calcularTempo(alvo: Date) {
  const agora = new Date();
  const diff = alvo.getTime() - agora.getTime();
  if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0, encerrado: true };

  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
    encerrado: false,
  };
}

function Bloco({ valor, label }: { valor: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg border border-white/30">
        <span
          className="text-3xl font-black text-white tabular-nums leading-none"
          style={{ textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}
        >
          {String(valor).padStart(2, "0")}
        </span>
      </div>
      <span
        className="text-[9px] font-black text-white uppercase tracking-widest mt-1"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.85)" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Banner() {
  const prazoPassou = calcularTempo(PRAZO_FRALDA).encerrado;
  const [tempo, setTempo] = useState(calcularTempo(prazoPassou ? DATA_SORTEIO : PRAZO_FRALDA));

  useEffect(() => {
    const alvo = prazoPassou ? DATA_SORTEIO : PRAZO_FRALDA;
    const interval = setInterval(() => setTempo(calcularTempo(alvo)), 1000);
    return () => clearInterval(interval);
  }, [prazoPassou]);

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-600 via-blue-500 to-blue-700 flex flex-col items-center justify-between py-12 px-6 font-sans overflow-hidden relative">

      {/* Decoração de fundo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-25 -right-15 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 -left-10 w-40 h-40 bg-white/5 rounded-full" />
      </div>

      {/* TOPO */}
      <div className="flex flex-col items-center gap-4 z-10">
        <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-blue-100">
          <Image src="/familiaa.jpg" alt="Família" fill className="object-contain p-1" priority />
        </div>
        <div className="text-center">
          <p
            className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
          >
            Chá Rifa do
          </p>
          <h1
            className="text-white text-4xl font-black uppercase tracking-tighter leading-none"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)" }}
          >
            Benício 💙
          </h1>
          <p
            className="text-white/70 text-xs font-medium mt-1"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
          >
            está chegando!
          </p>
        </div>
      </div>

      {/* MEIO — cronômetro */}
      <div className="flex flex-col items-center gap-5 z-10 w-full">

        {!prazoPassou ? (
          <>
            <div className="text-center">
              <p
                className="text-white font-black text-[11px] uppercase tracking-[0.2em] mb-1"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
              >
                ⏳ Prazo para entrega da fralda + mimo
              </p>
              <p
                className="text-white font-black text-xl"
                style={{ textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}
              >
                é em 06 de junho
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Bloco valor={tempo.dias} label="dias" />
              <span className="text-white/80 text-3xl font-black self-start mt-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>:</span>
              <Bloco valor={tempo.horas} label="horas" />
              <span className="text-white/80 text-3xl font-black self-start mt-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>:</span>
              <Bloco valor={tempo.minutos} label="min" />
              <span className="text-white/80 text-3xl font-black self-start mt-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>:</span>
              <Bloco valor={tempo.segundos} label="seg" />
            </div>

            {/* Frase motivacional */}
            <div className="bg-white/15 backdrop-blur-sm rounded-3xl px-5 py-4 text-center border border-white/20 mx-2">
              <p
                className="text-white font-bold text-sm leading-relaxed"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
              >
                A data limite está chegando! 🥹{"\n"}
                Não perca a chance de fazer parte dessa{" "}
                <span className="font-black">grande história de amor</span> e ainda{" "}
                <span className="font-black">concorrer a R$ 150,00 no PIX</span> 💙
              </p>
            </div>

            <p
              className="text-white/60 text-[10px] font-bold uppercase tracking-widest text-center"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
            >
              contagem regressiva ao vivo
            </p>
          </>
        ) : (
          <>
            <div className="text-center">
              <p
                className="text-white/80 text-xs font-black uppercase tracking-[0.25em] mb-1"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
              >
                🎉 Faltam para o sorteio
              </p>
              <p
                className="text-white font-black text-xl"
                style={{ textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}
              >
                13 de junho
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Bloco valor={tempo.dias} label="dias" />
              <span className="text-white/80 text-3xl font-black self-start mt-3">:</span>
              <Bloco valor={tempo.horas} label="horas" />
              <span className="text-white/80 text-3xl font-black self-start mt-3">:</span>
              <Bloco valor={tempo.minutos} label="min" />
              <span className="text-white/80 text-3xl font-black self-start mt-3">:</span>
              <Bloco valor={tempo.segundos} label="seg" />
            </div>
          </>
        )}
      </div>

      {/* BAIXO */}
      <div className="flex flex-col items-center gap-4 z-10 w-full max-w-xs">

        <div className="w-full grid grid-cols-2 gap-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <Baby size={18} className="text-white mx-auto mb-1" />
            <p className="text-white/70 text-[9px] font-black uppercase tracking-wider" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.85)" }}>Prazo FINAL para entregar</p>
            <p className="text-white font-black text-base" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>06/06</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <Gift size={18} className="text-white mx-auto mb-1" />
            <p className="text-white/70 text-[9px] font-black uppercase tracking-wider" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>Sorteio do prêmio</p>
            <p className="text-white font-black text-base" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>13/06</p>
          </div>
        </div>

        <a
          href="https://rifa-benicio.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-white rounded-2xl p-4 text-center shadow-2xl block hover:scale-105 transition-transform"
        >
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1">
            Ainda não escolheu seu número?
          </p>
          <p className="text-blue-700 font-black text-base">Clica aqui! 👆</p>
          <p className="text-blue-400 text-[10px] font-bold mt-1">rifa-benicio.vercel.app</p>
        </a>

        <p
          className="text-white/50 text-[9px] font-bold uppercase tracking-widest text-center"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
        >
          organizado com amor por Papai, Mamãe e Tata 💙
        </p>
      </div>

    </main>
  );
}
