import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { SafePlace, SafePlaceType } from '../types';
import {
  MapPin,
  Shield,
  Plus,
  Trash2,
  Navigation,
  ExternalLink,
  Building,
  Home,
  CheckCircle,
  Share2,
  Lock
} from 'lucide-react';

export const LocationSafetyPage: React.FC = () => {
  const {
    safePlaces,
    addSafePlace,
    deleteSafePlace,
    profile,
    updateProfile
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Verified Safe Places & Sanctuaries
          </h2>
          <p className="text-xs text-slate-400">
            Registered safe havens, police stations, One Stop Sakhi centres, and trusted shelters.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Refuge</span>
        </button>
      </div>

      {/* Strict Privacy Location Policy Card */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs text-slate-300">
        <div className="flex items-center gap-1.5 font-semibold text-sky-400">
          <Lock className="w-4 h-4" />
          <span>Strict Location Privacy Guarantee</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Aegis NEVER performs passive continuous background tracking. Your live coordinates are strictly queried only when you deliberately activate a Safety Check-in or Emergency SOS.
        </p>
      </div>

      {/* Add Safe Place Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <h3 className="font-bold text-white">Register New Safe Sanctuary</h3>

          <div>
            <label className="block text-slate-300 mb-1">Place Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Indiranagar Police Station / Aunt Maya's Apartment"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 mb-1">Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SafePlaceType)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
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
              <label className="block text-slate-300 mb-1">Contact Phone (Optional)</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Complete Address / Landmarks *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Landmarks, floor, metro station proximity"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Notes / Door Access Code (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Guard is 24/7, ask for Warden Mrs. Sunita"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-800 py-2 font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 font-bold text-white"
            >
              Save Safe Refuge
            </button>
          </div>
        </form>
      )}

      {/* Safe Places List */}
      <div className="space-y-2.5">
        {safePlaces.map((place) => (
          <div
            key={place.id}
            className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{place.name}</h4>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {place.type.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteSafePlace(place.id)}
                className="text-slate-500 hover:text-rose-400 p-1 transition"
                title="Remove safe place"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300 flex items-start gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{place.address}</span>
            </p>

            {place.notes && (
              <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <strong>Access Note:</strong> {place.notes}
              </p>
            )}

            <div className="pt-2 flex items-center gap-2 border-t border-slate-800/80">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition"
              >
                <Navigation className="w-3 h-3 text-sky-400" />
                <span>Navigate on Google Maps</span>
              </a>

              {place.contactPhone && (
                <a
                  href={`tel:${place.contactPhone}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition"
                >
                  <span>Call {place.contactPhone}</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
