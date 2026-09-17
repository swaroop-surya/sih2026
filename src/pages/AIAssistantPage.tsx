import React, { useState, useRef, useEffect } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { askAIAssistant, AIChatMessage } from '../services/aiService';
import {
  Bot,
  Send,
  Shield,
  AlertTriangle,
  FileText,
  LifeBuoy,
  Sparkles,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { generateId } from '../lib/utils';

export const AIAssistantPage: React.FC = () => {
  const { profile, addIncident, setCurrentPage } = useAegis();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${profile.name || 'friend'}. I am your Aegis AI Safety Advisor. You can describe an incident in your own words, check warning signs, or ask for guidance on Indian legal protections and safety planning.\n\nPlease remember: In an immediate physical emergency, dial 112 directly.`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: AIChatMessage = {
      id: generateId('msg_u'),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askAIAssistant(query, messages, profile.language);
      const botMsg: AIChatMessage = {
        id: generateId('msg_a'),
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'My partner checks my phone and demands my location constantly',
    'A recruiter is asking for my original passport for a hospitality job',
    'Someone is threatening to leak private photos unless I pay money',
    'How do I file a Zero FIR at a police station?'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-3">
      {/* Header */}
      <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">AI Safety Advisor</h2>
            <p className="text-[10px] text-slate-400">Trauma-informed, confidential guidance</p>
          </div>
        </div>

        <a
          href="tel:112"
          className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-1 rounded-lg"
        >
          <PhoneCall className="w-2.5 h-2.5" />
          <span>Emergency: 112</span>
        </a>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`block text-[9px] mt-1.5 ${isUser ? 'text-sky-200 text-right' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 p-3 rounded-2xl max-w-[70%]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
            <span>Consulting safety protocols...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sample Quick Questions */}
      {messages.length <= 2 && (
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Suggested Safety Topics:
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="text-[11px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-2.5 py-1.5 rounded-xl whitespace-nowrap text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Describe what happened or ask a question..."
          className="flex-1 bg-transparent px-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="h-8 w-8 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 flex items-center justify-center text-white transition active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
