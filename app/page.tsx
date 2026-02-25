"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Baby, Gift, Calendar, Users, Volume2, VolumeX } from "lucide-react";
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6 font-sans">
      <audio ref={audioRef} loop>
        <source src="/musica-tema.mp3" type="audio/mpeg" />
      </audio>

      <button onClick={alternarMusica} className="fixed top-5 right-5 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md text-blue-500 z-50">
        {tocando ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-blue-100 max-w-2xl w-full text-center border border-blue-100 animate-in fade-in zoom-in duration-700">
        <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-8 bg-gray-50 rounded-full border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
          <Image src="/familiaa.jpg" alt="Família" fill className="object-contain p-2" priority />
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-blue-700 mb-6 tracking-tighter uppercase">
          O Benício está chegando! 💙
        </h1>

        <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10 font-medium">
          Nossa família está crescendo e o coração transborda gratidão! O Benício já é muito amado e mal podemos esperar para ver seu rostinho. Preparamos este chá rifa para que cada um de vocês possa fazer parte da nossa história. 
          <br /><br />
          Escolha seus números, concorra a <span className="text-green-600 font-black">R$ 150,00</span> e venha celebrar essa espera com a gente!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
            <Calendar className="text-blue-500 shrink-0" size={20} />
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Entrega das Fraldas</p>
              <p className="text-sm font-bold text-blue-900">Até 06/06/2026</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-start gap-3">
            <Gift className="text-green-500 shrink-0" size={20} />
            <div>
              <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Sorteio do Prêmio</p>
              <p className="text-sm font-bold text-green-900">Dia 13/06/2026</p>
            </div>
          </div>
        </div>

        <Link href="/numeros">
          <button className="group relative w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all hover:scale-105">
            <span className="flex items-center justify-center gap-2">
              Escolher meus números <Heart size={20} className="fill-white animate-pulse" />
            </span>
          </button>
        </Link>
      </div>

      <footer className="mt-12 text-center pb-10">
        <p className="text-blue-500 font-medium italic text-sm mb-4 flex items-center justify-center gap-2">
          Organizado com carinho por Papai, Mamãe e Tata <Users size={16} />
        </p>
        <Link href="/admin">
          <button className="text-[10px] font-black text-blue-300 hover:text-blue-600 uppercase tracking-[0.3em]">
            Painel Administrativo
          </button>
        </Link>
      </footer>
    </main>
  );
}