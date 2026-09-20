import React from 'react';

interface FormattedSafetyTextProps {
  content: string;
  className?: string;
}

export const FormattedSafetyText: React.FC<FormattedSafetyTextProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Helper to parse inline **bold** syntax safely
  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-[var(--text)]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[13px] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 shrink-0 opacity-80" />
              <div className="flex-1">{item}</div>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[13px] leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-[var(--surface-2)] text-[var(--primary)] text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5 border border-[var(--line)]">
                {idx + 1}
              </span>
              <div className="flex-1">{item}</div>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Divider line
    if (trimmed === '***' || trimmed === '---' || trimmed === '___') {
      flushList();
      elements.push(
        <hr key={`hr-${index}`} className="my-3 border-t border-[var(--line)] opacity-60" />
      );
      return;
    }

    // Heading 3 or 4
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${index}`} className="font-heading font-semibold text-[15px] text-[var(--text)] mt-3 mb-1">
          {renderInline(trimmed.replace(/^###\s+/, ''))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${index}`} className="font-heading font-medium text-[14px] text-[var(--text)] mt-2 mb-1">
          {renderInline(trimmed.replace(/^####\s+/, ''))}
        </h4>
      );
      return;
    }

    // Bullet list item (* or -)
    if (/^[\*\-]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[\*\-]\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(renderInline(itemText));
      return;
    }

    // Numbered list item (1. , 2. )
    if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(renderInline(itemText));
      return;
    }

    // Normal paragraph
    flushList();
    elements.push(
      <p key={`p-${index}`} className="text-[13px] leading-relaxed my-1.5 text-[var(--text)]">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className={`space-y-0.5 ${className}`}>{elements}</div>;
};
