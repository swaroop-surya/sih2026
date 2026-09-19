import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { SafePlace, SafePlaceType } from '../types';
import {
  MapPin,
  Plus,
  Trash2,
  Navigation,
  Building,
  Lock,
  Phone
} from 'lucide-react';

export const LocationSafetyPage: React.FC = () => {
  const {
    safePlaces,
    addSafePlace,
    deleteSafePlace
  } = useAegis();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<SafePlaceType>('HOME');
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    addSafePlace({
      name: name.trim(),
      type,
      address: address.trim(),
      contactPhone: contactPhone.trim() || undefined,
      notes: notes.trim() || undefined
    });

    setName('');
    setAddress('');
    setContactPhone('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Safe Places</h1>
          <p className="text-caption text-[14px] mt-1">
            Registered safe havens, police stations, Sakhi centres, and trusted shelters.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-8 px-3 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] text-[12px] font-medium hover:bg-[var(--surface)] transition cursor-pointer flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[1.75]" />
          <span>Add place</span>
        </button>
      </div>

      {/* Strict Privacy Location Policy Card */}
      <div className="p-3.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] space-y-1 text-[13px] text-[var(--text)]">
        <div className="flex items-center gap-1.5 font-medium text-[var(--text)]">
          <Lock className="w-4 h-4 text-[var(--safe)] stroke-[1.75]" />
          <span>Location privacy guarantee</span>
        </div>
        <p className="text-caption text-[12px] leading-relaxed">
          Abhaya never performs continuous background tracking. Your live coordinates are strictly queried only when you deliberately activate a Safety Check-in or Emergency SOS.
        </p>
      </div>

      {/* Add Safe Place Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-3 text-[13px]">
          <h3 className="section-title text-[16px]">Register new safe place</h3>

          <div>
            <label className="block text-[12px] font-medium text-[var(--text)] mb-1">Place Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Indiranagar Police Station / Aunt Maya's House"
              className="soft-input w-full text-[13px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[12px] font-medium text-[var(--text)] mb-1">Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SafePlaceType)}
                className="soft-input w-full text-[12px] cursor-pointer"
              >
                <option value="HOME">Personal Home</option>
                <option value="WORK">Office / Work</option>
                <option value="COLLEGE">College / University</option>
                <option value="HOSTEL">Hostel / PG</option>
                <option value="POLICE_STATION">Police Station</option>
                <option value="SAKHI_CENTRE">One Stop Sakhi Centre</option>
                <option value="OTHER">Other Safe Sanctuary</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[var(--text)] mb-1">Contact Phone (Optional)</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91..."
                className="soft-input w-full text-[13px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[var(--text)] mb-1">Complete Address / Landmarks *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Landmarks, floor, metro station proximity"
              className="soft-input w-full text-[13px]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[var(--text)] mb-1">Access Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Guard is 24/7, ask for Warden Mrs. Sunita"
              className="soft-input w-full text-[13px]"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="soft-btn soft-btn-secondary flex-1 text-[13px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="soft-btn soft-btn-primary flex-1 text-[13px]"
            >
              Save safe place
            </button>
          </div>
        </form>
      )}

      {/* Safe Places List */}
      <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
        {safePlaces.map((place) => (
          <div
            key={place.id}
            className="py-3.5 space-y-2 text-[13px] px-1"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-[var(--surface-2)] text-[var(--text)] flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="font-medium text-[14px] text-[var(--text)]">{place.name}</h4>
                  <span className="text-[11px] text-[var(--muted)]">
                    {place.type.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteSafePlace(place.id)}
                className="text-[var(--muted)] hover:text-[var(--sos)] p-1.5 transition"
                title="Remove safe place"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
              </button>
            </div>

            <p className="text-caption text-[12px] flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--muted)] shrink-0 mt-0.5 stroke-[1.75]" />
              <span>{place.address}</span>
            </p>

            {place.notes && (
              <p className="text-[11px] text-[var(--muted)] bg-[var(--surface-2)] p-2 rounded-[8px]">
                <strong>Access Note:</strong> {place.notes}
              </p>
            )}

            <div className="pt-1 flex items-center gap-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 h-7 px-3 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] text-[12px] font-medium text-[var(--text)] transition"
              >
                <Navigation className="w-3 h-3 stroke-[1.75]" />
                <span>Navigate</span>
              </a>

              {place.contactPhone && (
                <a
                  href={`tel:${place.contactPhone}`}
                  className="inline-flex items-center gap-1 h-7 px-3 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] text-[12px] font-medium text-[var(--text)] transition"
                >
                  <Phone className="w-3 h-3 stroke-[1.75]" />
                  <span>Call</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
