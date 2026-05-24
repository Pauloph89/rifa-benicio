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

const shadow = { textShadow: "0 2px 6px rgba(0,0,0,0.85)" };
const shadowSm = { textShadow: "0 1px 4px rgba(0,0,0,0.75)" };

function Bloco({ valor, label }: { valor: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/20 backdrop-blur-sm rounded-xl w-14 h-14 flex items-center justify-center shadow-lg border border-white/30">
        <span className="text-2xl font-black text-white tabular-nums leading-none" style={shadow}>
          {String(valor).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[8px] font-black text-white uppercase tracking-widest mt-1" style={shadowSm}>
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
    <main className="h-screen overflow-hidden bg-linear-to-b from-blue-600 via-blue-500 to-blue-700 flex flex-col items-center justify-between pt-5 pb-4 px-5 font-sans relative">

      {/* Decoração de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-25 -right-15 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 -left-10 w-40 h-40 bg-white/5 rounded-full" />
      </div>

      {/* TOPO */}
      <div className="flex flex-col items-center gap-2 z-10">
        <div className="relative w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden bg-blue-100">
          <Image src="/familiaa.jpg" alt="Família" fill className="object-contain p-1" priority />
        </div>
        <div className="text-center">
          <p className="text-white/80 text-[9px] font-black uppercase tracking-[0.3em]" style={shadowSm}>
            Chá Rifa do
          </p>
          <h1 className="text-white text-3xl font-black uppercase tracking-tighter leading-none" style={shadow}>
            Benício 💙
          </h1>
          <p className="text-white/70 text-[10px] font-medium mt-0.5" style={shadowSm}>
            está chegando!
          </p>
        </div>
      </div>

      {/* MEIO — cronômetro */}
      <div className="flex flex-col items-center gap-3 z-10 w-full">
        {!prazoPassou ? (
          <>
            <div className="text-center">
              <p className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-0.5" style={shadowSm}>
                ⏳ Prazo para entrega da fralda + mimo
              </p>
              <p className="text-white font-black text-lg" style={shadow}>
                é em 06 de junho
              </p>
            </div>

            <div className="flex gap-2 justify-center items-start">
              <Bloco valor={tempo.dias} label="dias" />
              <span className="text-white/80 text-2xl font-black mt-2" style={shadowSm}>:</span>
              <Bloco valor={tempo.horas} label="horas" />
              <span className="text-white/80 text-2xl font-black mt-2" style={shadowSm}>:</span>
              <Bloco valor={tempo.minutos} label="min" />
              <span className="text-white/80 text-2xl font-black mt-2" style={shadowSm}>:</span>
              <Bloco valor={tempo.segundos} label="seg" />
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center border border-white/20 w-full">
              <p className="text-white font-bold text-xs leading-snug" style={shadowSm}>
                A data limite está chegando! 🥹 Não perca a chance de fazer parte dessa{" "}
                <span className="font-black">grande história de amor</span> e ainda{" "}
                <span className="font-black">concorrer a R$ 150,00 no PIX</span> 💙
              </p>
            </div>

            <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest" style={shadowSm}>
              contagem regressiva ao vivo
            </p>
          </>
        ) : (
          <>
            <div className="text-center">
              <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.25em] mb-0.5" style={shadowSm}>
                🎉 Faltam para o sorteio
              </p>
              <p className="text-white font-black text-lg" style={shadow}>13 de junho</p>
            </div>
            <div className="flex gap-2 justify-center items-start">
              <Bloco valor={tempo.dias} label="dias" />
              <span className="text-white/80 text-2xl font-black mt-2" style={shadowSm}>:</span>
              <Bloco valor={tempo.horas} label="horas" />
              <span className="text-white/80 text-2xl font-black mt-2" style={shadowSm}>:</span>
              <Bloco valor={tempo.minutos} label="min" />
              <span className="text-white/80 text-2xl font-black mt-2" style={shadowSm}>:</span>
              <Bloco valor={tempo.segundos} label="seg" />
            </div>
          </>
        )}
      </div>

      {/* BAIXO */}
      <div className="flex flex-col items-center gap-1.5 z-10 w-full max-w-xs">
        <div className="w-full grid grid-cols-2 gap-2">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20">
            <Baby size={14} className="text-white mx-auto mb-1" />
            <p className="text-white/70 text-[8px] font-black uppercase tracking-wider" style={shadowSm}>Prazo FINAL para entregar</p>
            <p className="text-white font-black text-sm" style={shadow}>06/06</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20">
            <Gift size={14} className="text-white mx-auto mb-1" />
            <p className="text-white/70 text-[8px] font-black uppercase tracking-wider" style={shadowSm}>Sorteio do prêmio</p>
            <p className="text-white font-black text-sm" style={shadow}>13/06</p>
          </div>
        </div>

        <a
          href="https://rifa-benicio.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-white rounded-2xl py-3 px-4 text-center shadow-2xl block"
        >
          <p className="text-blue-500 text-[9px] font-black uppercase tracking-widest mb-0.5">
            Ainda não escolheu seu número?
          </p>
          <p className="text-blue-700 font-black text-base">Clica aqui! 👆</p>
          <p className="text-blue-300 text-[8px] font-bold mt-0.5">rifa-benicio.vercel.app • com amor de Papai, Mamãe e Tata 💙</p>
        </a>
      </div>

    </main>
  );
}
