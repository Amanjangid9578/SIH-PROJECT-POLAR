import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Radio,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Bed,
  ArrowRight,
  Edit,
  Trash2,
  History,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Personnel, PersonnelStatus } from '../types';
import { CheckInModal } from '../components/personnel/CheckInModal';
import { AddPersonnelModal } from '../components/personnel/AddPersonnelModal';
import { formatTimeAgo, formatCoordinates, cn } from '../utils/formatters';

export const PersonnelPage: React.FC = () => {
  const { personnel, stations, deletePersonnel } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const [personToCheckIn, setPersonToCheckIn] = useState<Personnel | null>(null);
  const [personToEdit, setPersonToEdit] = useState<Personnel | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPersonForHistory, setSelectedPersonForHistory] = useState<Personnel | null>(null);

  // Stats
  const activeCount = personnel.filter(p => p.status === 'ACTIVE').length;
  const inTransitCount = personnel.filter(p => p.status === 'IN TRANSIT').length;
  const overdueCount = personnel.filter(p => p.checkInOverdue).length;

  const filteredPersonnel = useMemo(() => {
    return personnel.filter(p => {
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (selectedTeam !== 'ALL' && p.team !== selectedTeam) return false;
      if (selectedStation !== 'ALL' && p.currentStationId !== selectedStation) return false;
      if (showOverdueOnly && !p.checkInOverdue) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.badgeNumber.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.specialty.toLowerCase().includes(q) ||
          p.currentLocationName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [personnel, searchQuery, selectedStatus, selectedTeam, selectedStation, showOverdueOnly]);

  const getStatusBadge = (status: PersonnelStatus, isOverdue: boolean) => {
    if (isOverdue) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-500/60 uppercase font-black animate-pulse flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span>OVERDUE CHECK-IN</span>
        </span>
      );
    }

    switch (status) {
      case 'ACTIVE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>ACTIVE (FIELD)</span>
          </span>
        );
      case 'IN TRANSIT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase font-bold flex items-center gap-1">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>IN TRANSIT</span>
          </span>
        );
      case 'AT STATION':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950 text-sky-300 border border-sky-500/40 uppercase font-bold">
            AT STATION
          </span>
        );
      case 'RESTING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700 uppercase font-bold flex items-center gap-1">
            <Bed className="w-3 h-3 text-slate-400" />
            <span>RESTING</span>
          </span>
        );
      case 'MEDICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-500/40 uppercase font-bold flex items-center gap-1">
            <HeartPulse className="w-3 h-3 text-amber-400" />
            <span>MEDICAL CARE</span>
          </span>
        );
      case 'MISSING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-200 border border-rose-600 uppercase font-black animate-ping">
            MISSING (SAR ACTIVE)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-mono text-left select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-black text-slate-100 uppercase tracking-tight">
              Personnel Movement, Safety & Telemetry Check-In
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Field roster monitoring, mandatory radio schedules, biometric tags, and traverse team check-ins
          </p>
        </div>

        <button
          onClick={() => {
            setPersonToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Deploy Field Personnel</span>
        </button>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-polar-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Roster</span>
          <span className="text-2xl font-black text-slate-100">{personnel.length} OPERATORS</span>
          <span className="text-[11px] text-slate-500 block mt-1">Scientific & Marine Ops</span>
        </div>

        <div className="p-3.5 rounded-xl bg-polar-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Active in Field</span>
          <span className="text-2xl font-black text-emerald-300">{activeCount}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Conducting research/patrol</span>
        </div>

        <div className="p-3.5 rounded-xl bg-polar-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">In Transit</span>
          <span className="text-2xl font-black text-cyan-300">{inTransitCount}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Convoys & Vessels</span>
        </div>

        <div
          className={cn(
            'p-3.5 rounded-xl border',
            overdueCount > 0 ? 'bg-rose-950/40 border-rose-500/50' : 'bg-polar-900 border-slate-800'
          )}
        >
          <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Check-in Overdue</span>
          <span className="text-2xl font-black text-rose-300">{overdueCount}</span>
          <span className="text-[11px] text-slate-500 block mt-1">
            {overdueCount > 0 ? 'Search alert triggered' : 'All check-ins nominal'}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, badge ID, specialty, or outpost..."
              className="w-full bg-polar-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-polar-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="IN TRANSIT">IN TRANSIT</option>
              <option value="AT STATION">AT STATION</option>
              <option value="RESTING">RESTING</option>
              <option value="MEDICAL">MEDICAL</option>
              <option value="MISSING">MISSING</option>
            </select>

            {/* Team Filter */}
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="bg-polar-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ALL">All Teams</option>
              <option value="Scientific Research">Scientific Research</option>
              <option value="Logistics & Marine">Logistics & Marine</option>
              <option value="Medical & Safety">Medical & Safety</option>
              <option value="Engineering & Comms">Engineering & Comms</option>
              <option value="Station Command">Station Command</option>
            </select>

            {/* Station Filter */}
            <select
              value={selectedStation}
              onChange={e => setSelectedStation(e.target.value)}
              className="bg-polar-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ALL">All Bases</option>
              {stations.map(st => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>

            {/* Overdue Only Filter */}
            <button
              onClick={() => setShowOverdueOnly(!showOverdueOnly)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5',
                showOverdueOnly
                  ? 'bg-rose-950 text-rose-300 border-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                  : 'bg-polar-950 text-slate-400 border-slate-700 hover:text-white'
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Overdue Only ({overdueCount})</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span>Displaying {filteredPersonnel.length} of {personnel.length} operators</span>
          <span className="text-cyan-400 font-bold">Standard Radio Check Cycle: Every 4 Hours</span>
        </div>
      </div>

      {/* Personnel Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPersonnel.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs">
            No personnel found matching filter parameters.
          </div>
        ) : (
          filteredPersonnel.map(person => {
            const station = stations.find(s => s.id === person.currentStationId);
            return (
              <div
                key={person.id}
                className={cn(
                  'rounded-xl border p-4.5 bg-polar-900/90 transition-all space-y-3 relative group',
                  person.checkInOverdue
                    ? 'border-rose-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'border-slate-800 hover:border-cyan-500/40'
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold tracking-wider block">
                      {person.badgeNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-0.5">{person.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{person.role}</p>
                  </div>
                  <div>{getStatusBadge(person.status, person.checkInOverdue)}</div>
                </div>

                {/* Details */}
                <div className="p-3 rounded-lg bg-polar-950 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Team:</span>
                    <span className="text-sky-300 font-bold">{person.team}</span>
                  </div>
                  <div className="flex justify-between truncate">
                    <span className="text-slate-400">Field Sector:</span>
                    <span className="text-slate-200 font-bold truncate ml-1">{person.currentLocationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Station Base:</span>
                    <span className="text-slate-300">{station ? station.name.split(' ')[0] : 'In Transit'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Blood Type:</span>
                    <span className="text-rose-400 font-bold">{person.bloodType}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Last Check-In:</span>
                    <span
                      className={cn(
                        'font-bold',
                        person.checkInOverdue ? 'text-rose-400' : 'text-emerald-400'
                      )}
                    >
                      {formatTimeAgo(person.lastCheckIn)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
                  <button
                    onClick={() => setPersonToCheckIn(person)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Record Check-In</span>
                  </button>

                  <button
                    onClick={() => setSelectedPersonForHistory(person)}
                    className="p-1.5 rounded-lg bg-polar-800 hover:bg-polar-750 text-slate-300 border border-slate-700"
                    title="View movement history"
                  >
                    <History className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setPersonToEdit(person);
                      setIsAddModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-polar-800 hover:bg-polar-750 text-slate-300 border border-slate-700"
                    title="Edit record"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Remove ${person.name} from active roster?`)) {
                        deletePersonnel(person.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-polar-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Movement History Drawer Modal */}
      {selectedPersonForHistory && (
        <div className="fixed inset-0 z-50 overflow-hidden font-mono select-none">
          <div
            className="fixed inset-0 bg-polar-950/75 backdrop-blur-sm"
            onClick={() => setSelectedPersonForHistory(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-polar-900 border-l border-slate-800 shadow-2xl p-5 flex flex-col justify-between z-10 text-left overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">
                      Movement Telemetry Log
                    </span>
                    <h3 className="text-base font-bold text-slate-100">
                      {selectedPersonForHistory.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedPersonForHistory(null)}
                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-polar-800"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-300 uppercase block">
                    Traverse & Sector Transition Chain
                  </span>

                  <div className="border-l-2 border-slate-800 ml-2 pl-4 space-y-4 text-xs">
                    {selectedPersonForHistory.movementHistory.map((mov, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                        <div className="text-[10px] text-cyan-400 font-bold">{mov.timestamp}</div>
                        <div className="text-xs text-slate-200 font-bold mt-0.5">
                          {mov.fromLocation} → {mov.toLocation}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Mode: {mov.mode}</div>
                        <div className="text-[10px] text-slate-500 font-sans mt-0.5">{mov.notes}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedPersonForHistory(null)}
                  className="w-full py-2 rounded-lg bg-polar-800 hover:bg-polar-750 text-slate-200 text-xs font-bold"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CheckInModal
        isOpen={Boolean(personToCheckIn)}
        onClose={() => setPersonToCheckIn(null)}
        person={personToCheckIn}
      />
      <AddPersonnelModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        personToEdit={personToEdit}
      />
    </div>
  );
};
