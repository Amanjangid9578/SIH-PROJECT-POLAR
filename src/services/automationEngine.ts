import {
  InventoryItem,
  CargoItem,
  Personnel,
  EmergencyIncident,
  AutomationRule,
  NotificationItem
} from '../types';

export interface AutomationRunResult {
  newNotifications: NotificationItem[];
  updatedRules: AutomationRule[];
}

export function evaluateAutomations(
  inventory: InventoryItem[],
  cargo: CargoItem[],
  personnel: Personnel[],
  emergencies: EmergencyIncident[],
  rules: AutomationRule[],
  existingNotifications: NotificationItem[]
): AutomationRunResult {
  const newNotifications: NotificationItem[] = [];
  const updatedRules = [...rules];

  // Helper to prevent notification spam
  const hasRecentNotification = (category: string, entityId: string) => {
    return existingNotifications.some(
      n => n.category === category && n.entityId === entityId && !n.read
    );
  };

  rules.forEach((rule, ruleIdx) => {
    if (!rule.enabled) return;

    let triggered = false;

    // Rule 1: Inventory Thresholds
    if (rule.category === 'INVENTORY' && rule.trigger.includes('INVENTORY')) {
      inventory.forEach(item => {
        if (item.quantity <= item.reorderThreshold) {
          if (!hasRecentNotification('INVENTORY', item.id)) {
            triggered = true;
            newNotifications.push({
              id: `notif-auto-inv-${Date.now()}-${item.id}`,
              timestamp: new Date().toISOString(),
              title: `Smart Automation: Low Stock (${item.name})`,
              message: `${item.name} stock level is ${item.quantity} ${item.unit} (below threshold of ${item.reorderThreshold} ${item.unit}). Smart reorder suggested.`,
              severity: item.category === 'Medical' || item.category === 'Fuel' ? 'CRITICAL' : 'WARNING',
              category: 'INVENTORY',
              read: false,
              targetRoute: '/inventory',
              entityId: item.id
            });
          }
        }
      });
    }

    // Rule 2: Delayed Cargo
    if (rule.category === 'CARGO' && rule.trigger.includes('VESSEL_ETA')) {
      cargo.forEach(c => {
        if (c.status === 'Delayed') {
          if (!hasRecentNotification('CARGO', c.id)) {
            triggered = true;
            newNotifications.push({
              id: `notif-auto-crg-${Date.now()}-${c.id}`,
              timestamp: new Date().toISOString(),
              title: `Smart Automation: Cargo Transit Delayed`,
              message: `Shipment ${c.trackingNumber} (${c.description}) is marked as Delayed. Station logistics buffer recalculated.`,
              severity: c.priority === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
              category: 'CARGO',
              read: false,
              targetRoute: '/cargo',
              entityId: c.id
            });
          }
        }
      });
    }

    // Rule 3: Personnel Overdue Check-in
    if (rule.category === 'PERSONNEL' && rule.trigger.includes('CHECKIN')) {
      personnel.forEach(p => {
        if (p.checkInOverdue) {
          if (!hasRecentNotification('PERSONNEL', p.id)) {
            triggered = true;
            newNotifications.push({
              id: `notif-auto-pers-${Date.now()}-${p.id}`,
              timestamp: new Date().toISOString(),
              title: `Smart Automation: Personnel Check-in Overdue`,
              message: `${p.name} (${p.role}) check-in timer exceeded safe tolerance in ${p.currentLocationName}.`,
              severity: 'CRITICAL',
              category: 'PERSONNEL',
              read: false,
              targetRoute: '/personnel',
              entityId: p.id
            });
          }
        }
      });
    }

    // Rule 4: Critical Emergency Escalation
    if (rule.category === 'EMERGENCY' && rule.trigger.includes('EMERGENCY')) {
      emergencies.forEach(e => {
        if (e.severity === 'CRITICAL' && e.status !== 'RESOLVED') {
          if (!hasRecentNotification('EMERGENCY', e.id)) {
            triggered = true;
            newNotifications.push({
              id: `notif-auto-emg-${Date.now()}-${e.id}`,
              timestamp: new Date().toISOString(),
              title: `Smart Automation: Critical Incident Escalation`,
              message: `CRITICAL Incident ${e.incidentCode} at ${e.locationName}. Command level response active.`,
              severity: 'CRITICAL',
              category: 'EMERGENCY',
              read: false,
              targetRoute: '/emergency',
              entityId: e.id
            });
          }
        }
      });
    }

    if (triggered) {
      updatedRules[ruleIdx] = {
        ...rule,
        lastTriggered: new Date().toISOString(),
        executionCount: rule.executionCount + 1
      };
    }
  });

  return {
    newNotifications,
    updatedRules
  };
}
