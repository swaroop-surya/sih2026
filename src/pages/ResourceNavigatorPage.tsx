import React, { useState } from 'react';
import { initialVerifiedResources } from '../data/initialState';
import { useTranslation } from '../hooks/useTranslation';
import {
  PhoneCall,
  Search,
  ExternalLink
} from 'lucide-react';

interface ResourceNavigatorPageProps {
  embedded?: boolean;
}

export const ResourceNavigatorPage: React.FC<ResourceNavigatorPageProps> = ({ embedded = false }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [expandedResourceId, setExpandedResourceId] = useState<string | null>(null);

  const categories = [
    { key: 'ALL', label: 'All' },
    { key: 'EMERGENCY', label: 'Police 112' },
    { key: 'HELPLINE', label: '181 Women' },
    { key: 'LEGAL', label: 'Legal Aid' },
    { key: 'SHELTER', label: 'Sakhi Shelters' },
    { key: 'MENTAL_HEALTH', label: 'Mental Health' },
    { key: 'CYBER', label: 'Cyber 1930' }
  ];

  const regions = [
    { key: 'NEAR_ME', label: 'Near me' },
    { key: 'ALL', label: 'All India' },
    { key: 'Karnataka', label: 'Karnataka' },
    { key: 'Delhi', label: 'Delhi' },
    { key: 'Maharashtra', label: 'Maharashtra' },
    { key: 'Telangana', label: 'Telangana' },
    { key: 'Tamil Nadu', label: 'Tamil Nadu' }
  ];

  const filteredResources = initialVerifiedResources.filter(res => {
    if (selectedCategory !== 'ALL' && res.category !== selectedCategory) return false;
    if (selectedRegion === 'NEAR_ME') {
      if (res.state !== 'ALL' && res.state !== 'Karnataka') return false;
    } else if (selectedRegion !== 'ALL' && res.state !== 'ALL' && res.state !== selectedRegion) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.name.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedResourceId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Page Header */}
      {!embedded && (
        <div>
          <h1 className="page-title">{t.pageTitleGetHelp || 'Get help'}</h1>
          <p className="text-caption text-[14px] mt-1">
            {t.pageSubtitleGetHelp || 'Verified 24×7 helplines, local support centers, and legal aid across India.'}
          </p>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.75]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search helplines, legal aid, shelters..."
          className="soft-input w-full pl-10 pr-4 text-[13px]"
        />
      </div>

      {/* Filter Chips Scroll */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`h-7 px-3 rounded-full text-[12px] font-medium transition cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                  : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Region Selector */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {regions.map((reg) => (
            <button
              key={reg.key}
              onClick={() => setSelectedRegion(reg.key)}
              className={`h-7 px-2.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
                selectedRegion === reg.key
                  ? 'bg-[var(--text)] text-[var(--bg)]'
                  : 'bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)]'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
      </div>

      {/* List of Services */}
      <div className="space-y-2 pt-1">
        {filteredResources.length === 0 ? (
          <div className="p-6 rounded-[12px] bg-[var(--surface-2)] text-center text-caption text-[13px]">
            No support services match your filter. Try adjusting search or region.
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
            {filteredResources.map((res) => {
              const isExpanded = expandedResourceId === res.id;
              return (
                <div
                  key={res.id}
                  className="py-3.5 transition hover:bg-[var(--surface-2)]/50 cursor-pointer px-1"
                  onClick={() => toggleExpand(res.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-[14px] text-[var(--text)]">{res.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)] uppercase">
                          {res.category.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Number shown under name */}
                      <p className="text-[13px] font-mono text-[var(--primary)] mt-0.5">
                        {res.phone}
                      </p>

                      {/* One-line description */}
                      <p className="text-caption text-[12px] truncate mt-0.5">
                        {res.description}
                      </p>

                      {/* 24x7 dot */}
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--muted)]">
                        <span className={`w-1.5 h-1.5 rounded-full ${res.is24x7 ? 'bg-[var(--safe)]' : 'bg-[var(--accent)]'}`} />
                        <span>{res.is24x7 ? '24/7 Available' : 'Support line'}</span>
                        <span>•</span>
                        <span>{res.state === 'ALL' ? 'National' : res.state}</span>
                      </div>
                    </div>

                    {/* Round Call button */}
                    <a
                      href={`tel:${res.phone.replace(/[^0-9+]/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] flex items-center justify-center shrink-0 hover:bg-[var(--surface)] transition"
                      aria-label={`Call ${res.name} at ${res.phone}`}
                      title={`Call ${res.phone}`}
                    >
                      <PhoneCall className="w-4 h-4 stroke-[1.75]" />
                    </a>
                  </div>

                  {/* Expandable Section */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[var(--line)] space-y-2 text-[12px]" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <span className="font-medium text-[var(--text)] block">What to expect:</span>
                        <p className="text-caption text-[12px] mt-0.5">
                          {res.whatToExpect || 'Standard confidential responder protocol. Free government support.'}
                        </p>
                      </div>

                      {res.website && (
                        <div className="pt-1">
                          <a
                            href={res.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[var(--primary)] hover:underline font-medium"
                          >
                            Official portal
                            <ExternalLink className="w-3 h-3 stroke-[1.75]" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
