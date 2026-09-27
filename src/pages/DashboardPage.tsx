import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Ship,
  Box,
  Layers,
  Users,
  AlertTriangle,
  Zap,
  ArrowRight,
  Radio,
  Plus,
  PackagePlus,
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MissionHeader } from '../components/dashboard/MissionHeader';
import { KpiCard } from '../components/dashboard/KpiCard';
import { AlertTicker } from '../components/dashboard/AlertTicker';
import { PolarMap } from '../components/maps/PolarMap';
import { DeclareEmergencyModal } from '../components/emergency/DeclareEmergencyModal';
import { AddCargoModal } from '../components/cargo/AddCargoModal';
import { AddInventoryModal } from '../components/inventory/AddInventoryModal';
import { AddPersonnelModal } from '../components/personnel/AddPersonnelModal';
import { SmartReorderModal } from '../components/inventory/SmartReorderModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    expeditions,
    cargo,
    inventory,
    personnel,
    emergencies,
    vessels,
    stations
  } = useApp();

  const [isDeclareEmergencyOpen, setIsDeclareEmergencyOpen] = useState(false);
  const [isAddCargoOpen, setIsAddCargoOpen] = useState(false);
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [isAddPersonnelOpen, setIsAddPersonnelOpen] = useState(false);
  const [isSmartReorderOpen, setIsSmartReorderOpen] = useState(false);

  // Compute live KPIs
  const activeExpeditionsCount = expeditions.filter(e => e.status === 'OPERATIONAL' || e.status === 'ACTIVE').length;
  const inTransitCargoCount = cargo.filter(c => c.status === 'In Transit').length;
  const delayedCargoCount = cargo.filter(c => c.status === 'Delayed').length;
  const deployedPersonnelCount = personnel.filter(p => p.status === 'ACTIVE' || p.status === 'IN TRANSIT').length;
  const overduePersonnelCount = personnel.filter(p => p.checkInOverdue).length;

  const totalCurrentStock = inventory.reduce((sum, i) => sum + i.quantity, 0);
  const totalMaxStock = inventory.reduce((sum, i) => sum + i.maxCapacity, 0);
  const inventoryUtilizationPercent = totalMaxStock > 0 ? Math.round((totalCurrentStock / totalMaxStock) * 100) : 0;
  const lowStockCount = inventory.filter(i => i.quantity <= i.reorderThreshold).length;

  const criticalAlertsCount =
    emergencies.filter(e => e.severity === 'CRITICAL' && e.status !== 'RESOLVED').length +
    (overduePersonnelCount > 0 ? 1 : 0);

  return (
    <div className="space-y-5 pb-8">
      {/* Active Expedition Header Banner */}
      <MissionHeader onDeclareEmergency={() => setIsDeclareEmergencyOpen(true)} />

      {/* Live Tactical Alert Ticker */}
      <AlertTicker />

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <KpiCard
          title="Active Expeditions"
          value={activeExpeditionsCount}
          change="+1 In Season"
          isPositiveChange={true}
          contextText={`${expeditions.length} total registered campaigns`}
          icon={Compass}
          variant="cyan"
          targetRoute="/planning"
        />

        <KpiCard
          title="Cargo in Transit"
          value={inTransitCargoCount}
          change={delayedCargoCount > 0 ? `${delayedCargoCount} Delayed` : 'On Schedule'}
          isPositiveChange={delayedCargoCount === 0}
          contextText={`${cargo.length} tracked shipments across polar routes`}
          icon={Box}
          variant={delayedCargoCount > 0 ? 'amber' : 'blue'}
          targetRoute="/cargo"
        />

        <KpiCard
          title="Personnel Deployed"
          value={deployedPersonnelCount}
          change={overduePersonnelCount > 0 ? `${overduePersonnelCount} Overdue` : 'All Checked-in'}
          isPositiveChange={overduePersonnelCount === 0}
          contextText={`${personnel.length} scientists & logistics crew in field`}
          icon={Users}
          variant={overduePersonnelCount > 0 ? 'red' : 'green'}
          targetRoute="/personnel"
        />

        <KpiCard
          title="Inventory Utilization"
          value={`${inventoryUtilizationPercent}%`}
          change={lowStockCount > 0 ? `${lowStockCount} Low Items` : 'Optimal'}
          isPositiveChange={lowStockCount === 0}
          contextText={`${inventory.length} SKUs across all research stations`}
          icon={Layers}
          variant={lowStockCount > 0 ? 'amber' : 'cyan'}
          targetRoute="/inventory"
        />

        <KpiCard
          title="Critical Alerts"
          value={criticalAlertsCount}
          change={criticalAlertsCount > 0 ? 'Requires Action' : 'Nominal'}
          isPositiveChange={criticalAlertsCount === 0}
          contextText={criticalAlertsCount > 0 ? 'Immediate SAR response active' : 'Zero critical safety threats'}
          icon={AlertTriangle}
          variant="red"
          isAlert={criticalAlertsCount > 0}
          targetRoute="/emergency"
        />
      </div>

      {/* Live Polar Map Centerpiece */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 text-xs font-mono min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <span className="font-bold text-slate-200 uppercase tracking-wider truncate">
              CENTRAL OPERATIONAL PICTURE • REAL-TIME POLAR THEATRE
            </span>
          </div>
          <span className="text-slate-400 hidden lg:inline shrink-0 truncate max-w-[45%]">
            Interactive Leaflet Map • Click any marker for telemetry
          </span>
        </div>

        <PolarMap />
      </div>

      {/* Secondary Dashboard Grid: Quick Actions & Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono text-left">
        {/* Left 2 Cols: Fleet & Station Telemetry */}
        <div className="lg:col-span-2 rounded-xl bg-polar-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800 min-w-0">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 min-w-0">
                <Ship className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">Expedition Support Fleet Telemetry</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 break-words">
                Vessels actively navigating Southern Ocean & Antarctic coastal fast-ice
              </p>
            </div>
            <button
              onClick={() => navigate('/cargo')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold shrink-0"
            >
              <span>Cargo Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vessels.map(vessel => (
              <div
                key={vessel.id}
                className="p-3.5 rounded-lg bg-polar-950 border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{vessel.flag}</span>
                    <span className="font-bold text-slate-100 text-xs truncate">{vessel.name}</span>
                  </div>
                  <span
                    className="shrink-0 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/30"
                  >
                    {vessel.speedKnots} kts
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1 min-w-0">
                  <div className="flex justify-between gap-2 min-w-0">
                    <span className="truncate">MMSI: <strong className="text-slate-200">{vessel.mmsi}</strong></span>
                    <span className="shrink-0">HDG: <strong className="text-sky-300">{vessel.heading}°</strong></span>
                  </div>
                  <div className="flex justify-between gap-2 min-w-0">
                    <span className="shrink-0">Destination:</span>
                    <span className="text-cyan-300 font-bold truncate ml-1 min-w-0">{vessel.destination}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>Ice Class: {vessel.iceClass}</span>
                    <span>Fuel: {vessel.fuelPercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Tactical Mission Quick Commands */}
        <div className="rounded-xl bg-polar-900/90 border border-slate-800 p-5 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Mission Operations Dispatch</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct dispatch actions for field logistics coordinators
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setIsDeclareEmergencyOpen(true)}
              className="w-full p-2.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-500/50 hover:border-rose-400 transition-all flex items-center justify-between text-xs font-bold shadow-[0_0_12px_rgba(239,68,68,0.2)] cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>Declare Emergency Incident</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setIsSmartReorderOpen(true)}
              className="w-full p-2.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/50 hover:border-cyan-400 transition-all flex items-center justify-between text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)] cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Trigger Autonomous Smart Reorder</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setIsAddCargoOpen(true)}
              className="w-full p-2.5 rounded-lg bg-polar-950 hover:bg-polar-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-between text-xs font-bold cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <PackagePlus className="w-4 h-4 text-amber-400" />
                <span>Manifest New Cargo</span>
              </div>
              <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            </button>

            <button
              onClick={() => setIsAddPersonnelOpen(true)}
              className="w-full p-2.5 rounded-lg bg-polar-950 hover:bg-polar-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-between text-xs font-bold cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Deploy Field Personnel</span>
              </div>
              <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            </button>

            <button
              onClick={() => setIsAddInventoryOpen(true)}
              className="w-full p-2.5 rounded-lg bg-polar-950 hover:bg-polar-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-between text-xs font-bold cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Add Station Inventory SKU</span>
              </div>
              <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeclareEmergencyModal
        isOpen={isDeclareEmergencyOpen}
        onClose={() => setIsDeclareEmergencyOpen(false)}
      />
      <AddCargoModal
        isOpen={isAddCargoOpen}
        onClose={() => setIsAddCargoOpen(false)}
      />
      <AddInventoryModal
        isOpen={isAddInventoryOpen}
        onClose={() => setIsAddInventoryOpen(false)}
      />
      <AddPersonnelModal
        isOpen={isAddPersonnelOpen}
        onClose={() => setIsAddPersonnelOpen(false)}
      />
      <SmartReorderModal
        isOpen={isSmartReorderOpen}
        onClose={() => setIsSmartReorderOpen(false)}
      />
    </div>
  );
};
