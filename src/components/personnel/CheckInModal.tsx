import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Personnel, PersonnelStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { Radio, MapPin, CheckCircle2 } from 'lucide-react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Personnel | null;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  person
}) => {
  const { checkInPersonnel, stations } = useApp();

  const [locationName, setLocationName] = useState(person?.currentLocationName || 'Bharati Main Base');
  const [status, setStatus] = useState<PersonnelStatus>(person?.status || 'ACTIVE');

  if (!person) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkInPersonnel(person.id, locationName, status);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Field Check-In"
      subtitle={`Verify radio telemetry and update operational status for ${person.name}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        <div className="p-3 rounded-lg bg-polar-950 border border-slate-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Personnel:</span>
            <span className="text-slate-100 font-bold">{person.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Badge ID:</span>
            <span className="text-cyan-400 font-bold">{person.badgeNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Role / Specialty:</span>
            <span className="text-slate-300">{person.role}</span>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase">
            Current Field Location / Outpost
          </label>
          <input
            type="text"
            required
            value={locationName}
            onChange={e => setLocationName(e.target.value)}
            placeholder="e.g. Larsemann Ridge Shelter #2"
            className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase">Operational Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as PersonnelStatus)}
            className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer font-bold"
          >
            <option value="ACTIVE">ACTIVE (Field Operations)</option>
            <option value="IN TRANSIT">IN TRANSIT (Convoy / Vessel / Flight)</option>
            <option value="AT STATION">AT STATION (Living Quarters)</option>
            <option value="RESTING">RESTING (Mandatory Sleep Cycle)</option>
            <option value="MEDICAL">MEDICAL (Under Clinic Care)</option>
            <option value="MISSING">MISSING (SAR Activation)</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-polar-800 hover:bg-polar-750 text-slate-300 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)] flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm Check-in</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
