import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Zap,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Trash2,
  Edit,
  PlusCircle,
  MinusCircle,
  Building2,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InventoryItem, InventoryCategory } from '../types';
import { AddInventoryModal } from '../components/inventory/AddInventoryModal';
import { SmartReorderModal } from '../components/inventory/SmartReorderModal';
import { formatCurrency, cn } from '../utils/formatters';

export const InventoryPage: React.FC = () => {
  const {
    inventory,
    stations,
    updateInventoryItem,
    deleteInventoryItem,
    reorderInventoryItem
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [isSmartReorderOpen, setIsSmartReorderOpen] = useState(false);

  // Compute KPI card stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.reorderThreshold);
  const criticalStockItems = inventory.filter(i => i.quantity <= i.reorderThreshold * 0.5);

  const expiringSoonCount = inventory.filter(i => {
    if (!i.expiryDate) return false;
    const expiryTime = new Date(i.expiryDate).getTime();
    const threeMonthsFromNow = Date.now() + 90 * 86400000;
    return expiryTime <= threeMonthsFromNow;
  }).length;

  const totalCurrent = inventory.reduce((sum, i) => sum + i.quantity, 0);
  const totalMax = inventory.reduce((sum, i) => sum + i.maxCapacity, 0);
  const storageUtilization = totalMax > 0 ? Math.round((totalCurrent / totalMax) * 100) : 0;

  // Filter items
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      if (selectedStation !== 'ALL' && item.stationId !== selectedStation) return false;
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (showLowStockOnly && item.quantity > item.reorderThreshold) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.storageLocation.toLowerCase().includes(q) ||
          item.supplier.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inventory, searchQuery, selectedStation, selectedCategory, showLowStockOnly]);

  const handleAdjustQuantity = (item: InventoryItem, delta: number) => {
    const newQty = Math.max(0, Math.min(item.maxCapacity, item.quantity + delta));
    updateInventoryItem(item.id, { quantity: newQty });
  };

  /**
   * Visual Stock Indicator Generator: e.g. ████████░░ 80%
   */
  const renderVisualStockBar = (quantity: number, maxCapacity: number, threshold: number) => {
    const percent = Math.min(100, Math.max(0, Math.round((quantity / (maxCapacity || 100)) * 100)));
    const totalBlocks = 10;
    const filledBlocks = Math.round((percent / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;

    const isLow = quantity <= threshold;
    const isCritical = quantity <= threshold * 0.5;

    const filledChar = '█';
    const emptyChar = '░';
    const barString = filledChar.repeat(filledBlocks) + emptyChar.repeat(emptyBlocks);

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span
            className={cn(
              'font-mono tracking-tight font-bold',
              isCritical ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-cyan-400'
            )}
          >
            {barString}
          </span>
          <span
            className={cn(
              'font-bold ml-2',
              isCritical ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-slate-300'
            )}
          >
            {percent}%
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          {quantity.toLocaleString()} / {maxCapacity.toLocaleString()}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 font-mono text-left select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-black text-slate-100 uppercase tracking-tight">
              Polar Station Inventory & Warehouse Governance
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Station reserve stocks, threshold telemetry, extreme cold-chain storage, and smart reordering
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Smart Reorder Button */}
          <button
            onClick={() => setIsSmartReorderOpen(true)}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current animate-pulse" />
            <span>SMART REORDER</span>
          </button>

          <button
            onClick={() => {
              setItemToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-lg bg-polar-900 hover:bg-polar-800 text-sky-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 hover:border-cyan-400 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-3.5 rounded-xl bg-polar-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total SKUs</span>
          <span className="text-2xl font-black text-slate-100">{totalItems}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Across 3 bases</span>
        </div>

        <div className="p-3.5 rounded-xl bg-polar-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Low Stock Warning</span>
          <span className="text-2xl font-black text-amber-300">{lowStockItems.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Below safe threshold</span>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40">
          <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Critical Deficit</span>
          <span className="text-2xl font-black text-rose-300">{criticalStockItems.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Below 50% threshold</span>
        </div>

        <div className="p-3.5 rounded-xl bg-polar-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-sky-400 block mb-1">Expiring Soon (90d)</span>
          <span className="text-2xl font-black text-sky-300">{expiringSoonCount}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Requires turnover</span>
        </div>

        <div className="p-3.5 rounded-xl bg-polar-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">Storage Utilization</span>
          <span className="text-2xl font-black text-cyan-300">{storageUtilization}%</span>
          <span className="text-[11px] text-slate-500 block mt-1">Bunker capacity</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-polar-900 border border-slate-800 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, item name, bunker rack, supplier..."
              className="w-full bg-polar-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Station Filter */}
            <select
              value={selectedStation}
              onChange={e => setSelectedStation(e.target.value)}
              className="bg-polar-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ALL">All Stations</option>
              {stations.map(st => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-polar-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Food">Food</option>
              <option value="Medical">Medical</option>
              <option value="Fuel">Fuel</option>
              <option value="Research Equipment">Research Equipment</option>
              <option value="Spare Parts">Spare Parts</option>
              <option value="Safety Equipment">Safety Equipment</option>
              <option value="Communication Equipment">Communication Equipment</option>
            </select>

            {/* Low Stock Filter Button */}
            <button
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5',
                showLowStockOnly
                  ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'bg-polar-950 text-slate-400 border-slate-700 hover:text-white'
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Low Stock Warning ({lowStockItems.length})</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span>Displaying {filteredInventory.length} of {inventory.length} items</span>
          <span>Station Buffer Health: <strong className="text-emerald-400 font-bold">SECURE</strong></span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-slate-800 bg-polar-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-polar-950 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">SKU / Item Name</th>
                <th className="py-3 px-4">Station Base</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 w-48">Stock Level Indicator</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Storage Location</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-center">Adjust Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 text-xs">
                    No items matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInventory.map(item => {
                  const station = stations.find(s => s.id === item.stationId);
                  const isLow = item.quantity <= item.reorderThreshold;
                  const isCritical = item.quantity <= item.reorderThreshold * 0.5;

                  return (
                    <tr key={item.id} className="hover:bg-polar-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-100">{item.name}</div>
                        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{item.sku}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-200 font-medium">
                          {station ? station.name.split(' ')[0] : item.stationId}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-polar-950 text-slate-300 border border-slate-700">
                          {item.category}
                        </span>
                      </td>

                      {/* Visual Stock Level Indicator: ████████░░ 80% */}
                      <td className="py-3 px-4">
                        {renderVisualStockBar(item.quantity, item.maxCapacity, item.reorderThreshold)}
                      </td>

                      <td className="py-3 px-4">
                        <span className={cn('font-bold', isLow ? 'text-amber-400' : 'text-slate-400')}>
                          {item.reorderThreshold} {item.unit}
                        </span>
                        {isCritical ? (
                          <span className="block text-[9px] text-rose-400 font-bold uppercase animate-pulse">
                            CRITICAL
                          </span>
                        ) : isLow ? (
                          <span className="block text-[9px] text-amber-400 uppercase font-bold">
                            LOW STOCK
                          </span>
                        ) : null}
                      </td>

                      <td className="py-3 px-4 text-slate-300 text-[11px]">
                        {item.storageLocation}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'text-[10px] px-1.5 py-0.2 rounded border font-bold uppercase',
                            item.condition === 'Optimal' && 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
                            item.condition === 'Good' && 'bg-sky-950 text-sky-300 border-sky-500/40',
                            item.condition === 'Service Required' && 'bg-amber-950 text-amber-300 border-amber-500/40',
                            item.condition === 'Degraded' && 'bg-rose-950 text-rose-300 border-rose-500/40'
                          )}
                        >
                          {item.condition}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {item.expiryDate || 'N/A'}
                      </td>

                      {/* Adjust Quantity Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-polar-950 border border-slate-700 rounded p-0.5">
                          <button
                            onClick={() => handleAdjustQuantity(item, -1)}
                            className="p-1 text-slate-400 hover:text-white hover:bg-polar-800 rounded"
                            title="Decrease quantity by 1"
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-1.5 font-bold text-cyan-300 text-xs">{item.quantity}</span>
                          <button
                            onClick={() => handleAdjustQuantity(item, 1)}
                            className="p-1 text-slate-400 hover:text-white hover:bg-polar-800 rounded"
                            title="Increase quantity by 1"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Edit / Delete Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setItemToEdit(item);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-polar-800"
                            title="Edit Item"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete item ${item.name}?`)) {
                                deleteInventoryItem(item.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-polar-800"
                            title="Delete Item"
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

      {/* Modals */}
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        itemToEdit={itemToEdit}
      />
      <SmartReorderModal
        isOpen={isSmartReorderOpen}
        onClose={() => setIsSmartReorderOpen(false)}
      />
    </div>
  );
};
