import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Box,
  Layers,
  Users,
  Ship,
  AlertTriangle,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useApp } from '../context/AppContext';
import { formatWeight, formatCurrency, cn } from '../utils/formatters';

export const AnalyticsPage: React.FC = () => {
  const { cargo, inventory, personnel, vessels, emergencies, activeExpedition } = useApp();
  const [timeFilter, setTimeFilter] = useState<'7D' | '30D' | '90D' | 'EXPEDITION'>('30D');

  // Chart 1: Cargo Movement & Weight in Transit Over Time
  const cargoTrendsData = useMemo(() => {
    const days = timeFilter === '7D' ? 7 : timeFilter === '30D' ? 14 : 20;
    const totalCargoWeight = cargo.reduce((sum, c) => sum + c.weightKg, 0);

    return Array.from({ length: days }).map((_, i) => {
      const dayFactor = (i + 1) / days;
      const noise = Math.sin(i * 1.5) * 0.15;
      const tonnage = Math.round((totalCargoWeight / 1000) * (0.6 + dayFactor * 0.4 + noise));
      return {
        date: `D-${days - i}`,
        dispatchedTons: Math.round(tonnage * 0.85),
        inTransitTons: tonnage,
        deliveredTons: Math.round(tonnage * 0.35)
      };
    });
  }, [cargo, timeFilter]);

  // Chart 2: Inventory Stock by Category
  const inventoryCategoryData = useMemo(() => {
    const catMap: Record<string, { current: number; threshold: number }> = {};
    inventory.forEach(item => {
      if (!catMap[item.category]) {
        catMap[item.category] = { current: 0, threshold: 0 };
      }
      catMap[item.category].current += item.quantity;
      catMap[item.category].threshold += item.reorderThreshold;
    });

    return Object.keys(catMap).map(category => ({
      category: category.replace(' Equipment', '').replace(' Supplies', ''),
      stock: catMap[category].current,
      threshold: catMap[category].threshold
    }));
  }, [inventory]);

  // Chart 3: Personnel Team Distribution
  const personnelTeamData = useMemo(() => {
    const teamCounts: Record<string, number> = {};
    personnel.forEach(p => {
      teamCounts[p.team] = (teamCounts[p.team] || 0) + 1;
    });

    const colors = ['#06b6d4', '#38bdf8', '#10b981', '#f59e0b', '#a855f7'];
    return Object.keys(teamCounts).map((team, idx) => ({
      name: team,
      value: teamCounts[team],
      color: colors[idx % colors.length]
    }));
  }, [personnel]);

  // Chart 4: Vessel Speed Telemetry (Knots)
  const vesselSpeedData = useMemo(() => {
    return vessels.map(v => ({
      name: v.name.replace('MV ', '').replace('RV ', ''),
      speed: v.speedKnots,
      fuel: v.fuelPercent,
      capacity: Math.round(v.cargoCapacityTons / 100)
    }));
  }, [vessels]);

  // Chart 5: Emergency Severity Breakdown
  const emergencySeverityData = useMemo(() => {
    const sevMap: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    emergencies.forEach(e => {
      sevMap[e.severity] = (sevMap[e.severity] || 0) + 1;
    });

    return [
      { name: 'Critical', count: sevMap.CRITICAL, fill: '#ef4444' },
      { name: 'High', count: sevMap.HIGH, fill: '#f59e0b' },
      { name: 'Medium', count: sevMap.MEDIUM, fill: '#38bdf8' },
      { name: 'Low', count: sevMap.LOW, fill: '#64748b' }
    ];
  }, [emergencies]);

  const customTooltipStyle = {
    backgroundColor: '#0b1322',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    color: '#e2e8f0',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '11px'
  };

  return (
    <div className="space-y-6 pb-12 font-mono text-left select-none">
      {/* Header & Date Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-black text-slate-100 uppercase tracking-tight">
              Polar Operational Analytics & Telemetry Metrics
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Dynamically synthesized analytics across expedition cargo tonnage, base inventories, and SAR incident queues
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-polar-900 border border-slate-700 rounded-lg p-1 text-xs font-bold self-start sm:self-auto">
          {(['7D', '30D', '90D', 'EXPEDITION'] as const).map(f => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={cn(
                'px-3 py-1 rounded transition-all cursor-pointer',
                timeFilter === f
                  ? 'bg-cyan-600 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Quick Analytic Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Tracked Cargo Mass</span>
          <div className="text-2xl font-black text-cyan-300">
            {formatWeight(cargo.reduce((s, c) => s + c.weightKg, 0))}
          </div>
          <span className="text-[11px] text-slate-500">Across {cargo.length} manifest consignments</span>
        </div>

        <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Station Stock Buffer Utilization</span>
          <div className="text-2xl font-black text-emerald-300">
            {Math.round(
              (inventory.reduce((s, i) => s + i.quantity, 0) /
                (inventory.reduce((s, i) => s + i.maxCapacity, 0) || 1)) *
                100
            )}%
          </div>
          <span className="text-[11px] text-slate-500">Bunker storage health optimal</span>
        </div>

        <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Average Transit Velocity</span>
          <div className="text-2xl font-black text-sky-300">
            {(
              vessels.reduce((s, v) => s + v.speedKnots, 0) / (vessels.length || 1)
            ).toFixed(1)}{' '}
            knots
          </div>
          <span className="text-[11px] text-slate-500">Polar Class icebreaker fleet speed</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Cargo Movement Over Time */}
        <div className="p-5 rounded-xl bg-polar-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
              <Box className="w-4 h-4 text-cyan-400" />
              <span>Cargo Movement Over Time (Metric Tons)</span>
            </span>
            <span className="text-[10px] text-slate-400">Filter: {timeFilter}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cargoTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cargoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="inTransitTons"
                  name="In Transit (t)"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#cargoGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="deliveredTons"
                  name="Delivered (t)"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Inventory Reserves by Category */}
        <div className="p-5 rounded-xl bg-polar-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Station Stock Quantity vs Threshold</span>
            </span>
            <span className="text-[10px] text-slate-400">Base Reserves</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="stock" name="Current Stock" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="threshold" name="Reorder Threshold" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Personnel Team Allocation */}
        <div className="p-5 rounded-xl bg-polar-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Personnel Deployment by Team</span>
            </span>
            <span className="text-[10px] text-slate-400">{personnel.length} Operatives</span>
          </div>

          <div className="h-64 w-full flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={personnelTeamData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {personnelTeamData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-1/2 space-y-2 text-xs pl-2">
              {personnelTeamData.map((t, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="text-slate-300 truncate">{t.name}</span>
                  </div>
                  <span className="font-bold text-slate-100 ml-1">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: Vessel Activity & Speed */}
        <div className="p-5 rounded-xl bg-polar-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
              <Ship className="w-4 h-4 text-sky-400" />
              <span>Polar Vessel Cruising Speeds (Knots)</span>
            </span>
            <span className="text-[10px] text-slate-400">{vessels.length} Fleet Units</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vesselSpeedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="speed" name="Speed (kts)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fuel" name="Fuel Reserve (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
