"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Heart, Gift, Send, DollarSign } from "lucide-react";
import { 
  carregarParticipantes, 
  salvarParticipantes, 
  Participante 
} from "@/services/storage";

export default function Numeros() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [numeroSelecionado, setNumeroSelecionado] = useState<number | null>(null);
  const [etapa, setEtapa] = useState<'escolha' | 'pix'>('escolha');
  const [agora, setAgora] = useState(Date.now());
  
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [valorPix, setValorPix] = useState("0,00"); // Alterado de 150,00 para 0,00

  useEffect(() => {
    async function init() {
      const dados = await carregarParticipantes();
      setParticipantes(dados);
    }
    init();
    const timer = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  function gerarTamanho(numero: number) {
    if (numero <= 30) return "P";
    if (numero <= 85) return "M";
    if (numero <= 135) return "G";
    return "GG";
  }

  // Lógica do cronômetro ajustada para 5 minutos (300.000ms)
  function tempoRestante(expiraEm?: number | null) {
    if (!expiraEm) return "05:00";
    const diff = expiraEm - agora;
    if (diff <= 0) return "Expirado";
    const min = Math.floor(diff / 60000);
    const seg = Math.floor((diff % 60000) / 1000);
    return `${min.toString().padStart(2, "0")}:${seg.toString().padStart(2, "0")}`;
  }

  const handleSelecionarNumero = (num: number) => {
    if (!participantes.find(p => p.numero === num)) {
      setNumeroSelecionado(num);
      setModalAberto(true);
      setEtapa('escolha');
    }
  };

  const finalizarReserva = async (tipo: 'presencial' | 'pix', valorFinal: number) => {
    const novo: Participante = {
      numero: numeroSelecionado!,
      nome: nome.toUpperCase(),
      telefone,
      tipoEntrega: tipo,
      status: tipo === 'pix' ? 'pendente_pix' : 'presencial_pendente',
      data: new Date().toISOString(),
      expiraEm: tipo === 'pix' ? Date.now() + 5 * 60 * 1000 : null, // Ajustado para 5 minutos
      valor: valorFinal
    };

    await salvarParticipantes([novo]);
    const atualizados = await carregarParticipantes();
    setParticipantes(atualizados);
    
    // Fechar modal e resetar estados para permitir novas escolhas
    fecharModal();
    
    if (tipo === 'presencial') {
        alert("Reserva confirmada! Prepare a fraldinha e o mimo 🎁💙");
    } else {
        alert("Reserva enviada! Não esqueça de enviar o comprovante. 👶💙");
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEtapa('escolha');
    setNome("");
    setTelefone("");
    setValorPix("0,00");
  };

  return (
    <main className="min-h-screen bg-blue-50 p-4 md:p-8 font-sans pb-20">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <Link href="/"><button className="bg-white p-3 rounded-full shadow-sm text-gray-400 hover:scale-110 transition hover:text-blue-600"><ArrowLeft size={20} /></button></Link>
          <h1 className="text-2xl md:text-4xl font-black text-blue-700 uppercase tracking-tighter">Chá Rifa do Benício 💙</h1>
          <div className="w-10"></div>
        </div>

        {/* Banner do Mimo */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-8 border border-blue-100 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg shadow-blue-100 animate-pulse">
            <Gift size={32} />
          </div>
          <div>
            <h3 className="text-blue-700 font-black uppercase text-sm md:text-base leading-tight">Cada número reservado representa:</h3>
            <p className="text-gray-900 font-bold text-xs md:text-sm uppercase tracking-tight">1 Pacote de Fralda (tamanho indicado) + 1 Mimo para o Benício 🎁</p>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <div className="w-5 h-5 rounded-lg bg-white border-2 border-gray-100"></div> Livre
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-yellow-600 uppercase tracking-widest">
            <div className="w-5 h-5 rounded-lg bg-yellow-400"></div> Pendente
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
            <div className="w-5 h-5 rounded-lg bg-blue-500"></div> Confirmado
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest">
            <div className="w-5 h-5 rounded-lg bg-green-500"></div> Entregue
          </div>
        </div>

        {/* Grid de Números */}
        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-10 gap-3 mb-16">
          {Array.from({ length: 150 }, (_, i) => i + 1).map((num) => {
            const p = participantes.find(part => part.numero === num);
            let cor = "bg-white text-gray-900 border-gray-100";
            if (p?.status === 'pendente_pix' || p?.status === 'presencial_pendente') cor = "bg-yellow-400 text-white border-yellow-400";
            if (p?.status === 'confirmado_pix') cor = "bg-blue-500 text-white border-blue-500";
            if (p?.status === 'entregue') cor = "bg-green-500 text-white border-green-500";

            return (
              <button key={num} onClick={() => handleSelecionarNumero(num)} className={`rounded-2xl border-2 p-3 text-center transition-all shadow-sm ${cor} ${!p && 'hover:scale-110 hover:border-blue-300 hover:shadow-xl'}`}>
                <p className="text-lg md:text-xl font-black mb-1">{num.toString().padStart(3, '0')}</p>
                <p className="text-[7px] md:text-[8px] uppercase font-black leading-tight">Fralda {gerarTamanho(num)}<br/>+ Mimo</p>
              </button>
            );
          })}
        </div>

        {/* Mural */}
        <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-blue-100 max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-black text-blue-700 mb-10 flex items-center justify-center gap-4 uppercase text-center tracking-tighter">
            <Heart size={32} className="text-blue-500 fill-blue-500" /> Mural de Abençoados
          </h2>
          <div className="flex flex-col gap-4">
            {participantes.sort((a,b) => a.numero - b.numero).map((p) => (
              <div key={p.numero} className="flex items-center gap-5 bg-blue-50/50 p-5 rounded-[2rem] border border-blue-100 transition-all">
                <span className="bg-blue-600 text-white w-14 h-12 flex items-center justify-center rounded-2xl font-black text-lg shrink-0 shadow-lg">{p.numero.toString().padStart(3, '0')}</span>
                <p className="font-black text-gray-900 text-xs md:text-base uppercase tracking-tight">
                  <span className="text-blue-600">{p.nome}</span> abençoou o Benício com o número {p.numero.toString().padStart(3, '0')}! 💙
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl">
            {etapa === 'escolha' ? (
              <div className="space-y-6">
                <div className="text-center">
                    <div className="inline-block bg-blue-600 text-white px-8 py-2 rounded-full font-black text-sm uppercase mb-4">Número {numeroSelecionado?.toString().padStart(3, '0')}</div>
                    <h2 className="text-3xl font-black uppercase text-gray-900">Sua Reserva</h2>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-900 ml-4 mb-2 block tracking-widest">Nome Completo</label>
                        <input className="w-full bg-gray-50 border-2 border-gray-200 p-5 rounded-[1.5rem] font-black uppercase text-gray-900 focus:border-blue-400 outline-none transition-all" placeholder="SEU NOME AQUI" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-900 ml-4 mb-2 block tracking-widest">WhatsApp</label>
                        <input className="w-full bg-gray-50 border-2 border-gray-200 p-5 rounded-[1.5rem] font-black text-gray-900 focus:border-blue-400 outline-none transition-all" placeholder="(81) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4">
                    <button onClick={() => { if(nome && telefone) setEtapa('pix'); else alert("Preencha os campos! 💙")}} className="w-full bg-green-500 text-white p-6 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2">Participar via PIX <DollarSign size={18}/></button>
                    <button onClick={() => { if(nome && telefone) finalizarReserva('presencial', 0); else alert("Preencha os campos! 💙")}} className="w-full bg-blue-600 text-white p-6 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">Entregar Fralda + Mimo <Gift size={18}/></button>
                    <button onClick={fecharModal} className="w-full text-gray-400 font-black text-[10px] uppercase pt-2">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-8">
                <h2 className="text-3xl font-black uppercase text-gray-900">Pagamento PIX</h2>
                
                <div className="bg-green-50 p-6 rounded-[2.5rem] border-2 border-green-100 text-gray-900">
                  <label className="text-[10px] font-black uppercase text-green-700 block mb-3 tracking-widest">Valor do PIX:</label>
                  <div className="relative">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-green-700 text-xl">R$</span>
                    <input type="text" value={valorPix} onChange={(e) => setValorPix(e.target.value)} className="w-full bg-white border-2 border-green-200 p-5 pl-16 rounded-3xl font-black text-green-700 text-3xl text-center outline-none" />
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Copiar Chave pix:</p>
                  <p className="font-black text-gray-900 text-xl mb-4 uppercase">072.671.944-78</p>
                  
                  <div className="bg-white py-2 px-6 rounded-full inline-block border border-red-200 mb-6">
                    <p className="text-[10px] font-black text-red-600 uppercase">⏱️ EXPIRA EM: {tempoRestante(Date.now() + 5 * 60 * 1000)}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 text-gray-900">
                    <button onClick={() => {navigator.clipboard.writeText("07267194478"); alert("PIX Copiado!");}} className="w-full bg-white border-2 border-gray-200 p-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-3 shadow-sm hover:bg-gray-100 transition-all"><Copy size={16}/> Copiar Chave</button>
                    <button onClick={() => window.open(`https://wa.me/5581981120162?text=Oi! Reservei o número ${numeroSelecionado} e fiz o PIX de R$ ${valorPix} 💙`)} className="w-full bg-blue-600 text-white p-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-3 shadow-lg hover:bg-blue-700 transition-all"><Send size={16}/> Enviar Comprovante</button>
                  </div>
                </div>
                
                <button onClick={() => finalizarReserva('pix', parseFloat(valorPix.replace(',','.')) || 0)} className="w-full bg-green-500 text-white p-7 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-green-600 transition-all"><Check size={24}/> Já fiz o pagamento!</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}