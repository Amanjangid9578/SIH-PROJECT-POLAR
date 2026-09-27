import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { EmergencyIncident } from '../../types';
import { useApp } from '../../context/AppContext';

interface ResolveEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: EmergencyIncident | null;
}

export const ResolveEmergencyModal: React.FC<ResolveEmergencyModalProps> = ({
  isOpen,
  onClose,
  incident
}) => {
  const { resolveEmergency } = useApp();
  const [resolutionNotes, setResolutionNotes] = useState(
    'Search & Rescue mission completed. Field team secured inside refuge shelter with stable vitals. Threat neutralized.'
  );

  if (!incident) return null;

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    resolveEmergency(incident.id, resolutionNotes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="RESOLVE EMERGENCY INCIDENT"
      subtitle={`Formal stand-down and operational debrief for ${incident.incidentCode}`}
      maxWidth="md"
    >
      <form onSubmit={handleConfirmResolve} className="space-y-4 font-mono text-xs select-none">
        <div className="p-3.5 rounded-lg bg-polar-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold">{incident.incidentCode}</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-600/40 font-bold">
              {incident.severity}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-100">{incident.title}</h4>
          <p className="text-[11px] text-slate-400">{incident.locationName}</p>
        </div>

        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-amber-300 font-bold">Operational Confirmation Required</strong>
            <span>
              Resolving this incident will clear red tactical perimeter markers from the polar map, reset command alerts, and archive response logs.
            </span>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase">
            Official Resolution Debrief & Actions Taken
          </label>
          <textarea
            required
            rows={3}
            value={resolutionNotes}
            onChange={e => setResolutionNotes(e.target.value)}
            className="w-full bg-polar-950 border border-slate-700 rounded-md p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono text-xs"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-polar-800 hover:bg-polar-750 text-slate-300 text-xs font-bold"
          >
            Keep Active
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.35)] flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm Resolution & Stand Down</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
