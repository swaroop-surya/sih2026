import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { exportFullDataBackup, wipeAllLocalData } from '../lib/storage';
import { demoScenarios } from '../data/demoScenarios';
import { SupportedLanguage, UserRole } from '../types';
import {
  User,
  Shield,
  Users,
  Bell,
  Lock,
  Globe,
  Download,
  Trash2,
  Sparkles,
  PhoneCall,
  Plus,
  Send,
  CheckCircle,
  AlertTriangle,
  Info,
  Layers,
  History,
  Mic,
  MicOff,
  Settings,
  Volume2,
  Palette
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import { PWAInstallButton } from '../components/common/PWAInstallButton';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useVoiceTrigger } from '../context/VoiceTriggerContext';

export const ProfilePage: React.FC = () => {
  const {
    profile,
    updateProfile,
    contacts,
    addContact,
    deleteContact,
    testContactNotification,
    setLanguage,
    setUserRole,
    auditLogs,
    loadDemoScenario,
    resetToDefaultData,
    setCurrentPage
  } = useAegis();

  const {
    isListening,
    triggerPhrase,
    startListening,
    stopListening,
    setIsModalOpen,
    wakeLockActive
  } = useVoiceTrigger();

  const [showAddContact, setShowAddContact] = useState(false);
  const [cName, setCName] = useState('');
  const [cRelation, setCRelation] = useState('Sister');
  const [cPhone, setCPhone] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cPhone.trim()) return;

    addContact({
      name: cName.trim(),
      relationship: cRelation,
      phone: cPhone.trim(),
      email: cEmail.trim() || undefined,
      priority: contacts.length + 1,
      notifyOnSOS: true,
      notifyOnCheckinMiss: true
    });

    setCName('');
    setCPhone('');
    setCEmail('');
    setShowAddContact(false);
  };

  const handleWipeData = () => {
    resetToDefaultData();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-sky-400" />
          Profile, Privacy & Security
        </h2>
        <p className="text-xs text-slate-400">
          Manage your identity, trusted contact network, audit logs, and encryption settings.
        </p>
      </div>

      {/* Native App Installation Card */}
      <PWAInstallButton variant="card" />

      {/* Account Info Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-base">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{profile.name}</h3>
              <p className="text-[11px] text-slate-400">Device container: Local Encrypted</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            {profile.role} MODE
          </span>
        </div>

        {/* Edit Name & Role */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Your Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Active Role</label>
            <select
              value={profile.role}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
            >
              <option value="USER">User (Standard)</option>
              <option value="RESPONDER">Responder (Sakhi Staff)</option>
              <option value="ADMIN">System Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-sky-400" />
            Language / भाषा / భాష / மொழி
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {[
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'हिन्दी' },
            { code: 'te', label: 'తెలుగు' },
            { code: 'ta', label: 'தமிழ்' }
          ].map(l => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code as SupportedLanguage)}
              className={`py-2 rounded-xl text-xs font-semibold border transition ${
                profile.language === l.code
                  ? 'bg-sky-600 text-white border-sky-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Appearance: Dark Mode & Light Cream Mode */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-500" />
              Display Theme & Appearance
            </h3>
            <p className="text-[11px] text-slate-400">
              Choose between Dark Mode or the soothing Cream Light Mode.
            </p>
          </div>
        </div>
        <ThemeToggle variant="selector" />
      </div>

      {/* Trusted Contacts Management */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              Trusted Emergency Circle ({contacts.length})
            </h3>
            <p className="text-[11px] text-slate-400">People alerted during emergency SOS and overdue check-ins.</p>
          </div>

          <button
            onClick={() => setShowAddContact(!showAddContact)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Add Contact Sub-form */}
        {showAddContact && (
          <form onSubmit={handleAddContact} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
            <div className="font-semibold text-white">Add New Trusted Contact</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
              />
              <select
                value={cRelation}
                onChange={(e) => setCRelation(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
              >
                <option value="Sister">Sister</option>
                <option value="Mother">Mother</option>
                <option value="Friend">Friend</option>
                <option value="Partner">Partner</option>
                <option value="Colleague">Colleague</option>
                <option value="Advocate">Advocate</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="tel"
                required
                placeholder="Phone (+91...)"
                value={cPhone}
                onChange={(e) => setCPhone(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={cEmail}
                onChange={(e) => setCEmail(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className="flex-1 rounded-lg bg-slate-800 py-1.5 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-sky-600 hover:bg-sky-500 py-1.5 text-white font-bold"
              >
                Save Contact
              </button>
            </div>
          </form>
        )}

        {/* Contacts list */}
        <div className="space-y-2">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2"
            >
              <div>
                <div className="font-semibold text-white">{c.name} ({c.relationship})</div>
                <div className="text-[11px] text-slate-400 font-mono">{c.phone}</div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-emerald-400">
                  <span>● SOS Alert Enabled</span>
                  <span>● Overdue Alert Enabled</span>
                </div>
                {c.lastTestNotification && (
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Verified test: {formatDate(c.lastTestNotification)}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => testContactNotification(c.id)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition"
                  title="Simulate sending a test SMS alert to this contact"
                >
                  Test SMS
                </button>
                <button
                  onClick={() => deleteContact(c.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition"
                  title="Remove contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discreet Voice Safe Word (Speech API) Guard */}
      <div className={`rounded-2xl border p-4 space-y-3 text-xs transition ${
        isListening
          ? 'bg-rose-950/30 border-rose-500/60 shadow-lg'
          : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1.5">
            {isListening ? (
              <Mic className="w-4 h-4 text-rose-400 animate-pulse" />
            ) : (
              <MicOff className="w-4 h-4 text-slate-400" />
            )}
            Discreet Voice Trigger Guard (Speech API)
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isListening
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {isListening ? 'ARMED' : 'INACTIVE'}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Say your custom safe word <span className="font-mono text-sky-400 font-semibold">"{triggerPhrase}"</span> aloud to silently broadcast your live GPS location and emergency message to your contacts without looking at or unlocking your phone.
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>● Wake Lock: {wakeLockActive ? 'Active' : 'Standby'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Configure Safe Word</span>
            </button>
            <button
              onClick={() => {
                if (isListening) stopListening();
                else startListening();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition active:scale-95 ${
                isListening
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow'
              }`}
            >
              {isListening ? 'Disarm' : 'Arm Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Demo Scenarios Walkthrough (Evaluator Suite) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Evaluation & Presentation Scenarios
          </span>
          <button
            onClick={resetToDefaultData}
            className="text-[11px] text-slate-400 hover:text-white underline"
          >
            Reset to Default
          </button>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Quickly populate realistic domain situations to evaluate the early risk detector, evidence vault, and emergency workflows:
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          {demoScenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => {
                loadDemoScenario(sc.id);
                setCurrentPage('home');
              }}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 text-left transition flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-200 block">{sc.title}</span>
                <span className="text-[11px] text-slate-400">{sc.summary}</span>
              </div>
              <span className="text-[10px] font-semibold text-amber-400 px-2 py-1 rounded bg-amber-950 border border-amber-800">
                Load
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1.5">
            <History className="w-4 h-4 text-sky-400" />
            Security & Audit Ledger
          </span>
          <button
            onClick={() => setShowAuditLogs(!showAuditLogs)}
            className="text-[11px] text-sky-400 hover:underline"
          >
            {showAuditLogs ? 'Hide Log' : `View (${auditLogs.length})`}
          </button>
        </div>

        {showAuditLogs && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pt-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>{log.action}</span>
                  <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString('en-IN')}</span>
                </div>
                <p className="text-slate-400 text-[10px] mt-0.5 font-mono">{log.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Management & Export / Wipe */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
        <h3 className="font-bold text-white flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-emerald-400" />
          Privacy, Backup & Emergency Wipe
        </h3>

        <div className="flex flex-col gap-2">
          <button
            onClick={exportFullDataBackup}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export Encrypted Safety Backup (JSON)</span>
          </button>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 font-semibold flex items-center justify-center gap-2 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Emergency Data Wipe / Factory Reset</span>
            </button>
          ) : (
            <div className="p-3 bg-rose-950 rounded-xl border border-rose-600 text-rose-200 space-y-2">
              <p className="font-bold text-white">Confirm complete data wipe?</p>
              <p className="text-[11px]">This permanently removes all local incident journals, evidence hashes, and contacts.</p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWipeData}
                  className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Wipe Everything Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legal & Product Principles Statement */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
        <div className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          <span>Aegis Safety Architecture Principles</span>
        </div>
        <p className="leading-relaxed">
          Aegis is built on human rights and trauma-informed safety principles. It acts as an early risk detection layer, incident documentation journal, and connection bridge to official Indian emergency services (112, 181, 1930).
        </p>
        <p className="leading-relaxed">
          Consensual adult autonomy is respected. System screening focuses on coercion, exploitation, trafficking, violence, harassment, stalking, abuse, and inability to safely exit.
        </p>
        <p className="text-slate-500 text-[10px]">
          Version 1.0.0 • Offline-first Progressive Web App
        </p>
      </div>
    </div>
  );
};
