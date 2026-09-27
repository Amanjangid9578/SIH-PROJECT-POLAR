import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Radio,
  Globe2,
  Ship,
  Box,
  Layers,
  Users,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { expeditions, stations, vessels, personnel, cargo, aisStatus } = useApp();

  return (
    <div className="relative min-h-screen w-full bg-polar-950 text-slate-100 flex flex-col justify-between overflow-hidden font-mono select-none">
      {/* Background Cinematic Atmosphere & Grid */}
      <div className="absolute inset-0 polar-grid opacity-35" />
      <div className="absolute inset-0 bg-radial-gradient from-cyan-950/20 via-transparent to-polar-950 pointer-events-none" />

      {/* Decorative Radar Sweep Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-cyan-500/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-cyan-500/20 pointer-events-none" />

      {/* Rotating Radar Line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full overflow-hidden pointer-events-none animate-spin-slow opacity-30">
        <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/20 to-transparent origin-bottom-right" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 px-4 sm:px-12 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 bg-polar-950/60 backdrop-blur-md min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)]">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div className="min-w-0">
            <span className="text-base font-black tracking-wider text-slate-100 font-mono">
              POLAR COMMAND
            </span>
            <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase truncate">
              MINISTRY OF EARTH SCIENCES • NCPOR GOA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-polar-900 border border-slate-800 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>THEATRE STATUS: SECURE</span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] max-w-full">
            <span className="truncate">
              AIS: {aisStatus === 'LIVE_CONNECTED' ? 'LIVE' : 'SIMULATOR'}
            </span>
          </div>
        </div>
      </header>

      {/* Center Cinematic Hero */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 sm:py-20 text-center space-y-8">
        {/* Polar Tag Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.25)] max-w-full mx-2">
          <Globe2 className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow shrink-0" />
          <span className="tracking-widest uppercase font-bold text-center break-words">
            <span className="sm:hidden">POLAR LOGISTICS & ASSET MGMT</span>
            <span className="hidden sm:inline">
              INTEGRATED POLAR EXPEDITION LOGISTICS & ASSET MANAGEMENT SYSTEM
            </span>
          </span>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-100 uppercase tracking-tight leading-none">
            POLAR <span className="text-cyan-400 text-glow-cyan">COMMAND</span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Centralized digital operational picture for Antarctic and Arctic expeditions. Orchestrating vessel routing, extreme cold-chain cargo, station inventories, personnel safety, and autonomous disaster mitigation.
          </p>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.45)] border border-cyan-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>ENTER MISSION CONTROL</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/planning')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-polar-900/90 hover:bg-polar-800 text-sky-200 hover:text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer"
          >
            <span>VIEW ACTIVE EXPEDITION</span>
            <Compass className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Tactical Key Metrics Ribbon */}
        <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
          <div className="p-3 rounded-lg bg-polar-900/80 border border-slate-800 text-left">
            <span className="text-[10px] text-slate-400 uppercase block">Monitored Bases</span>
            <span className="text-xl font-black text-sky-300">{stations.length} STATIONS</span>
            <span className="text-[10px] text-slate-500 block truncate">Maitri, Bharati, Himadri</span>
          </div>

          <div className="p-3 rounded-lg bg-polar-900/80 border border-slate-800 text-left">
            <span className="text-[10px] text-slate-400 uppercase block">Polar Fleet</span>
            <span className="text-xl font-black text-cyan-300">{vessels.length} VESSELS</span>
            <span className="text-[10px] text-slate-500 block truncate">Icebreakers & Research</span>
          </div>

          <div className="p-3 rounded-lg bg-polar-900/80 border border-slate-800 text-left">
            <span className="text-[10px] text-slate-400 uppercase block">Tracked Cargo</span>
            <span className="text-xl font-black text-amber-300">{cargo.length} SHIPMENTS</span>
            <span className="text-[10px] text-slate-500 block truncate">Scientific & Diesel Fuels</span>
          </div>

          <div className="p-3 rounded-lg bg-polar-900/80 border border-slate-800 text-left">
            <span className="text-[10px] text-slate-400 uppercase block">Active Crew</span>
            <span className="text-xl font-black text-emerald-300">{personnel.length} OPERATORS</span>
            <span className="text-[10px] text-slate-500 block truncate">Traverse & Station Bases</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-slate-800/60 bg-polar-950/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left">
          <span>SMART INDIA HACKATHON 2026</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-cyan-400 break-words">
            PROBLEM STATEMENT: POLAR LOGISTICS & ASSET MANAGEMENT
          </span>
        </div>
        <div className="text-slate-500">
          OPERATIONAL READINESS LEVEL: PRODUCTION DEMO
        </div>
      </footer>
    </div>
  );
};
