import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Navigation,
  Wind,
  Thermometer,
  ArrowRight
} from 'lucide-react';
import { formatCoordinates, formatUtcDateTime, formatWeight, cn } from '../../utils/formatters';
import { ResearchStation, Vessel, CargoItem, Personnel, EmergencyIncident } from '../../types';

export type MapSelectedEntity =
  | { type: 'station'; data: ResearchStation }
  | { type: 'vessel'; data: Vessel }
  | { type: 'cargo'; data: CargoItem }
  | { type: 'personnel'; data: Personnel }
  | { type: 'emergency'; data: EmergencyIncident };

interface MapDetailDrawerProps {
  entity: MapSelectedEntity | null;
  onClose: () => void;
}

export const MapDetailDrawer: React.FC<MapDetailDrawerProps> = ({ entity, onClose }) => {
  const navigate = useNavigate();

  if (!entity) return null;

  const renderStation = (st: ResearchStation) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-3xl shrink-0">{st.flag}</div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-100 truncate">{st.name}</h3>
          <p className="text-xs text-sky-400 font-mono truncate">
            {st.country} • Established {st.established}
          </p>
        </div>
      </div>

      {/* Coordinates & Status */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800 min-w-0">
          <span className="text-slate-400 text-[10px] uppercase block">ID</span>
          <span className="text-slate-200 font-semibold break-all">{st.id}</span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800 min-w-0">
          <span className="text-slate-400 text-[10px] uppercase block">Type</span>
          <span className="text-sky-300 font-semibold">Research Station</span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800 min-w-0 col-span-2">
          <span className="text-slate-400 text-[10px] uppercase block">Coordinates</span>
          <span className="text-cyan-300 font-semibold break-all">{formatCoordinates(st.coords.lat, st.coords.lng)}</span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Status</span>
          <span className="text-emerald-300 font-semibold">{st.status}</span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Personnel</span>
          <span className="text-emerald-300 font-semibold">{st.currentPersonnel} / {st.capacity}</span>
        </div>
      </div>

      {/* Telemetry & Weather */}
      <div className="p-3 rounded-lg bg-polar-950/90 border border-slate-800 space-y-2">
        <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider block">
          Station Environment & Fuel
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-sky-400" />
            <span>Temp: <strong className="text-sky-300">{st.weather.tempC}°C</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span>Wind: <strong className="text-cyan-300">{st.weather.windKmh} km/h ({st.weather.windDirection})</strong></span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-800 text-xs font-mono">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400">Fuel Reserves</span>
            <span className="text-amber-300 font-bold">{st.fuelLevelPercent}%</span>
          </div>
          <div className="w-full bg-polar-800 h-2 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                st.fuelLevelPercent < 50 ? 'bg-amber-500' : 'bg-cyan-500'
              )}
              style={{ width: `${st.fuelLevelPercent}%` }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          onClose();
          navigate('/inventory');
        }}
        className="w-full py-2 px-3 rounded-lg bg-polar-800 hover:bg-polar-750 text-sky-200 border border-slate-700 hover:border-cyan-400 flex items-center justify-center gap-2 text-xs font-mono font-bold transition-all cursor-pointer"
      >
        <span>View Station Inventory</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const renderVessel = (v: Vessel) => (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 min-w-0">
            <span className="truncate">{v.name}</span>
            <span className="text-lg shrink-0">{v.flag}</span>
          </h3>
          <p className="text-xs text-cyan-400 font-mono truncate">
            {v.type} • Call Sign: {v.callSign}
          </p>
        </div>
        <span
          className={cn(
            'shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border',
            v.isLiveAis
              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
              : 'bg-amber-950 text-amber-300 border-amber-500/40'
          )}
        >
          {v.isLiveAis ? '● LIVE AIS' : '○ DEMO DATA'}
        </span>
      </div>

      {/* Core identity + kinematics */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800 min-w-0">
          <span className="text-slate-400 text-[10px] uppercase block">ID</span>
          <span className="text-slate-200 font-semibold break-all">{v.id}</span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800 min-w-0">
          <span className="text-slate-400 text-[10px] uppercase block">MMSI</span>
          <span className="text-slate-200 font-semibold break-all">{v.mmsi}</span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800 min-w-0 col-span-2">
          <span className="text-slate-400 text-[10px] uppercase block">Coordinates</span>
          <span className="text-cyan-300 font-semibold break-all">
            {formatCoordinates(v.coords.lat, v.coords.lng)}
          </span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Speed</span>
          <span className="text-cyan-300 font-semibold">{v.speedKnots} knots</span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Heading</span>
          <span className="text-sky-300 font-semibold">{v.heading}° TRUE</span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Status</span>
          <span className="text-emerald-300 font-semibold">{v.status}</span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Ice Class</span>
          <span className="text-slate-200 font-semibold truncate block">{v.iceClass}</span>
        </div>
      </div>

      {/* Route & ETA */}
      <div className="p-3 rounded-lg bg-polar-950/90 border border-slate-800 space-y-2 text-xs font-mono">
        <div className="flex justify-between items-center gap-2 text-[11px] pb-1 border-b border-slate-800">
          <span className="text-slate-400 shrink-0">VOYAGE PLAN</span>
          <span className="text-emerald-400 font-bold truncate">{v.status}</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between gap-2 min-w-0">
            <span className="text-slate-400 shrink-0">Origin:</span>
            <span className="text-slate-200 text-right break-words min-w-0">{v.origin}</span>
          </div>
          <div className="flex justify-between gap-2 min-w-0">
            <span className="text-slate-400 shrink-0">Destination:</span>
            <span className="text-cyan-300 font-semibold text-right break-words min-w-0">{v.destination}</span>
          </div>
          <div className="flex justify-between gap-2 min-w-0">
            <span className="text-slate-400 shrink-0">ETA:</span>
            <span className="text-sky-300 font-semibold text-right break-words min-w-0">
              {new Date(v.eta).toUTCString().substring(0, 22)}
            </span>
          </div>
          <div className="flex justify-between gap-2 text-[11px] pt-1 border-t border-slate-800 text-slate-500 min-w-0">
            <span className="shrink-0">Last Updated:</span>
            <span className="text-right break-words min-w-0">{formatUtcDateTime(v.lastUpdate)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          onClose();
          navigate('/cargo');
        }}
        className="w-full py-2 px-3 rounded-lg bg-polar-800 hover:bg-polar-750 text-sky-200 border border-slate-700 hover:border-cyan-400 flex items-center justify-center gap-2 text-xs font-mono font-bold transition-all cursor-pointer"
      >
        <span>View Assigned Cargo</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const renderCargo = (c: CargoItem) => (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-cyan-400 font-bold">{c.trackingNumber}</span>
          <span
            className={cn(
              'px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border',
              c.status === 'Delayed'
                ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
            )}
          >
            {c.status}
          </span>
        </div>
        <h3 className="text-sm font-bold text-slate-100 mt-1">{c.description}</h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5">{c.category}</p>
      </div>

      {/* Cargo Specs */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Weight</span>
          <span className="text-slate-200 font-semibold">{formatWeight(c.weightKg)}</span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Priority</span>
          <span
            className={cn(
              'font-semibold',
              c.priority === 'CRITICAL' ? 'text-rose-400' : 'text-amber-300'
            )}
          >
            {c.priority}
          </span>
        </div>
      </div>

      {/* Routing */}
      <div className="p-3 rounded-lg bg-polar-950/90 border border-slate-800 text-xs font-mono space-y-2">
        <span className="text-[11px] text-cyan-400 uppercase font-bold block">Logistics Routing</span>
        <div className="space-y-1.5 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">CURRENT POSITION</span>
            <span className="text-sky-300 font-semibold">{c.currentLocationName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">ORIGIN → DESTINATION</span>
            <span className="text-slate-200">{c.origin} → {c.destination}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">TARGET ETA</span>
            <span className="text-emerald-400 font-bold">
              {new Date(c.eta).toUTCString().substring(0, 22)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          onClose();
          navigate('/cargo');
        }}
        className="w-full py-2 px-3 rounded-lg bg-polar-800 hover:bg-polar-750 text-sky-200 border border-slate-700 hover:border-cyan-400 flex items-center justify-center gap-2 text-xs font-mono font-bold transition-all cursor-pointer"
      >
        <span>Open Cargo Tracking Board</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const renderPersonnel = (p: Personnel) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100">{p.name}</h3>
          <p className="text-xs text-cyan-400 font-mono">{p.role}</p>
        </div>
        <span
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border',
            p.checkInOverdue
              ? 'bg-rose-950 text-rose-300 border-rose-500/50 animate-pulse'
              : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
          )}
        >
          {p.checkInOverdue ? 'OVERDUE' : p.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Badge ID</span>
          <span className="text-slate-200 font-semibold">{p.badgeNumber}</span>
        </div>
        <div className="p-2.5 rounded bg-polar-950/80 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase block">Team</span>
          <span className="text-sky-300 font-semibold">{p.team}</span>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-polar-950/90 border border-slate-800 text-xs font-mono space-y-2">
        <span className="text-[11px] text-cyan-400 uppercase font-bold block">
          Current Assignment & Telemetry
        </span>
        <div className="space-y-1 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">CURRENT FIELD POSITION</span>
            <span className="text-slate-100 font-semibold">{p.currentLocationName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">COORDINATES</span>
            <span className="text-cyan-300">{formatCoordinates(p.coords.lat, p.coords.lng)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">LAST CHECK-IN TIME</span>
            <span className={cn('font-bold', p.checkInOverdue ? 'text-rose-400' : 'text-emerald-400')}>
              {formatUtcDateTime(p.lastCheckIn)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          onClose();
          navigate('/personnel');
        }}
        className="w-full py-2 px-3 rounded-lg bg-polar-800 hover:bg-polar-750 text-sky-200 border border-slate-700 hover:border-cyan-400 flex items-center justify-center gap-2 text-xs font-mono font-bold transition-all cursor-pointer"
      >
        <span>Open Personnel Records</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const renderEmergency = (e: EmergencyIncident) => (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.25)]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
            {e.incidentCode}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-rose-900 text-rose-200">
            {e.severity} SEVERITY
          </span>
        </div>
        <h3 className="text-sm font-bold text-rose-100">{e.title}</h3>
        <p className="text-xs text-rose-300/90 font-mono mt-1">{e.category}</p>
      </div>

      <div className="p-3 rounded-lg bg-polar-950/90 border border-slate-800 text-xs font-mono space-y-2">
        <span className="text-[11px] text-slate-300 uppercase font-bold block">Incident Perimeter</span>
        <p className="text-slate-400 text-xs font-sans leading-relaxed">{e.description}</p>
        <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
          <div>
            <span className="text-slate-400">Location:</span>{' '}
            <span className="text-slate-200">{e.locationName}</span>
          </div>
          <div>
            <span className="text-slate-400">Response Team:</span>{' '}
            <span className="text-sky-300">{e.assignedResponseTeam}</span>
          </div>
          <div>
            <span className="text-slate-400">Status:</span>{' '}
            <span className="text-amber-400 font-bold">{e.status}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          onClose();
          navigate('/emergency');
        }}
        className="w-full py-2 px-3 rounded-lg bg-rose-900 hover:bg-rose-800 text-rose-100 border border-rose-500 flex items-center justify-center gap-2 text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.3)]"
      >
        <span>Open Emergency Command Console</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="absolute z-[400] inset-x-2 bottom-2 sm:inset-auto sm:top-4 sm:right-4 sm:bottom-auto w-auto sm:w-[min(100%-2rem,24rem)] max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-2rem)] bg-polar-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl shadow-2xl p-4 text-left font-mono max-h-[50vh] sm:max-h-[85vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5" />
          <span>Telemetry Inspector</span>
        </span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-polar-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {entity.type === 'station' && renderStation(entity.data)}
      {entity.type === 'vessel' && renderVessel(entity.data)}
      {entity.type === 'cargo' && renderCargo(entity.data)}
      {entity.type === 'personnel' && renderPersonnel(entity.data)}
      {entity.type === 'emergency' && renderEmergency(entity.data)}
    </div>
  );
};
