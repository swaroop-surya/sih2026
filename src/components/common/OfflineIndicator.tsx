import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-500/95 border border-amber-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-lg backdrop-blur-md animate-bounce"
    >
      <WifiOff className="w-3.5 h-3.5 text-slate-950" />
      <span>Offline Mode — Cached safety vault & emergency plans available</span>
    </div>
  );
};
