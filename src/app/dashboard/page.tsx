'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DOMINIOS } from '@/data/perguntas';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { 
  Shield, AlertTriangle, CheckCircle2, TrendingUp, 
  LayoutDashboard, Loader2, Target, Zap
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, PolarRadiusAxis 
} from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [empresa, setEmpresa] = useState<any>(null);
  const [riscos, setRiscos] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    scoreGeral: "0.0",
    aderenciaISO: 0,
    riscosCriticos: 0,
    controlesAtivos: 0
  });

  useEffect(() => {
    const empresaId = localStorage.getItem('easygov_empresa_id');
    if (!empresaId) {
      router.push('/admin/clientes');
      return;
    }
    fetchDadosCompletos(empresaId);
  }, [router]);

  async function fetchDadosCompletos(empresaId: string) {
    setLoading(true);
    try {
      // 1. Buscar Empresa
      const { data: emp } = await supabase.from('empresas').select('*').eq('id', empresaId).single();
      setEmpresa(emp);

      // 2. Buscar Riscos para a Matriz
      const { data: listaRiscos } = await supabase.from('riscos').select('*').eq('empresa_id', empresaId);
      setRiscos(listaRiscos || []);

      // 3. Buscar Diagnóstico e Calcular Scores
      const { data: diag } = await supabase.from('diagnosticos').select('respostas').eq('empresa_id', empresaId).single();
      const respostas = diag?.respostas || {};

      const categoriasNIST = {
        Identify: { soma: 0, total: 0 },
        Protect: { soma: 0, total: 0 },
        Detect: { soma: 0, total: 0 },
        Respond: { soma: 0, total: 0 },
        Recover: { soma: 0, total: 0 },
      };

      let simCount = 0;
      DOMINIOS.forEach(dom => {
        dom.questoes.forEach(q => {
          const resp = respostas[q.id];
          let valor = 0;
          if (resp === 'sim') { valor = 1; simCount++; }
          else if (resp === 'parcial') valor = 0.5;

          if (categoriasNIST[q.categoria as keyof typeof categoriasNIST]) {
            categoriasNIST[q.categoria as keyof typeof categoriasNIST].soma += valor;
            categoriasNIST[q.categoria as keyof typeof categoriasNIST].total += 1;
          }
        });
      });

      const formattedRadar = Object.keys(categoriasNIST).map(cat => ({
        subject: cat,
        score: categoriasNIST[cat as keyof typeof categoriasNIST].total > 0 
          ? ((categoriasNIST[cat as keyof typeof categoriasNIST].soma / categoriasNIST[cat as keyof typeof categoriasNIST].total) * 5).toFixed(1) 
          : 0
      }));

      const mediaGeral = (formattedRadar.reduce((acc, curr) => acc + parseFloat(curr.score.toString()), 0) / 5).toFixed(1);

      setChartData(formattedRadar);
      setStats({
        scoreGeral: mediaGeral,
        aderenciaISO: Math.round((simCount / 120) * 100),
        riscosCriticos: (listaRiscos || []).filter(r => (r.impacto * r.probabilidade) >= 15).length,
        controlesAtivos: simCount
      });

    } catch (error) {
      console.error("Erro no Dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white">
      <Loader2 className="animate-spin mb-4 text-orange-500" size={40} />
      <p className="italic text-slate-400">Gerando Inteligência EASYGOV...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar empresaNome={empresa?.nome_fantasia} />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header Profissional */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded italic">LIVE</span>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Easylan Consultoria Virtual</p>
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">
              Status de <span className="text-blue-700">Maturidade</span>
            </h2>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 text-center min-w-[120px]">
              <p className="text-[9px] font-black text-slate-400 uppercase">Score Geral</p>
              <p className="text-2xl font-black text-blue-700">{stats.scoreGeral}<span className="text-xs text-slate-300">/5.0</span></p>
            </div>
          </div>
        </header>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KPICard title="Aderência ISO 27001" value={`${stats.aderenciaISO}%`} icon={<Shield size={20}/>} color="text-blue-600" />
          <KPICard title="Riscos Críticos" value={stats.riscosCriticos} icon={<AlertTriangle size={20}/>} color="text-red-500" />
          <KPICard title="Controles Ativos" value={stats.controlesAtivos} icon={<CheckCircle2 size={20}/>} color="text-green-500" />
          <KPICard title="Metodologia" value={empresa?.metodologia_risco || 'ISO 31000'} icon={<Target size={20}/>} color="text-slate-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart (NIST CSF) */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200">
            <h4 className="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-700" /> Radar de Maturidade NIST
            </h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                  <Radar name="Maturidade" dataKey="score" stroke="#0047AB" fill="#0047AB" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Matriz de Calor de Riscos */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200">
             <h4 className="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest flex items-center gap-2">
              <Zap size={16} className="text-orange-500" /> Matriz de Criticidade (I x P)
            </h4>
            <RiskHeatmap riscos={riscos} />
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-componente: Matriz de Calor
function RiskHeatmap({ riscos }: { riscos: any[] }) {
  const niveis = [5, 4, 3, 2, 1]; // Impacto
  const probabilidades = [1, 2, 3, 4, 5]; // Probabilidade

  const getCorFundo = (i: number, p: number) => {
    const r = i * p;
    if (r >= 16) return 'bg-red-500';
    if (r >= 10) return 'bg-orange-500';
    if (r >= 5) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const getCount = (i: number, p: number) => {
    return riscos.filter(r => r.impacto === i && r.probabilidade === p).length;
  };

  return (
    <div>
      <div className="grid grid-cols-6 gap-1">
        {/* Eixo Vertical Impacto */}
        <div className="flex flex-col justify-around text-[8px] font-black text-slate-400 uppercase pr-2 italic">
          <span>Alt</span><span>Med</span><span>Baix</span>
        </div>
        
        {/* Grid 5x5 */}
        <div className="col-span-5 grid grid-cols-5 gap-1">
          {niveis.map(i => (
            probabilidades.map(p => (
              <div 
                key={`${i}-${p}`}
                className={`h-12 flex items-center justify-center rounded-lg text-white font-black text-xs shadow-inner transition-transform hover:scale-105 cursor-default ${getCorFundo(i, p)}`}
              >
                {getCount(i, p) || ''}
              </div>
            ))
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-4 gap-8 text-[9px] font-black uppercase text-slate-400 italic">
        <span>Probabilidade (1 → 5)</span>
      </div>
    </div>
  );
}

// Sub-componente: Stat Card
function KPICard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center text-center">
      <div className={`mb-3 p-3 rounded-2xl bg-slate-50 ${color}`}>{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-xl font-black text-slate-800">{value}</h4>
    </div>
  );
}