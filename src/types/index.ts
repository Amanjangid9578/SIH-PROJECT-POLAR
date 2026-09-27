export type ExpeditionStatus = 'PLANNING' | 'ACTIVE' | 'OPERATIONAL' | 'TRANSIT' | 'COMPLETED' | 'STANDBY';

export type VesselStatus = 'UNDERWAY' | 'MOORED' | 'ANCHORED' | 'ICEBOUND' | 'MAINTENANCE';

export type CargoStatus = 'Preparing' | 'Loaded' | 'In Transit' | 'At Station' | 'Delayed' | 'Delivered' | 'Critical';
export type CargoCategory = 'Food & Rations' | 'Medical Supplies' | 'Fuel & Energy' | 'Scientific Instruments' | 'Heavy Machinery' | 'Communications' | 'Survival Gear' | 'Spare Parts';
export type CargoPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type InventoryCategory = 'Food' | 'Medical' | 'Fuel' | 'Research Equipment' | 'Spare Parts' | 'Safety Equipment' | 'Communication Equipment';
export type InventoryCondition = 'Optimal' | 'Good' | 'Service Required' | 'Degraded';

export type PersonnelStatus = 'ACTIVE' | 'IN TRANSIT' | 'AT STATION' | 'RESTING' | 'MEDICAL' | 'MISSING';

export type EmergencySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type EmergencyStatus = 'CREATED' | 'ACKNOWLEDGED' | 'RESPONSE ACTIVE' | 'RESOLVED';
export type EmergencyCategory = 'Medical Emergency' | 'Vehicle Failure' | 'Communication Loss' | 'Severe Weather' | 'Fire' | 'Missing Personnel' | 'Cargo Damage';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ResearchStation {
  id: string;
  name: string;
  country: string;
  flag: string;
  coords: Coordinates;
  established: number;
  capacity: number;
  currentPersonnel: number;
  weather: {
    tempC: number;
    windKmh: number;
    windDirection: string;
    condition: string;
    visibilityKm: number;
    pressureHpa: number;
  };
  fuelLevelPercent: number;
  status: 'OPTIMAL' | 'ADVISORY' | 'WARNING';
}

export interface Vessel {
  id: string;
  mmsi: string;
  name: string;
  callSign: string;
  flag: string;
  type: 'Icebreaker' | 'Research Vessel' | 'Cargo Carrier' | 'Supply Ship';
  coords: Coordinates;
  speedKnots: number;
  heading: number;
  status: VesselStatus;
  origin: string;
  destination: string;
  eta: string;
  lastUpdate: string;
  isLiveAis: boolean;
  iceClass: string;
  cargoCapacityTons: number;
  fuelPercent: number;
}

export interface Milestone {
  id: string;
  title: string;
  stationOrPhase: string;
  scheduledDate: string;
  actualDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  description: string;
}

export interface Expedition {
  id: string;
  code: string;
  name: string;
  missionCommander: string;
  startDate: string;
  endDate: string;
  status: ExpeditionStatus;
  primaryStation: string;
  stationsInvolved: string[];
  assignedVesselIds: string[];
  assignedPersonnelIds: string[];
  assignedCargoIds: string[];
  objectives: string[];
  riskAssessment: {
    overallRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
    weatherRisk: string;
    seaIceRisk: string;
    logisticsRisk: string;
  };
  budgetEstimatedUsd: number;
  budgetSpentUsd: number;
  milestones: Milestone[];
  routeCoordinates: Coordinates[];
}

export interface CargoItem {
  id: string;
  trackingNumber: string;
  description: string;
  category: CargoCategory;
  weightKg: number;
  volumeM3: number;
  origin: string;
  destination: string;
  currentLocationName: string;
  currentCoords: Coordinates;
  status: CargoStatus;
  priority: CargoPriority;
  assignedVesselId?: string;
  eta: string;
  departureDate: string;
  temperatureControlled: boolean;
  requiredTempC?: number;
  hazmat: boolean;
  timeline: {
    timestamp: string;
    location: string;
    event: string;
    status: CargoStatus;
  }[];
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  reorderThreshold: number;
  maxCapacity: number;
  stationId: string;
  storageLocation: string; // e.g. "Storage Bunker Alpha - Rack 4"
  expiryDate: string;
  supplier: string;
  condition: InventoryCondition;
  lastAudited: string;
  unitCostUsd: number;
}

export interface PersonnelMovement {
  timestamp: string;
  fromLocation: string;
  toLocation: string;
  mode: string;
  notes: string;
}

export interface Personnel {
  id: string;
  badgeNumber: string;
  name: string;
  role: string;
  specialty: string;
  team: 'Scientific Research' | 'Logistics & Marine' | 'Medical & Safety' | 'Engineering & Comms' | 'Station Command';
  currentStationId: string;
  currentLocationName: string;
  coords: Coordinates;
  status: PersonnelStatus;
  lastCheckIn: string;
  checkInOverdue: boolean;
  destination: string;
  bloodType: string;
  emergencyContact: string;
  movementHistory: PersonnelMovement[];
}

export interface EmergencyTimelineEvent {
  id: string;
  timestamp: string;
  author: string;
  note: string;
  actionTaken?: string;
}

export interface EmergencyIncident {
  id: string;
  incidentCode: string;
  category: EmergencyCategory;
  severity: EmergencySeverity;
  status: EmergencyStatus;
  title: string;
  description: string;
  locationName: string;
  coords: Coordinates;
  radiusKm: number;
  reportedAt: string;
  resolvedAt?: string;
  affectedPersonnelIds: string[];
  affectedAssetIds: string[];
  assignedResponseTeam: string;
  leadResponder: string;
  timeline: EmergencyTimelineEvent[];
}

export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
  lastTriggered?: string;
  executionCount: number;
  category: 'INVENTORY' | 'CARGO' | 'PERSONNEL' | 'EMERGENCY' | 'WEATHER' | 'SYSTEM';
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  category: 'EMERGENCY' | 'CARGO' | 'INVENTORY' | 'PERSONNEL' | 'VESSEL' | 'WEATHER' | 'AUTOMATION';
  read: boolean;
  targetRoute?: string;
  entityId?: string;
}

export interface PolarWeatherData {
  station: string;
  temp: number;
  feelsLike: number;
  windSpeed: number;
  windGust: number;
  windDirection: string;
  condition: string;
  iceThicknessMeters: number;
  pressure: number;
  visibilityKm: number;
  forecast: {
    day: string;
    tempMax: number;
    tempMin: number;
    wind: number;
    summary: string;
  }[];
}
