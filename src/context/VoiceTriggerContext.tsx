import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useDiscreetVoiceTrigger } from '../hooks/useDiscreetVoiceTrigger';
import { useAegis } from '../hooks/useAegisState';

interface VoiceTriggerContextType {
  isSupported: boolean;
  isListening: boolean;
  triggerPhrase: string;
  setTriggerPhrase: (phrase: string) => void;
  lastHeardText: string;
  wakeLockActive: boolean;
  keepScreenAwake: boolean;
  setKeepScreenAwake: (val: boolean) => void;
  backgroundAudioActive: boolean;
  setBackgroundAudioActive: (val: boolean) => void;
  isTriggered: boolean;
  errorMessage: string | null;
  startListening: () => Promise<boolean>;
  stopListening: () => void;
  testTrigger: () => void;
  clearStatus: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
}

const VoiceTriggerContext = createContext<VoiceTriggerContextType | undefined>(undefined);

export const VoiceTriggerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { startSOS } = useAegis();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const voiceTrigger = useDiscreetVoiceTrigger({
    onTriggerSilentSOS: (phrase) => {
      startSOS(true, `Discreet Voice Activation triggered: "${phrase}"`);
    }
  });

  return (
    <VoiceTriggerContext.Provider
      value={{
        ...voiceTrigger,
        isModalOpen,
        setIsModalOpen
      }}
    >
      {children}
    </VoiceTriggerContext.Provider>
  );
};

export function useVoiceTrigger() {
  const context = useContext(VoiceTriggerContext);
  if (!context) {
    throw new Error('useVoiceTrigger must be used within a VoiceTriggerProvider');
  }
  return context;
}
