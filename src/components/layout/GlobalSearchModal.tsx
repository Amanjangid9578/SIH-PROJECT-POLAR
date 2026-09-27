import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Compass,
  Ship,
  Box,
  Layers,
  Users,
  AlertTriangle,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    expeditions,
    vessels,
    cargo,
    inventory,
    personnel,
    emergencies,
    stations,
    setActiveExpeditionId
  } = useApp();

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  // Reset query on close
  useEffect(() => {
    if (!isGlobalSearchOpen) {
      setQuery('');
    }
  }, [isGlobalSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();

    return {
      expeditions: expeditions.filter(
        e =>
          e.name.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q) ||
          e.missionCommander.toLowerCase().includes(q)
      ),
      vessels: vessels.filter(
        v =>
          v.name.toLowerCase().includes(q) ||
          v.mmsi.includes(q) ||
          v.callSign.toLowerCase().includes(q) ||
          v.destination.toLowerCase().includes(q)
      ),
      cargo: cargo.filter(
        c =>
          c.description.toLowerCase().includes(q) ||
          c.trackingNumber.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.destination.toLowerCase().includes(q)
      ),
      inventory: inventory.filter(
        i =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.storageLocation.toLowerCase().includes(q)
      ),
      personnel: personnel.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.badgeNumber.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q)
      ),
      emergencies: emergencies.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.incidentCode.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.locationName.toLowerCase().includes(q)
      ),
      stations: stations.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q)
      )
    };
  }, [query, expeditions, vessels, cargo, inventory, personnel, emergencies, stations]);

  const totalResultsCount = results
    ? results.expeditions.length +
      results.vessels.length +
      results.cargo.length +
      results.inventory.length +
      results.personnel.length +
      results.emergencies.length +
      results.stations.length
    : 0;

  if (!isGlobalSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-polar-950/85 backdrop-blur-md transition-opacity"
        onClick={() => setIsGlobalSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-polar-900 border border-cyan-500/40 rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden z-10 text-left font-mono">
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-polar-950/60">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search vessels, cargo tracking #, personnel, inventory, emergencies..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none tracking-wide"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] text-slate-400 bg-polar-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <div className="py-8 text-center text-slate-500 text-xs">
              <p>Type keywords to search across all polar command entities.</p>
              <p className="mt-1 text-[11px] text-slate-600">
                Examples: "diesel", "Polar Star", "frostbite", "Bharati", "drill"
              </p>
            </div>
          )}

          {query.trim() && totalResultsCount === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p>No matching entities found for "{query}".</p>
            </div>
          )}

          {/* Expeditions */}
          {results && results.expeditions.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Expeditions ({results.expeditions.length})</span>
              </div>
              <div className="space-y-1">
                {results.expeditions.map(e => (
                  <div
                    key={e.id}
                    onClick={() => {
                      setActiveExpeditionId(e.id);
                      setIsGlobalSearchOpen(false);
                      navigate('/planning');
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-polar-950/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-xs text-slate-200 group-hover:text-cyan-300 font-semibold">
                        {e.code} — {e.name}
                      </div>
                      <div className="text-[10px] text-slate-400">Commander: {e.missionCommander}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vessels */}
          {results && results.vessels.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1.5 flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5" />
                <span>Vessels & AIS ({results.vessels.length})</span>
              </div>
              <div className="space-y-1">
                {results.vessels.map(v => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      navigate('/dashboard');
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-polar-950/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-xs text-slate-200 group-hover:text-cyan-300 font-semibold flex items-center gap-2">
                        <span>{v.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-polar-800 text-sky-300 border border-sky-600/30">
                          MMSI: {v.mmsi}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Dest: {v.destination} • Speed: {v.speedKnots} kts • {v.type}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cargo */}
          {results && results.cargo.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1.5 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" />
                <span>Cargo Shipments ({results.cargo.length})</span>
              </div>
              <div className="space-y-1">
                {results.cargo.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      navigate('/cargo');
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-polar-950/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-xs text-slate-200 group-hover:text-cyan-300 font-semibold flex items-center gap-2">
                        <span>{c.trackingNumber}</span>
                        <span className="text-[10px] text-slate-400">— {c.description}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Status: <span className="text-sky-300">{c.status}</span> • To: {c.destination} • {c.weightKg.toLocaleString()} kg
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory */}
          {results && results.inventory.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Station Inventory ({results.inventory.length})</span>
              </div>
              <div className="space-y-1">
                {results.inventory.map(i => (
                  <div
                    key={i.id}
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      navigate('/inventory');
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-polar-950/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-xs text-slate-200 group-hover:text-cyan-300 font-semibold">
                        {i.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        SKU: {i.sku} • Stock: <span className="text-cyan-300">{i.quantity} {i.unit}</span> (Threshold: {i.reorderThreshold})
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personnel */}
          {results && results.personnel.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Personnel ({results.personnel.length})</span>
              </div>
              <div className="space-y-1">
                {results.personnel.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      navigate('/personnel');
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-polar-950/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-xs text-slate-200 group-hover:text-cyan-300 font-semibold flex items-center gap-2">
                        <span>{p.name}</span>
                        <span className="text-[10px] text-slate-400">({p.role})</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Badge: {p.badgeNumber} • Location: {p.currentLocationName} • Status: {p.status}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergencies */}
          {results && results.emergencies.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-rose-400 font-bold mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Emergency Incidents ({results.emergencies.length})</span>
              </div>
              <div className="space-y-1">
                {results.emergencies.map(emg => (
                  <div
                    key={emg.id}
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      navigate('/emergency');
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/40 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-xs text-rose-200 font-semibold flex items-center gap-2">
                        <span>{emg.incidentCode} — {emg.title}</span>
                        <span className="text-[10px] px-1 py-0.2 bg-rose-900 text-rose-200 rounded">
                          {emg.severity}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {emg.locationName} • Status: {emg.status}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stations */}
          {results && results.stations.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Polar Stations ({results.stations.length})</span>
              </div>
              <div className="space-y-1">
                {results.stations.map(st => (
                  <div
                    key={st.id}
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      navigate('/dashboard');
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-polar-950/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-xs text-slate-200 group-hover:text-cyan-300 font-semibold">
                        {st.flag} {st.name} ({st.country})
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Capacity: {st.currentPersonnel}/{st.capacity} • Temp: {st.weather.tempC}°C • Fuel: {st.fuelLevelPercent}%
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
