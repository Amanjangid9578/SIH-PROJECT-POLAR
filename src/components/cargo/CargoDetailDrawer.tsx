import React from 'react';
import {
  X,
  Box,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ship,
  Thermometer,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CargoItem, CargoStatus } from '../../types';
import { formatWeight, formatCoordinates, cn } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

interface CargoDetailDrawerProps {
  cargo: CargoItem | null;
  onClose: () => void;
  onEdit: (cargo: CargoItem) => void;
}

export const CargoDetailDrawer: React.FC<CargoDetailDrawerProps> = ({
  cargo,
  onClose,
  onEdit
}) => {
  const { vessels, updateCargoStatus, deleteCargo } = useApp();

  if (!cargo) return null;

  const assignedVessel = vessels.find(v => v.id === cargo.assignedVesselId);

  const handleStatusChange = (newStatus: CargoStatus) => {
    updateCargoStatus(cargo.id, newStatus);
  };

  const steps = [
    { label: 'Origin', name: cargo.origin, isDone: true },
    { label: 'Maritime Transit', name: assignedVessel ? assignedVessel.name : 'Ocean Transit Corridor', isDone: cargo.status === 'In Transit' || cargo.status === 'At Station' || cargo.status === 'Delivered' },
    { label: 'Current Location', name: cargo.currentLocationName, isDone: true, isCurrent: true },
    { label: 'Destination Base', name: cargo.destination, isDone: cargo.status === 'Delivered' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono select-none">
      <div
        className="fixed inset-0 bg-polar-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-polar-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between z-10 text-left overflow-y-auto">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-polar-950/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-400 tracking-wider">
                  {cargo.trackingNumber}
                </span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase border',
                    cargo.status === 'Delayed'
                      ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                  )}
                >
                  {cargo.status}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-polar-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-base font-bold text-slate-100 mt-2">{cargo.description}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{cargo.category}</p>
          </div>

          {/* Body */}
          <div className="p-5 space-y-6 flex-1">
            {/* Quick Status Updater */}
            <div className="p-3.5 rounded-lg bg-polar-950/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 uppercase font-bold text-[10px]">
                  Manual Status Override
                </span>
                <span className="text-cyan-400 text-[11px]">Real-time state update</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={cargo.status}
                  onChange={e => handleStatusChange(e.target.value as CargoStatus)}
                  className="w-full bg-polar-900 border border-slate-700 text-xs text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer font-bold"
                >
                  <option value="Preparing">Preparing</option>
                  <option value="Loaded">Loaded</option>
                  <option value="In Transit">In Transit</option>
                  <option value="At Station">At Station</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Tactical Logistics Route Flow */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Consignment Transit Corridor
              </span>

              <div className="grid grid-cols-4 gap-1 relative">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs mb-1.5 transition-all',
                        step.isCurrent
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/30'
                          : step.isDone
                          ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                          : 'bg-polar-950 border-slate-700 text-slate-500'
                      )}
                    >
                      {step.isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">{step.label}</span>
                    <span className="text-[9px] text-slate-400 truncate w-full mt-0.5">{step.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-polar-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Gross Weight</span>
                <p className="text-sm font-bold text-slate-100">{formatWeight(cargo.weightKg)}</p>
                <span className="text-[10px] text-slate-500">Volume: {cargo.volumeM3} m³</span>
              </div>

              <div className="p-3 rounded-lg bg-polar-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Priority Rating</span>
                <p
                  className={cn(
                    'text-sm font-bold',
                    cargo.priority === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                  )}
                >
                  {cargo.priority}
                </p>
                <span className="text-[10px] text-slate-500">
                  {cargo.hazmat ? '⚠️ HAZMAT DECLARED' : 'Non-Hazardous'}
                </span>
              </div>
            </div>

            {/* Vessel & Location */}
            <div className="p-3.5 rounded-lg bg-polar-950/80 border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                Vessel Assignment & Position
              </span>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Carrier Vessel:</span>
                  <span className="text-slate-100 font-bold">{assignedVessel ? assignedVessel.name : 'Unassigned / Inland'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target ETA:</span>
                  <span className="text-sky-300 font-bold">{new Date(cargo.eta).toUTCString().substring(0, 22)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Telemetry Coordinates:</span>
                  <span className="text-cyan-400">{formatCoordinates(cargo.currentCoords.lat, cargo.currentCoords.lng)}</span>
                </div>
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Chain-of-Custody Timeline
              </span>
              <div className="border-l border-slate-800 ml-2 pl-4 space-y-3 text-xs">
                {cargo.timeline.map((entry, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                    <div className="text-[10px] text-cyan-400/90 font-bold">{entry.timestamp}</div>
                    <div className="text-[11px] text-slate-200 font-medium">{entry.event}</div>
                    <div className="text-[10px] text-slate-400">{entry.location} • Status: {entry.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 bg-polar-950/90 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                if (window.confirm(`Delete cargo shipment ${cargo.trackingNumber}?`)) {
                  deleteCargo(cargo.id);
                  onClose();
                }
              }}
              className="px-3 py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/50 text-xs font-bold transition-all cursor-pointer"
            >
              Delete
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(cargo)}
                className="px-4 py-2 rounded-lg bg-polar-800 hover:bg-polar-750 text-sky-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Edit Details
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
