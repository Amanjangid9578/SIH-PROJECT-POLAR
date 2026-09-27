import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { InventoryItem, InventoryCategory, InventoryCondition } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: InventoryItem | null;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
  isOpen,
  onClose,
  itemToEdit
}) => {
  const { stations, addInventoryItem, updateInventoryItem } = useApp();

  const [sku, setSku] = useState(
    itemToEdit?.sku || `POL-INV-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [name, setName] = useState(itemToEdit?.name || '');
  const [category, setCategory] = useState<InventoryCategory>(itemToEdit?.category || 'Medical');
  const [quantity, setQuantity] = useState(itemToEdit?.quantity ? String(itemToEdit.quantity) : '50');
  const [unit, setUnit] = useState(itemToEdit?.unit || 'Units');
  const [reorderThreshold, setReorderThreshold] = useState(
    itemToEdit?.reorderThreshold ? String(itemToEdit.reorderThreshold) : '20'
  );
  const [maxCapacity, setMaxCapacity] = useState(
    itemToEdit?.maxCapacity ? String(itemToEdit.maxCapacity) : '100'
  );
  const [stationId, setStationId] = useState(itemToEdit?.stationId || stations[0]?.id || 'st-bharati');
  const [storageLocation, setStorageLocation] = useState(
    itemToEdit?.storageLocation || 'Medical Bay Locker 4'
  );
  const [expiryDate, setExpiryDate] = useState(
    itemToEdit?.expiryDate || '2027-12-31'
  );
  const [supplier, setSupplier] = useState(itemToEdit?.supplier || 'NCPOR Central Supply');
  const [condition, setCondition] = useState<InventoryCondition>(itemToEdit?.condition || 'Optimal');
  const [unitCostUsd, setUnitCostUsd] = useState(
    itemToEdit?.unitCostUsd ? String(itemToEdit.unitCostUsd) : '120'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (itemToEdit) {
      updateInventoryItem(itemToEdit.id, {
        sku,
        name,
        category,
        quantity: Number(quantity) || 0,
        unit,
        reorderThreshold: Number(reorderThreshold) || 1,
        maxCapacity: Number(maxCapacity) || 100,
        stationId,
        storageLocation,
        expiryDate,
        supplier,
        condition,
        unitCostUsd: Number(unitCostUsd) || 0,
        lastAudited: new Date().toISOString().substring(0, 10)
      });
    } else {
      addInventoryItem({
        sku,
        name,
        category,
        quantity: Number(quantity) || 0,
        unit,
        reorderThreshold: Number(reorderThreshold) || 1,
        maxCapacity: Number(maxCapacity) || 100,
        stationId,
        storageLocation,
        expiryDate,
        supplier,
        condition,
        lastAudited: new Date().toISOString().substring(0, 10),
        unitCostUsd: Number(unitCostUsd) || 0
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? 'Modify Inventory Item' : 'Add Station Inventory Item'}
      subtitle="Manage research station stock levels, reorder thresholds, and warehouse bunkers"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">SKU Code</label>
            <input
              type="text"
              required
              value={sku}
              onChange={e => setSku(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-bold mb-1 uppercase">Item Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Frostbite Iloprost Infusion Packs"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as InventoryCategory)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="Food">Food</option>
              <option value="Medical">Medical</option>
              <option value="Fuel">Fuel</option>
              <option value="Research Equipment">Research Equipment</option>
              <option value="Spare Parts">Spare Parts</option>
              <option value="Safety Equipment">Safety Equipment</option>
              <option value="Communication Equipment">Communication Equipment</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Research Station</label>
            <select
              value={stationId}
              onChange={e => setStationId(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {stations.map(st => (
                <option key={st.id} value={st.id} className="bg-polar-900">
                  {st.flag} {st.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Storage Location</label>
            <input
              type="text"
              required
              value={storageLocation}
              onChange={e => setStorageLocation(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Current Stock</label>
            <input
              type="number"
              required
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Unit (e.g. Liters)</label>
            <input
              type="text"
              required
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Reorder Threshold</label>
            <input
              type="number"
              required
              value={reorderThreshold}
              onChange={e => setReorderThreshold(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 font-bold text-amber-300"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Max Capacity</label>
            <input
              type="number"
              required
              value={maxCapacity}
              onChange={e => setMaxCapacity(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Item Condition</label>
            <select
              value={condition}
              onChange={e => setCondition(e.target.value as InventoryCondition)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="Optimal">Optimal</option>
              <option value="Good">Good</option>
              <option value="Service Required">Service Required</option>
              <option value="Degraded">Degraded</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase">Unit Cost (USD)</label>
            <input
              type="number"
              value={unitCostUsd}
              onChange={e => setUnitCostUsd(e.target.value)}
              className="w-full bg-polar-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
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
            {itemToEdit ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
