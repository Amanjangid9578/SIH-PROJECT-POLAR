import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  ResearchStation,
  Vessel,
  Expedition,
  CargoItem,
  InventoryItem,
  Personnel,
  EmergencyIncident,
  AutomationRule,
  NotificationItem,
  CargoStatus,
  EmergencyStatus,
  PersonnelStatus
} from '../types';
import { PersistenceService } from '../services/persistence';
import { aisStreamService, AisConnectionStatus } from '../services/aisStream';
import { evaluateAutomations } from '../services/automationEngine';

interface AppContextType {
  stations: ResearchStation[];
  vessels: Vessel[];
  expeditions: Expedition[];
  activeExpedition: Expedition | null;
  activeExpeditionId: string;
  setActiveExpeditionId: (id: string) => void;
  cargo: CargoItem[];
  inventory: InventoryItem[];
  personnel: Personnel[];
  emergencies: EmergencyIncident[];
  automations: AutomationRule[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  aisStatus: AisConnectionStatus;
  aisStatusMessage: string;
  utcTime: string;

  // Search & Navigation
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;

  // CRUD & Operations
  addExpedition: (exp: Omit<Expedition, 'id'>) => void;
  updateExpedition: (id: string, updates: Partial<Expedition>) => void;
  deleteExpedition: (id: string) => void;

  addCargo: (item: Omit<CargoItem, 'id'>) => void;
  updateCargo: (id: string, updates: Partial<CargoItem>) => void;
  deleteCargo: (id: string) => void;
  updateCargoStatus: (id: string, newStatus: CargoStatus) => void;

  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  reorderInventoryItem: (id: string, additionalQty: number) => void;

  addPersonnel: (p: Omit<Personnel, 'id'>) => void;
  updatePersonnel: (id: string, updates: Partial<Personnel>) => void;
  deletePersonnel: (id: string) => void;
  checkInPersonnel: (id: string, locationName: string, status?: PersonnelStatus) => void;

  createEmergency: (incident: Omit<EmergencyIncident, 'id' | 'incidentCode' | 'reportedAt' | 'timeline'>) => void;
  updateEmergencyStatus: (id: string, status: EmergencyStatus) => void;
  addEmergencyTimelineEvent: (id: string, author: string, note: string, actionTaken?: string) => void;
  resolveEmergency: (id: string, note: string) => void;

  toggleAutomationRule: (id: string) => void;
  runAutomationsManually: () => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // Hackathon Presentation Simulators
  simulateCargoDelay: () => void;
  simulateLowInventory: () => void;
  simulatePersonnelOverdue: () => void;
  simulateSevereWeather: () => void;
  simulateCriticalEmergency: () => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent data states
  const [stations, setStations] = useState<ResearchStation[]>(() => PersistenceService.loadStations());
  const [vessels, setVessels] = useState<Vessel[]>(() => PersistenceService.loadVessels());
  const [expeditions, setExpeditions] = useState<Expedition[]>(() => PersistenceService.loadExpeditions());
  const [activeExpeditionId, setActiveExpeditionIdState] = useState<string>(() => PersistenceService.loadActiveExpeditionId());
  const [cargo, setCargo] = useState<CargoItem[]>(() => PersistenceService.loadCargo());
  const [inventory, setInventory] = useState<InventoryItem[]>(() => PersistenceService.loadInventory());
  const [personnel, setPersonnel] = useState<Personnel[]>(() => PersistenceService.loadPersonnel());
  const [emergencies, setEmergencies] = useState<EmergencyIncident[]>(() => PersistenceService.loadEmergencies());
  const [automations, setAutomations] = useState<AutomationRule[]>(() => PersistenceService.loadAutomations());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => PersistenceService.loadNotifications());

  // UI state
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [aisStatus, setAisStatus] = useState<AisConnectionStatus>('DISCONNECTED');
  const [aisStatusMessage, setAisStatusMessage] = useState<string>('Initializing');
  const [utcTime, setUtcTime] = useState<string>(new Date().toUTCString());

  // Sync to persistence
  useEffect(() => { PersistenceService.saveStations(stations); }, [stations]);
  useEffect(() => { PersistenceService.saveVessels(vessels); }, [vessels]);
  useEffect(() => { PersistenceService.saveExpeditions(expeditions); }, [expeditions]);
  useEffect(() => { PersistenceService.saveActiveExpeditionId(activeExpeditionId); }, [activeExpeditionId]);
  useEffect(() => { PersistenceService.saveCargo(cargo); }, [cargo]);
  useEffect(() => { PersistenceService.saveInventory(inventory); }, [inventory]);
  useEffect(() => { PersistenceService.savePersonnel(personnel); }, [personnel]);
  useEffect(() => { PersistenceService.saveEmergencies(emergencies); }, [emergencies]);
  useEffect(() => { PersistenceService.saveAutomations(automations); }, [automations]);
  useEffect(() => { PersistenceService.saveNotifications(notifications); }, [notifications]);

  // Live UTC Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setUtcTime(new Date().toUTCString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // AIS Stream Connection
  useEffect(() => {
    const unsubStatus = aisStreamService.subscribeStatus((st, msg) => {
      setAisStatus(st);
      if (msg) setAisStatusMessage(msg);
    });

    const unsubUpdates = aisStreamService.subscribeUpdates((updatedData) => {
      setVessels(prev => {
        const idx = prev.findIndex(v => v.mmsi === updatedData.mmsi);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            coords: { lat: updatedData.lat, lng: updatedData.lng },
            speedKnots: updatedData.speedKnots ?? updated[idx].speedKnots,
            heading: updatedData.heading ?? updated[idx].heading,
            lastUpdate: updatedData.lastUpdate ?? new Date().toISOString(),
            isLiveAis: updatedData.isLiveAis
          };
          return updated;
        }
        return prev;
      });
    });

    aisStreamService.connect();

    return () => {
      unsubStatus();
      unsubUpdates();
      aisStreamService.disconnect();
    };
  }, []);

  // Global Reactive Automation Evaluation
  const runAutomations = useCallback(() => {
    const res = evaluateAutomations(
      inventory,
      cargo,
      personnel,
      emergencies,
      automations,
      notifications
    );

    if (res.newNotifications.length > 0) {
      setNotifications(prev => [...res.newNotifications, ...prev]);
      setAutomations(res.updatedRules);
    }
  }, [inventory, cargo, personnel, emergencies, automations, notifications]);

  // Run automations whenever inventory, cargo, personnel or emergencies state changes
  useEffect(() => {
    runAutomations();
  }, [inventory, cargo, personnel, emergencies, runAutomations]);

  const activeExpedition = useMemo(() => {
    return expeditions.find(e => e.id === activeExpeditionId) || expeditions[0] || null;
  }, [expeditions, activeExpeditionId]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Handlers
  const setActiveExpeditionId = (id: string) => {
    setActiveExpeditionIdState(id);
  };

  const addExpedition = (exp: Omit<Expedition, 'id'>) => {
    const newExp: Expedition = {
      ...exp,
      id: `exp-${Date.now()}`
    };
    setExpeditions(prev => [newExp, ...prev]);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: 'New Expedition Created',
        message: `Expedition ${newExp.name} (${newExp.code}) registered in Mission Command.`,
        severity: 'INFO',
        category: 'AUTOMATION',
        read: false,
        targetRoute: '/planning',
        entityId: newExp.id
      },
      ...prev
    ]);
  };

  const updateExpedition = (id: string, updates: Partial<Expedition>) => {
    setExpeditions(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExpedition = (id: string) => {
    setExpeditions(prev => prev.filter(e => e.id !== id));
    if (activeExpeditionId === id) {
      const remaining = expeditions.filter(e => e.id !== id);
      if (remaining.length > 0) setActiveExpeditionIdState(remaining[0].id);
    }
  };

  const addCargo = (item: Omit<CargoItem, 'id'>) => {
    const newCargo: CargoItem = {
      ...item,
      id: `crg-${Date.now()}`
    };
    setCargo(prev => [newCargo, ...prev]);
  };

  const updateCargo = (id: string, updates: Partial<CargoItem>) => {
    setCargo(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCargo = (id: string) => {
    setCargo(prev => prev.filter(c => c.id !== id));
  };

  const updateCargoStatus = (id: string, newStatus: CargoStatus) => {
    setCargo(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus,
          timeline: [
            ...c.timeline,
            {
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
              location: c.currentLocationName,
              event: `Status manually updated to ${newStatus}`,
              status: newStatus
            }
          ]
        };
      }
      return c;
    }));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`
    };
    setInventory(prev => [newItem, ...prev]);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const reorderInventoryItem = (id: string, additionalQty: number) => {
    setInventory(prev => prev.map(i => {
      if (i.id === id) {
        return {
          ...i,
          quantity: Math.min(i.maxCapacity, i.quantity + additionalQty),
          lastAudited: new Date().toISOString().substring(0, 10)
        };
      }
      return i;
    }));

    const targetItem = inventory.find(i => i.id === id);
    if (targetItem) {
      setNotifications(prev => [
        {
          id: `notif-reorder-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: `Smart Reorder Dispatched: ${targetItem.name}`,
          message: `Requisition order for ${additionalQty} ${targetItem.unit} processed for ${targetItem.stationId}.`,
          severity: 'SUCCESS',
          category: 'INVENTORY',
          read: false,
          targetRoute: '/inventory',
          entityId: id
        },
        ...prev
      ]);
    }
  };

  const addPersonnel = (p: Omit<Personnel, 'id'>) => {
    const newPerson: Personnel = {
      ...p,
      id: `pers-${Date.now()}`
    };
    setPersonnel(prev => [newPerson, ...prev]);
  };

  const updatePersonnel = (id: string, updates: Partial<Personnel>) => {
    setPersonnel(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePersonnel = (id: string) => {
    setPersonnel(prev => prev.filter(p => p.id !== id));
  };

  const checkInPersonnel = (id: string, locationName: string, status: PersonnelStatus = 'ACTIVE') => {
    const nowIso = new Date().toISOString();
    setPersonnel(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          currentLocationName: locationName,
          lastCheckIn: nowIso,
          checkInOverdue: false,
          movementHistory: [
            {
              timestamp: nowIso.replace('T', ' ').substring(0, 16) + ' UTC',
              fromLocation: p.currentLocationName,
              toLocation: locationName,
              mode: 'Personnel Radio Check-in',
              notes: `Operator confirmed telemetry check-in at ${locationName}`
            },
            ...p.movementHistory
          ]
        };
      }
      return p;
    }));

    setNotifications(prev => [
      {
        id: `notif-checkin-${Date.now()}`,
        timestamp: nowIso,
        title: 'Personnel Check-in Recorded',
        message: `Personnel check-in confirmed at ${locationName}. Overdue flags cleared.`,
        severity: 'INFO',
        category: 'PERSONNEL',
        read: false,
        targetRoute: '/personnel',
        entityId: id
      },
      ...prev
    ]);
  };

  const createEmergency = (incident: Omit<EmergencyIncident, 'id' | 'incidentCode' | 'reportedAt' | 'timeline'>) => {
    const nowIso = new Date().toISOString();
    const newInc: EmergencyIncident = {
      ...incident,
      id: `emg-${Date.now()}`,
      incidentCode: `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      reportedAt: nowIso,
      timeline: [
        {
          id: `evt-${Date.now()}`,
          timestamp: nowIso.replace('T', ' ').substring(0, 16) + ' UTC',
          author: incident.leadResponder || 'Mission Commander',
          note: incident.description,
          actionTaken: `Emergency declared with severity ${incident.severity}`
        }
      ]
    };
    setEmergencies(prev => [newInc, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-emg-decl-${Date.now()}`,
        timestamp: nowIso,
        title: `EMERGENCY DECLARED: ${newInc.title}`,
        message: `${newInc.category} at ${newInc.locationName}. Severity: ${newInc.severity}.`,
        severity: newInc.severity === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
        category: 'EMERGENCY',
        read: false,
        targetRoute: '/emergency',
        entityId: newInc.id
      },
      ...prev
    ]);
  };

  const updateEmergencyStatus = (id: string, status: EmergencyStatus) => {
    setEmergencies(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const addEmergencyTimelineEvent = (id: string, author: string, note: string, actionTaken?: string) => {
    const nowIso = new Date().toISOString();
    setEmergencies(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          timeline: [
            ...e.timeline,
            {
              id: `evt-${Date.now()}`,
              timestamp: nowIso.replace('T', ' ').substring(0, 16) + ' UTC',
              author,
              note,
              actionTaken
            }
          ]
        };
      }
      return e;
    }));
  };

  const resolveEmergency = (id: string, note: string) => {
    const nowIso = new Date().toISOString();
    setEmergencies(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status: 'RESOLVED',
          resolvedAt: nowIso,
          timeline: [
            ...e.timeline,
            {
              id: `evt-${Date.now()}`,
              timestamp: nowIso.replace('T', ' ').substring(0, 16) + ' UTC',
              author: 'Mission Command',
              note: note || 'Incident successfully mitigated and safe operational baseline restored.',
              actionTaken: 'Incident status marked RESOLVED'
            }
          ]
        };
      }
      return e;
    }));

    setNotifications(prev => [
      {
        id: `notif-emg-res-${Date.now()}`,
        timestamp: nowIso,
        title: 'Emergency Incident Resolved',
        message: `Incident ${id} cleared by command. Station normal operations resumed.`,
        severity: 'SUCCESS',
        category: 'EMERGENCY',
        read: false,
        targetRoute: '/emergency',
        entityId: id
      },
      ...prev
    ]);
  };

  const toggleAutomationRule = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const runAutomationsManually = () => {
    runAutomations();
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Hackathon Presentation Simulators
  const simulateCargoDelay = () => {
    const transitCargo = cargo.find(c => c.status === 'In Transit') || cargo[0];
    if (transitCargo) {
      updateCargoStatus(transitCargo.id, 'Delayed');
      updateCargo(transitCargo.id, {
        eta: new Date(Date.now() + 72 * 3600 * 1000).toISOString()
      });
    }
  };

  const simulateLowInventory = () => {
    const item = inventory[0];
    if (item) {
      updateInventoryItem(item.id, {
        quantity: Math.max(1, Math.floor(item.reorderThreshold * 0.4))
      });
    }
  };

  const simulatePersonnelOverdue = () => {
    const person = personnel.find(p => !p.checkInOverdue) || personnel[0];
    if (person) {
      updatePersonnel(person.id, {
        checkInOverdue: true,
        lastCheckIn: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
      });
    }
  };

  const simulateSevereWeather = () => {
    setStations(prev => prev.map((s, idx) => {
      if (idx === 0) {
        return {
          ...s,
          weather: {
            ...s.weather,
            condition: 'Category 4 Blizzard',
            windKmh: 128,
            visibilityKm: 0.1,
            tempC: -38.4
          },
          status: 'WARNING'
        };
      }
      return s;
    }));

    setNotifications(prev => [
      {
        id: `notif-weather-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: 'SEVERE WEATHER ALERT: Maitri Station',
        message: 'Category 4 Blizzard detected. Wind gusts 128 km/h. Zero visibility lockdown initiated.',
        severity: 'CRITICAL',
        category: 'WEATHER',
        read: false,
        targetRoute: '/dashboard'
      },
      ...prev
    ]);
  };

  const simulateCriticalEmergency = () => {
    createEmergency({
      category: 'Medical Emergency',
      severity: 'CRITICAL',
      status: 'RESPONSE ACTIVE',
      title: 'Deep Glacial Crevasse Fall - Traumatic Injury',
      description: 'Field traverse member suffered compound fracture and acute hypothermia after 15m snow-bridge collapse at Larsemann Waypoint 12.',
      locationName: 'Larsemann Waypoint 12 (76.22°E, 69.45°S)',
      coords: { lat: -69.4500, lng: 76.2200 },
      radiusKm: 8,
      affectedPersonnelIds: ['pers-05'],
      affectedAssetIds: ['crg-101'],
      assignedResponseTeam: 'Bharati Alpha Medical Air Evac',
      leadResponder: 'Dr. Sunita Sen (CMO)'
    });
  };

  const resetAllDemoData = () => {
    PersistenceService.resetAllToDefault();
    setStations(PersistenceService.loadStations());
    setVessels(PersistenceService.loadVessels());
    setExpeditions(PersistenceService.loadExpeditions());
    setActiveExpeditionIdState(PersistenceService.loadActiveExpeditionId());
    setCargo(PersistenceService.loadCargo());
    setInventory(PersistenceService.loadInventory());
    setPersonnel(PersistenceService.loadPersonnel());
    setEmergencies(PersistenceService.loadEmergencies());
    setAutomations(PersistenceService.loadAutomations());
    setNotifications(PersistenceService.loadNotifications());
  };

  return (
    <AppContext.Provider
      value={{
        stations,
        vessels,
        expeditions,
        activeExpedition,
        activeExpeditionId,
        setActiveExpeditionId,
        cargo,
        inventory,
        personnel,
        emergencies,
        automations,
        notifications,
        unreadNotificationCount,
        aisStatus,
        aisStatusMessage,
        utcTime,

        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        isNotificationOpen,
        setIsNotificationOpen,

        addExpedition,
        updateExpedition,
        deleteExpedition,

        addCargo,
        updateCargo,
        deleteCargo,
        updateCargoStatus,

        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        reorderInventoryItem,

        addPersonnel,
        updatePersonnel,
        deletePersonnel,
        checkInPersonnel,

        createEmergency,
        updateEmergencyStatus,
        addEmergencyTimelineEvent,
        resolveEmergency,

        toggleAutomationRule,
        runAutomationsManually,

        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,

        simulateCargoDelay,
        simulateLowInventory,
        simulatePersonnelOverdue,
        simulateSevereWeather,
        simulateCriticalEmergency,
        resetAllDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
