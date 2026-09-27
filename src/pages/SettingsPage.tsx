import React, { useState } from 'react';
import {
  Settings,
  Radio,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Key,
  Database,
  CheckCircle2,
  RefreshCw,
  Server
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aisStreamService } from '../services/aisStream';
import { cn } from '../utils/formatters';

export const SettingsPage: React.FC = () => {
  const {
    aisStatus,
    aisStatusMessage,
    resetAllDemoData,
    stations,
    vessels,
    cargo,
    inventory,
    personnel,
    emergencies
  } = useApp();

  const [isReconnecting, setIsReconnecting] = useState(false);
  const [apiKeyMasked, setApiKeyMasked] = useState(true);

  const rawKey = import.meta.env.VITE_AISSTREAM_API_KEY || '';
  const displayKey = rawKey
    ? apiKeyMasked
      ? `${rawKey.substring(0, 8)}••••••••••••••••••••••••••••${rawKey.substring(rawKey.length - 4)}`
      : rawKey
    : 'Not configured';

  const handleTestAisReconnect = () => {
    setIsReconnecting(true);
    aisStreamService.disconnect();
    setTimeout(() => {
      aisStreamService.connect();
      setIsReconnecting(false);
    }, 1200);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all platform data to the initial Smart India Hackathon demo baseline? All customized cargo, inventory, and simulated alerts will be restored.'
      )
    ) {
      resetAllDemoData();
      alert('Application state successfully reset to initial polar demo baseline.');
    }
  };

  return (
    <div className="space-y-6 pb-12 font-mono text-left select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h1 className="text-lg sm:text-xl font-black text-slate-100 uppercase tracking-tight">
            System Settings & Telemetry Telecommunications
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          AISStream integration, local persistent storage, telemetry formats, and mission control diagnostic suites
        </p>
      </div>

      {/* AISStream Integration Card */}
      <div className="p-5 rounded-xl bg-polar-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase">
                AISStream.io Real-Time Maritime Integration
              </h3>
              <p className="text-xs text-slate-400">
                Live WebSocket satellite streaming for polar research vessels & icebreakers
              </p>
            </div>
          </div>

          <span
            className="px-2.5 py-1 rounded text-xs uppercase font-bold border"
            style={{
              backgroundColor: aisStatus === 'LIVE_CONNECTED' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.8)',
              color: aisStatus === 'LIVE_CONNECTED' ? '#06b6d4' : '#94a3b8',
              borderColor: aisStatus === 'LIVE_CONNECTED' ? 'rgba(6, 182, 212, 0.4)' : '#334155'
            }}
          >
            {aisStatus === 'LIVE_CONNECTED' ? '● LIVE WEBSOCKET CONNECTED' : '○ SIMULATOR FALLBACK ACTIVE'}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">
              AISStream API Token (Loaded securely via .env)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={displayKey}
                className="flex-1 bg-polar-950 border border-slate-700 rounded px-3 py-2 text-slate-300 font-mono text-xs select-all"
              />
              <button
                type="button"
                onClick={() => setApiKeyMasked(!apiKeyMasked)}
                className="px-3 py-2 rounded bg-polar-800 hover:bg-polar-750 text-slate-300 border border-slate-700 text-xs"
              >
                {apiKeyMasked ? 'Reveal' : 'Mask'}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Environment variable key: <code className="text-cyan-400">VITE_AISSTREAM_API_KEY</code>
            </p>
          </div>

          <div className="p-3 rounded-lg bg-polar-950 border border-slate-800 text-[11px] space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">WebSocket Endpoint:</span>
              <span className="text-slate-200">wss://stream.aisstream.io/v0/stream</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Geographic Bounding Box:</span>
              <span className="text-cyan-300">Antarctic Waters & Southern Ocean ([-90, -180] to [-40, 180])</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Telemetry Feed Status:</span>
              <span className="text-emerald-400 font-bold">{aisStatusMessage}</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleTestAisReconnect}
              disabled={isReconnecting}
              className="px-4 py-2 rounded-lg bg-polar-800 hover:bg-polar-750 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', isReconnecting && 'animate-spin')} />
              <span>{isReconnecting ? 'Reconnecting Socket...' : 'Test Reconnect WebSocket'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* LocalStorage Data Management & Hackathon Reset */}
      <div className="p-5 rounded-xl bg-polar-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Database className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase">
              Persistence Engine & Demo Data Governance
            </h3>
            <p className="text-xs text-slate-400">
              Browser LocalStorage caching retains all expedition plans, cargo movements, and stock levels
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-polar-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Stations Cached</span>
            <span className="text-base font-bold text-slate-100">{stations.length}</span>
          </div>
          <div className="p-3 rounded-lg bg-polar-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Vessels Tracked</span>
            <span className="text-base font-bold text-slate-100">{vessels.length}</span>
          </div>
          <div className="p-3 rounded-lg bg-polar-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Cargo Manifests</span>
            <span className="text-base font-bold text-slate-100">{cargo.length}</span>
          </div>
          <div className="p-3 rounded-lg bg-polar-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Inventory SKUs</span>
            <span className="text-base font-bold text-slate-100">{inventory.length}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Restore initial pristine Smart India Hackathon dataset:
          </span>
          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.2)]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline</span>
          </button>
        </div>
      </div>

      {/* System Specifications Card */}
      <div className="p-5 rounded-xl bg-polar-900 border border-slate-800 space-y-3 shadow-xl text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Server className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200 uppercase">Architecture Environment</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 text-[11px]">
          <div>Framework: <strong className="text-slate-200">React 19 + TypeScript + Vite</strong></div>
          <div>Styling: <strong className="text-slate-200">Tailwind CSS Tactical Dark Command</strong></div>
          <div>Mapping: <strong className="text-slate-200">Leaflet v1.9 EPSG:3857 Antarctic Theatre</strong></div>
          <div>State Model: <strong className="text-slate-200">Unified Centralized Reactive Event Bus</strong></div>
        </div>
      </div>
    </div>
  );
};
