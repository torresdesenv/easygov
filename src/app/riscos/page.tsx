'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import { CONTROLES_ISO_27001_2022 } from '@/data/iso27001_2022';
import { 
  ShieldAlert, Plus, Trash2, Library, Loader2, 
  Upload, Search, Edit3, X, Save, CheckCircle, Calendar, User
} from 'lucide-react';

export default function RiscosPage() {
  const [riscos, setRiscos] = useState<any[]>([]);
  const [empresa, setEmpresa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [importando, setImportando] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRisco, setEditingRisco] = useState<any>(null); // Estado para manutenção
  
  const [form, setForm] = useState({
    ativo: '', ameaca: '', vulnerabilidade: '', impacto: 3, probabilidade: 3,
    responsavel: '', status: 'aberto', prazo: '', controles_existentes: ''
  });

  useEffect(() => {
    const id = localStorage.getItem('easygov_empresa_id');
    if (id) fetchDados(id);
  }, []);

  async function fetchDados(id: string) {
    setLoading(true);
    const { data: emp } = await supabase.from('empresas').select('*').eq('id', id).single();
    if (emp) setEmpresa(emp);
    const { data } = await supabase.from('riscos').select('*').eq('empresa_id', id).order('nivel_risco', { ascending: false });
    if (data) setRiscos(data);
    setLoading(false);
  }

  async function importarISO() {
    if (!confirm("Importar os 93 controles base da ISO 27001:2022?")) return;
    setImportando(true);
    const id = localStorage.getItem('easygov_empresa_id');
    
    const novosRiscos = CONTROLES_ISO_27001_2022.map(c => ({
      empresa_id: id,
      ativo: c.ativo,
      ameaca: c.ameaca,
      vulnerabilidade: c.vulnerabilidade,
      impacto: 3,
      probabilidade: 3,
      nivel_risco: 9,
      status: 'aberto',
      responsavel: 'A definir',
      controles_existentes: 'Não implementado'
    }));

    const { error } = await supabase.from('riscos').insert(novosRiscos);
    if (error) alert("Erro ao importar: " + error.message);
    else fetchDados(id!);
    setImportando(false);
  }

  async function handleAddRisco(e: React.FormEvent) {
    e.preventDefault();
    const id = localStorage.getItem('easygov_empresa_id');
    const nivel = form.impacto * form.probabilidade;
    
    // Correção do Erro de Data: Se vazio, envia null
    const dadosParaEnviar = { 
      ...form, 
      empresa_id: id, 
      nivel_risco: nivel,
      prazo: form.prazo === '' ? null : form.prazo 
    };

    const { data, error } = await supabase.from('riscos').insert([dadosParaEnviar]).select().single();

    if (error) alert("Erro ao salvar: " + error.message);
    else {
      setRiscos([data, ...riscos]);
      setForm({ ativo: '', ameaca: '', vulnerabilidade: '', impacto: 3, probabilidade: 3, responsavel: '', status: 'aberto', prazo: '', controles_existentes: '' });
    }
  }

  async function handleUpdateRisco(e: React.FormEvent) {
    e.preventDefault();
    const nivel = editingRisco.impacto * editingRisco.probabilidade;
    
    const { error } = await supabase
      .from('riscos')
      .update({ 
        ...editingRisco, 
        nivel_risco: nivel,
        prazo: editingRisco.prazo === '' ? null : editingRisco.prazo
      })
      .eq('id', editingRisco.id);

    if (error) alert("Erro na manutenção: " + error.message);
    else {
      setEditingRisco(null);
      fetchDados(localStorage.getItem('easygov_empresa_id')!);
    }
  }

  async function deleteRisco(id: string) {
    if (!confirm("Excluir este risco?")) return;
    const { error } = await supabase.from('riscos').delete().eq('id', id);
    if (error) alert(error.message);
    else setRiscos(riscos.filter(r => r.id !== id));
  }

  const riscosFiltrados = riscos.filter(r => 
    r.ativo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ameaca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.responsavel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white italic tracking-widest">Processando Mapa de Riscos...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar empresaNome={empresa?.nome_fantasia} />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">
              Mapa de <span className="text-orange-500">Riscos</span>
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manutenção de Vulnerabilidades</p>
          </div>
          <button 
            onClick={importarISO}
            disabled={importando}
            className="bg-slate-900 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-[10px] font-black flex items-center gap-2 transition disabled:opacity-50 shadow-xl"
          >
            {importando ? <Loader2 className="animate-spin" /> : <Library size={16} className="text-orange-500" />} 
            IMPORTAR RISCOS ISO 27001
          </button>
        </header>

        {/* Cadastro Rápido */}
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 mb-6">
          <form onSubmit={handleAddRisco} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="text-[9px] font-black uppercase text-slate-400">Ativo</label>
              <input required className="w-full p-2 bg-slate-50 border rounded-lg text-xs" value={form.ativo} onChange={e => setForm({...form, ativo: e.target.value})} />
            </div>
            <div className="md:col-span-1">
              <label className="text-[9px] font-black uppercase text-slate-400">Ameaça</label>
              <input required className="w-full p-2 bg-slate-50 border rounded-lg text-xs" value={form.ameaca} onChange={e => setForm({...form, ameaca: e.target.value})} />
            </div>
            <div className="md:col-span-1">
              <label className="text-[9px] font-black uppercase text-slate-400">Vulnerabilidade</label>
              <input className="w-full p-2 bg-slate-50 border rounded-lg text-xs" value={form.vulnerabilidade} onChange={e => setForm({...form, vulnerabilidade: e.target.value})} />
            </div>
            <div className="md:col-span-1">
              <label className="text-[9px] font-black uppercase text-slate-400">Prazo (Opcional)</label>
              <input type="date" className="w-full p-2 bg-slate-50 border rounded-lg text-xs" value={form.prazo} onChange={e => setForm({...form, prazo: e.target.value})} />
            </div>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg font-black text-[10px] uppercase transition shadow-md">
              <Plus size={16} className="inline mr-1" /> Novo Risco
            </button>
          </form>
        </section>

        {/* Busca */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            placeholder="Filtrar por Ativo, Ameaça ou Responsável..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-700 outline-none shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Listagem */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
              <tr>
                <th className="p-4">Ativo / Ameaça</th>
                <th className="p-4 text-center italic">Score (I x P)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Responsável</th>
                <th className="p-4 text-right">Manutenção</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {riscosFiltrados.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition group">
                  <td className="p-4">
                    <p className="font-black text-slate-800 uppercase">{r.ativo}</p>
                    <p className="text-slate-400 italic text-[10px]">{r.ameaca}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black ${r.nivel_risco >= 15 ? 'bg-red-500 text-white' : 'bg-orange-400 text-white'}`}>
                      {r.nivel_risco}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-blue-700 uppercase text-[9px]">{r.status}</span>
                  </td>
                  <td className="p-4 text-slate-500 font-medium uppercase">{r.responsavel || '---'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => setEditingRisco(r)} className="text-blue-400 hover:text-blue-700 p-1"><Edit3 size={16}/></button>
                    <button onClick={() => deleteRisco(r.id)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL DE MANUTENÇÃO (Edição) */}
      {editingRisco && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <h3 className="font-black italic flex items-center gap-2">
                <Edit3 className="text-orange-500" size={20} /> MANUTENÇÃO DO RISCO
              </h3>
              <button onClick={() => setEditingRisco(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleUpdateRisco} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Ativo em Risco</label>
                <input required className="w-full p-3 bg-slate-50 border rounded-xl" value={editingRisco.ativo} onChange={e => setEditingRisco({...editingRisco, ativo: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Impacto (1-5)</label>
                <input type="number" min="1" max="5" className="w-full p-3 bg-slate-50 border rounded-xl" value={editingRisco.impacto} onChange={e => setEditingRisco({...editingRisco, impacto: Number(e.target.value)})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Probabilidade (1-5)</label>
                <input type="number" min="1" max="5" className="w-full p-3 bg-slate-50 border rounded-xl" value={editingRisco.probabilidade} onChange={e => setEditingRisco({...editingRisco, probabilidade: Number(e.target.value)})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Status</label>
                <select className="w-full p-3 bg-slate-50 border rounded-xl font-bold text-blue-700" value={editingRisco.status} onChange={e => setEditingRisco({...editingRisco, status: e.target.value})}>
                  <option value="aberto">Aberto</option>
                  <option value="mitigando">Mitigando</option>
                  <option value="resolvido">Resolvido</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Dono (Responsável)</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl" value={editingRisco.responsavel} onChange={e => setEditingRisco({...editingRisco, responsavel: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Controles Atuais / Mitigação</label>
                <textarea className="w-full p-3 bg-slate-50 border rounded-xl h-24 text-sm" value={editingRisco.controles_existentes} onChange={e => setEditingRisco({...editingRisco, controles_existentes: e.target.value})} />
              </div>
              
              <button type="submit" className="md:col-span-2 bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg transition">
                <Save size={20} /> SALVAR ALTERAÇÕES
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}