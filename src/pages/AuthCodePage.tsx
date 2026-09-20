import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { maskContact, DEMO_OTP } from '../services/supabase';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AuthCodePageProps {
  onChangeTarget: () => void;
  onSuccess: (onboarded: boolean) => void;
}

export const AuthCodePage: React.FC<AuthCodePageProps> = ({ onChangeTarget, onSuccess }) => {
  const { t } = useTranslation();
  const { authTarget, verifyOtp, sendOtp } = useAuth();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(60);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second Resend Timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // 60-second Cooldown Timer after 5 failed attempts
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const maskedDestination = authTarget
    ? maskContact(authTarget.value, authTarget.type)
    : '';

  const submitOtp = async (code: string) => {
    if (cooldownRemaining > 0) {
      setErrorMessage(`Too many incorrect attempts. Please wait ${cooldownRemaining}s before trying again.`);
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    const result = await verifyOtp(code);
    setIsVerifying(false);

    if (result.success) {
      onSuccess(Boolean(result.onboarded));
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        setCooldownRemaining(60);
        setErrorMessage('Too many incorrect attempts. For your security, please wait 60 seconds before trying again.');
      } else {
        const errorText = result.error?.toLowerCase() || '';
        if (errorText.includes('expired')) {
          setErrorMessage(t.expiredCodeError);
        } else {
          setErrorMessage(t.wrongCodeError);
        }
      }

      // Reset digits and focus first box
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleChange = (index: number, val: string) => {
    if (cooldownRemaining > 0) return;
    const clean = val.replace(/\D/g, '');

    // Handle single digit input
    const newDigits = [...digits];
    newDigits[index] = clean.slice(-1);
    setDigits(newDigits);
    setErrorMessage(null);

    // Auto advance
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if 6 digits complete
    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      submitOtp(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (cooldownRemaining > 0) return;

    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    setErrorMessage(null);

    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
      submitOtp(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || isVerifying || !authTarget) return;

    setErrorMessage(null);
    setResendCountdown(60);
    const res = await sendOtp(authTarget.type, authTarget.value);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to resend code. Please try again.');
    }
  };

  const isComplete = digits.join('').length === 6;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg)] text-[var(--text)] px-4 py-6 max-w-md mx-auto">
      {/* Top Bar: Back / Change Target */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={onChangeTarget}
          className="min-h-[44px] px-2.5 py-2 -ml-2 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-[var(--text)] flex items-center gap-1.5 transition-colors cursor-pointer"
          aria-label="Back to welcome screen"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.btnChangeTarget}</span>
        </button>
      </div>

      {/* Main Form Container */}
      <div className="w-full my-auto py-6 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            {t.codeScreenTitle}
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
            {t.codeSentTo}{' '}
            <strong className="text-[var(--text)] font-mono">{maskedDestination}</strong>
          </p>
        </div>

        {/* 6 Digit Input Boxes */}
        <div
          className="flex justify-between gap-2 sm:gap-2.5 mb-6"
          onPaste={handlePaste}
          role="group"
          aria-label="6-digit verification code"
        >
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={el => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete={idx === 0 ? 'one-time-code' : 'off'}
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              disabled={isVerifying || cooldownRemaining > 0}
              onChange={e => handleChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl border bg-[var(--surface-2)] text-[var(--text)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
                digit ? 'border-[var(--primary)] bg-[var(--surface)] shadow-xs' : 'border-[var(--line)]'
              } ${cooldownRemaining > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={`Digit ${idx + 1} of 6`}
            />
          ))}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="flex items-start gap-2 p-3.5 mb-5 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={() => submitOtp(digits.join(''))}
          disabled={!isComplete || isVerifying || cooldownRemaining > 0}
          className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] font-semibold text-sm flex items-center justify-center gap-2 shadow-xs hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying code...</span>
            </>
          ) : (
            <span>Verify & Continue</span>
          )}
        </button>

        {/* Resend & Cooldown Info */}
        <div className="mt-5 text-center text-xs text-[var(--muted)]">
          {cooldownRemaining > 0 ? (
            <p className="font-semibold text-red-500">
              Cooldown active: retry in {cooldownRemaining}s
            </p>
          ) : resendCountdown > 0 ? (
            <p>
              {t.resendIn}{' '}
              <span className="font-mono font-semibold text-[var(--text)]">
                {resendCountdown}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isVerifying}
              className="inline-flex items-center gap-1.5 font-semibold text-[var(--primary)] hover:underline cursor-pointer min-h-[40px] px-3 py-1.5 rounded-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.btnResend}</span>
            </button>
          )}
        </div>
      </div>

      {/* Security notice */}
      <div className="w-full text-center text-[11px] text-[var(--muted)] pb-2">
        <p>Your session will be encrypted and saved securely.</p>
      </div>
    </div>
  );
};
