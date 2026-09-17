import React, { useState, useRef, useEffect } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { useTheme } from '../context/ThemeContext';
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
  const { profile } = useAegis();
  const { isCream } = useTheme();

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
      <div className={`pb-2 flex items-center justify-between border-b ${isCream ? 'border-black/20' : 'border-slate-800'}`}>
        <div className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-xl flex items-center justify-center border ${
              isCream
                ? 'bg-white border-black text-[#0D0D0D] shadow-[1px_1px_0px_0px_#000]'
                : 'bg-sky-500/10 border-sky-500/30 text-sky-400'
            }`}
          >
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-sm font-bold ${isCream ? 'text-[#0D0D0D]' : 'text-white'}`}>
              AI Safety Advisor
            </h2>
            <p className={`text-[10px] ${isCream ? 'text-[#242424]' : 'text-slate-400'}`}>
              Trauma-informed, confidential guidance
            </p>
          </div>
        </div>

        <a
          href="tel:112"
          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
            isCream
              ? 'text-rose-700 bg-rose-50 border-rose-600 shadow-[1px_1px_0px_0px_#b91c1c]'
              : 'text-rose-400 bg-rose-950/60 border-rose-800'
          }`}
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
                    ? isCream
                      ? 'bg-[#0D0D0D] text-white rounded-br-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]'
                      : 'bg-sky-600 text-white rounded-br-none'
                    : isCream
                    ? 'bg-white border-2 border-black text-[#0D0D0D] rounded-bl-none shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-[9px] mt-1.5 ${
                    isUser
                      ? isCream ? 'text-slate-300 text-right' : 'text-sky-200 text-right'
                      : isCream ? 'text-[#242424]/70' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div
            className={`flex items-center gap-2 text-xs p-3 rounded-2xl max-w-[70%] border ${
              isCream
                ? 'bg-white border-2 border-black text-[#242424] shadow-[2px_2px_0px_0px_#000]'
                : 'text-slate-400 bg-slate-900 border-slate-800'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 animate-spin ${isCream ? 'text-[#0D0D0D]' : 'text-sky-400'}`} />
            <span>Consulting safety protocols...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sample Quick Questions */}
      {messages.length <= 2 && (
        <div className="space-y-1">
          <span className={`text-[10px] font-semibold uppercase tracking-wider block ${isCream ? 'text-[#242424]' : 'text-slate-400'}`}>
            Suggested Safety Topics:
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className={`text-[11px] px-2.5 py-1.5 rounded-xl whitespace-nowrap text-left transition ${
                  isCream
                    ? 'bg-white border border-black/40 text-[#242424] hover:bg-black/5 hover:text-[#0D0D0D]'
                    : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div
        className={`rounded-2xl p-2 flex items-center gap-2 transition ${
          isCream
            ? 'bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
            : 'bg-slate-900/90 border border-slate-800'
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Describe what happened or ask a question..."
          className={`flex-1 bg-transparent px-2 text-xs focus:outline-none ${
            isCream
              ? 'text-[#0D0D0D] placeholder:text-[#242424]/50'
              : 'text-white placeholder:text-slate-500'
          }`}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className={`h-8 w-8 rounded-xl disabled:opacity-40 flex items-center justify-center transition active:scale-95 shrink-0 ${
            isCream
              ? 'bg-[#0D0D0D] hover:bg-black text-[#FDFBD4]'
              : 'bg-sky-600 hover:bg-sky-500 text-white'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
