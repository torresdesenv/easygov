'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { ShieldCheck, FileText, Download, Loader2, Wand2 } from 'lucide-react';

export default function PoliticasPage() {
  const [empresaNome, setEmpresaNome] = useState('');
  const [politica, setPolitica] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carregar nome da empresa do localStorage ou banco
    setEmpresaNome("Empresa Selecionada");
  }, []);

  async function gerarPolitica(tipo: string) {
    setLoading(true);
    setPolitica('');
    
    const prompt = `Gere uma ${tipo} profissional para a empresa ${empresaNome}, baseada na ISO 27001. Use uma linguagem formal e técnica em Português do Brasil.`;
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setPolitica(data.text);
    } catch (e) {
      alert("Erro ao gerar política com IA.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar empresaNome={empresaNome} />
      <main className="flex-1 p-10">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <ShieldCheck className="text-blue-700" /> Gerador de Políticas IA
          </h2>
          <p className="text-slate-500">Gere documentos de governança personalizados para o seu cliente.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => gerarPolitica('Política de Segurança da Informação (PSI)')} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-700 transition font-bold text-xs flex flex-col items-center gap-2">
            <FileText className="text-blue-700" /> PSI COMPLETA
          </button>
          <button onClick={() => gerarPolitica('Política de Backup e Recuperação')} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-700 transition font-bold text-xs flex flex-col items-center gap-2">
            <FileText className="text-blue-700" /> BACKUP
          </button>
          <button onClick={() => gerarPolitica('Política de Controle de Acesso')} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-700 transition font-bold text-xs flex flex-col items-center gap-2">
            <FileText className="text-blue-700" /> ACESSOS
          </button>
          <button onClick={() => gerarPolitica('Plano de Resposta a Incidentes')} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-700 transition font-bold text-xs flex flex-col items-center gap-2">
            <FileText className="text-blue-700" /> INCIDENTES
          </button>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200 min-h-[500px] relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-[40px] z-10">
              <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
              <p className="font-bold italic text-slate-500 text-sm">IA da EASYLAN está redigindo o documento...</p>
            </div>
          ) : politica ? (
            <div className="prose max-w-none">
              <div className="flex justify-end mb-6">
                 <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Download size={16}/> BAIXAR PDF
                 </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-slate-700 text-sm leading-relaxed">
                {politica}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 opacity-30">
              <Wand2 size={60} className="mb-4 text-slate-300" />
              <p className="font-bold">Selecione um tipo de política para gerar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}