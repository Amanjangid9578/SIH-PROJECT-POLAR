import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Zap, Check, AlertTriangle, ArrowRight, PackageCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn, formatCurrency } from '../../utils/formatters';

interface SmartReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartReorderModal: React.FC<SmartReorderModalProps> = ({
  isOpen,
  onClose
}) => {
  const { inventory, reorderInventoryItem, stations } = useApp();

  // Find all items below or near reorder threshold
  const lowStockItems = inventory.filter(i => i.quantity <= i.reorderThreshold);

  // State to track custom reorder quantities for each low-stock item
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    lowStockItems.forEach(item => {
      const deficit = Math.max(10, item.maxCapacity - item.quantity);
      initial[item.id] = deficit;
    });
    return initial;
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleQuantityChange = (id: string, qty: number) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, qty)
    }));
  };

  const handleExecuteReorders = () => {
    setIsProcessing(true);

    setTimeout(() => {
      lowStockItems.forEach(item => {
        const qty = selectedQuantities[item.id] || (item.maxCapacity - item.quantity);
        reorderInventoryItem(item.id, qty);
      });
      setIsProcessing(false);
      setIsDone(true);
    }, 600);
  };

  const totalEstimatedCost = lowStockItems.reduce((sum, item) => {
    const qty = selectedQuantities[item.id] || (item.maxCapacity - item.quantity);
    return sum + (qty * (item.unitCostUsd || 10));
  }, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsDone(false);
        onClose();
      }}
      title="Autonomous Smart Reorder Console"
      subtitle="Automated inventory replenishment pipeline for Antarctic field stations"
      maxWidth="2xl"
    >
      {isDone ? (
        <div className="py-8 text-center font-mono space-y-4">
          <div className="h-14 w-14 rounded-full bg-emerald-950 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <PackageCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-100 uppercase tracking-wide">
              Smart Reorder Dispatched Successfully
            </h4>
            <p className="text-xs text-slate-400">
              Procurement orders transmitted to NCPOR Logistics Base & Military Air Supply. Station inventory reserves restocked.
            </p>
          </div>
          <button
            onClick={() => {
              setIsDone(false);
              onClose();
            }}
            className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            Return to Inventory Command
          </button>
        </div>
      ) : (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-3.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="leading-relaxed">
              <strong className="block text-cyan-300 font-bold">
                Smart Algorithm Scan: {lowStockItems.length} Critical Items Flagged
              </strong>
              <span>
                System calculated optimal replenishment volumes up to station bunker max capacities to protect against polar winter freeze-in.
              </span>
            </div>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              All inventory levels are currently above reorder safety thresholds.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1">
              {lowStockItems.map(item => {
                const station = stations.find(s => s.id === item.stationId);
                const reqQty = selectedQuantities[item.id] || (item.maxCapacity - item.quantity);
                const itemCost = reqQty * (item.unitCostUsd || 10);

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-polar-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-xs">{item.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-600/40 font-bold uppercase">
                          DEFICIT
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Station: <span className="text-slate-200">{station?.name}</span> • Current:{' '}
                        <strong className="text-amber-400">{item.quantity} {item.unit}</strong> (Threshold:{' '}
                        {item.reorderThreshold} {item.unit})
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <label className="text-[10px] text-slate-400 uppercase block">Reorder Qty</label>
                        <input
                          type="number"
                          min={1}
                          max={item.maxCapacity}
                          value={reqQty}
                          onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                          className="w-20 bg-polar-900 border border-slate-700 rounded px-2 py-1 text-xs text-cyan-300 font-bold text-center focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div className="text-right min-w-[75px]">
                        <span className="text-[10px] text-slate-400 uppercase block">Est. Cost</span>
                        <span className="text-slate-200 font-bold">{formatCurrency(itemCost)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cost Summary & Confirmation */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[11px] block">Total Estimated Requisition</span>
              <span className="text-lg font-black text-slate-100">
                {formatCurrency(totalEstimatedCost)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-polar-800 hover:bg-polar-750 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReorders}
                disabled={lowStockItems.length === 0 || isProcessing}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)] flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Authorize Smart Reorder</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
