'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, Loader2, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  // Verifica se o usuário já está logado ao carregar a página
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handleRedirect(session.user.id);
      }
    };
    checkUser();
  }, []);

  // Função centralizada para decidir para onde o usuário deve ir
  const handleRedirect = async (userId: string) => {
    try {
      const { data: perfil, error } = await supabase
        .from('perfis')
        .select('role, empresa_id')
        .eq('id', userId)
        .single();

      if (error || !perfil) {
        // Se não houver perfil, talvez seja um novo usuário
        router.push('/onboarding');
        return;
      }

      if (perfil.role === 'super-admin') {
        // Consultor EASYLAN: Vai para a lista de empresas
        router.push('/admin/clientes');
      } else {
        // Usuário Cliente: Vai para o Dashboard da empresa dele
        if (perfil.empresa_id) {
          localStorage.setItem('easygov_empresa_id', perfil.empresa_id);
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      }
    } catch (err) {
      console.error("Erro no redirecionamento:", err);
      setErrorMsg("Erro ao processar perfil de acesso.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg("Credenciais inválidas ou erro de conexão.");
        setLoading(false);
        return;
      }

      if (data.user) {
        await handleRedirect(data.user.id);
      }
    } catch (err) {
      setErrorMsg("Ocorreu um erro inesperado.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      {/* Detalhes de Background (Estética SaaS) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-700/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full z-10">
        <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-white/20 relative">
          
          {/* Logo EASYGOV conforme conceito solicitado */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-5 rounded-3xl shadow-xl shadow-blue-700/30 flex items-center justify-center relative">
                <Shield size={48} className="text-white" />
                <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-black text-slate-800 italic tracking-tighter">
              EASY<span className="text-orange-500">GOV</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
              Consultor Virtual de Governança e Segurança
            </p>
            <p className="text-blue-700 text-[9px] font-black italic mt-1">BY EASYLAN</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-xl animate-shake">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-700 transition" size={18} />
              <input 
                type="email" 
                placeholder="E-mail profissional" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition text-slate-700 font-medium"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-700 transition" size={18} />
              <input 
                type="password" 
                placeholder="Sua senha secreta" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition text-slate-700 font-medium"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-6 uppercase text-sm tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Autenticando...
                </>
              ) : (
                <>
                  Acessar Plataforma <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-slate-50 pt-6">
            <p className="text-[10px] text-slate-400 font-medium">
              Ambiente Seguro e Monitorado para Consultores <span className="text-slate-800 font-black">EASYLAN</span>
            </p>
          </div>
        </div>

        {/* Footer Externo */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-[10px] font-medium opacity-50 uppercase tracking-widest">
            © 2024 Easylan Tecnologia - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}