import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Users,
  Radio,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Send
} from 'lucide-react';
import { EmergencyCategory, EmergencySeverity } from '../../types';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/formatters';

interface DeclareEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeclareEmergencyModal: React.FC<DeclareEmergencyModalProps> = ({
  isOpen,
  onClose
}) => {
  const { personnel, cargo, stations, createEmergency } = useApp();

  const [step, setStep] = useState(1);

  // Workflow Form State
  const [category, setCategory] = useState<EmergencyCategory>('Severe Weather');
  const [severity, setSeverity] = useState<EmergencySeverity>('HIGH');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [locationName, setLocationName] = useState('Larsemann Ridge Outpost, Sector 4');
  const [lat, setLat] = useState('-69.4180');
  const [lng, setLng] = useState('76.1200');
  const [radiusKm, setRadiusKm] = useState('15');

  const [affectedPersonnelIds, setAffectedPersonnelIds] = useState<string[]>([]);
  const [affectedAssetIds, setAffectedAssetIds] = useState<string[]>([]);

  const [assignedResponseTeam, setAssignedResponseTeam] = useState('Bharati Search & Rescue Unit Bravo');
  const [leadResponder, setLeadResponder] = useState('Dr. Sunita Sen (CMO)');
  const [commChannel, setCommChannel] = useState('HF Channel 16 & Iridium Tactical Net');

  const handleTogglePersonnel = (id: string) => {
    setAffectedPersonnelIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleAsset = (id: string) => {
    setAffectedAssetIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createEmergency({
      category,
      severity,
      status: 'RESPONSE ACTIVE',
      title: title.trim(),
      description: description.trim() || 'Command declared polar emergency incident.',
      locationName: locationName.trim(),
      coords: {
        lat: parseFloat(lat) || -69.418,
        lng: parseFloat(lng) || 76.12
      },
      radiusKm: parseInt(radiusKm, 10) || 10,
      affectedPersonnelIds,
      affectedAssetIds,
      assignedResponseTeam,
      leadResponder
    });

    onClose();
    // Reset state
    setStep(1);
    setTitle('');
    setDescription('');
  };

  const stepTitles = [
    '1. Identify Incident',
    '2. Confirm Coordinates',
    '3. Affected Personnel & Assets',
    '4. Assign Response Team',
    '5. Confirm & Broadcast'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="EMERGENCY DECLARATION WORKFLOW"
      subtitle="Standard Operating Procedure (SOP) for Polar Search & Rescue and Incident Response"
      maxWidth="2xl"
      variant="emergency"
    >
      <div className="font-mono text-xs select-none">
        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-[10px] text-slate-400">
          {stepTitles.map((st, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-1 font-bold',
                step === idx + 1 ? 'text-rose-400' : step > idx + 1 ? 'text-emerald-400' : 'text-slate-600'
              )}
            >
              <span
                className={cn(
                  'h-4 w-4 rounded-full flex items-center justify-center text-[9px] border',
                  step === idx + 1
                    ? 'border-rose-500 bg-rose-950 text-rose-300'
                    : step > idx + 1
                    ? 'border-emerald-500 bg-emerald-950 text-emerald-300'
                    : 'border-slate-700 bg-polar-950 text-slate-500'
                )}
              >
                {step > idx + 1 ? '✓' : idx + 1}
              </span>
              <span className="hidden sm:inline">{st.split('. ')[1]}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Identify Incident */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase">Incident Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as EmergencyCategory)}
                  className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500 cursor-pointer font-bold"
                >
                  <option value="Severe Weather">Severe Weather (Blizzard / Katabatic)</option>
                  <option value="Medical Emergency">Medical Emergency (Frostbite / Trauma)</option>
                  <option value="Vehicle Failure">Vehicle Failure (PistenBully / Sledge)</option>
                  <option value="Communication Loss">Communication Loss (Radio Silence)</option>
                  <option value="Fire">Fire / Heating Failure</option>
                  <option value="Missing Personnel">Missing Personnel / Crevasse Fall</option>
                  <option value="Cargo Damage">Cargo Damage / Fuel Leak</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase">Severity Level</label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value as EmergencySeverity)}
                  className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-rose-300 font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="CRITICAL">CRITICAL (Immediate Threat to Life/Station)</option>
                  <option value="HIGH">HIGH (Severe Mission Hazard)</option>
                  <option value="MEDIUM">MEDIUM (Operational Setback)</option>
                  <option value="LOW">LOW (Advisory / Caution)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase">Incident Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Whiteout Blizzard & Field Crew Radio Silence"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase">Initial Incident Debrief</label>
              <textarea
                rows={3}
                placeholder="Describe observed conditions, timeline of failure, and immediate risks..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-polar-950 border border-slate-700 rounded-md p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Confirm Location & Perimeter */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase">Location Name / Sector</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase">Latitude (°)</label>
                <input
                  type="text"
                  value={lat}
                  onChange={e => setLat(e.target.value)}
                  className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase">Longitude (°)</label>
                <input
                  type="text"
                  value={lng}
                  onChange={e => setLng(e.target.value)}
                  className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase">Perimeter Radius (km)</label>
                <input
                  type="number"
                  value={radiusKm}
                  onChange={e => setRadiusKm(e.target.value)}
                  className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-polar-950 border border-slate-800 text-slate-400 text-xs">
              <span className="text-cyan-400 font-bold">Quick Coordinate Presets:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {stations.map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setLocationName(st.name);
                      setLat(String(st.coords.lat));
                      setLng(String(st.coords.lng));
                    }}
                    className="px-2 py-1 rounded bg-polar-900 hover:bg-polar-800 border border-slate-700 text-[11px] text-slate-200"
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Affected Personnel & Assets */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase">
                Tag Potentially Affected Personnel
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {personnel.map(p => (
                  <label
                    key={p.id}
                    className={cn(
                      'p-2 rounded border flex items-center justify-between cursor-pointer transition-all',
                      affectedPersonnelIds.includes(p.id)
                        ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                        : 'bg-polar-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    )}
                  >
                    <div>
                      <div className="font-bold text-xs">{p.name}</div>
                      <div className="text-[10px] text-slate-500">{p.role}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={affectedPersonnelIds.includes(p.id)}
                      onChange={() => handleTogglePersonnel(p.id)}
                      className="rounded bg-polar-900 border-slate-700 text-rose-500 focus:ring-0"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase">
                Tag At-Risk Cargo / Equipment Assets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {cargo.map(c => (
                  <label
                    key={c.id}
                    className={cn(
                      'p-2 rounded border flex items-center justify-between cursor-pointer transition-all',
                      affectedAssetIds.includes(c.id)
                        ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                        : 'bg-polar-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    )}
                  >
                    <div className="truncate mr-2">
                      <div className="font-bold text-xs truncate">{c.trackingNumber}</div>
                      <div className="text-[10px] text-slate-500 truncate">{c.description}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={affectedAssetIds.includes(c.id)}
                      onChange={() => handleToggleAsset(c.id)}
                      className="rounded bg-polar-900 border-slate-700 text-rose-500 focus:ring-0"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Assign Response Team & Comms */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase">Response Team Unit</label>
                <input
                  type="text"
                  required
                  value={assignedResponseTeam}
                  onChange={e => setAssignedResponseTeam(e.target.value)}
                  className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase">Incident Commander / Lead</label>
                <input
                  type="text"
                  required
                  value={leadResponder}
                  onChange={e => setLeadResponder(e.target.value)}
                  className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase">Tactical Comms Channel</label>
              <input
                type="text"
                required
                value={commChannel}
                onChange={e => setCommChannel(e.target.value)}
                className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs">
              <span className="font-bold block mb-1">Standard Emergency Notification Broadcasts:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-300">
                <li>NCPOR Emergency Operations Centre (Goa)</li>
                <li>Maritime Rescue Coordination Centre (MRCC Cape Town)</li>
                <li>All Antarctic base consoles via Iridium satellite packet broadcast</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 5: Confirm & Broadcast */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-950/60 border-2 border-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-rose-300">CONFIRM DISPATCH SUMMARY</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-rose-900 text-rose-100 font-bold">
                  {severity}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{title || 'Untitled Emergency Incident'}</h3>
              <p className="text-xs text-rose-200">{category} at {locationName}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-rose-500/40 text-rose-300">
                <div>Team: <strong>{assignedResponseTeam}</strong></div>
                <div>Lead: <strong>{leadResponder}</strong></div>
                <div>Affected Crew: <strong>{affectedPersonnelIds.length} person(s)</strong></div>
                <div>Radius: <strong>{radiusKm} km perimeter</strong></div>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center">
              Clicking "Broadcast & Engage" will trigger audible command alarms, update live operational map markers to critical red, and dispatch automated notification alerts.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-800 mt-5">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg bg-polar-800 hover:bg-polar-750 text-slate-300 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-polar-800 hover:bg-polar-750 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !title.trim()) {
                  alert('Please provide an incident title.');
                  return;
                }
                setStep(step + 1);
              }}
              className="px-5 py-2 rounded-lg bg-rose-900 hover:bg-rose-800 text-rose-100 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(244,63,94,0.3)] cursor-pointer"
            >
              <span>Proceed to Step {step + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-2 shadow-[0_0_25px_rgba(239,68,68,0.6)] cursor-pointer animate-pulse"
            >
              <Send className="w-4 h-4" />
              <span>BROADCAST & ENGAGE SAR RESPONSE</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
