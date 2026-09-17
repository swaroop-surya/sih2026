import React, { useState } from 'react';
import { initialVerifiedResources } from '../data/initialState';
import { SafetyResource, ResourceCategory } from '../types';
import {
  LifeBuoy,
  PhoneCall,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  Shield,
  Clock,
  HeartPulse,
  Scale,
  Building
} from 'lucide-react';

export const ResourceNavigatorPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');

  const filteredResources = initialVerifiedResources.filter(res => {
    if (selectedCategory !== 'ALL' && res.category !== selectedCategory) return false;
    if (selectedState !== 'ALL' && res.state !== 'ALL' && res.state !== selectedState) return false;
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

  const categories = [
    { key: 'ALL', label: 'All Resources' },
    { key: 'EMERGENCY', label: 'Police / 112' },
    { key: 'HELPLINE', label: '181 & Helplines' },
    { key: 'LEGAL', label: 'Free Legal (NALSA)' },
    { key: 'SHELTER', label: 'Sakhi One Stop' },
    { key: 'MENTAL_HEALTH', label: 'Tele-MANAS' },
    { key: 'CYBER', label: 'Cyber (1930)' }
  ];

  const states = ['ALL', 'Karnataka', 'Delhi', 'Maharashtra', 'Telangana', 'Tamil Nadu', 'Uttar Pradesh'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <LifeBuoy className="w-5 h-5 text-sky-400" />
          Verified Support Services Navigator
        </h2>
        <p className="text-xs text-slate-400">
          Official government emergency infrastructure, legal aid, mental health, and Sakhi shelters.
        </p>
      </div>

      {/* Search & State Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, number, or service..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* State Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] whitespace-nowrap">State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-slate-200 text-xs focus:outline-none"
          >
            {states.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All India Coverage' : s}</option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === cat.key
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="space-y-3">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2 text-xs shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{res.name}</h4>
                  {res.is24x7 && (
                    <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded">
                      24/7 Available
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="uppercase font-semibold text-sky-400">{res.category.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{res.state === 'ALL' ? 'Pan-India' : res.state}</span>
                </div>
              </div>

              <a
                href={`tel:${res.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition active:scale-95 shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {res.phone}</span>
              </a>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              {res.description}
            </p>

            {/* What to expect calling note */}
            {res.whatToExpect && (
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-0.5">
                <span className="font-semibold text-slate-300">What to expect when calling:</span>
                <p className="leading-normal">{res.whatToExpect}</p>
              </div>
            )}

            {res.website && (
              <div className="pt-1">
                <a
                  href={res.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:underline"
                >
                  <span>Official Government Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
