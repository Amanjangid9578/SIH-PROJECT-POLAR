import React from 'react';
import {
  Cpu,
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Box,
  Users,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AutomationCard } from '../components/automation/AutomationCard';

export const AutomationPage: React.FC = () => {
  const {
    automations,
    toggleAutomationRule,
    runAutomationsManually,
    inventory,
    cargo,
    personnel,
    emergencies
  } = useApp();

  const activeCount = automations.filter(a => a.enabled).length;
  const totalExecutions = automations.reduce((sum, a) => sum + a.executionCount, 0);

  return (
    <div className="space-y-6 pb-12 font-mono text-left select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-black text-slate-100 uppercase tracking-tight">
              Smart Automation Center & Event Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Autonomous rule triggers that evaluate polar telemetry and cascade actions across stations, vessels, and personnel
          </p>
        </div>

        <button
          onClick={runAutomationsManually}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer hover:scale-105 active:scale-95 self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>RUN ENGINE SCAN NOW</span>
        </button>
      </div>

      {/* Engine Status & Execution Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Automation Rules</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-cyan-300">{activeCount} / {automations.length}</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
              ONLINE
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Autonomous evaluation loop active</span>
        </div>

        <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Trigger Executions</span>
          <span className="text-2xl font-black text-slate-100">{totalExecutions}</span>
          <span className="text-[11px] text-slate-500">Events fired and resolved</span>
        </div>

        <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Reactive Rule Architecture</span>
          <span className="text-sm font-black text-emerald-300">TRIGGER → CONDITION → ACTION</span>
          <span className="text-[11px] text-slate-500">Deterministic state listeners</span>
        </div>
      </div>

      {/* Rule Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Operational Rule Catalog
          </h3>
          <span className="text-[10px] text-slate-500">
            Rules execute automatically whenever state mutations occur
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automations.map(rule => (
            <AutomationCard
              key={rule.id}
              rule={rule}
              onToggle={toggleAutomationRule}
              onExecuteNow={() => runAutomationsManually()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
