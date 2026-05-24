"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Gift, Calendar, Users, Volume2, VolumeX } from "lucide-react";
import { useState, useRef } from "react";

export default function Home() {
  const [tocando, setTocando] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const alternarMusica = () => {
    if (audioRef.current) {
      if (tocando) { audioRef.current.pause(); }
      else { audioRef.current.play(); }
      setTocando(!tocando);
    }
  };

  return (
    <main className="h-screen overflow-hidden flex flex-col items-center justify-between bg-blue-50 px-4 py-4 font-sans relative">
      <audio ref={audioRef} loop>
        <source src="/musica-tema.mp3" type="audio/mpeg" />
      </audio>

      <button onClick={alternarMusica} className="fixed top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md text-blue-500 z-50">
        {tocando ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* CARD PRINCIPAL */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-100 w-full max-w-lg border border-blue-100 flex flex-col items-center px-6 py-5 gap-3 flex-1 justify-between mt-2">

        {/* FOTO + TÍTULO */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-blue-100 shadow-xl overflow-hidden bg-gray-50 flex-shrink-0">
            <Image src="/familiaa.jpg" alt="Família" fill className="object-contain p-1" priority />
          </div>
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-black text-blue-700 tracking-tighter uppercase leading-tight">
              O Benício está chegando! 💙
            </h1>
          </div>
        </div>

        {/* TEXTO */}
        <p className="text-sm md:text-base text-gray-600 leading-relaxed text-center font-medium px-1">
          Nossa família está crescendo e o coração transborda gratidão! Escolha seus números, concorra a{" "}
          <span className="text-green-600 font-black">R$ 150,00</span> e venha celebrar essa espera com a gente!
        </p>

        {/* DATAS */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex items-center gap-2">
            <Calendar className="text-blue-500 shrink-0" size={18} />
            <div>
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Entrega da Fralda</p>
              <p className="text-xs font-black text-blue-900">Até 06/06/2026</p>
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-2xl border border-green-100 flex items-center gap-2">
            <Gift className="text-green-500 shrink-0" size={18} />
            <div>
              <p className="text-[9px] font-black text-green-400 uppercase tracking-widest">Sorteio do Prêmio</p>
              <p className="text-xs font-black text-green-900">Dia 13/06/2026</p>
            </div>
          </div>
        </div>

        {/* BOTÃO PRINCIPAL */}
        <div className="w-full flex flex-col items-center gap-1">
          <Link href="/numeros" className="w-full">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all hover:scale-105 flex items-center justify-center gap-2 text-base md:text-lg animate-pulse">
              Escolher meus números <Heart size={20} className="fill-white" />
            </button>
          </Link>
          <p className="text-blue-400 text-[11px] font-black uppercase tracking-widest animate-bounce">
            👆 Clique aqui para participar!
          </p>
        </div>

        {/* TROCAR NÚMERO */}
        <Link href="/trocar">
          <p className="text-blue-300 text-[10px] font-bold underline underline-offset-2 hover:text-blue-500 transition-colors text-center">
            Já escolheu um número? Clique aqui para trocar
          </p>
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="py-3 text-center">
        <p className="text-blue-500 font-medium italic text-xs flex items-center justify-center gap-1">
          Organizado com carinho por Papai, Mamãe e Tata <Users size={14} />
        </p>
        <Link href="/admin">
          <button className="text-[9px] font-black text-blue-300 hover:text-blue-600 uppercase tracking-[0.3em] mt-1">
            Painel Administrativo
          </button>
        </Link>
      </footer>
    </main>
  );
}
