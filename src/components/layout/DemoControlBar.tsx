import React, { useEffect, useState } from 'react';
import {
  Zap,
  RotateCcw,
  Clock,
  CloudSnow,
  AlertTriangle,
  UserX,
  PackageX,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemoControlBar: React.FC = () => {
  // Collapsed by default on small screens to save vertical space
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const {
    simulateCargoDelay,
    simulateLowInventory,
    simulatePersonnelOverdue,
    simulateSevereWeather,
    simulateCriticalEmergency,
    resetAllDemoData
  } = useApp();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="bg-gradient-to-r from-polar-950 via-polar-900 to-polar-950 border-b border-cyan-500/20 px-3 sm:px-4 py-1.5 text-xs font-mono select-none shrink-0">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold tracking-wider shrink-0">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>SIH DEMO</span>
          </div>
          <span className="hidden xl:inline text-[11px] text-slate-400 truncate">
            Trigger real-time field disruptions & observe automation cascading across modules:
          </span>
        </div>

        {!collapsed && (
          <div className="flex items-center flex-wrap justify-end gap-1.5 flex-1 min-w-0">
            <button
              type="button"
              onClick={simulateCargoDelay}
              className="px-2 py-1 rounded bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1 text-[11px] cursor-pointer hover:scale-105 active:scale-95"
              title="Simulate Cargo Delay"
            >
              <PackageX className="w-3 h-3 shrink-0" />
              <span className="hidden md:inline">Simulate Cargo Delay</span>
              <span className="md:hidden">Cargo</span>
            </button>

            <button
              type="button"
              onClick={simulateLowInventory}
              className="px-2 py-1 rounded bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1 text-[11px] cursor-pointer hover:scale-105 active:scale-95"
              title="Simulate Low Stock"
            >
              <Clock className="w-3 h-3 shrink-0" />
              <span className="hidden md:inline">Simulate Low Stock</span>
              <span className="md:hidden">Stock</span>
            </button>

            <button
              type="button"
              onClick={simulatePersonnelOverdue}
              className="px-2 py-1 rounded bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-500/40 transition-all flex items-center gap-1 text-[11px] cursor-pointer hover:scale-105 active:scale-95"
              title="Simulate Overdue Check-in"
            >
              <UserX className="w-3 h-3 shrink-0" />
              <span className="hidden md:inline">Simulate Overdue Check-in</span>
              <span className="md:hidden">Overdue</span>
            </button>

            <button
              type="button"
              onClick={simulateSevereWeather}
              className="px-2 py-1 rounded bg-sky-950/70 hover:bg-sky-900 text-sky-300 border border-sky-500/40 transition-all flex items-center gap-1 text-[11px] cursor-pointer hover:scale-105 active:scale-95"
              title="Simulate Blizzard"
            >
              <CloudSnow className="w-3 h-3 shrink-0" />
              <span className="hidden md:inline">Simulate Blizzard</span>
              <span className="md:hidden">Blizzard</span>
            </button>

            <button
              type="button"
              onClick={simulateCriticalEmergency}
              className="px-2 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-400/60 shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer hover:scale-105 active:scale-95 animate-pulse"
              title="Trigger Critical Emergency"
            >
              <AlertTriangle className="w-3 h-3 text-rose-300 shrink-0" />
              <span className="hidden md:inline">Trigger Critical Emergency</span>
              <span className="md:hidden">Emergency</span>
            </button>

            <button
              type="button"
              onClick={resetAllDemoData}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-all flex items-center gap-1 text-[11px] cursor-pointer hover:scale-105 active:scale-95"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="hidden md:inline">Reset Demo Data</span>
              <span className="md:hidden">Reset</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-polar-800 shrink-0"
          aria-label={collapsed ? 'Show demo controls' : 'Hide demo controls'}
        >
          {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
