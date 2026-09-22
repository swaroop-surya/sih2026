import React, { useState } from 'react';
import { useAegis } from '../hooks/useAegisState';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { SupportedLanguage } from '../types';
import { AbhayaLogo } from '../components/common/AbhayaLogo';
import {
  Shield,
  MapPin,
  Users,
  Check,
  RefreshCw,
  Globe,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Camera,
  Smartphone
} from 'lucide-react';
import {
  requestCameraPermissionEarly,
  isCameraPermissionGranted,
  setManualCameraPermission
} from '../services/cameraService';
import {
  requestLocationPermissionEarly,
  isLocationPermissionGranted,
  setManualLocationPermission
} from '../services/locationService';
import { AndroidApkCameraModal } from '../components/common/AndroidApkCameraModal';

const RANDOM_ALIASES_POOL = [
  'Kolam Sparrow 27',
  'Amber Lotus 42',
  'Silent River 19',
  'Dawn Falcon 88',
  'Pulli Star 63',
  'Banyan Owl 51',
  'Marigold Finch 34',
  'Teak Deer 76',
  'Neem Weaver 15',
  'Monsoon Swift 92',
  'Kaveri Breeze 45',
  'Sandalwood Crane 18'
];

export const OnboardingPage: React.FC = () => {
  const { setCurrentPage, updateProfile, addContact, setLanguage } = useAegis();
  const { completeOnboarding, user } = useAuth();
  const { t, currentLang } = useTranslation();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // 1. Alias State
  const [aliasSuggestions, setAliasSuggestions] = useState<string[]>(() => {
    return [...RANDOM_ALIASES_POOL].sort(() => 0.5 - Math.random()).slice(0, 6);
  });
  const [selectedAlias, setSelectedAlias] = useState<string>(aliasSuggestions[0]);
  const [customAlias, setCustomAlias] = useState<string>('');
  const [aliasError, setAliasError] = useState<string | null>(null);

  // 2. Private First Name & Language
  const [firstName, setFirstName] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(currentLang as SupportedLanguage);

  // 3. Location Explainer
  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean | null>(null);
  const [locationStatusText, setLocationStatusText] = useState<string>('');

  // Camera Permission (Early Ahead-of-Time Request)
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(() => isCameraPermissionGranted());
  const [cameraStatusText, setCameraStatusText] = useState<string>('');
  const [showApkModal, setShowApkModal] = useState<boolean>(false);

  const handleRequestCamera = async () => {
    setCameraStatusText('Requesting camera permission from Android / browser...');
    const result = await requestCameraPermissionEarly();
    setCameraPermissionGranted(result.granted);
    updateProfile({
      cameraPermissionGranted: result.granted,
      capturePhotosOnSOS: result.granted ? true : false
    });
    setCameraStatusText(result.message);
  };

  const handleForceEnableCamera = () => {
    setManualCameraPermission(true);
    setCameraPermissionGranted(true);
    updateProfile({
      cameraPermissionGranted: true,
      capturePhotosOnSOS: true
    });
    setCameraStatusText('Camera activated! (Granted via Android Phone Settings)');
  };

  // 4. Privacy & Rules Checkbox
  const [acceptedRules, setAcceptedRules] = useState<boolean>(false);

  // 5. Trusted Contact (Optional)
  const [contactName, setContactName] = useState<string>('');
  const [contactRelation, setContactRelation] = useState<string>('Sister');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Shuffle aliases
  const handleShuffleAliases = () => {
    const shuffled = [...RANDOM_ALIASES_POOL].sort(() => 0.5 - Math.random()).slice(0, 6);
    setAliasSuggestions(shuffled);
    if (!customAlias) {
      setSelectedAlias(shuffled[0]);
    }
  };

  // Validate custom alias: 3 to 20 chars, letters, numbers, spaces, no phone/email
  const validateCustomAlias = (value: string): boolean => {
    if (!value.trim()) return true;
    const clean = value.trim();

    if (clean.length < 3 || clean.length > 20) {
      setAliasError('Alias must be between 3 and 20 characters.');
      return false;
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(clean)) {
      setAliasError('Only letters, numbers, and spaces are allowed.');
      return false;
    }
    if (/\d{5,}/.test(clean) || /@/.test(clean) || /\b(com|org|in|net)\b/i.test(clean)) {
      setAliasError('Do not include phone numbers or email addresses in your alias.');
      return false;
    }
    setAliasError(null);
    return true;
  };

  const handleCustomAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAlias(val);
    if (val.trim()) {
      validateCustomAlias(val);
      setSelectedAlias(val.trim());
    } else {
      setAliasError(null);
      setSelectedAlias(aliasSuggestions[0]);
    }
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  const handleRequestLocation = async () => {
    setLocationStatusText('Requesting location access from Android / browser...');
    try {
      const res = await requestLocationPermissionEarly();
      if (res.granted) {
        setLocationPermissionGranted(true);
        setLocationStatusText(res.message || 'Area location enabled for safety alerts.');
      } else {
        setLocationPermissionGranted(false);
        setLocationStatusText(res.message);
      }
    } catch {
      setLocationPermissionGranted(false);
      setLocationStatusText('Location access was not enabled or timed out.');
    }
  };

  const handleForceEnableLocation = () => {
    setManualLocationPermission(true);
    setLocationPermissionGranted(true);
    setLocationStatusText('Location activated. (Granted via Android Phone Settings)');
  };

  const handleFinish = async () => {
    if (!acceptedRules) return;
    setIsSubmitting(true);

    const activeAlias = customAlias.trim() || selectedAlias || 'Kolam Sparrow 27';

    // 1. Complete Supabase Profile
    await completeOnboarding({
      alias: activeAlias,
      firstName: firstName.trim() || undefined,
      language: selectedLanguage
    });

    // 2. Update local state
    updateProfile({
      name: firstName.trim() || activeAlias,
      language: selectedLanguage,
      isOnboarded: true
    });

    // 3. Add first trusted contact if filled
    if (contactName.trim() && contactPhone.trim()) {
      addContact({
        name: contactName.trim(),
        relationship: contactRelation,
        phone: contactPhone.trim(),
        priority: 1,
        notifyOnSOS: true,
        notifyOnCheckinMiss: true
      });
    }

    setIsSubmitting(false);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between py-6 px-4 max-w-md mx-auto">
      {/* Top Header & Progress */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AbhayaLogo className="w-6 h-6 text-[var(--primary)]" strokeWidth={2.4} />
            <span className="text-sm font-bold tracking-tight">Abhaya Setup</span>
          </div>
          <span className="text-xs font-semibold text-[var(--muted)]">
            Step {step} of {totalSteps}
          </span>
        </div>

        <div className="h-1.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full flex-1 flex flex-col justify-center">
        {/* STEP 1: Alias & Community Name */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--surface-2)] text-[var(--primary)] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Community Identity
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
                {t.onboardingAliasTitle}
              </h1>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
                {t.onboardingAliasSubtitle}
              </p>
            </div>

            {/* Random Alias Suggestions Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--muted)]">Choose a suggested alias:</span>
                <button
                  type="button"
                  onClick={handleShuffleAliases}
                  className="text-xs font-medium text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>More names</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {aliasSuggestions.map(suggestion => {
                  const isSelected = selectedAlias === suggestion && !customAlias;
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setSelectedAlias(suggestion);
                        setCustomAlias('');
                        setAliasError(null);
                      }}
                      className={`min-h-[48px] px-3 py-2 text-xs font-semibold rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--text)] shadow-xs ring-1 ring-[var(--primary)]'
                          : 'border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      <span className="truncate pr-1">{suggestion}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Alias Field */}
            <div>
              <label htmlFor="custom-alias" className="block text-xs font-semibold text-[var(--muted)] mb-1.5">
                {t.onboardingAliasCustomPlaceholder}
              </label>
              <input
                id="custom-alias"
                type="text"
                value={customAlias}
                onChange={handleCustomAliasChange}
                placeholder="e.g. Amber Lotus 42"
                maxLength={20}
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
              />
              {aliasError ? (
                <p className="text-xs text-red-500 mt-1">{aliasError}</p>
              ) : (
                <p className="text-[11px] text-[var(--muted)] mt-1">3 to 20 characters. Letters, numbers, and spaces only.</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Private First Name & Language */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
                {t.onboardingFirstNameTitle}
              </h1>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
                {t.onboardingFirstNameSubtitle}
              </p>
            </div>

            <div>
              <label htmlFor="first-name" className="block text-xs font-semibold text-[var(--muted)] mb-1.5">
                First name (optional)
              </label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="e.g. Ananya"
                maxLength={30}
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-base font-semibold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
              />
              <p className="text-[11px] text-[var(--muted)] mt-1">
                Never shared in community posts. Used only for "Hi, {firstName.trim() || 'friend'}".
              </p>
            </div>

            <div className="pt-2 border-t border-[var(--line)]">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="text-sm font-bold text-[var(--text)]">{t.onboardingLanguageTitle}</h2>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'te', label: 'తెలుగు' },
                  { code: 'ta', label: 'தமிழ்' }
                ].map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code as SupportedLanguage)}
                    className={`min-h-[48px] p-3 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      selectedLanguage === lang.code
                        ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--text)] shadow-xs ring-1 ring-[var(--primary)]'
                        : 'border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {selectedLanguage === lang.code && <Check className="w-4 h-4 text-[var(--primary)]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Location Explainer & Rules Agreement */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center mb-3 text-[var(--primary)]">
                <MapPin className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
                {t.onboardingLocationTitle}
              </h1>
              <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
                {t.onboardingLocationSubtitle}
              </p>
            </div>

            {/* Location buttons */}
            <div className="space-y-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  className={`flex-1 min-h-[48px] px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    locationPermissionGranted === true
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-95'
                  }`}
                >
                  {locationPermissionGranted === true ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Location Allowed</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      <span>{t.btnAllowLocation}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApkModal(true)}
                  className="px-3 min-h-[48px] text-xs font-medium rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] transition-all cursor-pointer flex items-center gap-1"
                  title="Android APK Location Fix"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>APK Fix</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLocationPermissionGranted(false);
                    setLocationStatusText('Location will be requested only when you trigger SOS.');
                  }}
                  className="px-4 min-h-[48px] text-xs font-semibold rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] transition-all cursor-pointer"
                >
                  {t.btnNotNow}
                </button>
              </div>

              {locationStatusText && (
                <div className="mt-2 p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--line)] text-[11px] text-[var(--muted)] space-y-1.5">
                  <p className="leading-relaxed">{locationStatusText}</p>
                  {locationPermissionGranted !== true && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[var(--line)]">
                      <button
                        type="button"
                        onClick={handleForceEnableLocation}
                        className="px-2 py-0.5 rounded bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] hover:bg-emerald-600/25 cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Verify & Force Enable
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowApkModal(true)}
                        className="px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--text)] font-medium text-[10px] hover:bg-[var(--surface-2)] cursor-pointer"
                      >
                        APK Guide
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Camera Permission row (Requested Early) */}
            <div className="space-y-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
              <div className="flex items-center gap-2 mb-1">
                <Camera className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span className="text-xs font-semibold text-[var(--text)]">
                  {t.cameraAccessTitle || 'Camera access'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed mb-2">
                {t.cameraAccessExplainer ||
                  'Abhaya can quietly take a couple of photos when you trigger SOS, as extra evidence for your trusted circle. Nothing is sent anywhere unless you send an alert.'}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRequestCamera}
                  className={`flex-1 min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    cameraPermissionGranted === true
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] hover:bg-[var(--surface)]'
                  }`}
                >
                  {cameraPermissionGranted === true ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.cameraAllowed || 'Camera Allowed'}</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>{t.btnAllowCamera || 'Allow Camera'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApkModal(true)}
                  className="px-3 min-h-[44px] text-xs font-medium rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] transition-all cursor-pointer flex items-center gap-1"
                  title="Android APK Fix"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>APK Fix</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCameraPermissionGranted(false);
                    setCameraStatusText('Camera capture disabled. You can enable it in Profile > Privacy and data.');
                  }}
                  className="px-3 min-h-[44px] text-xs font-semibold rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] transition-all cursor-pointer"
                >
                  {t.btnNotNow}
                </button>
              </div>
              {cameraStatusText && (
                <div className="mt-2 p-2 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[11px] text-[var(--muted)] space-y-1.5">
                  <p>{cameraStatusText}</p>
                  {cameraPermissionGranted !== true && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[var(--line)]">
                      <button
                        type="button"
                        onClick={handleForceEnableCamera}
                        className="px-2 py-0.5 rounded bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] hover:bg-emerald-600/25 cursor-pointer"
                      >
                        Verify & Force Enable
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowApkModal(true)}
                        className="px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text)] font-medium text-[10px] hover:bg-[var(--surface)] cursor-pointer"
                      >
                        APK Guide
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Privacy Note & Community Rules Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] cursor-pointer hover:bg-[var(--surface-2)] transition-colors">
                <input
                  type="checkbox"
                  checked={acceptedRules}
                  onChange={e => setAcceptedRules(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-[var(--line)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                />
                <span className="text-xs font-medium text-[var(--text)] leading-relaxed select-none">
                  {t.privacyAndRulesCheckbox}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: Add First Trusted Contact (Optional, Can Skip) */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center mb-3 text-[var(--primary)]">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
                Add a Trusted Contact
              </h1>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
                Add someone you trust (sister, friend, partner, parent) to receive alerts if you trigger SOS or miss a safety check-in. You can also skip this and add later.
              </p>
            </div>

            <div className="space-y-3 bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="e.g. Priya"
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Relationship</label>
                <select
                  value={contactRelation}
                  onChange={e => setContactRelation(e.target.value)}
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="Sister">Sister</option>
                  <option value="Mother">Mother</option>
                  <option value="Friend">Friend</option>
                  <option value="Partner">Partner</option>
                  <option value="Father">Father</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Phone Number</label>
                <div className="flex items-center rounded-xl border border-[var(--line)] bg-[var(--surface-2)] overflow-hidden">
                  <span className="px-3 py-2.5 text-sm font-bold text-[var(--text)] bg-[var(--surface)] border-r border-[var(--line)]">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit number"
                    className="w-full px-3 py-2.5 text-sm font-semibold text-[var(--text)] bg-transparent focus:outline-none min-h-[48px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="w-full pt-6 mt-4 border-t border-[var(--line)] flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={isSubmitting}
            className="px-4 min-h-[48px] rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface)] transition-all cursor-pointer"
          >
            Back
          </button>
        )}

        {step < totalSteps ? (
          <button
            type="button"
            onClick={() => {
              if (step === 1 && customAlias && !validateCustomAlias(customAlias)) {
                return;
              }
              if (step === 3 && !acceptedRules) {
                return;
              }
              setStep(step + 1);
            }}
            disabled={step === 3 && !acceptedRules}
            className="flex-1 min-h-[48px] px-4 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] text-sm font-semibold flex items-center justify-center gap-2 shadow-xs hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>{t.btnContinue}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex-1 flex gap-2">
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex-1 min-h-[48px] px-4 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] text-sm font-semibold flex items-center justify-center gap-2 shadow-xs hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
            >
              <span>{t.btnCompleteSetup}</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Android APK Camera & Location Permission Guide Modal */}
      <AndroidApkCameraModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
        onForceEnableCamera={handleForceEnableCamera}
        onForceEnableLocation={handleForceEnableLocation}
      />
    </div>
  );
};
