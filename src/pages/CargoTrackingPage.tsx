import React, { useState, useMemo } from 'react';
import {
  Box,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Ship,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CargoItem, CargoStatus, CargoCategory, CargoPriority } from '../types';
import { formatWeight, formatCoordinates, cn } from '../utils/formatters';
import { AddCargoModal } from '../components/cargo/AddCargoModal';
import { CargoDetailDrawer } from '../components/cargo/CargoDetailDrawer';
import { PolarMap } from '../components/maps/PolarMap';

export const CargoTrackingPage: React.FC = () => {
  const { cargo, vessels, deleteCargo } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'eta' | 'weight' | 'trackingNumber'>('eta');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [cargoToEdit, setCargoToEdit] = useState<CargoItem | null>(null);
  const [selectedCargoDetail, setSelectedCargoDetail] = useState<CargoItem | null>(null);

  // Filter & Sort
  const filteredCargo = useMemo(() => {
    return cargo
      .filter(item => {
        if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
        if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
        if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          return (
            item.trackingNumber.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.origin.toLowerCase().includes(q) ||
            item.destination.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'weight') cmp = a.weightKg - b.weightKg;
        else if (sortBy === 'trackingNumber') cmp = a.trackingNumber.localeCompare(b.trackingNumber);
        else cmp = new Date(a.eta).getTime() - new Date(b.eta).getTime();

        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [cargo, searchQuery, selectedStatus, selectedCategory, selectedPriority, sortBy, sortOrder]);

  const getStatusBadge = (status: CargoStatus) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>In Transit</span>
          </span>
        );
      case 'Delayed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-500/50 uppercase font-bold flex items-center gap-1 animate-pulse">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span>Delayed</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Delivered</span>
          </span>
        );
      case 'At Station':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950 text-sky-300 border border-sky-500/40 uppercase font-bold flex items-center gap-1">
            <span>At Station</span>
          </span>
        );
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-600 uppercase font-black flex items-center gap-1 animate-ping">
            <span>Critical</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400 border border-slate-700 uppercase font-bold">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (p: CargoPriority) => {
    switch (p) {
      case 'CRITICAL':
        return <span className="text-rose-400 font-bold">CRITICAL</span>;
      case 'HIGH':
        return <span className="text-amber-400 font-bold">HIGH</span>;
      case 'MEDIUM':
        return <span className="text-sky-300">MEDIUM</span>;
      default:
        return <span className="text-slate-400">LOW</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-mono text-left select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Box className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-black text-slate-100 uppercase tracking-tight">
              Polar Cargo Consignment & Cold-Chain Tracking
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time multi-modal logistics from Indian ports across the Southern Ocean to Antarctic ice-shelves
          </p>
        </div>

        <button
          onClick={() => {
            setCargoToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Cargo Consignment</span>
        </button>
      </div>

      {/* Mini Polar Route Tracker Map */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-polar-900">
        <PolarMap
          className="h-[320px]"
          highlightCargoId={selectedCargoDetail?.id}
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Tracking ID, equipment name, origin, or destination base..."
              className="w-full bg-polar-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-polar-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="In Transit">In Transit</option>
              <option value="Delayed">Delayed</option>
              <option value="Loaded">Loaded</option>
              <option value="Preparing">Preparing</option>
              <option value="At Station">At Station</option>
              <option value="Delivered">Delivered</option>
              <option value="Critical">Critical</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-polar-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Scientific Instruments">Scientific Instruments</option>
              <option value="Fuel & Energy">Fuel & Energy</option>
              <option value="Medical Supplies">Medical Supplies</option>
              <option value="Food & Rations">Food & Rations</option>
              <option value="Spare Parts">Spare Parts</option>
              <option value="Heavy Machinery">Heavy Machinery</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="bg-polar-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-polar-950 border border-slate-700 text-slate-300 hover:text-white"
              title="Toggle Ascending/Descending"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase text-[11px]">{sortOrder}</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span>Showing {filteredCargo.length} of {cargo.length} cargo consignments</span>
          <span className="text-cyan-400 font-bold">
            Total Mass: {formatWeight(filteredCargo.reduce((s, c) => s + c.weightKg, 0))}
          </span>
        </div>
      </div>

      {/* Cargo Manifest Table */}
      <div className="rounded-xl border border-slate-800 bg-polar-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-polar-950 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Tracking ID</th>
                <th className="py-3 px-4">Description & Category</th>
                <th className="py-3 px-4">Weight / Vol</th>
                <th className="py-3 px-4">Carrier Vessel / Location</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCargo.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 text-xs">
                    No cargo items matching active filters.
                  </td>
                </tr>
              ) : (
                filteredCargo.map(item => {
                  const assignedVessel = vessels.find(v => v.id === item.assignedVesselId);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedCargoDetail(item)}
                      className="hover:bg-polar-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-bold text-cyan-300">
                        {item.trackingNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-100 max-w-xs truncate">
                          {item.description}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {item.category} {item.hazmat && <span className="text-rose-400 font-bold">• HAZMAT</span>}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200">{formatWeight(item.weightKg)}</div>
                        <div className="text-[10px] text-slate-500">{item.volumeM3} m³</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-bold flex items-center gap-1.5">
                          {assignedVessel && <Ship className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          <span className="truncate max-w-[140px]">
                            {assignedVessel ? assignedVessel.name : item.currentLocationName}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {item.currentLocationName}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-200">
                        {item.destination}
                      </td>

                      <td className="py-3 px-4 text-[11px]">
                        {getPriorityBadge(item.priority)}
                      </td>

                      <td className="py-3 px-4">
                        {getStatusBadge(item.status)}
                      </td>

                      <td className="py-3 px-4 text-sky-300 font-bold whitespace-nowrap">
                        {new Date(item.eta).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setCargoToEdit(item);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-polar-800"
                            title="Edit Cargo"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete cargo shipment ${item.trackingNumber}?`)) {
                                deleteCargo(item.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-polar-800"
                            title="Delete Cargo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals & Drawers */}
      <AddCargoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        cargoToEdit={cargoToEdit}
      />
      <CargoDetailDrawer
        cargo={selectedCargoDetail}
        onClose={() => setSelectedCargoDetail(null)}
        onEdit={cargo => {
          setSelectedCargoDetail(null);
          setCargoToEdit(cargo);
          setIsAddModalOpen(true);
        }}
      />
    </div>
  );
};
