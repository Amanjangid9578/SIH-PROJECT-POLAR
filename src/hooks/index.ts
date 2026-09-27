import { useApp } from '../context/AppContext';

export function useVesselTracking() {
  const { vessels, aisStatus, aisStatusMessage } = useApp();

  return {
    vessels,
    aisStatus,
    aisStatusMessage,
    isLiveAis: aisStatus === 'LIVE_CONNECTED',
    totalVessels: vessels.length,
    underwayVessels: vessels.filter(v => v.status === 'UNDERWAY').length
  };
}

export function useCargoTracking() {
  const {
    cargo,
    addCargo,
    updateCargo,
    deleteCargo,
    updateCargoStatus
  } = useApp();

  const inTransitCount = cargo.filter(c => c.status === 'In Transit').length;
  const delayedCount = cargo.filter(c => c.status === 'Delayed').length;
  const criticalCount = cargo.filter(c => c.priority === 'CRITICAL').length;
  const totalWeightKg = cargo.reduce((sum, c) => sum + c.weightKg, 0);

  return {
    cargo,
    addCargo,
    updateCargo,
    deleteCargo,
    updateCargoStatus,
    inTransitCount,
    delayedCount,
    criticalCount,
    totalWeightKg
  };
}

export function useInventory() {
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    reorderInventoryItem
  } = useApp();

  const lowStockItems = inventory.filter(i => i.quantity <= i.reorderThreshold);
  const criticalStockItems = inventory.filter(i => i.quantity <= (i.reorderThreshold * 0.5));
  const totalItemsCount = inventory.length;

  // Calculate storage utilization percentage across all inventory
  const totalCurrent = inventory.reduce((sum, i) => sum + i.quantity, 0);
  const totalMax = inventory.reduce((sum, i) => sum + i.maxCapacity, 0);
  const utilizationPercent = totalMax > 0 ? Math.round((totalCurrent / totalMax) * 100) : 0;

  return {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    reorderInventoryItem,
    lowStockItems,
    criticalStockItems,
    totalItemsCount,
    utilizationPercent
  };
}

export function usePersonnel() {
  const {
    personnel,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    checkInPersonnel
  } = useApp();

  const activeCount = personnel.filter(p => p.status === 'ACTIVE').length;
  const inTransitCount = personnel.filter(p => p.status === 'IN TRANSIT').length;
  const overdueCount = personnel.filter(p => p.checkInOverdue).length;

  return {
    personnel,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    checkInPersonnel,
    activeCount,
    inTransitCount,
    overdueCount,
    totalCount: personnel.length
  };
}

export function useEmergencyAlerts() {
  const {
    emergencies,
    createEmergency,
    updateEmergencyStatus,
    addEmergencyTimelineEvent,
    resolveEmergency
  } = useApp();

  const activeEmergencies = emergencies.filter(e => e.status !== 'RESOLVED');
  const criticalEmergencies = emergencies.filter(e => e.severity === 'CRITICAL' && e.status !== 'RESOLVED');
  const resolvedEmergencies = emergencies.filter(e => e.status === 'RESOLVED');

  return {
    emergencies,
    activeEmergencies,
    criticalEmergencies,
    resolvedEmergencies,
    hasCriticalAlert: criticalEmergencies.length > 0,
    createEmergency,
    updateEmergencyStatus,
    addEmergencyTimelineEvent,
    resolveEmergency
  };
}

export function useAutomations() {
  const {
    automations,
    toggleAutomationRule,
    runAutomationsManually
  } = useApp();

  const activeRuleCount = automations.filter(a => a.enabled).length;
  const totalExecutions = automations.reduce((sum, a) => sum + a.executionCount, 0);

  return {
    automations,
    toggleAutomationRule,
    runAutomationsManually,
    activeRuleCount,
    totalExecutions
  };
}
