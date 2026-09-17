import React, { useState } from 'react';
import { Cloud, Sun, Droplets, Wind, RotateCcw, Shield } from 'lucide-react';

interface DisguisedScreenProps {
  onReturnToAegis: () => void;
}

export const DisguisedScreen: React.FC<DisguisedScreenProps> = ({ onReturnToAegis }) => {
  const [returnClicks, setReturnClicks] = useState(0);

  const handleLogoTap = () => {
    // Discreet multi-tap to return to Aegis
    if (returnClicks >= 2) {
      onReturnToAegis();
    } else {
      setReturnClicks(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 select-none">
      <div className="max-w-md mx-auto space-y-4">
        {/* Weather header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">National Forecast</span>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Bengaluru, IN
            </h1>
          </div>
          <button
            onClick={handleLogoTap}
            className="p-2 text-slate-500 hover:text-slate-400 transition"
            title="Weather Source"
          >
            <Sun className="w-6 h-6 text-amber-400 animate-spin-slow" />
          </button>
        </div>

        {/* Current weather card */}
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-lg text-center space-y-3">
          <div className="flex justify-center">
            <Cloud className="w-16 h-16 text-sky-400" />
          </div>
          <div className="text-5xl font-extrabold tracking-tight">24°C</div>
          <div className="text-sm font-medium text-slate-300">Partly Cloudy • Humidity 62%</div>
          <div className="flex justify-center gap-6 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5" /> 14 km/h WNW</span>
            <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> AQI 48 (Good)</span>
          </div>
        </div>

        {/* 5-day forecast */}
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-800 space-y-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">5-Day Outlook</h2>
          {[
            { day: 'Today', temp: '25° / 19°', desc: 'Scattered clouds' },
            { day: 'Tomorrow', temp: '26° / 18°', desc: 'Mild sunshine' },
            { day: 'Wednesday', temp: '24° / 19°', desc: 'Evening drizzle' },
            { day: 'Thursday', temp: '23° / 18°', desc: 'Overcast' },
            { day: 'Friday', temp: '25° / 19°', desc: 'Clear skies' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-700/30 text-xs last:border-0">
              <span className="font-medium text-slate-200 w-24">{item.day}</span>
              <span className="text-slate-400 flex-1 text-center">{item.desc}</span>
              <span className="font-semibold text-slate-200">{item.temp}</span>
            </div>
          ))}
        </div>

        {/* Secret return bar */}
        <div className="pt-6 text-center">
          <button
            onClick={onReturnToAegis}
            className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 bg-slate-800/40 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-800 transition"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Resume Protected Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
