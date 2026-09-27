import React from 'react';
import {
  Search,
  Bell,
  Radio,
  Clock,
  Compass,
  User,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/formatters';

interface TopbarProps {
  onOpenAiAssistant?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenAiAssistant }) => {
  const {
    expeditions,
    activeExpeditionId,
    setActiveExpeditionId,
    activeExpedition,
    unreadNotificationCount,
    setIsNotificationOpen,
    setIsGlobalSearchOpen,
    aisStatus,
    utcTime,
    emergencies
  } = useApp();

  const criticalEmergencies = emergencies.filter(
    e => e.severity === 'CRITICAL' && e.status !== 'RESOLVED'
  );
  const isEmergencyActive = criticalEmergencies.length > 0;

  return (
    <header className="h-16 bg-polar-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Left: Organization & Expedition Selector */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden lg:flex items-center gap-2 pr-4 border-r border-slate-800">
          <div className="h-8 w-8 rounded bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black font-mono text-xs">
            NCPOR
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold">
              GOVT. OF INDIA • MoES
            </div>
            <div className="text-xs font-semibold text-slate-200 tracking-tight">
              Polar Expedition Operations
            </div>
          </div>
        </div>

        {/* Expedition Selector Dropdown */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase text-[11px] tracking-wider text-slate-400">EXPEDITION:</span>
          </div>

          <div className="relative group">
            <select
              value={activeExpeditionId}
              onChange={e => setActiveExpeditionId(e.target.value)}
              className="bg-polar-950/90 border border-slate-700 hover:border-cyan-500/60 text-slate-100 text-xs font-mono font-medium rounded-md px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer shadow-inner"
            >
              {expeditions.map(exp => (
                <option key={exp.id} value={exp.id} className="bg-polar-900 text-slate-100">
                  {exp.code} — {exp.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {activeExpedition && (
            <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
              {activeExpedition.status}
            </span>
          )}
        </div>
      </div>

      {/* Center: Live UTC Clock & Global Status */}
      <div className="hidden md:flex items-center gap-4">
        {/* UTC Clock */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-polar-950/80 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="tracking-wider text-sky-200">{utcTime || 'UTC CLOCK'}</span>
        </div>

        {/* Global Operational Status */}
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-mono uppercase font-bold tracking-wider',
            isEmergencyActive
              ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse'
              : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
          )}
        >
          {isEmergencyActive ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>● CRITICAL ALERT ACTIVE</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>● SYSTEM OPERATIONAL</span>
            </>
          )}
        </div>

        {/* AIS Status Badge */}
        <div
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono tracking-wider uppercase',
            aisStatus === 'LIVE_CONNECTED'
              ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          )}
          title={
            aisStatus === 'LIVE_CONNECTED'
              ? 'Real-time WebSocket streaming from AISStream.io'
              : 'Polar Fleet Telemetry Simulator active'
          }
        >
          <Radio
            className={cn(
              'w-3 h-3',
              aisStatus === 'LIVE_CONNECTED' ? 'text-cyan-400 animate-pulse' : 'text-slate-400'
            )}
          />
          <span>{aisStatus === 'LIVE_CONNECTED' ? 'LIVE AIS' : 'DEMO AIS'}</span>
        </div>
      </div>

      {/* Right: Search, Notifications, AI Assistant & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-polar-950/90 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all text-xs font-mono group"
          title="Search Command Center (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-polar-800 rounded border border-slate-700">
            Ctrl K
          </kbd>
        </button>

        {/* POLAR AI Button */}
        {onOpenAiAssistant && (
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 transition-all text-xs font-mono font-medium shadow-[0_0_12px_rgba(6,182,212,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">POLAR AI</span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-2 rounded-md bg-polar-950/90 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4 text-slate-300" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-slate-950 font-black text-[10px] font-mono flex items-center justify-center animate-pulse">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="h-8 w-8 rounded-full bg-polar-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shadow-inner">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-mono font-bold text-slate-200 truncate">
              Dr. R. K. Nair
            </div>
            <div className="text-[10px] font-mono text-cyan-400/90 tracking-wide">
              EXPEDITION DIRECTOR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
