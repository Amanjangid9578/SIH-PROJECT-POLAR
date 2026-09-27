import {
  Expedition,
  Vessel,
  CargoItem,
  InventoryItem,
  Personnel,
  EmergencyIncident,
  AutomationRule,
  NotificationItem,
  ResearchStation
} from '../types';
import {
  INITIAL_STATIONS,
  INITIAL_VESSELS,
  INITIAL_EXPEDITIONS,
  INITIAL_CARGO,
  INITIAL_INVENTORY,
  INITIAL_PERSONNEL,
  INITIAL_EMERGENCIES,
  INITIAL_AUTOMATIONS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

const STORAGE_KEYS = {
  STATIONS: 'polar_stations_v1',
  VESSELS: 'polar_vessels_v1',
  EXPEDITIONS: 'polar_expeditions_v1',
  CARGO: 'polar_cargo_v1',
  INVENTORY: 'polar_inventory_v1',
  PERSONNEL: 'polar_personnel_v1',
  EMERGENCIES: 'polar_emergencies_v1',
  AUTOMATIONS: 'polar_automations_v1',
  NOTIFICATIONS: 'polar_notifications_v1',
  ACTIVE_EXPEDITION_ID: 'polar_active_exp_id_v1',
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const PersistenceService = {
  loadStations: (): ResearchStation[] => safeGet(STORAGE_KEYS.STATIONS, INITIAL_STATIONS),
  saveStations: (data: ResearchStation[]) => safeSet(STORAGE_KEYS.STATIONS, data),

  loadVessels: (): Vessel[] => safeGet(STORAGE_KEYS.VESSELS, INITIAL_VESSELS),
  saveVessels: (data: Vessel[]) => safeSet(STORAGE_KEYS.VESSELS, data),

  loadExpeditions: (): Expedition[] => safeGet(STORAGE_KEYS.EXPEDITIONS, INITIAL_EXPEDITIONS),
  saveExpeditions: (data: Expedition[]) => safeSet(STORAGE_KEYS.EXPEDITIONS, data),

  loadCargo: (): CargoItem[] => safeGet(STORAGE_KEYS.CARGO, INITIAL_CARGO),
  saveCargo: (data: CargoItem[]) => safeSet(STORAGE_KEYS.CARGO, data),

  loadInventory: (): InventoryItem[] => safeGet(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY),
  saveInventory: (data: InventoryItem[]) => safeSet(STORAGE_KEYS.INVENTORY, data),

  loadPersonnel: (): Personnel[] => safeGet(STORAGE_KEYS.PERSONNEL, INITIAL_PERSONNEL),
  savePersonnel: (data: Personnel[]) => safeSet(STORAGE_KEYS.PERSONNEL, data),

  loadEmergencies: (): EmergencyIncident[] => safeGet(STORAGE_KEYS.EMERGENCIES, INITIAL_EMERGENCIES),
  saveEmergencies: (data: EmergencyIncident[]) => safeSet(STORAGE_KEYS.EMERGENCIES, data),

  loadAutomations: (): AutomationRule[] => safeGet(STORAGE_KEYS.AUTOMATIONS, INITIAL_AUTOMATIONS),
  saveAutomations: (data: AutomationRule[]) => safeSet(STORAGE_KEYS.AUTOMATIONS, data),

  loadNotifications: (): NotificationItem[] => safeGet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (data: NotificationItem[]) => safeSet(STORAGE_KEYS.NOTIFICATIONS, data),

  loadActiveExpeditionId: (): string => safeGet(STORAGE_KEYS.ACTIVE_EXPEDITION_ID, 'exp-isea-45'),
  saveActiveExpeditionId: (id: string) => safeSet(STORAGE_KEYS.ACTIVE_EXPEDITION_ID, id),

  resetAllToDefault: () => {
    safeSet(STORAGE_KEYS.STATIONS, INITIAL_STATIONS);
    safeSet(STORAGE_KEYS.VESSELS, INITIAL_VESSELS);
    safeSet(STORAGE_KEYS.EXPEDITIONS, INITIAL_EXPEDITIONS);
    safeSet(STORAGE_KEYS.CARGO, INITIAL_CARGO);
    safeSet(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
    safeSet(STORAGE_KEYS.PERSONNEL, INITIAL_PERSONNEL);
    safeSet(STORAGE_KEYS.EMERGENCIES, INITIAL_EMERGENCIES);
    safeSet(STORAGE_KEYS.AUTOMATIONS, INITIAL_AUTOMATIONS);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    safeSet(STORAGE_KEYS.ACTIVE_EXPEDITION_ID, 'exp-isea-45');
  }
};
