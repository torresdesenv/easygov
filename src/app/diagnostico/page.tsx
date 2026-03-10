'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DOMINIOS } from '@/data/perguntas';
import Sidebar from '@/components/Sidebar';
import { Loader2, CheckCircle, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DiagnosticoPage() {
  const router = useRouter();
  const [respostas, setRespostas] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [empresa, setEmpresa] = useState<any>(null);

  useEffect(() => {
    const id = localStorage.getItem('easygov_empresa_id');
    if (id) fetchDados(id);
    else router.push('/admin/clientes');
  }, [router]);

  async function fetchDados(empresaId: string) {
    const { data: emp } = await supabase.from('empresas').select('*').eq('id', empresaId).single();
    setEmpresa(emp);
    const { data: diag } = await supabase.from('diagnosticos').select('respostas').eq('empresa_id', empresaId).single();
    if (diag?.respostas) setRespostas(diag.respostas);
    setLoading(false);
  }

  const handleResposta = async (qId: number, valor: string) => {
    const novasRespostas = { ...respostas, [qId]: valor };
    setRespostas(novasRespostas);
    setSaving(true);

    const empresaId = localStorage.getItem('easygov_empresa_id');
    
    // Agora o UPSERT funciona pois adicionamos a CONSTRAINT no banco
    const { error } = await supabase
      .from('diagnosticos')
      .upsert(
        { empresa_id: empresaId, respostas: novasRespostas, ultima_atualizacao: new Date().toISOString() },
        { onConflict: 'empresa_id' }
      );

    if (error) {
      console.error("Erro ao salvar:", error.message);
      alert("Erro ao salvar progresso.");
    }
    setSaving(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-orange-500 italic">Carregando Questionário...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar empresaNome={empresa?.nome_fantasia} />
      <main className="flex-1 pb-20">
        <header className="sticky top-0 z-10 bg-white border-b p-6 flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Diagnóstico <span className="text-orange-500">ISO 27001</span></h1>
          <div>{saving ? <span className="text-orange-500 animate-pulse font-bold text-xs uppercase italic">Gravando...</span> : <span className="text-green-500 font-bold text-xs uppercase italic">Sincronizado</span>}</div>
        </header>

        <div className="max-w-4xl mx-auto mt-10 px-6 space-y-10">
          {DOMINIOS.map((dominio) => (
            <section key={dominio.id} className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 p-6 text-white font-bold">{dominio.titulo}</div>
              <div className="divide-y divide-slate-100">
                {dominio.questoes.map((q) => (
                  <div key={q.id} className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-700 font-bold text-sm leading-relaxed flex-1">{q.id}. {q.texto}</p>
                    <div className="flex gap-2">
                      {['sim', 'parcial', 'nao'].map((op) => (
                        <button 
                          key={op}
                          onClick={() => handleResposta(q.id, op)}
                          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 
                            ${respostas[q.id] === op ? (op === 'sim' ? 'bg-green-600 border-green-600 text-white' : op === 'parcial' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-red-600 border-red-600 text-white') : 'bg-white text-slate-300 border-slate-100 hover:border-slate-300'}`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}