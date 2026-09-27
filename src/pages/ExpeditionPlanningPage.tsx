import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  DollarSign,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Users,
  Ship,
  Box,
  Building2,
  MapPin,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Expedition, Milestone, ExpeditionStatus } from '../types';
import { ExpeditionTimeline } from '../components/planning/ExpeditionTimeline';
import { ExpeditionFormModal } from '../components/planning/ExpeditionFormModal';
import { formatCurrency, formatCoordinates, cn } from '../utils/formatters';

export const ExpeditionPlanningPage: React.FC = () => {
  const {
    expeditions,
    activeExpeditionId,
    setActiveExpeditionId,
    updateExpedition,
    deleteExpedition,
    stations,
    vessels,
    personnel,
    cargo
  } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expeditionToEdit, setExpeditionToEdit] = useState<Expedition | null>(null);

  const selectedExpedition = expeditions.find(e => e.id === activeExpeditionId) || expeditions[0];

  const handleStatusChange = (newStatus: ExpeditionStatus) => {
    if (selectedExpedition) {
      updateExpedition(selectedExpedition.id, { status: newStatus });
    }
  };

  const handleUpdateMilestones = (updatedMilestones: Milestone[]) => {
    if (selectedExpedition) {
      updateExpedition(selectedExpedition.id, { milestones: updatedMilestones });
    }
  };

  const handleDeleteCurrent = () => {
    if (!selectedExpedition) return;
    if (window.confirm(`Are you certain you want to permanently delete expedition "${selectedExpedition.name}"?`)) {
      deleteExpedition(selectedExpedition.id);
    }
  };

  if (!selectedExpedition) {
    return (
      <div className="py-20 text-center font-mono">
        <p className="text-slate-400">No expeditions found. Create one to begin mission planning.</p>
        <button
          onClick={() => {
            setExpeditionToEdit(null);
            setIsFormOpen(true);
          }}
          className="mt-4 px-4 py-2 rounded-lg bg-cyan-600 text-slate-950 font-bold"
        >
          Initialize Expedition
        </button>
        <ExpeditionFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          expeditionToEdit={null}
        />
      </div>
    );
  }

  const assignedStations = stations.filter(s =>
    selectedExpedition.stationsInvolved.includes(s.id) || selectedExpedition.primaryStation === s.id
  );
  const assignedVesselsList = vessels.filter(v => selectedExpedition.assignedVesselIds.includes(v.id));
  const assignedCrewList = personnel.filter(p => selectedExpedition.assignedPersonnelIds.includes(p.id));
  const assignedCargoList = cargo.filter(c => selectedExpedition.assignedCargoIds.includes(c.id));

  const budgetSpent = selectedExpedition.budgetSpentUsd || 0;
  const budgetTotal = selectedExpedition.budgetEstimatedUsd || 1;
  const budgetPercent = Math.min(100, Math.round((budgetSpent / budgetTotal) * 100));

  return (
    <div className="space-y-6 pb-12 font-mono text-left select-none">
      {/* Page Title & Expedition Switcher Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-black text-slate-100 uppercase tracking-tight">
              Expedition Planning & Tactical Governance
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Lifecycle phasing, asset allocation, milestone tracking, and multi-hazard risk assessment
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Expedition Select Pills */}
          <div className="flex items-center gap-1.5 bg-polar-900 border border-slate-700 rounded-lg p-1">
            {expeditions.map(exp => (
              <button
                key={exp.id}
                onClick={() => setActiveExpeditionId(exp.id)}
                className={cn(
                  'px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer',
                  exp.id === selectedExpedition.id
                    ? 'bg-cyan-600 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {exp.code}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setExpeditionToEdit(null);
              setIsFormOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Expedition</span>
          </button>
        </div>
      </div>

      {/* Selected Expedition Header Card */}
      <div className="rounded-xl bg-gradient-to-r from-polar-900 via-polar-850 to-polar-900 border border-cyan-500/30 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
                {selectedExpedition.code}
              </span>
              <span className="text-xs text-slate-400">
                Commander: <strong className="text-slate-200">{selectedExpedition.missionCommander}</strong>
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-100 uppercase tracking-tight">
              {selectedExpedition.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Status Dropdown */}
            <select
              value={selectedExpedition.status}
              onChange={e => handleStatusChange(e.target.value as ExpeditionStatus)}
              className="bg-polar-950 border border-slate-700 text-xs text-cyan-300 font-bold rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:border-cyan-400 shadow-inner"
            >
              <option value="PLANNING">PLANNING</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="OPERATIONAL">OPERATIONAL</option>
              <option value="TRANSIT">TRANSIT</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="STANDBY">STANDBY</option>
            </select>

            <button
              onClick={() => {
                setExpeditionToEdit(selectedExpedition);
                setIsFormOpen(true);
              }}
              className="p-2 rounded-lg bg-polar-800 hover:bg-polar-750 text-slate-300 hover:text-white border border-slate-700"
              title="Edit expedition settings"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDeleteCurrent}
              className="p-2 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-500/40"
              title="Delete expedition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Objectives & Budget Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
          <div className="lg:col-span-2 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Core Mission Scientific & Logistic Objectives
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {selectedExpedition.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold shrink-0">›</span>
                  <span className="font-sans text-xs">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-polar-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 text-[10px] uppercase">Expenditure Telemetry</span>
              <span className="text-cyan-400 font-bold">{budgetPercent}%</span>
            </div>
            <div className="w-full bg-polar-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full"
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Spent: <strong>{formatCurrency(budgetSpent)}</strong></span>
              <span>Total: <strong>{formatCurrency(budgetTotal)}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Hazard Risk Assessment Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-polar-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Overall Risk Rating</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-base font-black text-amber-300 uppercase">
              {selectedExpedition.riskAssessment.overallRisk}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Calculated composite vulnerability</p>
        </div>

        <div className="p-3.5 rounded-xl bg-polar-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Weather Hazard</span>
          <span className="text-xs font-bold text-slate-200 block truncate">
            {selectedExpedition.riskAssessment.weatherRisk}
          </span>
          <p className="text-[11px] text-slate-500">Katabatic wind and blizzard surges</p>
        </div>

        <div className="p-3.5 rounded-xl bg-polar-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Sea-Ice Concentration</span>
          <span className="text-xs font-bold text-slate-200 block truncate">
            {selectedExpedition.riskAssessment.seaIceRisk}
          </span>
          <p className="text-[11px] text-slate-500">Fast-ice & pack navigation risk</p>
        </div>

        <div className="p-3.5 rounded-xl bg-polar-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Logistics Bottleneck</span>
          <span className="text-xs font-bold text-slate-200 block truncate">
            {selectedExpedition.riskAssessment.logisticsRisk}
          </span>
          <p className="text-[11px] text-slate-500">Vessel transit and supply lines</p>
        </div>
      </div>

      {/* Interactive Operational Timeline */}
      <ExpeditionTimeline
        milestones={selectedExpedition.milestones}
        onUpdateMilestones={handleUpdateMilestones}
      />

      {/* Assigned Assets & Logistics Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Assigned Vessels */}
        <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Ship className="w-4 h-4 text-cyan-400" />
              <span>Assigned Polar Fleet ({assignedVesselsList.length})</span>
            </span>
          </div>
          <div className="space-y-2">
            {assignedVesselsList.map(v => (
              <div key={v.id} className="p-2.5 rounded-lg bg-polar-950 border border-slate-800 text-xs">
                <div className="flex justify-between font-bold text-slate-100">
                  <span>{v.name}</span>
                  <span className="text-cyan-400">{v.speedKnots} kts</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {v.type} • Destination: {v.destination}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Stations */}
        <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Involved Research Stations ({assignedStations.length})</span>
            </span>
          </div>
          <div className="space-y-2">
            {assignedStations.map(st => (
              <div key={st.id} className="p-2.5 rounded-lg bg-polar-950 border border-slate-800 text-xs">
                <div className="flex justify-between font-bold text-slate-100">
                  <span>{st.flag} {st.name}</span>
                  <span className="text-sky-300">{st.weather.tempC}°C</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Capacity: {st.currentPersonnel}/{st.capacity} • Fuel: {st.fuelLevelPercent}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Personnel */}
        <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Assigned Field Crew ({assignedCrewList.length})</span>
            </span>
          </div>
          <div className="space-y-2">
            {assignedCrewList.slice(0, 3).map(p => (
              <div key={p.id} className="p-2.5 rounded-lg bg-polar-950 border border-slate-800 text-xs">
                <div className="flex justify-between font-bold text-slate-100">
                  <span>{p.name}</span>
                  <span className={cn('text-[10px]', p.checkInOverdue ? 'text-rose-400' : 'text-emerald-400')}>
                    {p.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {p.role} • {p.currentLocationName}
                </div>
              </div>
            ))}
            {assignedCrewList.length > 3 && (
              <div className="text-[11px] text-slate-500 text-center pt-1">
                + {assignedCrewList.length - 3} additional personnel assigned
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <ExpeditionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        expeditionToEdit={expeditionToEdit}
      />
    </div>
  );
};
