'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { setEmpresaAtiva } from '@/lib/context';
import { Building2, Plus, ArrowRight, Loader2, ShieldCheck, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminClientesPage() {
  const [mounted, setMounted] = useState(false);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    nome_fantasia: '',
    razao_social: '',
    cnpj: '',
    setor: '',
    numero_funcionarios: '',
    sistemas_criticos: '',
    contato_seguranca: '',
    metodologia_risco: 'ISO 31000'
  });

  useEffect(() => {
    setMounted(true);
    fetchEmpresas();
  }, []);

  async function fetchEmpresas() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setEmpresas(data);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    setCadastrando(true);
    
    try {
      const { data: novaEmpresa, error: erroEmpresa } = await supabase
        .from('empresas')
        .insert([form])
        .select()
        .single();
      
      if (erroEmpresa) throw erroEmpresa;

      if (novaEmpresa) {
        await supabase.from('diagnosticos').insert([{ 
          empresa_id: novaEmpresa.id, 
          respostas: {},
          status: 'em_andamento'
        }]);
        
        setShowModal(false);
        setForm({
          nome_fantasia: '', razao_social: '', cnpj: '', setor: '',
          numero_funcionarios: '', sistemas_criticos: '', contato_seguranca: '',
          metodologia_risco: 'ISO 31000'
        });
        fetchEmpresas();
        alert("Cliente cadastrado com sucesso!");
      }
    } catch (err: any) {
      // CORREÇÃO TS: Usando err.message de forma segura
      alert("Erro ao cadastrar: " + (err?.message || "Erro desconhecido"));
    } finally {
      setCadastrando(false);
    }
  }

  const acessarConsultoria = (id: string) => {
    setEmpresaAtiva(id);
    router.push('/dashboard');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <nav className="bg-[#0f172a] text-white p-4 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[#FF8C00]" />
          <span className="font-black italic tracking-tighter text-xl text-white uppercase">
            EasyGov <span className="text-slate-500 text-xs not-italic font-medium">Admin</span>
          </span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.push('/admin/equipe')} className="text-slate-400 hover:text-white text-xs font-bold uppercase transition">
            Gestão de Equipe
          </button>
          <button onClick={() => setShowModal(true)} className="bg-[#FF8C00] hover:bg-[#e67e00] px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition shadow-md">
            <Plus size={18} /> NOVO CLIENTE
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto w-full">
        <header className="mb-10">
          <h2 className="text-2xl font-black text-slate-800 uppercase flex items-center gap-3">
            <Database className="text-[#0047AB]" /> Carteira de Clientes EASYLAN
          </h2>
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0047AB]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {empresas.map(emp => (
              <div key={emp.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-blue-50 p-4 rounded-2xl text-[#0047AB]"><Building2 size={32} /></div>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase italic tracking-widest">Ativo</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-1 truncate">{emp.nome_fantasia}</h3>
                <p className="text-slate-400 text-xs font-medium mb-6 italic">{emp.setor || 'Setor não informado'}</p>
                
                <div className="space-y-2 mb-8 border-t border-slate-50 pt-4 text-[11px] text-slate-500 font-bold uppercase">
                  <div className="flex justify-between"><span>CNPJ:</span> <span className="text-slate-800">{emp.cnpj || '---'}</span></div>
                  <div className="flex justify-between"><span>Metodologia:</span> <span className="text-[#0047AB] font-black">{emp.metodologia_risco}</span></div>
                </div>

                <button 
                  onClick={() => acessarConsultoria(emp.id)}
                  className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0047AB] transition shadow-lg"
                >
                  ACESSAR CONSULTORIA <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="bg-[#0047AB] p-8 text-white flex justify-between items-center">
              <h3 className="text-2xl font-black italic uppercase tracking-tight">Cadastro de Novo Cliente</h3>
              <button onClick={() => setShowModal(false)} className="text-blue-200 hover:text-white font-bold text-xl">✕</button>
            </div>
            
            <form onSubmit={handleCadastrar} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Nome Fantasia *</label>
                <input required className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#0047AB] outline-none text-slate-700 font-medium" value={form.nome_fantasia} onChange={e => setForm({...form, nome_fantasia: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">CNPJ</label>
                <input className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 outline-none focus:border-[#0047AB]" value={form.cnpj} onChange={e => setForm({...form, cnpj: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Setor</label>
                <input className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 outline-none focus:border-[#0047AB]" value={form.setor} onChange={e => setForm({...form, setor: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Metodologia de Risco</label>
                <select className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-[#0047AB] outline-none" value={form.metodologia_risco} onChange={e => setForm({...form, metodologia_risco: e.target.value})}>
                  <option value="ISO 31000">ISO 31000 - Gestão de Risco</option>
                  <option value="COSO">COSO - Controles Internos</option>
                </select>
              </div>
              <div className="md:col-span-2 mt-6">
                <button 
                  disabled={cadastrando}
                  className="w-full bg-[#FF8C00] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#e67e00] transition shadow-lg flex items-center justify-center gap-2"
                >
                  {cadastrando ? <Loader2 className="animate-spin" /> : "FINALIZAR E SALVAR CLIENTE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}