import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useVoiceTrigger } from '../context/VoiceTriggerContext';
import { demoScenarios } from '../data/demoScenarios';
import { SupportedLanguage, UserRole } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import {
  Globe,
  Download,
  Trash2,
  Plus,
  Mic,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Laptop,
  Play,
  X,
  RotateCcw,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { DiscreetVoiceModal } from '../components/voice/DiscreetVoiceModal';

export const ProfilePage: React.FC = () => {
  const {
    profile,
    updateProfile,
    contacts,
    addContact,
    deleteContact,
    setLanguage,
    setUserRole,
    loadDemoScenario,
    resetToDefaultData,
    setCurrentPage
  } = useAegis();

  const { user, communityProfile, signOut, deleteCommunityData } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const {
    isListening,
    triggerPhrase,
    startListening,
    stopListening,
    setIsModalOpen,
    isModalOpen
  } = useVoiceTrigger();

  const [showAddContact, setShowAddContact] = useState(false);
  const [showSafeWord, setShowSafeWord] = useState(false);
  const [showDemoSheet, setShowDemoSheet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteCommunityConfirm, setShowDeleteCommunityConfirm] = useState(false);
  const [isDeletingCommunity, setIsDeletingCommunity] = useState(false);

  // Real logged-in account (not a demo placeholder)
  const rawAccount =
    user?.phone ||
    localStorage.getItem('abhaya_logged_in_account') ||
    (localStorage.getItem('abhaya_last_phone') ? `+91${localStorage.getItem('abhaya_last_phone')}` : '') ||
    user?.email ||
    '';

  const formatAccount = (account: string) => {
    if (!account) return 'Registered mobile';
    if (account.includes('@')) return account;
    const clean = account.replace(/\D/g, '');
    const ten = clean.slice(-10);
    if (ten.length === 10) {
      return `+91 ${ten.slice(0, 5)} ${ten.slice(5)}`;
    }
    return account;
  };

  const displayAccount = formatAccount(rawAccount);

  const userAlias = communityProfile?.alias || 'Community Member';

  // New Contact form state
  const [cName, setCName] = useState('');
  const [cRelation, setCRelation] = useState('Sister');
  const [cPhone, setCPhone] = useState('');

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cPhone.trim()) return;

    const cleanName = cName.replace(/\s*\([^)]*\)/g, '').trim();

    addContact({
      name: cleanName,
      relationship: cRelation,
      phone: cPhone.trim(),
      priority: (contacts?.length || 0) + 1,
      notifyOnSOS: true,
      notifyOnCheckinMiss: true
    });

    setCName('');
    setCPhone('');
    setShowAddContact(false);
  };

  const handleExportData = () => {
    const backup = {
      app: 'Abhaya',
      profile,
      contacts,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abhaya-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="page-title">{t.pageTitleProfile || 'Profile & Settings'}</h1>
        <p className="text-caption text-[14px] mt-1">
          {t.pageSubtitleProfile || 'Manage your protection settings, trusted contacts, and private data.'}
        </p>
      </div>

      {/* Community Identity & Authenticated Account Card */}
      <div className="soft-card p-4 space-y-4 border border-[var(--line)] bg-[var(--surface)]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.profileCommunityAlias || 'Community identity'}</span>
            </div>
            <h2 className="text-lg font-bold text-[var(--text)] tracking-tight">
              {userAlias}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {t.profileAuthAccount || 'Signed in as'}: <span className="font-mono font-medium text-[var(--text)]">{displayAccount}</span>
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Connected
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span>{t.btnLogout || 'Log out'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteCommunityConfirm(true)}
            className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.btnDeleteCommunityData || 'Delete community data'}</span>
          </button>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="soft-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--text)] font-heading font-semibold text-[15px] flex items-center justify-center">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="card-title text-[16px]">{profile.name}</h3>
              <p className="text-caption text-[12px]">Private data on this phone</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]">
            {profile.role}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--line)]">
          <div>
            <label className="text-[12px] font-medium text-[var(--muted)] block mb-1">Your Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="soft-input w-full text-[13px]"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[var(--muted)] block mb-1">Role</label>
            <select
              value={profile.role}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="soft-input w-full text-[13px] cursor-pointer"
            >
              <option value="USER">User</option>
              <option value="RESPONDER">Responder (Sakhi Staff)</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Theme Control */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-medium text-[var(--text)]">
            {t.themeTitle || 'Appearance'}
          </span>
          <span className="text-caption text-[12px] capitalize">{theme}</span>
        </div>

        <div className="p-1 rounded-full bg-[var(--surface-2)] border border-[var(--line)] grid grid-cols-3 gap-1">
          <button
            id="theme-btn-light"
            onClick={() => setTheme('light')}
            className={`h-9 rounded-full text-[13px] font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
              theme === 'light'
                ? 'bg-[var(--surface)] text-[var(--text)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <Sun className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Light</span>
          </button>
          <button
            id="theme-btn-dark"
            onClick={() => setTheme('dark')}
            className={`h-9 rounded-full text-[13px] font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
              theme === 'dark'
                ? 'bg-[var(--surface)] text-[var(--text)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <Moon className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Dark</span>
          </button>
          <button
            id="theme-btn-system"
            onClick={() => setTheme('system')}
            className={`h-9 rounded-full text-[13px] font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
              theme === 'system'
                ? 'bg-[var(--surface)] text-[var(--text)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>System</span>
          </button>
        </div>
      </div>

      {/* Voice Safe Word Row */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mic className="w-5 h-5 text-[var(--text)] stroke-[1.75]" />
            <div>
              <h3 className="card-title text-[15px]">{t.voiceSafeWordTitle || 'Voice safe word'}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-[var(--safe)]' : 'bg-[var(--muted)]'}`} />
                <span className="text-caption text-[12px]">
                  {isListening ? (t.statusListening || 'Listening') : (t.statusOff || 'Off')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-8 px-3 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] text-[12px] font-medium hover:bg-[var(--surface)] transition cursor-pointer"
            >
              {t.setUpVoice || 'Set up'}
            </button>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isListening}
                onChange={(e) => {
                  if (e.target.checked) startListening().catch(() => setIsModalOpen(true));
                  else stopListening();
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--surface-2)] border border-[var(--line)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--safe)]" />
            </label>
          </div>
        </div>

        {/* Masked phrase */}
        <div className="p-2.5 rounded-[8px] bg-[var(--surface-2)] flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--muted)]">Phrase:</span>
            <span className="font-mono text-[var(--text)]">
              {showSafeWord ? triggerPhrase : '••••••••••••'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowSafeWord(!showSafeWord)}
            className="text-[var(--muted)] hover:text-[var(--text)] p-1 cursor-pointer"
            aria-label={showSafeWord ? 'Hide safe word' : 'Reveal safe word'}
          >
            {showSafeWord ? <EyeOff className="w-4 h-4 stroke-[1.75]" /> : <Eye className="w-4 h-4 stroke-[1.75]" />}
          </button>
        </div>
      </div>

      {/* Language Selector: EN / हिन्दी / తెలుగు / தமிழ் */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="card-title text-[15px] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--text)] stroke-[1.75]" />
            Language
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {[
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'हिन्दी' },
            { code: 'te', label: 'తెలుగు' },
            { code: 'ta', label: 'தமிழ்' }
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code as SupportedLanguage)}
              className={`h-9 rounded-full text-[12px] font-medium transition cursor-pointer ${
                profile.language === l.code
                  ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                  : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trusted Contacts Management */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="section-title text-[20px]">
              {t.trustedContacts || 'Trusted contacts'} ({contacts.length})
            </h3>
            <p className="text-caption text-[12px]">Alerted during SOS and missed check-ins</p>
          </div>
          <button
            id="btn-profile-add-contact"
            onClick={() => setShowAddContact(true)}
            className="h-8 px-3 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] text-[12px] font-medium hover:bg-[var(--surface)] transition cursor-pointer flex items-center"
          >
            <Plus className="w-3.5 h-3.5 mr-1 stroke-[1.75]" />
            + Add contact
          </button>
        </div>

        <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
          {contacts.map((c) => {
            const cleanDisplayName = c.name.replace(/\s*\([^)]*\)/g, '').trim();
            return (
              <div
                key={c.id}
                className="py-3 flex items-center justify-between gap-2 px-1"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[var(--surface-2)] text-[var(--text)] font-heading font-semibold text-[13px] flex items-center justify-center shrink-0">
                    {cleanDisplayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[14px] text-[var(--text)] truncate">
                      {cleanDisplayName}
                    </p>
                    <p className="text-caption text-[12px]">
                      {c.relationship || 'Emergency Contact'} • {c.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      c.notifyOnSOS ? 'bg-[var(--safe)]' : 'bg-[var(--muted)]'
                    }`}
                    title={c.notifyOnSOS ? 'Active for alerts' : 'Paused'}
                  />
                  {contacts.length > 1 && (
                    <button
                      onClick={() => deleteContact(c.id)}
                      className="p-1.5 text-[var(--muted)] hover:text-[var(--sos)] transition"
                      aria-label={`Remove ${cleanDisplayName}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demo tools section */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="card-title text-[15px]">
              Demo scenarios
            </h3>
            <p className="text-caption text-[12px]">Test preset safety states</p>
          </div>
          <button
            id="btn-open-demo-sheet-link"
            onClick={() => setShowDemoSheet(true)}
            className="text-[13px] font-medium text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Open scenarios
            <ChevronRight className="w-3.5 h-3.5 stroke-[1.75]" />
          </button>
        </div>

        {/* Switch "Show demo tools" */}
        <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between">
          <div>
            <span className="text-[13px] font-medium text-[var(--text)] block">
              {t.showDemoTools || 'Show demo tools'}
            </span>
            <span className="text-caption text-[12px] block">
              Floating demo bar above bottom navigation
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="switch-show-demo-tools"
              checked={profile.showDemoTools !== false}
              onChange={(e) => updateProfile({ showDemoTools: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--surface-2)] border border-[var(--line)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--safe)]" />
          </label>
        </div>
      </div>

      {/* Data & Privacy Actions */}
      <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-2.5">
        <h3 className="card-title text-[15px]">Data & Privacy</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportData}
            className="soft-btn soft-btn-secondary text-[12px]"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 stroke-[1.75]" />
            Export backup
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="soft-btn soft-btn-secondary text-[12px] text-[var(--sos)]"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 stroke-[1.75]" />
            Reset all data
          </button>
        </div>
      </div>

      {/* ADD CONTACT MODAL */}
      {showAddContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAddContact}
            className="soft-card w-full max-w-sm p-5 space-y-4 bg-[var(--surface)] border border-[var(--line)]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <h3 className="section-title text-[18px]">Add trusted contact</h3>
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className="p-1 rounded-full text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>

            <div>
              <label className="text-[12px] font-medium text-[var(--text)] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="soft-input w-full text-[13px]"
              />
            </div>

            <div>
              <label className="text-[12px] font-medium text-[var(--text)] block mb-1">Relationship</label>
              <select
                value={cRelation}
                onChange={(e) => setCRelation(e.target.value)}
                className="soft-input w-full text-[13px] cursor-pointer"
              >
                <option value="Sister">Sister</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Brother">Brother</option>
                <option value="Friend">Friend</option>
                <option value="Colleague">Colleague</option>
                <option value="Neighbor">Neighbor</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-medium text-[var(--text)] block mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={cPhone}
                onChange={(e) => setCPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="soft-input w-full text-[13px]"
              />
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className="soft-btn soft-btn-secondary text-[13px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="soft-btn soft-btn-primary text-[13px]"
              >
                Save contact
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DEMO SCENARIOS SHEET MODAL (28px top corner radius for sheets) */}
      {showDemoSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--surface)] border-t border-[var(--line)] rounded-t-[28px] p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <div>
                <h3 className="section-title text-[18px]">Demo Scenarios</h3>
                <p className="text-caption text-[12px]">Load preset test data</p>
              </div>
              <button
                onClick={() => setShowDemoSheet(false)}
                className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>

            <div className="space-y-2">
              {demoScenarios.map((scenario, index) => (
                <div
                  key={scenario.id}
                  className="p-3.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--surface)] text-[var(--text)] text-[11px] font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <h4 className="text-[14px] font-medium text-[var(--text)] truncate">
                        {scenario.title}
                      </h4>
                    </div>
                    <p className="text-caption text-[12px] mt-1 line-clamp-2">
                      {scenario.summary}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      loadDemoScenario(scenario.id);
                      setShowDemoSheet(false);
                      setCurrentPage('home');
                    }}
                    className="h-8 px-3.5 rounded-full bg-[var(--surface)] text-[var(--text)] border border-[var(--line)] text-[12px] font-medium shrink-0 flex items-center hover:bg-[var(--surface-2)] transition cursor-pointer"
                  >
                    <Play className="w-3 h-3 mr-1 fill-current" />
                    Load
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="soft-card w-full max-w-sm p-5 space-y-4 bg-[var(--surface)] border border-[var(--line)]">
            <h3 className="section-title text-[18px] text-[var(--sos)]">Reset all data?</h3>
            <p className="text-caption text-[13px]">
              This will restore all contacts, safety plans, and incident records to original defaults.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="soft-btn soft-btn-secondary text-[13px]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setShowDeleteConfirm(false);
                }}
                className="soft-btn soft-btn-sos text-[13px]"
              >
                Confirm reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="soft-card w-full max-w-sm p-5 space-y-4 bg-[var(--surface)] border border-[var(--line)]">
            <div className="flex items-center gap-2 text-[var(--primary)]">
              <LogOut className="w-5 h-5" />
              <h3 className="section-title text-[18px]">{t.btnLogoutConfirmTitle || 'Log out of Abhaya?'}</h3>
            </div>
            <p className="text-caption text-[13px] leading-relaxed">
              {t.btnLogoutConfirmDesc || 'You can sign back in at any time with your phone or email. Your local records remain on this phone.'}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface)] cursor-pointer"
              >
                {t.btnCancel || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowLogoutConfirm(false);
                  await signOut();
                }}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] text-xs font-semibold hover:opacity-95 cursor-pointer"
              >
                {t.btnLogout || 'Log out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE COMMUNITY DATA MODAL */}
      {showDeleteCommunityConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="soft-card w-full max-w-sm p-5 space-y-4 bg-[var(--surface)] border border-[var(--line)]">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="section-title text-[18px]">{t.btnDeleteCommunityData || 'Delete community data'}</h3>
            </div>
            <p className="text-caption text-[13px] leading-relaxed">
              {t.btnDeleteCommunityDataDesc || 'Removes your public profile and alias from the server. Offline records remain intact.'}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteCommunityConfirm(false)}
                disabled={isDeletingCommunity}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface)] cursor-pointer"
              >
                {t.btnCancel || 'Cancel'}
              </button>
              <button
                type="button"
                disabled={isDeletingCommunity}
                onClick={async () => {
                  setIsDeletingCommunity(true);
                  await deleteCommunityData();
                  setIsDeletingCommunity(false);
                  setShowDeleteCommunityConfirm(false);
                }}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer disabled:opacity-50"
              >
                {isDeletingCommunity ? 'Deleting...' : (t.btnConfirmDelete || 'Delete data')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Trigger Setup Modal */}
      {isModalOpen && <DiscreetVoiceModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
