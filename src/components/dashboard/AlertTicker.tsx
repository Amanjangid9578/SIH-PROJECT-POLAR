import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronRight, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAgo, cn } from '../../utils/formatters';

export const AlertTicker: React.FC = () => {
  const { notifications } = useApp();
  const navigate = useNavigate();

  const unreadAlerts = notifications.filter(n => !n.read).slice(0, 4);

  if (unreadAlerts.length === 0) {
    return (
      <div className="bg-polar-900/60 border border-slate-800/80 rounded-lg px-3 py-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs font-mono select-none min-w-0">
        <div className="flex items-center gap-2 text-slate-400 min-w-0">
          <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[11px] text-slate-300 truncate">
            <span className="sm:hidden">ALL SECTORS NOMINAL</span>
            <span className="hidden sm:inline">
              ALL EXPEDITION SECTORS NOMINAL • ZERO UNRESOLVED HIGH-SEVERITY ALERTS
            </span>
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold shrink-0">LIVE TELEMETRY</span>
      </div>
    );
  }

  const latestAlert = unreadAlerts[0];

  return (
    <div
      onClick={() => latestAlert.targetRoute && navigate(latestAlert.targetRoute)}
      className={cn(
        'border rounded-lg px-3 py-1.5 flex items-center justify-between gap-2 text-xs font-mono select-none cursor-pointer transition-all min-w-0',
        latestAlert.severity === 'CRITICAL'
          ? 'bg-rose-950/40 border-rose-500/50 hover:bg-rose-950/60 text-rose-200'
          : 'bg-amber-950/40 border-amber-500/40 hover:bg-amber-950/60 text-amber-200'
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
        <AlertCircle
          className={cn(
            'w-4 h-4 shrink-0',
            latestAlert.severity === 'CRITICAL' ? 'text-rose-400 animate-pulse' : 'text-amber-400'
          )}
        />
        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/40 border border-current shrink-0">
          {latestAlert.severity}
        </span>
        <span className="font-bold truncate text-[11px] min-w-0">{latestAlert.title}</span>
        <span className="hidden md:inline truncate text-slate-300 text-[11px] font-sans min-w-0">
          {latestAlert.message}
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-slate-400">
        <span className="hidden sm:inline">{formatTimeAgo(latestAlert.timestamp)}</span>
        <ChevronRight className="w-3.5 h-3.5 text-current" />
      </div>
    </div>
  );
};
