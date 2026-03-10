'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { setEmpresaAtiva } from '@/lib/context';
import { Building2, Plus, ArrowRight, Loader2, ShieldCheck, Database, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminClientesPage() {
  const [mounted, setMounted] = useState(false);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    nome_fantasia: '', razao_social: '', cnpj: '', setor: '',
    numero_funcionarios: '', sistemas_criticos: '', contato_seguranca: '',
    metodologia_risco: 'ISO 31000'
  });

  // Garante que o componente só renderize interações após montar no cliente
  useEffect(() => {
    setMounted(true);
    fetchEmpresas();
  }, []);

  async function fetchEmpresas() {
    setLoading(true);
    const { data } = await supabase.from('empresas').select('*').order('created_at', { ascending: false });
    if (data) setEmpresas(data);
    setLoading(false);
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    const { data: novaEmpresa, error } = await supabase.from('empresas').insert([form]).select().single();
    
    if (novaEmpresa) {
      await supabase.from('diagnosticos').insert([{ empresa_id: novaEmpresa.id, respostas: {} }]);
      setShowModal(false);
      setForm({ nome_fantasia: '', razao_social: '', cnpj: '', setor: '', numero_funcionarios: '', sistemas_criticos: '', contato_seguranca: '', metodologia_risco: 'ISO 31000' });
      fetchEmpresas();
    } else {
      alert("Erro ao cadastrar: " + error.message);
    }
  }

  const acessarConsultoria = (id: string) => {
    setEmpresaAtiva(id);
    router.push('/dashboard');
  };

  // Evita erros de prefetch/SSR do Next.js
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <nav className="bg-slate-900 text-white p-4 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-orange-500" />
          <span className="font-black italic tracking-tighter text-xl text-white uppercase">
            EasyGov <span className="text-slate-500 text-xs not-italic font-medium">Admin</span>
          </span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.push('/admin/equipe')} className="text-slate-400 hover:text-white text-xs font-bold uppercase transition">
            Gestão de Equipe
          </button>
          <button onClick={() => setShowModal(true)} className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition">
            <Plus size={18} /> NOVO CLIENTE
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto w-full">
        <header className="mb-10">
          <h2 className="text-2xl font-black text-slate-800 uppercase flex items-center gap-3">
            <Database className="text-blue-700" /> Carteira de Clientes EASYLAN
          </h2>
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-700" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {empresas.map(emp => (
              <div key={emp.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-blue-50 p-4 rounded-2xl text-blue-700"><Building2 size={32} /></div>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase italic">Ativo</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-1 truncate">{emp.nome_fantasia}</h3>
                <p className="text-slate-400 text-xs font-medium mb-6 italic">{emp.setor || 'Setor não informado'}</p>
                
                <div className="space-y-2 mb-8 border-t border-slate-50 pt-4 text-[11px] text-slate-500 font-bold uppercase">
                  <div className="flex justify-between"><span>CNPJ:</span> <span className="text-slate-800">{emp.cnpj || '---'}</span></div>
                  <div className="flex justify-between"><span>Metodologia:</span> <span className="text-blue-600 font-black">{emp.metodologia_risco}</span></div>
                </div>

                <button 
                  onClick={() => acessarConsultoria(emp.id)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg"
                >
                  ACESSAR CONSULTORIA <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Cadastro Completo */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-700 p-8 text-white flex justify-between items-center">
              <h3 className="text-2xl font-black italic">CADASTRO DE NOVO CLIENTE</h3>
              <button onClick={() => setShowModal(false)} className="text-blue-200 hover:text-white font-bold">X</button>
            </div>
            
            <form onSubmit={handleCadastrar} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Nome Fantasia *</label>
                <input required className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-700 outline-none text-slate-700" value={form.nome_fantasia} onChange={e => setForm({...form, nome_fantasia: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">CNPJ</label>
                <input className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700" value={form.cnpj} onChange={e => setForm({...form, cnpj: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Setor</label>
                <input className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700" value={form.setor} onChange={e => setForm({...form, setor: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Metodologia de Risco</label>
                <select className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-blue-700" value={form.metodologia_risco} onChange={e => setForm({...form, metodologia_risco: e.target.value})}>
                  <option value="ISO 31000">ISO 31000</option>
                  <option value="COSO">COSO</option>
                </select>
              </div>
              <div className="md:col-span-2 mt-4">
                <button className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition shadow-lg">
                  SALVAR E FINALIZAR CADASTRO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}