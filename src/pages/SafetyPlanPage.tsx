import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { SafetyPlanSection } from '../types';
import {
  CheckSquare,
  Square,
  EyeOff,
  Eye,
  Plus
} from 'lucide-react';

export const SafetyPlanPage: React.FC = () => {
  const {
    safetyPlan,
    toggleSafetyPlanItem,
    addSafetyPlanItem
  } = useAegis();

  const [isDiscreetView, setIsDiscreetView] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SafetyPlanSection | 'ALL'>('ALL');
  const [newItemText, setNewItemText] = useState('');
  const [newItemSection, setNewItemSection] = useState<SafetyPlanSection>('DOCUMENTS');

  const safePlan = safetyPlan || [];
  const completedCount = safePlan.filter(i => i.isCompleted).length;
  const progressPercent = Math.round((completedCount / (safePlan.length || 1)) * 100);

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
    ? safePlan
    : safePlan.filter(i => i.section === selectedSection);

  const sectionsList: Array<{ key: SafetyPlanSection; label: string; discreetLabel: string }> = [
    { key: 'DOCUMENTS', label: 'Identity & Legal Papers', discreetLabel: 'Important Files' },
    { key: 'SAFE_PLACES', label: 'Emergency Shelters', discreetLabel: 'Saved Locations' },
    { key: 'TRANSPORT', label: 'Transportation', discreetLabel: 'Travel Itinerary' },
    { key: 'MEDICAL', label: 'Health & Prescriptions', discreetLabel: 'Wellness Notes' },
    { key: 'CONTACTS', label: 'Trusted Network', discreetLabel: 'Personal Directory' },
    { key: 'EXIT_BAG', label: 'Emergency Bag', discreetLabel: 'Travel Kit' }
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">
            {isDiscreetView ? 'Personal Organizer' : 'Safety Plan'}
          </h1>
          <p className="text-caption text-[14px] mt-1">
            {isDiscreetView ? 'Private checklists and travel items.' : 'Step-by-step readiness checklist.'}
          </p>
        </div>

        {/* Discreet view toggle */}
        <button
          onClick={() => setIsDiscreetView(!isDiscreetView)}
          className="h-8 px-3 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] text-[12px] font-medium hover:bg-[var(--surface)] transition cursor-pointer flex items-center gap-1.5 shrink-0"
          title="Mutes sensitive titles for discretion"
        >
          {isDiscreetView ? <Eye className="w-3.5 h-3.5 stroke-[1.75]" /> : <EyeOff className="w-3.5 h-3.5 stroke-[1.75]" />}
          <span>{isDiscreetView ? 'Standard' : 'Discreet'}</span>
        </button>
      </div>

      {/* Progress */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-2">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[var(--muted)]">Readiness progress</span>
          <span className="font-medium text-[var(--safe)]">{progressPercent}% ({completedCount}/{safePlan.length})</span>
        </div>
        <div className="h-1.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--safe)] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setSelectedSection('ALL')}
            className={`h-7 px-3 rounded-full text-[12px] font-medium transition cursor-pointer ${
              selectedSection === 'ALL'
                ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                : 'bg-[var(--surface-2)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            All ({safetyPlan.length})
          </button>
          {sectionsList.map(sec => (
            <button
              key={sec.key}
              onClick={() => setSelectedSection(sec.key)}
              className={`h-7 px-3 rounded-full text-[12px] font-medium transition cursor-pointer ${
                selectedSection === sec.key
                  ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                  : 'bg-[var(--surface-2)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {isDiscreetView ? sec.discreetLabel : sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist items */}
      <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => toggleSafetyPlanItem(item.id)}
            className="py-3 flex items-start gap-3 cursor-pointer select-none px-1 hover:bg-[var(--surface-2)]/50 transition"
          >
            <div className="mt-0.5 shrink-0">
              {item.isCompleted ? (
                <CheckSquare className="w-4 h-4 text-[var(--safe)] stroke-[1.75]" />
              ) : (
                <Square className="w-4 h-4 text-[var(--muted)] stroke-[1.75]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-[13px] block ${item.isCompleted ? 'line-through text-[var(--muted)]' : 'text-[var(--text)]'}`}>
                {item.title}
              </span>
              <span className="text-[11px] text-[var(--muted)] block mt-0.5">
                {item.section.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Item */}
      <form onSubmit={handleAddItem} className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-2.5 text-[13px]">
        <span className="font-medium text-[var(--text)] block">Add checklist action</span>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={newItemSection}
            onChange={(e) => setNewItemSection(e.target.value as SafetyPlanSection)}
            className="col-span-1 soft-input text-[12px] cursor-pointer"
          >
            <option value="DOCUMENTS">Documents</option>
            <option value="SAFE_PLACES">Safe Place</option>
            <option value="TRANSPORT">Transport</option>
            <option value="MEDICAL">Medical</option>
            <option value="EXIT_BAG">Bag</option>
          </select>

          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="e.g. Spare key hidden safely"
            className="col-span-2 soft-input text-[13px]"
          />
        </div>
        <button
          type="submit"
          disabled={!newItemText.trim()}
          className="soft-btn soft-btn-primary w-full text-[13px] h-9"
        >
          <Plus className="w-3.5 h-3.5 mr-1 stroke-[1.75]" />
          Add to plan
        </button>
      </form>
    </div>
  );
};
