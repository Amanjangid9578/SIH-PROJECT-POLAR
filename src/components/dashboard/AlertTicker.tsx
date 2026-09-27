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
      <div className="bg-polar-900/60 border border-slate-800/80 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs font-mono select-none">
        <div className="flex items-center gap-2 text-slate-400">
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] text-slate-300">
            ALL EXPEDITION SECTORS NOMINAL • ZERO UNRESOLVED HIGH-SEVERITY ALERTS
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold">LIVE TELEMETRY STREAM</span>
      </div>
    );
  }

  const latestAlert = unreadAlerts[0];

  return (
    <div
      onClick={() => latestAlert.targetRoute && navigate(latestAlert.targetRoute)}
      className={cn(
        'border rounded-lg px-3 py-1.5 flex items-center justify-between text-xs font-mono select-none cursor-pointer transition-all',
        latestAlert.severity === 'CRITICAL'
          ? 'bg-rose-950/40 border-rose-500/50 hover:bg-rose-950/60 text-rose-200'
          : 'bg-amber-950/40 border-amber-500/40 hover:bg-amber-950/60 text-amber-200'
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden mr-2">
        <AlertCircle
          className={cn(
            'w-4 h-4 shrink-0',
            latestAlert.severity === 'CRITICAL' ? 'text-rose-400 animate-pulse' : 'text-amber-400'
          )}
        />
        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-black/40 border border-current shrink-0">
          {latestAlert.severity} ALERT
        </span>
        <span className="font-bold truncate text-[11px]">{latestAlert.title}:</span>
        <span className="truncate text-slate-300 text-[11px] font-sans">{latestAlert.message}</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-slate-400">
        <span>{formatTimeAgo(latestAlert.timestamp)}</span>
        <ChevronRight className="w-3.5 h-3.5 text-current" />
      </div>
    </div>
  );
};
