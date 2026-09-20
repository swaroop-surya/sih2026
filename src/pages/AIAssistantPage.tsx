import React, { useState, useRef, useEffect } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { askAIAssistant, AIChatMessage } from '../services/aiService';
import { useTranslation } from '../hooks/useTranslation';
import {
  ArrowLeft,
  Trash2,
  Send,
  Info,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { generateId } from '../lib/utils';
import { AbhayaLogo } from '../components/common/AbhayaLogo';
import { FormattedSafetyText } from '../components/common/FormattedSafetyText';

export const AIAssistantPage: React.FC = () => {
  const { profile, setCurrentPage } = useAegis();
  const { t } = useTranslation();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${profile.name ? profile.name.split(' ')[0] : 'there'}. I am your Abhaya AI safety advisor.\n\nYou can describe what is happening in your own words, ask about safety steps, or get guidance on Indian legal protections (like Zero FIR and cybercrime reporting).\n\nIf you are in immediate danger, dial 112 immediately.`,
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
    } catch {
      const errorMsg: AIChatMessage = {
        id: generateId('msg_err'),
        sender: 'assistant',
        text: 'I had trouble connecting to the network right now. If you are in urgent distress, call 112 or 181 immediately, or try asking your question again.',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Chat cleared. Tell me what is happening, and I will provide private, objective guidance.',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const starterChips = [
    'My partner checks my phone and location constantly',
    'A recruiter is asking for my original passport for a job',
    'Someone is threatening to leak private photos unless I pay',
    'How do I file a Zero FIR at any police station in India?',
    'Someone is following me on the street right now',
    'What free legal aid is available under NALSA?'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] space-y-3 pb-2">
      {/* Header: Back button + Title + Live AI Badge + Clear chat */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-9 h-9 rounded-full bg-[var(--surface-2)] text-[var(--text)] flex items-center justify-center hover:bg-[var(--surface)] transition cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-semibold text-[18px] text-[var(--text)]">
                {t.askAegis || 'Ask Abhaya'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--safe)]/15 text-[var(--safe)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--safe)] animate-pulse" />
                Live AI
              </span>
            </div>
            <p className="text-caption text-[12px]">Private safety guidance</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="w-9 h-9 rounded-full bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--sos)] flex items-center justify-center transition cursor-pointer"
          aria-label={t.clearChat || 'Clear chat'}
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4 stroke-[1.75]" />
        </button>
      </div>

      {/* Plain Language Disclaimer at top */}
      <div className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] flex items-start gap-2.5 text-[13px] text-[var(--text)]">
        <Info className="w-4 h-4 text-[var(--muted)] shrink-0 mt-0.5 stroke-[1.75]" />
        <p className="text-caption text-[12px] leading-relaxed">
          {t.aiDisclaimerText || 'Abhaya provides general safety guidance, not legal or police advice. In danger, call 112.'}
        </p>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] text-[var(--text)] flex items-center justify-center shrink-0 mt-0.5">
                  <AbhayaLogo className="w-5 h-5" strokeWidth={2.4} />
                </div>
              )}

              <div
                className={`max-w-[86%] p-3.5 rounded-[16px] text-[14px] leading-relaxed ${
                  isUser
                    ? 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)]'
                    : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--line)] shadow-xs'
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap">{m.text}</div>
                ) : (
                  <FormattedSafetyText content={m.text} />
                )}
                <span className="block text-[11px] text-[var(--muted)] text-right mt-1.5 font-mono">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-[13px] text-[var(--muted)]">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] text-[var(--primary)] flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 stroke-[1.75]" />
            </div>
            <span className="p-3 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--primary)]" />
              Abhaya is thinking...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Chips as horizontal scroll */}
      <div className="overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
        <div className="flex items-center gap-2">
          {starterChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="h-8 px-3 rounded-full bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface)] border border-[var(--line)] text-[12px] font-medium whitespace-nowrap shrink-0 transition cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or describe what happened..."
          className="soft-input flex-1 h-11 text-[14px] px-4"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center shrink-0 disabled:opacity-40 transition cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4 stroke-[1.75]" />
        </button>
      </form>
    </div>
  );
};
