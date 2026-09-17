import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import {
  Shield,
  Lock,
  Users,
  MapPin,
  Bell,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { setCurrentPage, updateProfile, addContact, addSafePlace } = useAegis();
  const [step, setStep] = useState(1);

  // Form state
  const [name, setName] = useState('Ananya');
  const [contactName, setContactName] = useState('');
  const [contactRelation, setContactRelation] = useState('Sister');
  const [contactPhone, setContactPhone] = useState('');
  const [safePlaceName, setSafePlaceName] = useState('');
  const [safePlaceAddress, setSafePlaceAddress] = useState('');
  const [notifyOnSOS, setNotifyOnSOS] = useState(true);

  const totalSteps = 7;

  const handleFinish = () => {
    updateProfile({
      name: name.trim() || 'Protected User',
      isOnboarded: true
    });

    if (contactName.trim() && contactPhone.trim()) {
      addContact({
        name: contactName.trim(),
        relationship: contactRelation,
        phone: contactPhone.trim(),
        email: '',
        priority: 1,
        notifyOnSOS: true,
        notifyOnCheckinMiss: true
      });
    }

    if (safePlaceName.trim() && safePlaceAddress.trim()) {
      addSafePlace({
        name: safePlaceName.trim(),
        type: 'OTHER',
        address: safePlaceAddress.trim(),
        notes: 'Added during onboarding'
      });
    }

    setCurrentPage('home');
  };

  const handleSkip = () => {
    updateProfile({ isOnboarded: true });
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-6 px-4">
      {/* Progress Bar */}
      <div className="w-full max-w-sm mx-auto mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Step {step} of {totalSteps}</span>
          <button
            onClick={handleSkip}
            className="text-sky-400 hover:underline font-medium"
          >
            Skip for now
          </button>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Screen Content */}
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center space-y-5">
        {step === 1 && (
          <div className="space-y-4 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shadow-xl">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Welcome to Aegis</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              A serious, mobile-first personal safety infrastructure platform designed for women’s protection, risk prevention, and discreet response.
            </p>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400 text-left space-y-1.5">
              <p className="font-semibold text-slate-200">What makes Aegis different:</p>
              <p>• Focuses on early risk detection before an incident escalates.</p>
              <p>• Coordinates with your trusted circle and connects to 112 emergency services.</p>
              <p>• Respects autonomy: consensual adult decisions are never penalized.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">What Aegis Does</h2>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-semibold text-sky-400">1. Early Risk Assessment</span>
                <p className="text-slate-400">Structured questionnaire detecting indicators of coercive control, stalking, blackmail, or exploitation.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-semibold text-emerald-400">2. Safety Check-Ins & Circle</span>
                <p className="text-slate-400">Automated countdown timers for commutes or meetings that notify your trusted circle if unconfirmed.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-semibold text-rose-400">3. Cryptographic Evidence Vault</span>
                <p className="text-slate-400">Stores screenshots and logs with client-side SHA-256 hashes to preserve timestamped integrity.</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Privacy & Principles</h2>
            <div className="space-y-3 text-xs text-slate-300 bg-slate-900 p-4 rounded-xl border border-slate-800 leading-relaxed">
              <p>
                <strong>No Continuous Surveillance:</strong> Aegis never tracks your live location without your explicit permission during an active check-in or SOS.
              </p>
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-200">
                <p className="font-semibold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Important Legal & Medical Disclaimer
                </p>
                <p className="text-[11px] text-amber-300/90 leading-normal">
                  Risk scores generated by Aegis are observational safety indicators, not legal verdicts or medical diagnoses. Aegis acts as a prevention layer and does not replace official emergency services like India's 112 or 181 Women Helpline.
                </p>
              </div>
              <p>
                <strong>Discreet Panic Protection:</strong> A one-tap Quick Exit instantly replaces this screen with a functional neutral weather app or note view if someone enters the room.
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Set Up Profile</h2>
            <p className="text-xs text-slate-400">
              Provide a name. This name is included in alerts sent to your trusted circle.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div className="rounded-xl bg-slate-900/60 p-3 border border-slate-800/80 text-[11px] text-slate-400">
                🔒 Data is stored in your private local encrypted container. No credentials or evidence are made public.
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Add Trusted Contact</h2>
            <p className="text-xs text-slate-400">
              Who should be notified if you trigger SOS or miss a safety check-in?
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Pooja (Sister)"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Relationship</label>
                  <select
                    value={contactRelation}
                    onChange={(e) => setContactRelation(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Sister">Sister</option>
                    <option value="Mother">Mother</option>
                    <option value="Friend">Friend</option>
                    <option value="Partner">Partner</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Advocate">Advocate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Safe Places (Optional)</h2>
            <p className="text-xs text-slate-400">
              Define a sanctuary place (home, hostel, or workplace) where you can take safe shelter.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Place Name</label>
                <input
                  type="text"
                  value={safePlaceName}
                  onChange={(e) => setSafePlaceName(e.target.value)}
                  placeholder="e.g. University Hostel / Office RMZ"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Address / Landmark</label>
                <input
                  type="text"
                  value={safePlaceAddress}
                  onChange={(e) => setSafePlaceAddress(e.target.value)}
                  placeholder="e.g. Near Indiranagar Metro Station"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Emergency Preferences</h2>
            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnSOS}
                  onChange={(e) => setNotifyOnSOS(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Instant Trusted Contact SMS</span>
                  <span className="text-slate-400">Send simulated emergency coordinates to configured priority contacts upon SOS activation.</span>
                </div>
              </label>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                You can change these preferences anytime from your Profile settings.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="w-full max-w-sm mx-auto pt-6 flex items-center justify-between gap-3">
        {step > 1 ? (
          <button
            onClick={() => setStep(prev => prev - 1)}
            className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < totalSteps ? (
          <button
            onClick={() => setStep(prev => prev + 1)}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition shadow-sm"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-sm"
          >
            <span>Enter Aegis Shield</span>
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
