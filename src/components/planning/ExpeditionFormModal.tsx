import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Expedition, Milestone } from '../../types';
import { useApp } from '../../context/AppContext';

interface ExpeditionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  expeditionToEdit?: Expedition | null;
}

export const ExpeditionFormModal: React.FC<ExpeditionFormModalProps> = ({
  isOpen,
  onClose,
  expeditionToEdit
}) => {
  const { stations, addExpedition, updateExpedition } = useApp();

  const [code, setCode] = useState(expeditionToEdit?.code || 'ISEA-XLVI-2027');
  const [name, setName] = useState(expeditionToEdit?.name || '46th Indian Scientific Expedition to Antarctica');
  const [commander, setCommander] = useState(expeditionToEdit?.missionCommander || 'Dr. K. S. Verma (NCPOR)');
  const [startDate, setStartDate] = useState(expeditionToEdit?.startDate || '2027-10-01');
  const [endDate, setEndDate] = useState(expeditionToEdit?.endDate || '2028-04-15');
  const [primaryStation, setPrimaryStation] = useState(expeditionToEdit?.primaryStation || stations[0]?.id || 'st-bharati');
  const [budget, setBudget] = useState(expeditionToEdit?.budgetEstimatedUsd ? String(expeditionToEdit.budgetEstimatedUsd) : '15000000');
  const [objectivesText, setObjectivesText] = useState(
    expeditionToEdit?.objectives?.join('\n') ||
      'Continental ice-shelf radar tomography\nSub-glacial lake water column microbial sampling\nStation renewable wind turbine array deployment'
  );
  const [overallRisk, setOverallRisk] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE'>(
    expeditionToEdit?.riskAssessment?.overallRisk || 'MODERATE'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const objectives = objectivesText
      .split('\n')
      .map(o => o.trim())
      .filter(Boolean);

    const defaultMilestones: Milestone[] = [
      {
        id: `ms-${Date.now()}-1`,
        title: 'Mission Launch & Staging',
        stationOrPhase: 'Cape Town Logistics Berth',
        scheduledDate: startDate,
        status: 'PENDING',
        description: 'Vessel loading, fuel bunkering and environmental audit.'
      },
      {
        id: `ms-${Date.now()}-2`,
        title: 'Southern Ocean Transit',
        stationOrPhase: 'Roaring Forties Ice Route',
        scheduledDate: new Date(new Date(startDate).getTime() + 14 * 86400000).toISOString().substring(0, 10),
        status: 'PENDING',
        description: 'Transit to pack ice edge with continuous atmospheric data collection.'
      },
      {
        id: `ms-${Date.now()}-3`,
        title: 'Station Arrival & Resupply Operations',
        stationOrPhase: primaryStation,
        scheduledDate: new Date(new Date(startDate).getTime() + 28 * 86400000).toISOString().substring(0, 10),
        status: 'PENDING',
        description: 'Fuel pumping and heavy containerized science module offloading.'
      }
    ];

    if (expeditionToEdit) {
      updateExpedition(expeditionToEdit.id, {
        code,
        name,
        missionCommander: commander,
        startDate,
        endDate,
        primaryStation,
        budgetEstimatedUsd: Number(budget) || 10000000,
        objectives,
        riskAssessment: {
          ...expeditionToEdit.riskAssessment,
          overallRisk
        }
      });
    } else {
      addExpedition({
        code,
        name,
        missionCommander: commander,
        startDate,
        endDate,
        status: 'PLANNING',
        primaryStation,
        stationsInvolved: [primaryStation],
        assignedVesselIds: ['ves-polar-star'],
        assignedPersonnelIds: ['pers-01', 'pers-02'],
        assignedCargoIds: ['crg-101'],
        objectives,
        riskAssessment: {
          overallRisk,
          weatherRisk: 'Katabatic wind seasonal transition monitored',
          seaIceRisk: 'Pack ice satellite imagery analysis pending',
          logisticsRisk: 'Vessel charter confirmed'
        },
        budgetEstimatedUsd: Number(budget) || 12000000,
        budgetSpentUsd: 0,
        milestones: defaultMilestones,
        routeCoordinates: [
          { lat: -33.9249, lng: 18.4241 },
          { lat: -55.0, lng: 45.0 },
          { lat: -69.4064, lng: 76.1914 }
        ]
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expeditionToEdit ? 'Edit Expedition Mission' : 'Create New Polar Expedition'}
      subtitle="Configure operational parameters, assigned research stations, and risk tolerances"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Mission Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Primary Research Base</label>
            <select
              value={primaryStation}
              onChange={e => setPrimaryStation(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {stations.map(st => (
                <option key={st.id} value={st.id} className="bg-polar-900">
                  {st.flag} {st.name} ({st.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase">Expedition Title</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Mission Commander</label>
            <input
              type="text"
              required
              value={commander}
              onChange={e => setCommander(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Overall Risk Rating</label>
            <select
              value={overallRisk}
              onChange={e => setOverallRisk(e.target.value as any)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="LOW">LOW RISK</option>
              <option value="MODERATE">MODERATE RISK</option>
              <option value="HIGH">HIGH RISK</option>
              <option value="SEVERE">SEVERE RISK</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Start Date</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">End Date</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Estimated Budget (USD)</label>
            <input
              type="number"
              required
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase">
            Primary Scientific & Logistics Objectives (One per line)
          </label>
          <textarea
            rows={4}
            value={objectivesText}
            onChange={e => setObjectivesText(e.target.value)}
            className="w-full bg-polar-950 border border-slate-700 rounded-md p-3 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono text-xs"
          />
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
            {expeditionToEdit ? 'Save Changes' : 'Initialize Expedition'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
