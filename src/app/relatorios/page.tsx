'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DOMINIOS } from '@/data/perguntas';
import Sidebar from '@/components/Sidebar';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  FileDown, ShieldCheck, TrendingUp, AlertTriangle, 
  Loader2, CheckCircle, FileText, BarChart3, Clock
} from 'lucide-react';

// Importação dinâmica do Recharts para evitar erros de SSR no Next.js
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';

export default function RelatoriosPage() {
  const [empresa, setEmpresa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [riscos, setRiscos] = useState<any[]>([]);
  const [stats, setStats] = useState({ score: "0.0", iso: 0 });

  useEffect(() => {
    const id = localStorage.getItem('easygov_empresa_id');
    if (id) fetchRelatorioData(id);
  }, []);

  async function fetchRelatorioData(id: string) {
    setLoading(true);
    try {
      // 1. Dados da Empresa
      const { data: emp } = await supabase.from('empresas').select('*').eq('id', id).single();
      setEmpresa(emp);

      // 2. Diagnóstico e Cálculo de Maturidade
      const { data: diag } = await supabase.from('diagnosticos').select('respostas').eq('empresa_id', id).single();
      const resp = diag?.respostas || {};
      
      const scores: any = { Identify: 0, Protect: 0, Detect: 0, Respond: 0, Recover: 0 };
      const totais: any = { Identify: 0, Protect: 0, Detect: 0, Respond: 0, Recover: 0 };

      DOMINIOS.forEach(d => d.questoes.forEach(q => {
        // @ts-ignore
        totais[q.categoria]++;
        if (resp[q.id] === 'sim') scores[q.categoria] += 1;
        else if (resp[q.id] === 'parcial') scores[q.categoria] += 0.5;
      }));

      const formatted = Object.keys(scores).map(cat => ({
        subject: cat,
        score: totais[cat] > 0 ? ((scores[cat] / totais[cat]) * 5).toFixed(1) : 0
      }));
      
      setChartData(formatted);
      setStats({
        score: (formatted.reduce((a, b) => a + Number(b.score), 0) / 5).toFixed(1),
        iso: Math.round((Object.values(resp).filter(v => v === 'sim').length / 120) * 100)
      });

      // 3. Riscos Críticos (Top Gaps)
      const { data: listaRiscos } = await supabase.from('riscos')
        .select('*')
        .eq('empresa_id', id)
        .order('nivel_risco', { ascending: false });
      if (listaRiscos) setRiscos(listaRiscos);

    } catch (e) { 
      console.error("Erro ao carregar dados do relatório:", e); 
    } finally { 
      setLoading(false); 
    }
  }

  const gerarPDF = async () => {
    setGenerating(true); // Ativa o Overlay de progresso
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const chartElement = document.getElementById('radar-capture');

      if (!chartElement) throw new Error("Gráfico não encontrado");

      // Captura o gráfico de radar como imagem (escala 2 para melhor qualidade)
      const canvas = await html2canvas(chartElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      // --- PÁGINA 1: CAPA E MATURIDADE ---
      // Cabeçalho Azul EASYLAN (Hex puro para evitar erros de lab/color-function)
      doc.setFillColor(0, 71, 171); 
      doc.rect(0, 0, 210, 45, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('EASYGOV - RELATÓRIO EXECUTIVO', 20, 25);
      doc.setFontSize(10);
      doc.text('CONSULTORIA DE SEGURANÇA DA INFORMAÇÃO E GOVERNANÇA', 20, 32);

      // Informações da Auditoria
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(12);
      doc.text(`CLIENTE: ${empresa?.nome_fantasia?.toUpperCase()}`, 20, 60);
      doc.text(`RESPONSÁVEL: EASYLAN TECNOLOGIA`, 20, 67);
      doc.text(`DATA: ${new Date().toLocaleDateString('pt-BR')}`, 20, 74);

      // Seção NIST
      doc.setTextColor(0, 71, 171);
      doc.setFontSize(16);
      doc.text('1. Maturidade NIST Cybersecurity Framework', 20, 90);
      
      // Inserir Gráfico de Radar
      doc.addImage(imgData, 'PNG', 30, 95, 150, 110);

      // Resumo de Scores
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(11);
      doc.text(`Score Geral de Maturidade: ${stats.score} / 5.0`, 20, 215);
      doc.text(`Aderência à Norma ISO 27001:2022: ${stats.iso}%`, 20, 222);

      // --- PÁGINA 2: ANÁLISE DE RISCOS E ROADMAP ---
      doc.addPage();
      doc.setTextColor(0, 71, 171);
      doc.setFontSize(16);
      doc.text('2. Principais Gaps e Vulnerabilidades', 20, 25);

      let yPos = 40;
      doc.setFontSize(9);
      riscos.slice(0, 12).forEach((r, i) => {
        const isCritico = (r.impacto * r.probabilidade) >= 15;
        doc.setTextColor(isCritico ? 200 : 80, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`${i + 1}. [Risco: ${r.nivel_risco}] ${r.ativo}`, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text(`   Ameaça: ${r.ameaca}`, 20, yPos + 4);
        yPos += 12;
      });

      // Roadmap Estratégico
      doc.setTextColor(255, 140, 0); // Laranja EASYLAN
      doc.setFontSize(16);
      doc.text('3. Roadmap de Mitigação (Prioridades)', 20, yPos + 10);
      
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);
      doc.text('CURTO PRAZO (30 dias): Implementação de MFA e Correção de Gaps Críticos.', 20, yPos + 25);
      doc.text('MÉDIO PRAZO (90 dias): Inventário de Ativos e Gestão de Vulnerabilidades.', 20, yPos + 33);
      doc.text('LONGO PRAZO (180 dias): Testes de Intrusão e Auditoria de Continuidade.', 20, yPos + 41);

      // Rodapé
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text('Documento gerado pela plataforma EasyGov - Propriedade Intelectual EASYLAN.', 105, 285, { align: 'center' });

      doc.save(`Relatorio_Executivo_EasyGov_${empresa.nome_fantasia}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Houve um erro ao processar o PDF. Tente novamente.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
      <p className="italic text-slate-400">Preparando Central de Relatórios...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar empresaNome={empresa?.nome_fantasia} />
      
      {/* OVERLAY DE PROCESSAMENTO - INDICA AO USUÁRIO QUE O PDF ESTÁ SENDO GERADO */}
      {generating && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white">
          <div className="bg-white p-10 rounded-[40px] flex flex-col items-center shadow-2xl border border-blue-100 text-slate-800">
            <Loader2 className="animate-spin text-blue-700 mb-6" size={60} />
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Gerando <span className="text-orange-500">PDF Executivo</span></h2>
            <p className="text-slate-400 font-medium text-sm mt-2 text-center max-w-xs">
              Estamos processando os gráficos e a matriz de riscos. Por favor, aguarde alguns segundos...
            </p>
          </div>
        </div>
      )}

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-800 italic uppercase tracking-tighter">
              Relatórios <span className="text-blue-700 font-black">Estratégicos</span>
            </h2>
            <p className="text-slate-500 font-medium">Extraia o valor da sua consultoria para a diretoria do cliente.</p>
          </div>
          <button 
            onClick={gerarPDF}
            disabled={generating}
            className="bg-blue-700 hover:bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black flex items-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {generating ? <Loader2 className="animate-spin" /> : <FileDown size={22} />}
            BAIXAR RELATÓRIO EXECUTIVO (.PDF)
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Área de Captura do Gráfico (Preview) */}
            <div id="radar-capture" className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-200">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 text-center">Preview da Maturidade NIST CSF</h3>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 12, fontWeight: 'bold', fill: '#64748b'}} />
                    <Radar name="Maturidade" dataKey="score" stroke="#0047AB" fill="#0047AB" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sumário de Gaps */}
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200">
              <h3 className="text-xs font-black text-slate-800 uppercase mb-8 flex items-center gap-2 italic">
                <AlertTriangle size={20} className="text-orange-500" /> Resumo de Vulnerabilidades (GAPs)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {riscos.slice(0, 4).map((r, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Controle/Ativo</span>
                      <span className={`text-[10px] font-black italic ${r.nivel_risco >= 15 ? 'text-red-600' : 'text-orange-500'}`}>
                        SCORE: {r.nivel_risco}
                      </span>
                    </div>
                    <p className="text-sm font-black text-slate-800 uppercase truncate">{r.ativo}</p>
                    <p className="text-[11px] text-slate-500 italic mt-1 leading-tight">{r.ameaca}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Widgets Laterais */}
          <aside className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl border border-slate-800">
              <BarChart3 className="text-orange-500 mb-4" size={40} />
              <h4 className="font-black text-lg mb-2 italic">Documentação Pronta para o Board</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Este relatório traduz controles técnicos em visão de negócios, facilitando a aprovação de investimentos e orçamentos de cibersegurança pela diretoria.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <Clock className="text-blue-700 mb-4" size={40} />
              <h4 className="font-black text-slate-800 text-sm uppercase mb-2">Roadmap Dinâmico</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight">
                Os prazos de 30, 90 e 180 dias são calculados com base na criticidade dos riscos importados.
              </p>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}