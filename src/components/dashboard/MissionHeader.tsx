import React from 'react';
import {
  Compass,
  Calendar,
  MapPin,
  CloudSnow,
  Wind,
  Thermometer,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/formatters';

interface MissionHeaderProps {
  onDeclareEmergency: () => void;
}

export const MissionHeader: React.FC<MissionHeaderProps> = ({ onDeclareEmergency }) => {
  const { activeExpedition, stations, emergencies } = useApp();

  const primaryStation = stations.find(s => s.id === activeExpedition?.primaryStation) || stations[0];

  // Calculate days elapsed
  const startDate = activeExpedition?.startDate ? new Date(activeExpedition.startDate).getTime() : Date.now();
  const endDate = activeExpedition?.endDate ? new Date(activeExpedition.endDate).getTime() : Date.now();
  const now = Date.now();

  const daysElapsed = Math.max(0, Math.floor((now - startDate) / (1000 * 60 * 60 * 24)));
  const totalDays = Math.max(1, Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, Math.round((daysElapsed / totalDays) * 100));

  const hasCriticalEmergency = emergencies.some(e => e.severity === 'CRITICAL' && e.status !== 'RESOLVED');

  return (
    <div className="relative rounded-xl bg-gradient-to-r from-polar-900 via-polar-850 to-polar-900 border border-cyan-500/30 p-5 shadow-xl overflow-hidden font-mono text-left select-none">
      {/* Subtle polar scanline watermark */}
      <div className="absolute inset-0 polar-grid opacity-25 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Mission Info */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center flex-wrap gap-2.5">
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase font-bold tracking-wider">
              {activeExpedition?.code || 'ISEA-45'}
            </span>

            <div
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs uppercase font-bold tracking-wider border',
                hasCriticalEmergency
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/60 animate-pulse'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              )}
            >
              {hasCriticalEmergency ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>CRITICAL ALERT IN THEATRE</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OPERATIONAL</span>
                </>
              )}
            </div>

            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {activeExpedition?.startDate} → {activeExpedition?.endDate}
              </span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight">
            {activeExpedition?.name || 'INDIA POLAR EXPEDITION — 2026'}
          </h1>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Mission Lead: <strong className="text-cyan-300 font-mono">{activeExpedition?.missionCommander}</strong> • Primary Base: <strong className="text-sky-300 font-mono">{primaryStation?.name}</strong>
          </p>

          {/* Mission Progress Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Mission Timeline Progress: <strong>Day {daysElapsed} of {totalDays}</strong></span>
              <span className="text-cyan-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-polar-950 h-2 rounded-full border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Weather & Quick Emergency CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Primary Station Weather Card */}
          {primaryStation && (
            <div className="p-3.5 rounded-lg bg-polar-950/80 border border-slate-800/80 text-xs space-y-1.5 min-w-[210px]">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{primaryStation.name.split(' ')[0]} Weather</span>
                </span>
                <span className="text-sky-300 font-bold">{primaryStation.weather.condition}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-sky-400" />
                  <span className="text-sm font-bold text-slate-100">
                    {primaryStation.weather.tempC}°C
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-300">
                    {primaryStation.weather.windKmh} km/h {primaryStation.weather.windDirection}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-0.5">
                Visibility: {primaryStation.weather.visibilityKm} km • Pres: {primaryStation.weather.pressureHpa} hPa
              </div>
            </div>
          )}

          {/* Quick Action Button */}
          <button
            onClick={onDeclareEmergency}
            className="px-4 py-3 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 text-rose-200 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-center justify-center gap-2 text-xs font-bold uppercase cursor-pointer hover:scale-105 active:scale-95 group"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform animate-pulse" />
            <span>DECLARE EMERGENCY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
