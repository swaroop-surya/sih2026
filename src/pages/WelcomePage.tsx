import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { AbhayaLogo } from '../components/common/AbhayaLogo';
import { DEMO_PHONE, DEMO_OTP, validateIndianPhone, validateEmail } from '../services/supabase';
import { PhoneCall, Shield, Sparkles, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

interface WelcomePageProps {
  onCodeSent: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onCodeSent }) => {
  const { t } = useTranslation();
  const { sendOtp } = useAuth();

  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDemoBox, setShowDemoBox] = useState(false);

  // Phone validation
  const cleanPhone = phoneNumber.replace(/\D/g, '').slice(0, 10);
  const isPhoneValid = validateIndianPhone(cleanPhone);

  // Email validation
  const cleanEmail = emailAddress.trim().toLowerCase();
  const isEmailValid = validateEmail(cleanEmail);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(val);
    if (errorMessage) setErrorMessage(null);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddress(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (activeTab === 'phone') {
      if (!isPhoneValid) {
        setErrorMessage('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
        return;
      }
      setIsSubmitting(true);
      setErrorMessage(null);
      const res = await sendOtp('phone', cleanPhone);
      setIsSubmitting(false);
      if (res.success) {
        onCodeSent();
      } else {
        setErrorMessage(res.error || 'Failed to send OTP. Please try again.');
      }
    } else {
      if (!isEmailValid) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      setIsSubmitting(true);
      setErrorMessage(null);
      const res = await sendOtp('email', cleanEmail);
      setIsSubmitting(false);
      if (res.success) {
        onCodeSent();
      } else {
        setErrorMessage(res.error || 'Failed to send verification code. Please try again.');
      }
    }
  };

  const handleFillDemo = async () => {
    setActiveTab('phone');
    setPhoneNumber(DEMO_PHONE);
    setErrorMessage(null);
    setIsSubmitting(true);
    const res = await sendOtp('phone', DEMO_PHONE);
    setIsSubmitting(false);
    if (res.success) {
      onCodeSent();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg)] text-[var(--text)] px-4 py-8 max-w-md mx-auto">
      {/* Top Section: Logo, Wordmark & Tagline */}
      <div className="w-full flex flex-col items-center text-center pt-4">
        <div className="w-20 h-20 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] shadow-sm flex items-center justify-center mb-4 transition-transform hover:scale-105">
          <AbhayaLogo className="w-12 h-12 text-[var(--primary)]" strokeWidth={2.4} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">Abhaya</h1>
        <p className="text-base font-medium text-[var(--muted)] mt-1.5">{t.welcomeTagline}</p>
      </div>

      {/* Center Section: Segmented Auth Form */}
      <div className="w-full my-6 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-sm">
        {/* Segmented Control Phone | Email */}
        <div
          role="tablist"
          aria-label="Sign in method"
          className="flex bg-[var(--surface-2)] p-1 rounded-xl mb-5 border border-[var(--line)]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'phone'}
            onClick={() => {
              setActiveTab('phone');
              setErrorMessage(null);
            }}
            className={`flex-1 min-h-[44px] text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'phone'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {t.welcomeTabPhone}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'email'}
            onClick={() => {
              setActiveTab('email');
              setErrorMessage(null);
            }}
            className={`flex-1 min-h-[44px] text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {t.welcomeTabEmail}
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSendOtp} className="space-y-4">
          {activeTab === 'phone' ? (
            <div>
              <label htmlFor="phone-input" className="block text-xs font-semibold text-[var(--muted)] mb-1.5">
                {t.phoneLabel}
              </label>
              <div className="flex items-center rounded-xl border border-[var(--line)] bg-[var(--surface-2)] focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:border-transparent transition-all overflow-hidden">
                <span className="px-3.5 py-3 text-sm font-bold text-[var(--text)] bg-[var(--surface)] border-r border-[var(--line)] select-none">
                  +91
                </span>
                <input
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  pattern="[0-9]*"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder={t.phonePlaceholder}
                  className="w-full px-3.5 py-3 text-base font-semibold text-[var(--text)] bg-transparent placeholder:text-[var(--muted)] focus:outline-none min-h-[48px]"
                  aria-label="10-digit mobile number"
                  maxLength={10}
                />
              </div>
              <p className="text-[11px] text-[var(--muted)] mt-1.5">{t.phoneHint}</p>
            </div>
          ) : (
            <div>
              <label htmlFor="email-input" className="block text-xs font-semibold text-[var(--muted)] mb-1.5">
                {t.emailLabel}
              </label>
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:border-transparent transition-all overflow-hidden">
                <input
                  id="email-input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={emailAddress}
                  onChange={handleEmailChange}
                  placeholder={t.emailPlaceholder}
                  className="w-full px-3.5 py-3 text-base font-semibold text-[var(--text)] bg-transparent placeholder:text-[var(--muted)] focus:outline-none min-h-[48px]"
                  aria-label="Email address"
                />
              </div>
              <p className="text-[11px] text-[var(--muted)] mt-1.5">{t.emailHint}</p>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-2 p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (activeTab === 'phone' ? cleanPhone.length !== 10 : !cleanEmail)}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] font-semibold text-sm flex items-center justify-center gap-2 shadow-xs hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.btnSending}</span>
              </>
            ) : (
              <>
                <span>{t.btnSendCode}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Login Link for Evaluators */}
        <div className="mt-4 pt-3 border-t border-[var(--line)] text-center">
          <button
            type="button"
            onClick={() => setShowDemoBox(!showDemoBox)}
            className="text-xs font-medium text-[var(--primary)] hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.evaluatorDemoLink}</span>
          </button>

          {showDemoBox && (
            <div className="mt-2.5 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">{t.evaluatorDemoPhone}:</span>
                <span className="font-mono font-semibold">+91 {DEMO_PHONE}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">{t.evaluatorDemoOtp}:</span>
                <span className="font-mono font-semibold">{DEMO_OTP}</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                disabled={isSubmitting}
                className="w-full min-h-[40px] mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] text-[var(--text)] border border-[var(--line)] font-medium text-xs hover:bg-[var(--surface-2)] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>{t.btnFillDemo}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Permanent "Need help now?" Row */}
      <div className="w-full rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-[var(--sos)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
            {t.needHelpNow}
          </span>
          <span className="text-[11px] text-[var(--muted)] ml-auto font-medium">Free 24x7</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* 112 National Police */}
          <a
            href="tel:112"
            className="flex flex-col items-center justify-center p-2.5 min-h-[48px] rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/15 active:scale-95 transition-all"
            aria-label="Call 112 National Police Emergency"
          >
            <PhoneCall className="w-4 h-4 mb-1 text-[var(--sos)]" />
            <span className="text-xs font-bold leading-tight">112</span>
            <span className="text-[10px] text-[var(--muted)] leading-tight">Police</span>
          </a>

          {/* 181 Women's Helpline */}
          <a
            href="tel:181"
            className="flex flex-col items-center justify-center p-2.5 min-h-[48px] rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 hover:bg-purple-500/15 active:scale-95 transition-all"
            aria-label="Call 181 Women Helpline"
          >
            <PhoneCall className="w-4 h-4 mb-1 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold leading-tight">181</span>
            <span className="text-[10px] text-[var(--muted)] leading-tight">Women</span>
          </a>

          {/* 1930 Cybercrime Helpline */}
          <a
            href="tel:1930"
            className="flex flex-col items-center justify-center p-2.5 min-h-[48px] rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500/15 active:scale-95 transition-all"
            aria-label="Call 1930 Cyber Helpline"
          >
            <PhoneCall className="w-4 h-4 mb-1 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold leading-tight">1930</span>
            <span className="text-[10px] text-[var(--muted)] leading-tight">Cyber</span>
          </a>
        </div>
      </div>
    </div>
  );
};
