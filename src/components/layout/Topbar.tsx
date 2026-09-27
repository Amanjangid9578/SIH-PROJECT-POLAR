import React from 'react';
import {
  Search,
  Bell,
  Radio,
  Clock,
  Compass,
  User,
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
    unreadNotificationCount,
    setIsNotificationOpen,
    setIsGlobalSearchOpen,
    aisStatus,
    utcTime,
    emergencies
  } = useApp();

  const isEmergencyActive = emergencies.some(
    e => e.severity === 'CRITICAL' && e.status !== 'RESOLVED'
  );

  const aisLabel =
    aisStatus === 'LIVE_CONNECTED'
      ? 'LIVE AIS'
      : aisStatus === 'CONNECTING'
        ? 'CONNECTING'
        : 'AIS OFF';

  return (
    <header className="h-16 shrink-0 bg-polar-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 flex items-center gap-2 sm:gap-3 z-20 sticky top-0 min-w-0 overflow-hidden">
      {/* Left: Expedition selector */}
      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
        <div className="hidden xl:flex items-center gap-2 pr-3 border-r border-slate-800 shrink-0">
          <div className="h-8 w-8 rounded bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black font-mono text-xs">
            NCPOR
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold whitespace-nowrap">
              GOVT. OF INDIA • MoES
            </div>
            <div className="text-xs font-semibold text-slate-200 tracking-tight whitespace-nowrap">
              Polar Ops
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0 hidden sm:block" />
          <span className="hidden lg:inline uppercase text-[10px] tracking-wider text-slate-400 font-mono shrink-0">
            EXPEDITION
          </span>

          <div className="relative min-w-0 flex-1 max-w-[280px]">
            <select
              value={activeExpeditionId}
              onChange={e => setActiveExpeditionId(e.target.value)}
              className="w-full max-w-full bg-polar-950/90 border border-slate-700 hover:border-cyan-500/60 text-slate-100 text-xs font-mono font-medium rounded-md pl-2.5 pr-7 py-1.5 appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer shadow-inner truncate"
              title={expeditions.find(e => e.id === activeExpeditionId)?.name}
            >
              {expeditions.map(exp => (
                <option key={exp.id} value={exp.id} className="bg-polar-900 text-slate-100">
                  {exp.code}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Center: compact status chips (wide screens only) */}
      <div className="hidden 2xl:flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-polar-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="tracking-wider text-sky-200">{utcTime || 'UTC'}</span>
        </div>

        {isEmergencyActive && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border bg-rose-950/70 border-rose-500/60 text-rose-300 text-[11px] font-mono uppercase font-bold tracking-wider whitespace-nowrap animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>CRITICAL</span>
          </div>
        )}

        <div
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-mono tracking-wider uppercase whitespace-nowrap',
            aisStatus === 'LIVE_CONNECTED'
              ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          )}
          title={
            aisStatus === 'LIVE_CONNECTED'
              ? 'Real-time WebSocket streaming from AISStream.io'
              : 'AIS disconnected — demo telemetry active'
          }
        >
          <Radio
            className={cn(
              'w-3 h-3 shrink-0',
              aisStatus === 'LIVE_CONNECTED' ? 'text-cyan-400 animate-pulse' : 'text-slate-400'
            )}
          />
          <span>{aisLabel}</span>
        </div>
      </div>

      {/* Right: actions — never shrink/overflow */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md bg-polar-950/90 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all text-xs font-mono"
          title="Search Command Center (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="hidden md:inline">Search</span>
        </button>

        {onOpenAiAssistant && (
          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 transition-all text-xs font-mono font-medium"
            title="POLAR AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <span className="hidden md:inline">AI</span>
          </button>
        )}

        {/* Compact AIS on mid widths where center strip is hidden */}
        <div
          className={cn(
            '2xl:hidden flex items-center gap-1 px-1.5 py-1.5 rounded-md border text-[10px] font-mono uppercase',
            aisStatus === 'LIVE_CONNECTED'
              ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          )}
          title={aisLabel}
        >
          <Radio
            className={cn(
              'w-3 h-3',
              aisStatus === 'LIVE_CONNECTED' ? 'text-cyan-400 animate-pulse' : 'text-slate-400'
            )}
          />
        </div>

        <button
          type="button"
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

        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 shrink-0">
          <div className="h-8 w-8 rounded-full bg-polar-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shadow-inner shrink-0">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
