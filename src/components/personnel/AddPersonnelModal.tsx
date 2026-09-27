import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Personnel, PersonnelStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  personToEdit?: Personnel | null;
}

export const AddPersonnelModal: React.FC<AddPersonnelModalProps> = ({
  isOpen,
  onClose,
  personToEdit
}) => {
  const { stations, addPersonnel, updatePersonnel } = useApp();

  const [badgeNumber, setBadgeNumber] = useState(
    personToEdit?.badgeNumber || `POL-IND-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [name, setName] = useState(personToEdit?.name || '');
  const [role, setRole] = useState(personToEdit?.role || 'Senior Glaciologist & Field Scout');
  const [specialty, setSpecialty] = useState(personToEdit?.specialty || 'Crevasse Detection & GPR Radar');
  const [team, setTeam] = useState<Personnel['team']>(personToEdit?.team || 'Scientific Research');
  const [currentStationId, setCurrentStationId] = useState(personToEdit?.currentStationId || stations[0]?.id || 'st-bharati');
  const [currentLocationName, setCurrentLocationName] = useState(personToEdit?.currentLocationName || 'Bharati Main Base');
  const [status, setStatus] = useState<PersonnelStatus>(personToEdit?.status || 'ACTIVE');
  const [bloodType, setBloodType] = useState(personToEdit?.bloodType || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(personToEdit?.emergencyContact || '+91-9820-112233');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const station = stations.find(s => s.id === currentStationId);
    const coords = station?.coords || { lat: -69.4064, lng: 76.1914 };

    if (personToEdit) {
      updatePersonnel(personToEdit.id, {
        badgeNumber,
        name,
        role,
        specialty,
        team,
        currentStationId,
        currentLocationName,
        status,
        bloodType,
        emergencyContact
      });
    } else {
      addPersonnel({
        badgeNumber,
        name,
        role,
        specialty,
        team,
        currentStationId,
        currentLocationName,
        coords,
        status,
        lastCheckIn: new Date().toISOString(),
        checkInOverdue: false,
        destination: currentLocationName,
        bloodType,
        emergencyContact,
        movementHistory: [
          {
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
            fromLocation: 'NCPOR Goa',
            toLocation: currentLocationName,
            mode: 'Expedition Deployment',
            notes: 'Field operative inducted into active polar roster'
          }
        ]
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={personToEdit ? 'Modify Personnel Record' : 'Deploy Field Personnel'}
      subtitle="Register polar scientists, logistics crew, medical officers, and station commands"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Badge ID</label>
            <input
              type="text"
              required
              value={badgeNumber}
              onChange={e => setBadgeNumber(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-bold mb-1 uppercase">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Rajesh K. Nair"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Role / Title</label>
            <input
              type="text"
              required
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Operational Team</label>
            <select
              value={team}
              onChange={e => setTeam(e.target.value as any)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="Scientific Research">Scientific Research</option>
              <option value="Logistics & Marine">Logistics & Marine</option>
              <option value="Medical & Safety">Medical & Safety</option>
              <option value="Engineering & Comms">Engineering & Comms</option>
              <option value="Station Command">Station Command</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase">Specialty & Qualifications</label>
          <input
            type="text"
            required
            value={specialty}
            onChange={e => setSpecialty(e.target.value)}
            className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Station Base</label>
            <select
              value={currentStationId}
              onChange={e => setCurrentStationId(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {stations.map(st => (
                <option key={st.id} value={st.id} className="bg-polar-900">
                  {st.flag} {st.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Current Field Location</label>
            <input
              type="text"
              required
              value={currentLocationName}
              onChange={e => setCurrentLocationName(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as PersonnelStatus)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="IN TRANSIT">IN TRANSIT</option>
              <option value="AT STATION">AT STATION</option>
              <option value="RESTING">RESTING</option>
              <option value="MEDICAL">MEDICAL</option>
              <option value="MISSING">MISSING</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Blood Type</label>
            <input
              type="text"
              required
              value={bloodType}
              onChange={e => setBloodType(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 font-bold text-rose-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Emergency Contact / SAR Channel</label>
            <input
              type="text"
              required
              value={emergencyContact}
              onChange={e => setEmergencyContact(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-polar-800 hover:bg-polar-750 text-slate-300 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)]"
          >
            {personToEdit ? 'Save Changes' : 'Deploy Personnel'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
