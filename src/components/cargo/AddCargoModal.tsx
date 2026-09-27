import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { CargoItem, CargoCategory, CargoPriority, CargoStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddCargoModalProps {
  isOpen: boolean;
  onClose: () => void;
  cargoToEdit?: CargoItem | null;
}

export const AddCargoModal: React.FC<AddCargoModalProps> = ({
  isOpen,
  onClose,
  cargoToEdit
}) => {
  const { vessels, stations, addCargo, updateCargo } = useApp();

  const [trackingNumber, setTrackingNumber] = useState(
    cargoToEdit?.trackingNumber || `POL-CRG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [description, setDescription] = useState(cargoToEdit?.description || '');
  const [category, setCategory] = useState<CargoCategory>(cargoToEdit?.category || 'Scientific Instruments');
  const [priority, setPriority] = useState<CargoPriority>(cargoToEdit?.priority || 'HIGH');
  const [status, setStatus] = useState<CargoStatus>(cargoToEdit?.status || 'Preparing');
  const [weightKg, setWeightKg] = useState(cargoToEdit?.weightKg ? String(cargoToEdit.weightKg) : '1500');
  const [volumeM3, setVolumeM3] = useState(cargoToEdit?.volumeM3 ? String(cargoToEdit.volumeM3) : '4.5');
  const [origin, setOrigin] = useState(cargoToEdit?.origin || 'NCPOR Goa (India)');
  const [destination, setDestination] = useState(cargoToEdit?.destination || 'Bharati Research Station');
  const [currentLocationName, setCurrentLocationName] = useState(
    cargoToEdit?.currentLocationName || 'Cape Town Staging Depot'
  );
  const [assignedVesselId, setAssignedVesselId] = useState(cargoToEdit?.assignedVesselId || vessels[0]?.id || '');
  const [eta, setEta] = useState(
    cargoToEdit?.eta ? cargoToEdit.eta.substring(0, 10) : new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10)
  );
  const [hazmat, setHazmat] = useState(cargoToEdit?.hazmat || false);
  const [tempControlled, setTempControlled] = useState(cargoToEdit?.temperatureControlled || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Pick coordinates based on assigned vessel or destination station
    const vessel = vessels.find(v => v.id === assignedVesselId);
    const station = stations.find(s => s.name.includes(destination));
    const coords = vessel?.coords || station?.coords || { lat: -64.215, lng: 55.402 };

    if (cargoToEdit) {
      updateCargo(cargoToEdit.id, {
        trackingNumber,
        description,
        category,
        priority,
        status,
        weightKg: Number(weightKg) || 100,
        volumeM3: Number(volumeM3) || 1,
        origin,
        destination,
        currentLocationName,
        assignedVesselId,
        eta: new Date(eta).toISOString(),
        hazmat,
        temperatureControlled: tempControlled
      });
    } else {
      addCargo({
        trackingNumber,
        description,
        category,
        weightKg: Number(weightKg) || 100,
        volumeM3: Number(volumeM3) || 1,
        origin,
        destination,
        currentLocationName,
        currentCoords: coords,
        status,
        priority,
        assignedVesselId,
        eta: new Date(eta).toISOString(),
        departureDate: new Date().toISOString(),
        temperatureControlled: tempControlled,
        hazmat,
        timeline: [
          {
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
            location: origin,
            event: 'Shipment manifest registered into Polar Command',
            status
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
      title={cargoToEdit ? 'Modify Cargo Manifest' : 'Register Polar Cargo Consignment'}
      subtitle="Logistics manifest, container weights, hazmat declarations, and vessel routing"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Tracking ID</label>
            <input
              type="text"
              required
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as CargoCategory)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="Food & Rations">Food & Rations</option>
              <option value="Medical Supplies">Medical Supplies</option>
              <option value="Fuel & Energy">Fuel & Energy</option>
              <option value="Scientific Instruments">Scientific Instruments</option>
              <option value="Heavy Machinery">Heavy Machinery</option>
              <option value="Communications">Communications</option>
              <option value="Survival Gear">Survival Gear</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase">Cargo Description & Contents</label>
          <input
            type="text"
            required
            placeholder="e.g. Deep Ice Core Drill Augers & Tungsten Bits"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Weight (kg)</label>
            <input
              type="number"
              required
              value={weightKg}
              onChange={e => setWeightKg(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Volume (m³)</label>
            <input
              type="number"
              step="0.1"
              required
              value={volumeM3}
              onChange={e => setVolumeM3(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as CargoPriority)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Origin Port / Lab</label>
            <input
              type="text"
              required
              value={origin}
              onChange={e => setOrigin(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Destination Base</label>
            <input
              type="text"
              required
              value={destination}
              onChange={e => setDestination(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Assigned Vessel</label>
            <select
              value={assignedVesselId}
              onChange={e => setAssignedVesselId(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="">None (Station Held)</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id} className="bg-polar-900">
                  {v.name} ({v.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as CargoStatus)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
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

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Target Arrival (ETA)</label>
            <input
              type="date"
              required
              value={eta}
              onChange={e => setEta(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={hazmat}
              onChange={e => setHazmat(e.target.checked)}
              className="rounded bg-polar-950 border-slate-700 text-rose-500 focus:ring-0"
            />
            <span className="font-bold text-rose-400">Hazardous Materials (HAZMAT)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={tempControlled}
              onChange={e => setTempControlled(e.target.checked)}
              className="rounded bg-polar-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="text-cyan-300">Temperature Controlled Storage</span>
          </label>
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
            {cargoToEdit ? 'Save Changes' : 'Register Cargo'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
