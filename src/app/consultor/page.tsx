'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Bot, Send, User } from 'lucide-react';

export default function ConsultorIAPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input) return;
    const userMsg = { role: 'user', text: input };
    setMessages([...messages, userMsg]);
    setLoading(true);
    
    // Chamada para a nossa API Route que configuramos antes
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt: input })
    });
    const data = await res.json();
    
    setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
    setLoading(false);
    setInput('');
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col p-10">
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          <div className="bg-blue-700 text-white p-6 rounded-3xl inline-block max-w-xl">
            Olá! Sou o assistente da **EASYLAN**. Como posso ajudar na sua governança hoje? 
            Tire dúvidas sobre a ISO 27001 ou como implementar controles do NIST.
          </div>

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-xl ${m.role === 'user' ? 'bg-orange-500 text-white' : 'bg-white border text-slate-700'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-slate-400 italic text-xs animate-pulse">Easylan IA está analisando...</div>}
        </div>

        <div className="flex gap-4">
          <input 
            className="flex-1 p-4 rounded-2xl border-2 border-slate-200 outline-none focus:border-blue-700"
            placeholder="Pergunte algo (ex: Como criar uma política de backup?)"
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="bg-blue-700 text-white p-4 rounded-2xl">
            <Send size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}