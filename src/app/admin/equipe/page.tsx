'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserPlus, Loader2, ChevronLeft, UserCog, ShieldCheck, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GestaoEquipePage() {
  const router = useRouter();
  const [novoUser, setNovoUser] = useState({ email: '', senha: '', nome: '', role: 'cliente' });
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => { fetchUsuarios(); }, []);

  async function fetchUsuarios() {
    const { data } = await supabase.from('perfis').select('*').order('nome_completo');
    if (data) setUsuarios(data);
  }

  const criarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: novoUser.email,
      password: novoUser.senha,
      options: { data: { nome_completo: novoUser.nome } }
    });

    if (error) {
      alert("Erro: " + error.message);
    } else if (data.user) {
      await supabase.from('perfis').insert([{ id: data.user.id, nome_completo: novoUser.nome, role: novoUser.role }]);
      alert("Usuário Criado!");
      setNovoUser({ email: '', senha: '', nome: '', role: 'cliente' });
      fetchUsuarios();
    }
    setLoading(false);
  };

  const alterarPerfil = async (userId: string, novoRole: string) => {
    const { error } = await supabase
      .from('perfis')
      .update({ role: novoRole })
      .eq('id', userId);

    if (error) alert("Erro ao mudar perfil: " + error.message);
    else {
      alert("Perfil atualizado!");
      fetchUsuarios();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="bg-white p-3 rounded-xl border hover:bg-slate-100 transition shadow-sm border-blue-100">
              <ChevronLeft size={20} className="text-blue-700" />
            </button>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-800">Equipe <span className="text-orange-500">Easylan</span></h1>
          </div>
        </header>

        {/* Formulário de Criação */}
        <form onSubmit={criarUsuario} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
           <div className="md:col-span-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Nome</label>
              <input required className="w-full p-3 border rounded-xl" value={novoUser.nome} onChange={e => setNovoUser({...novoUser, nome: e.target.value})} />
           </div>
           <div className="md:col-span-1">
              <label className="text-[10px] font-black uppercase text-slate-400">E-mail</label>
              <input required type="email" className="w-full p-3 border rounded-xl" value={novoUser.email} onChange={e => setNovoUser({...novoUser, email: e.target.value})} />
           </div>
           <div className="md:col-span-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Senha</label>
              <input required type="password" placeholder="******" className="w-full p-3 border rounded-xl" value={novoUser.senha} onChange={e => setNovoUser({...novoUser, senha: e.target.value})} />
           </div>
           <button className="bg-blue-700 text-white p-4 h-[52px] rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-slate-900 transition">
              {loading ? <Loader2 className="animate-spin"/> : <UserPlus size={18}/>} CRIAR
           </button>
        </form>

        {/* Listagem com Troca de Perfil */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-slate-900 text-white text-[10px] uppercase font-black tracking-widest">
                 <tr>
                   <th className="p-5">Membro</th>
                   <th className="p-5">Perfil Atual</th>
                   <th className="p-5 text-right">Mudar Perfil</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {usuarios.map(u => (
                   <tr key={u.id} className="hover:bg-slate-50">
                     <td className="p-5 font-bold text-slate-700">{u.nome_completo}</td>
                     <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${u.role === 'super-admin' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                          {u.role}
                        </span>
                     </td>
                     <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                           <button 
                             onClick={() => alterarPerfil(u.id, 'super-admin')}
                             className={`p-2 rounded-lg border transition ${u.role === 'super-admin' ? 'bg-orange-500 text-white border-transparent' : 'bg-white text-slate-400 border-slate-200'}`}
                             title="Tornar Consultor"
                           >
                             <ShieldCheck size={16} />
                           </button>
                           <button 
                             onClick={() => alterarPerfil(u.id, 'cliente')}
                             className={`p-2 rounded-lg border transition ${u.role === 'cliente' ? 'bg-blue-600 text-white border-transparent' : 'bg-white text-slate-400 border-slate-200'}`}
                             title="Tornar Cliente"
                           >
                             <User size={16} />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}