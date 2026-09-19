import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import {
  Shield,
  Lock,
  Users,
  MapPin,
  Bell,
  CheckCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { AbhayaLogo } from '../components/common/AbhayaLogo';

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
      name: name.trim() || 'User',
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
        notes: 'Added during setup'
      });
    }

    setCurrentPage('home');
  };

  const handleSkip = () => {
    updateProfile({ isOnboarded: true });
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between py-6 px-4">
      {/* Progress Bar */}
      <div className="w-full max-w-sm mx-auto mb-6">
        <div className="flex items-center justify-between text-[12px] text-[var(--muted)] mb-2">
          <span>Step {step} of {totalSteps}</span>
          <button
            onClick={handleSkip}
            className="text-[var(--primary)] hover:underline font-medium cursor-pointer"
          >
            Skip for now
          </button>
        </div>
        <div className="h-1.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Screen Content */}
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center space-y-5">
        {step === 1 && (
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center">
              <AbhayaLogo size={56} />
            </div>
            <h2 className="text-[26px] font-heading font-semibold text-[var(--text)]">Welcome to Abhaya</h2>
            <p className="text-[14px] text-[var(--muted)] leading-relaxed">
              You're not alone. Personal safety, early risk detection, and discreet emergency response.
            </p>
            <div className="bg-[var(--surface)] p-4 rounded-[12px] border border-[var(--line)] text-[13px] text-[var(--muted)] text-left space-y-2">
              <p className="font-medium text-[var(--text)]">Core principles:</p>
              <p>• Focuses on early risk detection before situations escalate.</p>
              <p>• Connects with your trusted contacts and official 112 emergency services.</p>
              <p>• Full privacy: everything stays on your phone unless you trigger help.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-[22px] font-heading font-semibold text-[var(--text)]">What Abhaya Does</h2>
            <div className="space-y-2.5 text-[13px]">
              <div className="p-3.5 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-1">
                <span className="font-medium text-[var(--text)] block">1. Early Risk Assessment</span>
                <p className="text-caption text-[12px]">Check patterns of stalking, coercion, harassment, or unsafe routes.</p>
              </div>
              <div className="p-3.5 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-1">
                <span className="font-medium text-[var(--text)] block">2. Safety Check-Ins</span>
                <p className="text-caption text-[12px]">Countdown timers for commutes that notify trusted contacts if unconfirmed.</p>
              </div>
              <div className="p-3.5 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] space-y-1">
                <span className="font-medium text-[var(--text)] block">3. Your Private Record</span>
                <p className="text-caption text-[12px]">Stores screenshots and notes with digital fingerprints so they cannot be altered.</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-[22px] font-heading font-semibold text-[var(--text)]">Privacy & Principles</h2>
            <div className="space-y-3 text-[13px] bg-[var(--surface)] p-4 rounded-[12px] border border-[var(--line)] leading-relaxed">
              <p>
                <strong>No Continuous Tracking:</strong> Abhaya never tracks your live location in the background. GPS is queried only when you actively trigger SOS or a check-in.
              </p>
              <div className="p-2.5 rounded-[8px] bg-[var(--surface-2)] text-[12px] text-[var(--muted)]">
                <p className="font-medium text-[var(--text)] mb-0.5">
                  Observational Safety Guidance
                </p>
                <p>
                  Assessments generated by Abhaya are observational safety indicators, not legal verdicts or medical advice. Abhaya does not replace official emergency services (112 / 181).
                </p>
              </div>
              <p className="text-[12px] text-[var(--muted)]">
                <strong>Discreet Quick Hide:</strong> Tap the lock or disguise icon to immediately replace this view with a neutral screen if someone walks into the room.
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-[22px] font-heading font-semibold text-[var(--text)]">Set Up Profile</h2>
            <p className="text-caption text-[13px]">
              Provide a name. This name is included in alerts sent to your trusted circle.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-[var(--text)] mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya"
                  className="soft-input w-full text-[13px]"
                />
              </div>
              <div className="rounded-[8px] bg-[var(--surface-2)] p-3 text-[12px] text-[var(--muted)]">
                Data is stored locally on this phone. No personal details are public.
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-[22px] font-heading font-semibold text-[var(--text)]">Add Trusted Contact</h2>
            <p className="text-caption text-[13px]">
              Who should be notified if you trigger SOS or miss a safety check-in?
            </p>
            <div className="space-y-3 text-[13px]">
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Pooja (Sister)"
                  className="soft-input w-full text-[13px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[var(--text)] mb-1">Relationship</label>
                  <select
                    value={contactRelation}
                    onChange={(e) => setContactRelation(e.target.value)}
                    className="soft-input w-full text-[13px] cursor-pointer"
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
                  <label className="block font-medium text-[var(--text)] mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98..."
                    className="soft-input w-full text-[13px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-[22px] font-heading font-semibold text-[var(--text)]">Safe Places (Optional)</h2>
            <p className="text-caption text-[13px]">
              Add a trusted place (home, hostel, or office) where you can take shelter.
            </p>
            <div className="space-y-3 text-[13px]">
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Place Name</label>
                <input
                  type="text"
                  value={safePlaceName}
                  onChange={(e) => setSafePlaceName(e.target.value)}
                  placeholder="e.g. University Hostel / Office"
                  className="soft-input w-full text-[13px]"
                />
              </div>
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Address / Landmark</label>
                <input
                  type="text"
                  value={safePlaceAddress}
                  onChange={(e) => setSafePlaceAddress(e.target.value)}
                  placeholder="e.g. Near Indiranagar Metro Station"
                  className="soft-input w-full text-[13px]"
                />
              </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-[22px] font-heading font-semibold text-[var(--text)]">Emergency Preferences</h2>
            <div className="space-y-3 text-[13px]">
              <label className="flex items-start gap-3 p-3.5 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnSOS}
                  onChange={(e) => setNotifyOnSOS(e.target.checked)}
                  className="mt-0.5 rounded"
                />
                <div>
                  <span className="font-medium text-[var(--text)] block">Instant Trusted Contact SMS</span>
                  <span className="text-caption text-[12px]">Send simulated emergency coordinates to configured priority contacts upon SOS activation.</span>
                </div>
              </label>
              <div className="p-3 rounded-[8px] bg-[var(--surface-2)] text-[12px] text-[var(--muted)]">
                You can change these preferences anytime from Profile settings.
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
            className="soft-btn soft-btn-secondary text-[13px] px-4"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < totalSteps ? (
          <button
            onClick={() => setStep(prev => prev + 1)}
            className="soft-btn soft-btn-primary flex-1 text-[13px]"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4 ml-1 stroke-[1.75]" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="soft-btn soft-btn-primary flex-1 text-[13px]"
          >
            <span>Enter Abhaya</span>
            <CheckCircle className="w-4 h-4 ml-1 stroke-[1.75]" />
          </button>
        )}
      </div>
    </div>
  );
};
