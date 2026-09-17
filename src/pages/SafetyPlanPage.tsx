import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { SafetyPlanSection } from '../types';
import {
  CheckSquare,
  Square,
  Shield,
  Plus,
  Lock,
  EyeOff,
  Eye,
  FileCheck,
  MapPin,
  Users,
  Car,
  HeartPulse,
  AlertCircle
} from 'lucide-react';

export const SafetyPlanPage: React.FC = () => {
  const {
    safetyPlan,
    toggleSafetyPlanItem,
    addSafetyPlanItem,
    contacts,
    safePlaces,
    setCurrentPage
  } = useAegis();

  const [isDiscreetView, setIsDiscreetView] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SafetyPlanSection | 'ALL'>('ALL');
  const [newItemText, setNewItemText] = useState('');
  const [newItemSection, setNewItemSection] = useState<SafetyPlanSection>('DOCUMENTS');

  const completedCount = safetyPlan.filter(i => i.isCompleted).length;
  const progressPercent = Math.round((completedCount / (safetyPlan.length || 1)) * 100);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    addSafetyPlanItem({
      section: newItemSection,
      title: newItemText.trim()
    });
    setNewItemText('');
  };

  const filteredItems = selectedSection === 'ALL'
    ? safetyPlan
    : safetyPlan.filter(i => i.section === selectedSection);

  const sectionsList: Array<{ key: SafetyPlanSection; label: string; discreetLabel: string }> = [
    { key: 'DOCUMENTS', label: 'Identity & Legal Papers', discreetLabel: 'Important Files' },
    { key: 'SAFE_PLACES', label: 'Emergency Shelters', discreetLabel: 'Saved Locations' },
    { key: 'TRANSPORT', label: 'Escape Transportation', discreetLabel: 'Travel Itinerary' },
    { key: 'MEDICAL', label: 'Critical Health & Prescriptions', discreetLabel: 'Wellness Notes' },
    { key: 'CONTACTS', label: 'Trusted Distress Network', discreetLabel: 'Personal Directory' },
    { key: 'EXIT_BAG', label: 'Secret Emergency Go-Bag', discreetLabel: 'Travel Kit' }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-sky-400" />
            {isDiscreetView ? 'Personal Organizer' : 'Personal Safety & Exit Plan'}
          </h2>
          <p className="text-xs text-slate-400">
            {isDiscreetView ? 'Private checklists and travel items' : 'Step-by-step actionable exit readiness and documentation checklist.'}
          </p>
        </div>

        {/* Discreet view toggle */}
        <button
          onClick={() => setIsDiscreetView(!isDiscreetView)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition"
          title="Mutes sensitive titles for safety"
        >
          {isDiscreetView ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{isDiscreetView ? 'Standard' : 'Discreet'}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300">Preparedness Completion</span>
          <span className="text-emerald-400 font-bold">{progressPercent}% ({completedCount}/{safetyPlan.length})</span>
        </div>
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedSection('ALL')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
            selectedSection === 'ALL'
              ? 'bg-sky-600 text-white'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Items ({safetyPlan.length})
        </button>
        {sectionsList.map(sec => (
          <button
            key={sec.key}
            onClick={() => setSelectedSection(sec.key)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
              selectedSection === sec.key
                ? 'bg-sky-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isDiscreetView ? sec.discreetLabel : sec.label}
          </button>
        ))}
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => toggleSafetyPlanItem(item.id)}
            className={`cursor-pointer p-3 rounded-xl border transition text-xs flex items-start gap-3 select-none ${
              item.isCompleted
                ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-400'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.isCompleted ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <div className="flex-1">
              <span className={`font-medium block ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                {item.title}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-0.5">
                {item.section.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Item */}
      <form onSubmit={handleAddItem} className="bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
        <span className="font-semibold text-slate-300 block">Add Custom Checklist Action</span>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={newItemSection}
            onChange={(e) => setNewItemSection(e.target.value as SafetyPlanSection)}
            className="col-span-1 rounded-xl border border-slate-800 bg-slate-950 px-2 py-2 text-xs text-white focus:outline-none"
          >
            <option value="DOCUMENTS">Documents</option>
            <option value="SAFE_PLACES">Safe Place</option>
            <option value="TRANSPORT">Transport</option>
            <option value="MEDICAL">Medical</option>
            <option value="EXIT_BAG">Go-Bag</option>
          </select>

          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="e.g. Spare key hidden at aunt's house"
            className="col-span-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!newItemText.trim()}
          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold transition"
        >
          Add to Plan
        </button>
      </form>
    </div>
  );
};
