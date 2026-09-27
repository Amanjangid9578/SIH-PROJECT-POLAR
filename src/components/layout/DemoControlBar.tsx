import React, { useState } from 'react';
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
  const [collapsed, setCollapsed] = useState(false);
  const {
    simulateCargoDelay,
    simulateLowInventory,
    simulatePersonnelOverdue,
    simulateSevereWeather,
    simulateCriticalEmergency,
    resetAllDemoData
  } = useApp();

  return (
    <div className="bg-gradient-to-r from-polar-950 via-polar-900 to-polar-950 border-b border-cyan-500/20 px-4 py-1.5 text-xs font-mono select-none">
      <div className="flex items-center justify-between gap-3">
        {/* Left Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold tracking-wider">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>SIH DEMO SIMULATOR</span>
          </div>
          <span className="hidden lg:inline text-[11px] text-slate-400">
            Trigger real-time field disruptions & observe automation cascading across modules:
          </span>
        </div>

        {/* Action Buttons */}
        {!collapsed && (
          <div className="flex items-center flex-wrap gap-1.5">
            <button
              onClick={simulateCargoDelay}
              className="px-2 py-1 rounded bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1 text-[11px] cursor-pointer hover:scale-105 active:scale-95"
              title="Simulate delay on vessel cargo shipment and trigger logistics recalculation"
            >
              <PackageX className="w-3 h-3" />
              <span>Simulate Cargo Delay</span>
            </button>

            <button
              onClick={simulateLowInventory}
              className="px-2 py-1 rounded bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1 text-[11px] cursor-pointer hover:scale-105 active:scale-95"
              title="Drop critical medical/fuel inventory below threshold to fire smart restock trigger"
            >
              <Clock className="w-3 h-3" />
              <span>Simulate Low Stock</span>
            </button>

            <button
              onClick={simulatePersonnelOverdue}
              className="px-2 py-1 rounded bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-500/40 transition-all flex items-center gap-1 text-[11px] cursor-pointer hover:scale-105 active:scale-95"
              title="Trigger overdue check-in alarm for patrol personnel in field sector"
            >
              <UserX className="w-3 h-3" />
              <span>Simulate Overdue Check-in</span>
            </button>

            <button
              onClick={simulateSevereWeather}
              className="px-2 py-1 rounded bg-sky-950/70 hover:bg-sky-900 text-sky-300 border border-sky-500/40 transition-all flex items-center gap-1 text-[11px] cursor-pointer hover:scale-105 active:scale-95"
              title="Simulate 128 km/h Category 4 Blizzard hitting Antarctic station"
            >
              <CloudSnow className="w-3 h-3" />
              <span>Simulate Blizzard</span>
            </button>

            <button
              onClick={simulateCriticalEmergency}
              className="px-2 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-400/60 shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer hover:scale-105 active:scale-95 animate-pulse"
              title="Declare critical Crevasse Rescue emergency"
            >
              <AlertTriangle className="w-3 h-3 text-rose-300" />
              <span>Trigger Critical Emergency</span>
            </button>

            <button
              onClick={resetAllDemoData}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-all flex items-center gap-1 text-[11px] ml-2 cursor-pointer hover:scale-105 active:scale-95"
              title="Restore pristine initial dataset and wipe simulated disruptions"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        )}

        {/* Toggle Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-polar-800"
          aria-label={collapsed ? 'Show demo controls' : 'Hide demo controls'}
        >
          {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
