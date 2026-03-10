'use client';

import { 
  LayoutDashboard, FileText, AlertTriangle, 
  ShieldCheck, Bot, LogOut, ChevronRight, Users, FileDown 
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
  empresaNome?: string;
}

export default function Sidebar({ empresaNome }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // LISTA DE MENU ATUALIZADA COM CENTRAL DE RELATÓRIOS
  const menu = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Diagnóstico 120', icon: FileText, path: '/diagnostico' },
    { label: 'Mapa de Riscos', icon: AlertTriangle, path: '/riscos' },
    { label: 'Gerador de Políticas', icon: ShieldCheck, path: '/politicas' },
    { label: 'Central de Relatórios', icon: FileDown, path: '/relatorios' }, // <-- NOVO ITEM
    { label: 'Consultor IA', icon: Bot, path: '/consultor' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('easygov_empresa_id');
    router.push('/');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 shadow-2xl z-20">
      {/* Branding EASYLAN */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter">
          EASY<span className="text-orange-500">GOV</span>
        </h1>
        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">Easylan Technology</p>
      </div>

      {/* Contexto da Empresa Selecionada */}
      <div className="p-4 bg-slate-800/30 border-b border-slate-800">
        <p className="text-[9px] text-orange-500 font-black uppercase mb-1 tracking-wider">Auditando agora:</p>
        <div 
          onClick={() => router.push('/admin/clientes')}
          className="flex justify-between items-center group cursor-pointer hover:bg-slate-800 p-2 rounded-lg transition"
        >
          <span className="text-xs font-bold truncate max-w-[150px]">
            {empresaNome || 'Selecionar Cliente'}
          </span>
          <ChevronRight size={14} className="text-slate-500 group-hover:text-white transition" />
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 p-4 space-y-1 mt-4">
        {menu.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-xs font-bold uppercase tracking-tight ${
              pathname === item.path 
                ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/20' 
                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={18} className={pathname === item.path ? 'text-orange-500' : ''} /> 
            {item.label}
          </button>
        ))}

        {/* Gestão de Equipe / Consultores */}
        <button
          onClick={() => router.push('/admin/equipe')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-xs font-bold uppercase tracking-tight mt-6 border-t border-slate-800 pt-6 ${
            pathname === '/admin/equipe' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-200'
          }`}
        >
          <Users size={18} /> Gestão de Equipe
        </button>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all text-[10px] font-black uppercase"
        >
          <LogOut size={14} /> Encerrar Consultoria
        </button>
      </div>
    </aside>
  );
}