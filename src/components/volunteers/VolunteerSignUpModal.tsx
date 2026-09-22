import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  HeartHandshake,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { VolunteerHelpType, VolunteerScheduleSlot } from '../../types/volunteer';
import { useVolunteers } from '../../context/VolunteerContext';
import { useNearby } from '../../context/NearbyContext';
import { VOLUNTEER_HELP_TYPES, VOLUNTEER_SCHEDULE_SLOTS } from '../../lib/volunteerUtils';

interface VolunteerSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerSignUpModal: React.FC<VolunteerSignUpModalProps> = ({ isOpen, onClose }) => {
  const {
    myVolunteerProfile,
    isMyVolunteerActive,
    upsertMyVolunteer,
    stopBeingVolunteer
  } = useVolunteers();

  const { activeRoomId, activeArea } = useNearby();

  // Form states
  const [selectedAreas, setSelectedAreas] = useState<string[]>([activeRoomId]);
  const [customAreaInput, setCustomAreaInput] = useState('');
  const [selectedHelpTypes, setSelectedHelpTypes] = useState<VolunteerHelpType[]>([
    'meet_walk',
    'accompany_call'
  ]);
  const [selectedSlots, setSelectedSlots] = useState<VolunteerScheduleSlot[]>([
    'weekday_evening',
    'weekend_evening'
  ]);
  const [note, setNote] = useState('');
  const [showPhone, setShowPhone] = useState(false);
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  // Initialize with existing volunteer data if available
  useEffect(() => {
    if (myVolunteerProfile) {
      setSelectedAreas(myVolunteerProfile.areas.length > 0 ? myVolunteerProfile.areas : [activeRoomId]);
      setSelectedHelpTypes(myVolunteerProfile.helpTypes);
      setSelectedSlots(myVolunteerProfile.availabilitySlots || []);
      setNote(myVolunteerProfile.note || '');
      setShowPhone(myVolunteerProfile.showPhone);
      setPhoneDisplay(myVolunteerProfile.phoneDisplay || '');
    } else {
      setSelectedAreas([activeRoomId]);
      setSelectedHelpTypes(['meet_walk', 'accompany_call']);
      setSelectedSlots(['weekday_evening', 'weekend_evening']);
      setNote('');
      setShowPhone(false);
      setPhoneDisplay('');
    }
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [myVolunteerProfile, activeRoomId, isOpen]);

  if (!isOpen) return null;

  const toggleHelpType = (type: VolunteerHelpType) => {
    if (selectedHelpTypes.includes(type)) {
      if (selectedHelpTypes.length === 1) {
        setErrorMsg('Please select at least one way you can help.');
        return;
      }
      setSelectedHelpTypes(selectedHelpTypes.filter((t) => t !== type));
    } else {
      setSelectedHelpTypes([...selectedHelpTypes, type]);
    }
    setErrorMsg(null);
  };

  const toggleSlot = (slot: VolunteerScheduleSlot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleAddArea = () => {
    const trimmed = customAreaInput.trim().toLowerCase();
    if (!trimmed) return;
    if (selectedAreas.includes(trimmed)) {
      setCustomAreaInput('');
      return;
    }
    if (selectedAreas.length >= 4) {
      setErrorMsg('You can register up to 4 nearby areas.');
      return;
    }
    setSelectedAreas([...selectedAreas, trimmed]);
    setCustomAreaInput('');
    setErrorMsg(null);
  };

  const handleRemoveArea = (area: string) => {
    if (selectedAreas.length <= 1) {
      setErrorMsg('At least one area must remain selected.');
      return;
    }
    setSelectedAreas(selectedAreas.filter((a) => a !== area));
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (selectedHelpTypes.length === 0) {
      setErrorMsg('Please select at least one help category.');
      return;
    }

    if (showPhone && !phoneDisplay.trim()) {
      setErrorMsg('Please provide a contact phone number or choose in-app messaging.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await upsertMyVolunteer({
        areas: selectedAreas,
        helpTypes: selectedHelpTypes,
        note: note.trim(),
        showPhone,
        phoneDisplay: showPhone ? phoneDisplay.trim() : undefined,
        availabilitySlots: selectedSlots
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to save volunteer settings.');
      } else {
        setSuccessMsg('Your volunteer profile has been updated!');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStop = async () => {
    setIsSubmitting(true);
    try {
      const res = await stopBeingVolunteer();
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to remove volunteer listing.');
      } else {
        setShowStopConfirm(false);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="volunteer-signup-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="w-full max-w-lg bg-[var(--surface)] border-t sm:border border-[var(--line)] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[var(--primary)]" />
            <h2 id="volunteer-signup-title" className="font-heading font-bold text-base text-[var(--text)]">
              {isMyVolunteerActive ? 'Volunteer Settings' : 'Become a Community Volunteer'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition cursor-pointer"
            aria-label="Close volunteer sign-up"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plain Explanation & Limitation Notice */}
        <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] space-y-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-[var(--text)]">
            <Shield className="w-4 h-4 text-[var(--primary)] shrink-0" />
            <span>What being a volunteer means</span>
          </div>
          <p className="text-[var(--muted)] leading-relaxed">
            Your community alias and general neighbourhood cell become visible to nearby users so they can
            message or call you for local help (such as walking along a dark stretch, route guidance, or phone
            accompaniment).
          </p>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
            <strong>Limitation:</strong> You are not a substitute for police, medical responders, or emergency services (112).
            You can turn off or pause your listing at any time.
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Areas Willing to Help In */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block">
              Areas you can help in
            </label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {selectedAreas.map((areaId) => (
                <span
                  key={areaId}
                  className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-[var(--primary)] text-white dark:text-[#1A1F45]"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{areaId === activeRoomId ? `${activeArea?.name || areaId} (current)` : areaId}</span>
                  {selectedAreas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArea(areaId)}
                      className="ml-1 hover:opacity-75 cursor-pointer"
                      title="Remove area"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customAreaInput}
                onChange={(e) => setCustomAreaInput(e.target.value)}
                placeholder="Add another geohash or area (e.g. tdr1u)"
                className="text-xs flex-1 p-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="min-h-[44px] px-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* 2. How you can help (chips) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block">
              How can you help? (select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VOLUNTEER_HELP_TYPES.map((type) => {
                const isSelected = selectedHelpTypes.includes(type.key);
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => toggleHelpType(type.key)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text)] shadow-xs'
                        : 'border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isSelected ? 'text-[var(--primary)]' : 'text-[var(--muted)]'
                      }`}
                    />
                    <div className="min-w-0">
                      <span className="font-semibold text-xs block leading-tight text-[var(--text)]">
                        {type.label}
                      </span>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-snug">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Availability Days & Hours (Chips) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block">
              When are you typically available?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {VOLUNTEER_SCHEDULE_SLOTS.map((slot) => {
                const isSelected = selectedSlots.includes(slot.key);
                return (
                  <button
                    key={slot.key}
                    type="button"
                    onClick={() => toggleSlot(slot.key)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer font-medium ${
                      isSelected
                        ? 'bg-[var(--primary)] text-white dark:text-[#1A1F45] border-[var(--primary)]'
                        : 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--line)] hover:text-[var(--text)]'
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. One-line Note */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block">
              One-line note for neighbours (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Regular commuter near Metro gate 2. Happy to walk together."
              maxLength={140}
              className="w-full text-xs p-3 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] placeholder-[var(--muted)]"
            />
            <span className="text-[10px] text-[var(--muted)] text-right block">
              {note.length} / 140
            </span>
          </div>

          {/* 5. Phone Visibility Choice */}
          <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] space-y-3">
            <label className="text-xs font-semibold text-[var(--text)] block">
              Contact preference
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="phone_choice"
                  checked={!showPhone}
                  onChange={() => setShowPhone(false)}
                  className="mt-0.5 accent-[var(--primary)]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[var(--text)] block">
                    Only let them message me in-app first (recommended)
                  </span>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">
                    Your phone number is kept completely hidden. Neighbours reach you via in-app direct chat.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="phone_choice"
                  checked={showPhone}
                  onChange={() => setShowPhone(true)}
                  className="mt-0.5 accent-[var(--primary)]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[var(--text)] block">
                    Show my number to nearby users
                  </span>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">
                    Neighbours will see a Call button with this number. Enter the number you'd like to share below.
                  </p>
                </div>
              </label>
            </div>

            {showPhone && (
              <div className="pt-2">
                <label className="text-xs font-semibold text-[var(--text)] block mb-1">
                  Contact phone number to display
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--muted)]" />
                  <input
                    type="tel"
                    value={phoneDisplay}
                    onChange={(e) => setPhoneDisplay(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="text-xs flex-1 p-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 6. 7-Day Re-confirmation Requirement */}
          <div className="p-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] flex items-start gap-2.5 text-xs text-[var(--muted)]">
            <Clock className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Freshness policy:</strong> To avoid stale listings, we require re-confirming availability
              every 7 days. If not confirmed, your listing is automatically set to unavailable.
            </p>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[48px] flex-1 rounded-xl bg-[var(--primary)] text-white dark:text-[#1A1F45] text-xs font-bold hover:opacity-95 transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting
                ? 'Saving...'
                : isMyVolunteerActive
                ? 'Save Volunteer Settings'
                : 'Join as Volunteer'}
            </button>
          </div>

          {/* Stop Being Volunteer Option (if already registered) */}
          {myVolunteerProfile && (
            <div className="pt-3 border-t border-[var(--line)] text-center">
              <button
                type="button"
                onClick={() => setShowStopConfirm(true)}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer p-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Stop being a volunteer</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Stop Volunteering Confirmation Dialog */}
      {showStopConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-heading font-semibold text-sm text-[var(--text)]">
              Stop being a volunteer?
            </h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              You will be removed from all nearby volunteer listings immediately. You can re-join anytime.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowStopConfirm(false)}
                className="min-h-[44px] flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={handleStop}
                disabled={isSubmitting}
                className="min-h-[44px] flex-1 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition cursor-pointer shadow-xs"
              >
                {isSubmitting ? 'Removing...' : 'Yes, Remove Me'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
