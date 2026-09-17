import { useState, useEffect, useRef, useCallback } from 'react';

interface UseDiscreetVoiceTriggerOptions {
  onTriggerSilentSOS: (phrase: string) => void;
  defaultPhrase?: string;
}

export function useDiscreetVoiceTrigger({
  onTriggerSilentSOS,
  defaultPhrase = 'red umbrella'
}: UseDiscreetVoiceTriggerOptions) {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [triggerPhrase, setTriggerPhraseState] = useState<string>(() => {
    return localStorage.getItem('aegis_voice_trigger_phrase') || defaultPhrase;
  });
  const [lastHeardText, setLastHeardText] = useState<string>('');
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const [keepScreenAwake, setKeepScreenAwakeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('aegis_voice_wake_lock');
    return saved !== null ? saved === 'true' : true;
  });
  const [backgroundAudioActive, setBackgroundAudioActiveState] = useState<boolean>(() => {
    const saved = localStorage.getItem('aegis_voice_bg_audio');
    return saved !== null ? saved === 'true' : true;
  });
  const [isTriggered, setIsTriggered] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const wakeLockSentinelRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Check Web Speech API availability
  useEffect(() => {
    const hasSpeech = typeof window !== 'undefined' &&
      !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    setIsSupported(hasSpeech);
  }, []);

  const setTriggerPhrase = useCallback((phrase: string) => {
    const cleaned = phrase.trim().toLowerCase();
    setTriggerPhraseState(cleaned);
    localStorage.setItem('aegis_voice_trigger_phrase', cleaned);
  }, []);

  const setKeepScreenAwake = useCallback((val: boolean) => {
    setKeepScreenAwakeState(val);
    localStorage.setItem('aegis_voice_wake_lock', String(val));
  }, []);

  const setBackgroundAudioActive = useCallback((val: boolean) => {
    setBackgroundAudioActiveState(val);
    localStorage.setItem('aegis_voice_bg_audio', String(val));
  }, []);

  // Initialize and manage Screen Wake Lock
  const requestWakeLock = useCallback(async () => {
    if ('wakeLock' in navigator && keepScreenAwake) {
      try {
        const sentinel = await (navigator as any).wakeLock.request('screen');
        wakeLockSentinelRef.current = sentinel;
        setWakeLockActive(true);

        sentinel.addEventListener('release', () => {
          setWakeLockActive(false);
          // If still armed, re-acquire when document becomes visible again
          if (isListeningRef.current && document.visibilityState === 'visible') {
            requestWakeLock();
          }
        });
      } catch (err) {
        console.warn('Screen Wake Lock could not be acquired:', err);
        setWakeLockActive(false);
      }
    }
  }, [keepScreenAwake]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockSentinelRef.current) {
      try {
        await wakeLockSentinelRef.current.release();
      } catch (e) {
        // Ignore
      }
      wakeLockSentinelRef.current = null;
      setWakeLockActive(false);
    }
  }, []);

  // Initialize and manage silent background audio to keep process alive on mobile
  const startBackgroundAudio = useCallback(() => {
    if (!backgroundAudioActive) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Generate a 1-second silent audio buffer
      const buffer = audioContextRef.current.createBuffer(
        1,
        audioContextRef.current.sampleRate * 1,
        audioContextRef.current.sampleRate
      );

      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(audioContextRef.current.destination);
      source.start(0);
      audioSourceRef.current = source;
    } catch (e) {
      console.warn('Silent audio context keep-alive could not be started:', e);
    }
  }, [backgroundAudioActive]);

  const stopBackgroundAudio = useCallback(() => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
      } catch (e) {
        // Ignore
      }
      audioSourceRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // Ignore
      }
      audioContextRef.current = null;
    }
  }, []);

  // Normalize speech strings for comparison
  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const checkMatch = useCallback((transcript: string, phrase: string) => {
    const cleanTranscript = normalize(transcript);
    const cleanPhrase = normalize(phrase);

    if (!cleanPhrase || !cleanTranscript) return false;

    // Direct substring match
    if (cleanTranscript.includes(cleanPhrase)) {
      return true;
    }

    // Word tokens overlap check
    const phraseWords = cleanPhrase.split(' ').filter(Boolean);
    if (phraseWords.length > 1) {
      const allWordsPresent = phraseWords.every(word => cleanTranscript.includes(word));
      if (allWordsPresent) return true;
    }

    return false;
  }, []);

  const triggerAlert = useCallback((phrase: string) => {
    setIsTriggered(true);

    // Provide discreet tactile haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([60, 100, 60, 100, 60]);
    }

    onTriggerSilentSOS(phrase);
  }, [onTriggerSilentSOS]);

  // Main start listening handler
  const startListening = useCallback(async (): Promise<boolean> => {
    setErrorMessage(null);
    setIsTriggered(false);

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setErrorMessage('Web Speech API is not supported in this browser. Please use Chrome or Safari.');
      return false;
    }

    try {
      // Request microphone permission if not already active
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop track immediately, we just needed explicit permission check
          stream.getTracks().forEach(t => t.stop());
        } catch (micErr) {
          console.warn('Microphone permission check note:', micErr);
        }
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore
        }
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          currentTranscript += transcript;
        }

        setLastHeardText(currentTranscript);

        // Check if trigger phrase is matched
        if (checkMatch(currentTranscript, triggerPhrase)) {
          triggerAlert(triggerPhrase);
        }
      };

      recognition.onerror = (event: any) => {
        // Ignore benign errors like 'no-speech' or 'aborted'
        if (event.error === 'no-speech') {
          return;
        }
        if (event.error === 'aborted') {
          return;
        }
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser.');
          setIsListening(false);
          isListeningRef.current = false;
        }
      };

      recognition.onend = () => {
        // If armed, automatically restart continuous loop
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            // Short delay retry if restart collided
            setTimeout(() => {
              if (isListeningRef.current) {
                try {
                  recognition.start();
                } catch (err) {
                  console.warn('Recognition loop retry', err);
                }
              }
            }, 300);
          }
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      isListeningRef.current = true;
      setIsListening(true);

      // Start Screen Wake Lock & Background Audio
      requestWakeLock();
      startBackgroundAudio();

      return true;
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setErrorMessage(err?.message || 'Could not start voice recognition.');
      setIsListening(false);
      isListeningRef.current = false;
      return false;
    }
  }, [triggerPhrase, checkMatch, triggerAlert, requestWakeLock, startBackgroundAudio]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore
      }
      recognitionRef.current = null;
    }

    releaseWakeLock();
    stopBackgroundAudio();
  }, [releaseWakeLock, stopBackgroundAudio]);

  // Handle visibility change to re-acquire wake lock if armed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isListeningRef.current) {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [requestWakeLock]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore
        }
      }
      releaseWakeLock();
      stopBackgroundAudio();
    };
  }, [releaseWakeLock, stopBackgroundAudio]);

  const testTrigger = useCallback(() => {
    triggerAlert(triggerPhrase);
  }, [triggerAlert, triggerPhrase]);

  const clearStatus = useCallback(() => {
    setIsTriggered(false);
    setLastHeardText('');
    setErrorMessage(null);
  }, []);

  return {
    isSupported,
    isListening,
    triggerPhrase,
    setTriggerPhrase,
    lastHeardText,
    wakeLockActive,
    keepScreenAwake,
    setKeepScreenAwake,
    backgroundAudioActive,
    setBackgroundAudioActive,
    isTriggered,
    errorMessage,
    startListening,
    stopListening,
    testTrigger,
    clearStatus
  };
}
