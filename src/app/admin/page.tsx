// src/app/admin/page.tsx
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Building2, Mail, ShieldCheck } from 'lucide-react';

export default function AdminClientes() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '', cnpj: '', setor: '', emailAdmin: ''
  });

  const criarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Criar a Empresa
    const { data: empresa, error: empError } = await supabase
      .from('empresas')
      .insert([{ 
        nome_fantasia: formData.nome, 
        cnpj: formData.cnpj, 
        setor: formData.setor 
      }])
      .select()
      .single();

    if (empError) alert("Erro ao criar empresa: " + empError.message);
    else {
      alert(`Empresa ${formData.nome} cadastrada! Agora você pode convidar o administrador ${formData.emailAdmin} via painel de Auth.`);
      setFormData({ nome: '', cnpj: '', setor: '', emailAdmin: '' });
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-orange-500" /> Painel de Gestão EASYLAN
            </h2>
            <p className="text-slate-400 text-sm italic">Cadastro de Novos Clientes EasyGov</p>
          </div>
        </div>

        <form onSubmit={criarCliente} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Nome da Empresa</label>
            <input required className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500" 
              value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">CNPJ</label>
            <input className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500" 
              value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Setor</label>
            <input className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500" 
              value={formData.setor} onChange={e => setFormData({...formData, setor: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">E-mail do Administrador (Cliente)</label>
            <input required type="email" className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500" 
              value={formData.emailAdmin} onChange={e => setFormData({...formData, emailAdmin: e.target.value})} />
          </div>
          
          <button disabled={loading} className="md:col-span-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition shadow-lg flex justify-center items-center gap-2">
            {loading ? 'Cadastrando...' : <><Plus size={20}/> Cadastrar Empresa e Gerar Acesso</>}
          </button>
        </form>
      </div>
    </div>
  );
}