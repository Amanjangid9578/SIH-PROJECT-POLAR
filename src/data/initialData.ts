import {
  ResearchStation,
  Vessel,
  Expedition,
  CargoItem,
  InventoryItem,
  Personnel,
  EmergencyIncident,
  AutomationRule,
  NotificationItem
} from '../types';

export const INITIAL_STATIONS: ResearchStation[] = [
  {
    id: 'st-maitri',
    name: 'Maitri Research Station',
    country: 'India',
    flag: '🇮🇳',
    coords: { lat: -70.7667, lng: 11.7333 },
    established: 1989,
    capacity: 65,
    currentPersonnel: 28,
    weather: {
      tempC: -24.5,
      windKmh: 48,
      windDirection: 'SSE',
      condition: 'Blowing Snow',
      visibilityKm: 4.2,
      pressureHpa: 982
    },
    fuelLevelPercent: 78,
    status: 'OPTIMAL'
  },
  {
    id: 'st-bharati',
    name: 'Bharati Research Station',
    country: 'India',
    flag: '🇮🇳',
    coords: { lat: -69.4064, lng: 76.1914 },
    established: 2012,
    capacity: 72,
    currentPersonnel: 34,
    weather: {
      tempC: -18.2,
      windKmh: 28,
      windDirection: 'ENE',
      condition: 'Partly Cloudy',
      visibilityKm: 12.0,
      pressureHpa: 994
    },
    fuelLevelPercent: 62,
    status: 'OPTIMAL'
  },
  {
    id: 'st-neumayer',
    name: 'Neumayer-Station III',
    country: 'Germany',
    flag: '🇩🇪',
    coords: { lat: -70.6744, lng: -8.2742 },
    established: 2009,
    capacity: 50,
    currentPersonnel: 19,
    weather: {
      tempC: -28.0,
      windKmh: 62,
      windDirection: 'S',
      condition: 'Blizzard Warning',
      visibilityKm: 1.5,
      pressureHpa: 975
    },
    fuelLevelPercent: 54,
    status: 'ADVISORY'
  },
  {
    id: 'st-mcmurdo',
    name: 'McMurdo Station',
    country: 'United States',
    flag: '🇺🇸',
    coords: { lat: -77.8419, lng: 166.6863 },
    established: 1956,
    capacity: 1200,
    currentPersonnel: 310,
    weather: {
      tempC: -19.8,
      windKmh: 35,
      windDirection: 'ESE',
      condition: 'Clear Sky',
      visibilityKm: 25.0,
      pressureHpa: 1002
    },
    fuelLevelPercent: 84,
    status: 'OPTIMAL'
  },
  {
    id: 'st-southpole',
    name: 'Amundsen-Scott South Pole Station',
    country: 'United States',
    flag: '🇺🇸',
    coords: { lat: -90.0000, lng: 0.0000 },
    established: 1957,
    capacity: 150,
    currentPersonnel: 48,
    weather: {
      tempC: -49.5,
      windKmh: 22,
      windDirection: 'GRID N',
      condition: 'Extreme Cold',
      visibilityKm: 18.0,
      pressureHpa: 680
    },
    fuelLevelPercent: 71,
    status: 'OPTIMAL'
  },
  {
    id: 'st-himadri',
    name: 'Himadri Station (Arctic)',
    country: 'India',
    flag: '🇮🇳',
    coords: { lat: 78.9244, lng: 11.9286 },
    established: 2008,
    capacity: 25,
    currentPersonnel: 12,
    weather: {
      tempC: -9.4,
      windKmh: 18,
      windDirection: 'NW',
      condition: 'Overcast',
      visibilityKm: 15.0,
      pressureHpa: 1011
    },
    fuelLevelPercent: 88,
    status: 'OPTIMAL'
  }
];

export const INITIAL_VESSELS: Vessel[] = [
  {
    id: 'ves-polar-star',
    mmsi: '419001244',
    name: 'MV Polar Star',
    callSign: 'VTCY',
    flag: '🇮🇳',
    type: 'Icebreaker',
    coords: { lat: -64.215, lng: 55.402 },
    speedKnots: 13.8,
    heading: 142,
    status: 'UNDERWAY',
    origin: 'Cape Town (ZACPT)',
    destination: 'Bharati Station',
    eta: '2026-10-04T12:00:00Z',
    lastUpdate: '2026-09-27T10:00:00Z',
    isLiveAis: false,
    iceClass: 'Polar Class 3 (PC3)',
    cargoCapacityTons: 4200,
    fuelPercent: 82
  },
  {
    id: 'ves-rv-aurora',
    mmsi: '503000109',
    name: 'RV Aurora Australis II',
    callSign: 'VNKL',
    flag: '🇦🇺',
    type: 'Research Vessel',
    coords: { lat: -66.852, lng: 72.105 },
    speedKnots: 11.2,
    heading: 98,
    status: 'UNDERWAY',
    origin: 'Hobart (AUHBA)',
    destination: 'Prydz Bay / Bharati',
    eta: '2026-10-02T18:30:00Z',
    lastUpdate: '2026-09-27T09:45:00Z',
    isLiveAis: false,
    iceClass: 'Polar Class 4 (PC4)',
    cargoCapacityTons: 2800,
    fuelPercent: 74
  },
  {
    id: 'ves-ocean-exp',
    mmsi: '311000852',
    name: 'MV Ocean Explorer',
    callSign: 'C6ZW',
    flag: '🇳🇴',
    type: 'Supply Ship',
    coords: { lat: -58.120, lng: 32.400 },
    speedKnots: 15.4,
    heading: 175,
    status: 'UNDERWAY',
    origin: 'Cape Town (ZACPT)',
    destination: 'Maitri Station (Crown Bay)',
    eta: '2026-10-08T08:00:00Z',
    lastUpdate: '2026-09-27T10:10:00Z',
    isLiveAis: false,
    iceClass: '1A Super',
    cargoCapacityTons: 6500,
    fuelPercent: 89
  },
  {
    id: 'ves-sagar-nidhi',
    mmsi: '419000123',
    name: 'INS Sagar Nidhi',
    callSign: 'ATMA',
    flag: '🇮🇳',
    type: 'Research Vessel',
    coords: { lat: -62.304, lng: 68.450 },
    speedKnots: 12.0,
    heading: 210,
    status: 'UNDERWAY',
    origin: 'Goa (INGOI)',
    destination: 'Southern Ocean Transect',
    eta: '2026-10-06T16:00:00Z',
    lastUpdate: '2026-09-27T09:55:00Z',
    isLiveAis: false,
    iceClass: '1A Ice Class',
    cargoCapacityTons: 1900,
    fuelPercent: 68
  }
];

export const INITIAL_EXPEDITIONS: Expedition[] = [
  {
    id: 'exp-isea-45',
    code: 'ISEA-XLV-2026',
    name: '45th Indian Scientific Expedition to Antarctica (ISEA-45)',
    missionCommander: 'Dr. Rajesh K. Nair (NCPOR)',
    startDate: '2026-09-15',
    endDate: '2027-04-30',
    status: 'OPERATIONAL',
    primaryStation: 'st-bharati',
    stationsInvolved: ['st-bharati', 'st-maitri'],
    assignedVesselIds: ['ves-polar-star', 'ves-ocean-exp'],
    assignedPersonnelIds: ['pers-01', 'pers-02', 'pers-03', 'pers-04', 'pers-05', 'pers-06'],
    assignedCargoIds: ['crg-101', 'crg-102', 'crg-103', 'crg-104', 'crg-105'],
    objectives: [
      'Deep ice core drilling at Larsemann Hills up to 450m depth',
      'Continuous atmospheric boundary layer measurements and ionospheric scintillation monitoring',
      'Complete winter fuel resupply (1,200 metric tons polar diesel) for Maitri and Bharati',
      'Structural health telemetry sensor array installation on Bharati sub-structures'
    ],
    riskAssessment: {
      overallRisk: 'MODERATE',
      weatherRisk: 'Active katabatic wind surges forecast for Queen Maud Land sector',
      seaIceRisk: 'Multi-year sea ice pack concentration 6/10 near Prydz Bay approach',
      logisticsRisk: 'Vessel MV Ocean Explorer delayed by 36 hours due to Southern Ocean swell'
    },
    budgetEstimatedUsd: 14500000,
    budgetSpentUsd: 6820000,
    milestones: [
      {
        id: 'ms-1',
        title: 'Expedition Planning & Science Clearance',
        stationOrPhase: 'NCPOR Goa',
        scheduledDate: '2026-08-01',
        actualDate: '2026-08-05',
        status: 'COMPLETED',
        description: 'MoES scientific review, environmental protocol sign-off, medical screening completed.'
      },
      {
        id: 'ms-2',
        title: 'Vessel Staging & Heavy Loading',
        stationOrPhase: 'Port of Cape Town',
        scheduledDate: '2026-09-10',
        actualDate: '2026-09-12',
        status: 'COMPLETED',
        description: 'Loaded 4,200t specialized cargo, polar diesel, containerized labs onto MV Polar Star.'
      },
      {
        id: 'ms-3',
        title: 'Roaring Forties & Ice Edge Transit',
        stationOrPhase: 'Southern Ocean (40°S - 60°S)',
        scheduledDate: '2026-09-25',
        status: 'IN_PROGRESS',
        description: 'Vessel underway through heavy swells; sea ice satellite reconnaissance active.'
      },
      {
        id: 'ms-4',
        title: 'Prydz Bay Sea-Ice Navigation & Mooring',
        stationOrPhase: 'Larsemann Hills Coastal Shelf',
        scheduledDate: '2026-10-04',
        status: 'PENDING',
        description: 'Icebreaker channel cutting and fast-ice mooring setup for heavy offloading.'
      },
      {
        id: 'ms-5',
        title: 'Bharati Station Cargo Offload & Resupply',
        stationOrPhase: 'Bharati Station',
        scheduledDate: '2026-10-12',
        status: 'PENDING',
        description: 'Helicopter and heavy sledge convoys across ice shelf to station tanks.'
      },
      {
        id: 'ms-6',
        title: 'Larsemann Deep Ice Core Campaign',
        stationOrPhase: 'Inland Continental Camp',
        scheduledDate: '2026-11-01',
        status: 'PENDING',
        description: 'Drilling operations commencement; cryosphere data acquisition.'
      },
      {
        id: 'ms-7',
        title: 'Maitri Station Wintering Turnover',
        stationOrPhase: 'Maitri Station',
        scheduledDate: '2026-12-15',
        status: 'PENDING',
        description: 'Handover ceremony between 44th and 45th wintering teams.'
      }
    ],
    routeCoordinates: [
      { lat: -33.9249, lng: 18.4241 }, // Cape Town
      { lat: -45.0, lng: 30.0 },
      { lat: -55.0, lng: 45.0 },
      { lat: -64.215, lng: 55.402 },   // Current MV Polar Star
      { lat: -67.5, lng: 70.0 },
      { lat: -69.4064, lng: 76.1914 }  // Bharati
    ]
  },
  {
    id: 'exp-arc-18',
    code: 'IND-ARC-XVIII',
    name: 'Arctic Ny-Ålesund Atmospheric & Fjords Survey',
    missionCommander: 'Dr. Sunita Deshmukh',
    startDate: '2026-07-01',
    endDate: '2026-10-30',
    status: 'OPERATIONAL',
    primaryStation: 'st-himadri',
    stationsInvolved: ['st-himadri'],
    assignedVesselIds: ['ves-sagar-nidhi'],
    assignedPersonnelIds: ['pers-07', 'pers-08'],
    assignedCargoIds: ['crg-106'],
    objectives: [
      'Atmospheric mercury and black carbon flux monitoring in Kongsfjorden',
      'Marine microbial genomic diversity sampling at 79°N'
    ],
    riskAssessment: {
      overallRisk: 'LOW',
      weatherRisk: 'Mild autumn freeze-up',
      seaIceRisk: 'Fjord drift ice minimal',
      logisticsRisk: 'Supply airlifts running on schedule'
    },
    budgetEstimatedUsd: 3800000,
    budgetSpentUsd: 2900000,
    milestones: [
      {
        id: 'ms-arc-1',
        title: 'Kongsfjorden Summer Water Sampling',
        stationOrPhase: 'Ny-Ålesund',
        scheduledDate: '2026-08-15',
        actualDate: '2026-08-14',
        status: 'COMPLETED',
        description: 'Fjord CTD casts and benthic sediment samples collected.'
      },
      {
        id: 'ms-arc-2',
        title: 'Autumn Sensor Winterization',
        stationOrPhase: 'Himadri Lab',
        scheduledDate: '2026-10-15',
        status: 'IN_PROGRESS',
        description: 'Heating jackets installed on atmospheric spectrometer mast.'
      }
    ],
    routeCoordinates: [
      { lat: 60.3913, lng: 5.3221 }, // Bergen
      { lat: 69.6492, lng: 18.9553 }, // Tromso
      { lat: 78.9244, lng: 11.9286 }  // Ny-Alesund
    ]
  }
];

export const INITIAL_CARGO: CargoItem[] = [
  {
    id: 'crg-101',
    trackingNumber: 'POL-CRG-2026-0101',
    description: 'Specialized Ice Core Drill Assembly & Crown Bit Kits',
    category: 'Scientific Instruments',
    weightKg: 2450,
    volumeM3: 8.5,
    origin: 'NCPOR Vasco da Gama, Goa',
    destination: 'Bharati Research Station',
    currentLocationName: 'Aboard MV Polar Star (Hold #2)',
    currentCoords: { lat: -64.215, lng: 55.402 },
    status: 'In Transit',
    priority: 'CRITICAL',
    assignedVesselId: 'ves-polar-star',
    eta: '2026-10-04T12:00:00Z',
    departureDate: '2026-09-12T08:00:00Z',
    temperatureControlled: false,
    hazmat: false,
    timeline: [
      { timestamp: '2026-09-08 09:00 UTC', location: 'Goa Lab', event: 'Customs seal and vibration packaging verified', status: 'Preparing' },
      { timestamp: '2026-09-12 14:30 UTC', location: 'Cape Town Port', event: 'Loaded into specialized reinforced hold aboard MV Polar Star', status: 'Loaded' },
      { timestamp: '2026-09-25 18:00 UTC', location: 'Southern Ocean', event: 'Telemetry beacon ping nominal at 64°S', status: 'In Transit' }
    ]
  },
  {
    id: 'crg-102',
    trackingNumber: 'POL-CRG-2026-0102',
    description: 'Bulk Arctic Grade Polar Diesel (Fuel Bladders #1-4)',
    category: 'Fuel & Energy',
    weightKg: 380000,
    volumeM3: 450,
    origin: 'Cape Town Energy Terminal',
    destination: 'Maitri Research Station',
    currentLocationName: 'Aboard MV Ocean Explorer (Tanks 1-4)',
    currentCoords: { lat: -58.120, lng: 32.400 },
    status: 'Delayed',
    priority: 'CRITICAL',
    assignedVesselId: 'ves-ocean-exp',
    eta: '2026-10-10T14:00:00Z',
    departureDate: '2026-09-16T11:00:00Z',
    temperatureControlled: false,
    hazmat: true,
    timeline: [
      { timestamp: '2026-09-14 08:00 UTC', location: 'Cape Town', event: 'Pumping and fuel density lab certification', status: 'Loaded' },
      { timestamp: '2026-09-16 12:00 UTC', location: 'Underway', event: 'Vessel departed Cape Town', status: 'In Transit' },
      { timestamp: '2026-09-26 04:30 UTC', location: 'Southern Ocean (58°S)', event: 'Severe gale force 9 slowed vessel transit speed by 4.2 knots', status: 'Delayed' }
    ]
  },
  {
    id: 'crg-103',
    trackingNumber: 'POL-CRG-2026-0103',
    description: 'Cryogenic Liquid Nitrogen Dewars for Atmospheric Lidar',
    category: 'Scientific Instruments',
    weightKg: 860,
    volumeM3: 3.2,
    origin: 'BARC Mumbai',
    destination: 'Bharati Research Station',
    currentLocationName: 'Aboard MV Polar Star (Hazmat Deck)',
    currentCoords: { lat: -64.215, lng: 55.402 },
    status: 'In Transit',
    priority: 'HIGH',
    assignedVesselId: 'ves-polar-star',
    eta: '2026-10-04T12:00:00Z',
    departureDate: '2026-09-12T08:00:00Z',
    temperatureControlled: true,
    requiredTempC: -196,
    hazmat: true,
    timeline: [
      { timestamp: '2026-09-10 16:00 UTC', location: 'Cape Town Berth 4', event: 'Cryo pressure sensors online and connected to ship telemetry', status: 'Loaded' },
      { timestamp: '2026-09-27 06:00 UTC', location: 'MV Polar Star', event: 'Pressure levels 1.4 bar nominal', status: 'In Transit' }
    ]
  },
  {
    id: 'crg-104',
    trackingNumber: 'POL-CRG-2026-0104',
    description: 'PistenBully 300 Polar Track & Hydraulic Overhaul Spares',
    category: 'Spare Parts',
    weightKg: 4200,
    volumeM3: 14.0,
    origin: 'Kässbohrer Geländefahrzeug, Germany',
    destination: 'Maitri Research Station',
    currentLocationName: 'Cape Town Logistics Staging Depot',
    currentCoords: { lat: -33.9249, lng: 18.4241 },
    status: 'Preparing',
    priority: 'MEDIUM',
    eta: '2026-11-05T10:00:00Z',
    departureDate: '2026-10-15T00:00:00Z',
    temperatureControlled: false,
    hazmat: false,
    timeline: [
      { timestamp: '2026-09-22 11:00 UTC', location: 'Cape Town Depot', event: 'Palletized and anti-corrosion shrink wrapped', status: 'Preparing' }
    ]
  },
  {
    id: 'crg-105',
    trackingNumber: 'POL-CRG-2026-0105',
    description: 'Emergency Frostbite, Surgical Field Packs & Hyperbaric Tent',
    category: 'Medical Supplies',
    weightKg: 480,
    volumeM3: 2.1,
    origin: 'AIIMS New Delhi',
    destination: 'Bharati Research Station',
    currentLocationName: 'Bharati Medical Bay',
    currentCoords: { lat: -69.4064, lng: 76.1914 },
    status: 'At Station',
    priority: 'CRITICAL',
    eta: '2026-09-20T10:00:00Z',
    departureDate: '2026-09-01T08:00:00Z',
    temperatureControlled: true,
    requiredTempC: 4,
    hazmat: false,
    timeline: [
      { timestamp: '2026-09-01 08:00 UTC', location: 'Delhi', event: 'Airlifted via military transport to Cape Town', status: 'Preparing' },
      { timestamp: '2026-09-18 14:00 UTC', location: 'Bharati Helipad', event: 'Received via Twin Otter flight and inventoried', status: 'At Station' }
    ]
  },
  {
    id: 'crg-106',
    trackingNumber: 'POL-CRG-2026-0106',
    description: 'Dehydrated High-Calorie Polar Nutrition Packs (6-Month)',
    category: 'Food & Rations',
    weightKg: 5200,
    volumeM3: 16.0,
    origin: 'DFRL Mysore',
    destination: 'Maitri Research Station',
    currentLocationName: 'Maitri Dry Storage Bunker',
    currentCoords: { lat: -70.7667, lng: 11.7333 },
    status: 'Delivered',
    priority: 'HIGH',
    eta: '2026-09-15T00:00:00Z',
    departureDate: '2026-08-20T00:00:00Z',
    temperatureControlled: false,
    hazmat: false,
    timeline: [
      { timestamp: '2026-09-15 12:00 UTC', location: 'Maitri Station', event: 'Verified and signed off by logistics chief', status: 'Delivered' }
    ]
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-med-01',
    sku: 'MED-HYPO-09',
    name: 'Rapid Hypothermia Core Rewarming System IV Fluids',
    category: 'Medical',
    quantity: 14,
    unit: 'Units',
    reorderThreshold: 25,
    maxCapacity: 60,
    stationId: 'st-bharati',
    storageLocation: 'Medical Module B - Trauma Locker 3',
    expiryDate: '2027-02-15',
    supplier: 'Baxter Healthcare Polar Div',
    condition: 'Optimal',
    lastAudited: '2026-09-20',
    unitCostUsd: 320
  },
  {
    id: 'inv-med-02',
    sku: 'MED-FROST-04',
    name: 'Prostacyclin & Iloprost Infusion Packs (Severe Frostbite)',
    category: 'Medical',
    quantity: 8,
    unit: 'Vials',
    reorderThreshold: 20,
    maxCapacity: 50,
    stationId: 'st-maitri',
    storageLocation: 'Maitri Clinic - Cold Lockbox #1',
    expiryDate: '2026-12-10',
    supplier: 'Cipla Critical Care',
    condition: 'Optimal',
    lastAudited: '2026-09-18',
    unitCostUsd: 650
  },
  {
    id: 'inv-fuel-01',
    sku: 'POL-DSL-A1',
    name: 'Polar Winter Grade -50°C Diesel Fuel',
    category: 'Fuel',
    quantity: 82000,
    unit: 'Liters',
    reorderThreshold: 100000,
    maxCapacity: 280000,
    stationId: 'st-bharati',
    storageLocation: 'Tank Farm Alpha - Tanks 1-3',
    expiryDate: '2028-12-31',
    supplier: 'Indian Oil Corporation Aviation',
    condition: 'Optimal',
    lastAudited: '2026-09-25',
    unitCostUsd: 1.85
  },
  {
    id: 'inv-fuel-02',
    sku: 'POL-DSL-A2',
    name: 'Polar Winter Grade -50°C Diesel Fuel',
    category: 'Fuel',
    quantity: 64000,
    unit: 'Liters',
    reorderThreshold: 75000,
    maxCapacity: 220000,
    stationId: 'st-maitri',
    storageLocation: 'Station Main Fuel Reserve',
    expiryDate: '2028-12-31',
    supplier: 'Indian Oil Corporation Aviation',
    condition: 'Optimal',
    lastAudited: '2026-09-22',
    unitCostUsd: 1.85
  },
  {
    id: 'inv-food-01',
    sku: 'RAT-DRY-EXP',
    name: 'DFRL Freeze-Dried Meal Packs (Kheer, Upma, Dal Chawal)',
    category: 'Food',
    quantity: 3400,
    unit: 'Meals',
    reorderThreshold: 1500,
    maxCapacity: 8000,
    stationId: 'st-bharati',
    storageLocation: 'Dry Ration Store Room 2',
    expiryDate: '2027-08-30',
    supplier: 'Defence Food Research Lab (DFRL)',
    condition: 'Optimal',
    lastAudited: '2026-09-15',
    unitCostUsd: 12
  },
  {
    id: 'inv-food-02',
    sku: 'RAT-MRE-EMG',
    name: 'Field Traverse High-Energy Survival Rations (4,500 kcal)',
    category: 'Food',
    quantity: 420,
    unit: 'Boxes',
    reorderThreshold: 600,
    maxCapacity: 1500,
    stationId: 'st-maitri',
    storageLocation: 'Traverse Emergency Bunker C',
    expiryDate: '2026-11-20',
    supplier: 'TrekTech Polar Rations',
    condition: 'Optimal',
    lastAudited: '2026-09-10',
    unitCostUsd: 45
  },
  {
    id: 'inv-sci-01',
    sku: 'SCI-ICE-BIT',
    name: 'Tungsten-Carbide Deep Core Ice Drilling Bits (125mm)',
    category: 'Research Equipment',
    quantity: 6,
    unit: 'Sets',
    reorderThreshold: 10,
    maxCapacity: 25,
    stationId: 'st-bharati',
    storageLocation: 'Geoscience Workshop Bay 4',
    expiryDate: '2030-01-01',
    supplier: 'Sandvik Mining & Rock Technology',
    condition: 'Optimal',
    lastAudited: '2026-09-21',
    unitCostUsd: 4200
  },
  {
    id: 'inv-spares-01',
    sku: 'SPR-GEN-CAT',
    name: 'Caterpillar 3406 Diesel Generator Fuel Injectors',
    category: 'Spare Parts',
    quantity: 12,
    unit: 'Units',
    reorderThreshold: 8,
    maxCapacity: 24,
    stationId: 'st-bharati',
    storageLocation: 'Power House Spares Rack 1',
    expiryDate: '2032-01-01',
    supplier: 'Caterpillar Marine Power',
    condition: 'Optimal',
    lastAudited: '2026-09-01',
    unitCostUsd: 850
  },
  {
    id: 'inv-spares-02',
    sku: 'SPR-SNOW-TRK',
    name: 'PistenBully Heavy Heavy-Duty Rubberized Track Links',
    category: 'Spare Parts',
    quantity: 4,
    unit: 'Pairs',
    reorderThreshold: 6,
    maxCapacity: 16,
    stationId: 'st-maitri',
    storageLocation: 'Vehicle Workshop Hangar',
    expiryDate: '2035-01-01',
    supplier: 'Kässbohrer Spares',
    condition: 'Service Required',
    lastAudited: '2026-09-12',
    unitCostUsd: 3100
  },
  {
    id: 'inv-comms-01',
    sku: 'COM-SAT-IRID',
    name: 'Iridium Extreme Satellite Emergency Handsets',
    category: 'Communication Equipment',
    quantity: 18,
    unit: 'Handsets',
    reorderThreshold: 12,
    maxCapacity: 30,
    stationId: 'st-bharati',
    storageLocation: 'Comms Control Room Safe',
    expiryDate: '2031-01-01',
    supplier: 'Iridium Communications Inc',
    condition: 'Optimal',
    lastAudited: '2026-09-26',
    unitCostUsd: 1450
  },
  {
    id: 'inv-safe-01',
    sku: 'SAF-CREV-HARN',
    name: 'Petzl Polar Crevasse Rescue Pulley & Full Harness Kit',
    category: 'Safety Equipment',
    quantity: 22,
    unit: 'Kits',
    reorderThreshold: 15,
    maxCapacity: 40,
    stationId: 'st-bharati',
    storageLocation: 'Safety & Mountain Guide Locker',
    expiryDate: '2029-06-01',
    supplier: 'Petzl Professional',
    condition: 'Optimal',
    lastAudited: '2026-09-24',
    unitCostUsd: 780
  }
];

export const INITIAL_PERSONNEL: Personnel[] = [
  {
    id: 'pers-01',
    badgeNumber: 'POL-IND-0451',
    name: 'Dr. Rajesh K. Nair',
    role: 'Expedition Commander & Senior Glaciologist',
    specialty: 'Ice Core Stratigraphy & Polar Logistics',
    team: 'Station Command',
    currentStationId: 'st-bharati',
    currentLocationName: 'Bharati Main Command Hub',
    coords: { lat: -69.4064, lng: 76.1914 },
    status: 'ACTIVE',
    lastCheckIn: '2026-09-27T09:30:00Z',
    checkInOverdue: false,
    destination: 'Larsemann Deep Field Camp',
    bloodType: 'O+',
    emergencyContact: '+91-9820-112233 (NCPOR Operations Desk)',
    movementHistory: [
      { timestamp: '2026-09-15 08:00 UTC', fromLocation: 'Goa', toLocation: 'Cape Town', mode: 'Commercial Air', notes: 'Expedition staging' },
      { timestamp: '2026-09-18 14:00 UTC', fromLocation: 'Cape Town', toLocation: 'Bharati Station', mode: 'Twin Otter Ski-Plane', notes: 'Advance command team arrival' }
    ]
  },
  {
    id: 'pers-02',
    badgeNumber: 'POL-IND-0452',
    name: 'Dr. Sunita Sen',
    role: 'Chief Medical Officer',
    specialty: 'Polar Medicine, Hypothermia & Emergency Surgery',
    team: 'Medical & Safety',
    currentStationId: 'st-bharati',
    currentLocationName: 'Bharati Medical Ward',
    coords: { lat: -69.4064, lng: 76.1914 },
    status: 'ACTIVE',
    lastCheckIn: '2026-09-27T08:45:00Z',
    checkInOverdue: false,
    destination: 'Bharati Medical Ward',
    bloodType: 'A+',
    emergencyContact: '+91-9433-445566',
    movementHistory: [
      { timestamp: '2026-09-18 14:00 UTC', fromLocation: 'Cape Town', toLocation: 'Bharati Station', mode: 'Twin Otter Ski-Plane', notes: 'Routine transfer' }
    ]
  },
  {
    id: 'pers-03',
    badgeNumber: 'POL-IND-0453',
    name: 'Vikramaditya Chauhan',
    role: 'Lead Mechanical Engineer',
    specialty: 'Heavy Diesel Turbines & PistenBully Maintenance',
    team: 'Engineering & Comms',
    currentStationId: 'st-maitri',
    currentLocationName: 'Maitri Generator Complex',
    coords: { lat: -70.7667, lng: 11.7333 },
    status: 'ACTIVE',
    lastCheckIn: '2026-09-27T07:15:00Z',
    checkInOverdue: false,
    destination: 'Maitri Generator Complex',
    bloodType: 'B+',
    emergencyContact: '+91-9811-998877',
    movementHistory: [
      { timestamp: '2026-08-20 10:00 UTC', fromLocation: 'Cape Town', toLocation: 'Maitri Station', mode: 'IL-76 Transport', notes: 'Winter over team support' }
    ]
  },
  {
    id: 'pers-04',
    badgeNumber: 'POL-IND-0454',
    name: 'Capt. Arunima Joseph',
    role: 'Ice Navigation & Maritime Logistics Officer',
    specialty: 'Polar Ship Routing & Sea Ice Satellite Analysis',
    team: 'Logistics & Marine',
    currentStationId: 'ves-polar-star',
    currentLocationName: 'Aboard MV Polar Star (Navigation Bridge)',
    coords: { lat: -64.215, lng: 55.402 },
    status: 'IN TRANSIT',
    lastCheckIn: '2026-09-27T09:10:00Z',
    checkInOverdue: false,
    destination: 'Bharati Station Anchorage',
    bloodType: 'AB+',
    emergencyContact: '+91-9940-223344',
    movementHistory: [
      { timestamp: '2026-09-12 14:00 UTC', fromLocation: 'Cape Town', toLocation: 'MV Polar Star', mode: 'Vessel Embarkation', notes: 'Master of ice routing' }
    ]
  },
  {
    id: 'pers-05',
    badgeNumber: 'POL-IND-0455',
    name: 'Tenzing Norbu',
    role: 'Field Safety Guide & Crevasse Rescue Specialist',
    specialty: 'High Altitude & Glacial Survival / ITBP Mountain Guide',
    team: 'Medical & Safety',
    currentStationId: 'st-bharati',
    currentLocationName: 'Larsemann Ridge Outpost (Sector 4)',
    coords: { lat: -69.4180, lng: 76.1200 },
    status: 'ACTIVE',
    lastCheckIn: '2026-09-27T05:00:00Z',
    checkInOverdue: true, // OVERDUE for demonstration!
    destination: 'Bharati Station Base Camp',
    bloodType: 'O-',
    emergencyContact: '+91-9876-001122',
    movementHistory: [
      { timestamp: '2026-09-26 14:00 UTC', fromLocation: 'Bharati Base', toLocation: 'Sector 4 Ridge', mode: 'Snowmobile Sled', notes: 'Establishing safety boundary' }
    ]
  },
  {
    id: 'pers-06',
    badgeNumber: 'POL-IND-0456',
    name: 'Dr. Priya Murthy',
    role: 'Atmospheric Physicist',
    specialty: 'Auroral Electrojet & Magnetospheric Radar',
    team: 'Scientific Research',
    currentStationId: 'st-maitri',
    currentLocationName: 'Maitri SuperDARN Antenna Field',
    coords: { lat: -70.7667, lng: 11.7333 },
    status: 'ACTIVE',
    lastCheckIn: '2026-09-27T09:00:00Z',
    checkInOverdue: false,
    destination: 'Maitri Science Hut',
    bloodType: 'B-',
    emergencyContact: '+91-9444-556677',
    movementHistory: [
      { timestamp: '2026-08-25 12:00 UTC', fromLocation: 'Goa', toLocation: 'Maitri', mode: 'Aircraft & Traverse', notes: 'Installation of magnetometers' }
    ]
  }
];

export const INITIAL_EMERGENCIES: EmergencyIncident[] = [
  {
    id: 'emg-2026-01',
    incidentCode: 'INC-2026-0084',
    category: 'Severe Weather',
    severity: 'HIGH',
    status: 'RESPONSE ACTIVE',
    title: 'Katabatic Gale Surge & Whiteout Condition (Sector 4)',
    description: 'Sudden descent of katabatic winds gusting at 115 km/h over Larsemann Ridge. Surface visibility reduced to <10 meters. Solo safety patrol unit Tenzing Norbu missed scheduled 08:00 UTC radio check.',
    locationName: 'Larsemann Ridge Outpost, Sector 4 (Antarctica)',
    coords: { lat: -69.4180, lng: 76.1200 },
    radiusKm: 15,
    reportedAt: '2026-09-27T08:15:00Z',
    affectedPersonnelIds: ['pers-05'],
    affectedAssetIds: ['crg-101'],
    assignedResponseTeam: 'Bharati Search & Rescue Unit Bravo',
    leadResponder: 'Dr. Rajesh K. Nair',
    timeline: [
      {
        id: 'evt-1',
        timestamp: '2026-09-27 08:15 UTC',
        author: 'Comms Duty Officer',
        note: '08:00 UTC HF Radio check-in failed for patrol unit pers-05. Three repeat calls on Channel 16 and Iridium beacon unanswered.',
        actionTaken: 'Incident declared HIGH severity'
      },
      {
        id: 'evt-2',
        timestamp: '2026-09-27 08:35 UTC',
        author: 'Station Commander Dr. Nair',
        note: 'Activated emergency response shelter beacon at Ridge Waypoint 4. Standby crew instructed to prepare enclosed tracked Hagglund BV206.',
        actionTaken: 'SAR Unit Bravo mustered in hangar'
      },
      {
        id: 'evt-3',
        timestamp: '2026-09-27 09:20 UTC',
        author: 'Radar Specialist Priya Murthy',
        note: 'Satellite meteorological radar shows wind speed decreasing to 65 km/h within 90 minutes. Thermal drone pre-flight check initiated.',
        actionTaken: 'Drone launch cleared upon wind drop below 70 km/h'
      }
    ]
  },
  {
    id: 'emg-2026-02',
    incidentCode: 'INC-2026-0082',
    category: 'Vehicle Failure',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    title: 'Hydraulic Rupture on PB-300 Sledge Tractor',
    description: 'During traverse trial near Maitri blue ice runway, PB-300 hydraulic steering line ruptured in -32°C chill.',
    locationName: 'Maitri Blue Ice Runway Runway-South',
    coords: { lat: -70.8200, lng: 11.6500 },
    radiusKm: 5,
    reportedAt: '2026-09-24T11:00:00Z',
    resolvedAt: '2026-09-25T16:30:00Z',
    affectedPersonnelIds: ['pers-03'],
    affectedAssetIds: ['crg-104'],
    assignedResponseTeam: 'Maitri Workshop Quick Response Team',
    leadResponder: 'Vikramaditya Chauhan',
    timeline: [
      {
        id: 'evt-r1',
        timestamp: '2026-09-24 11:00 UTC',
        author: 'Vikramaditya Chauhan',
        note: 'Hydraulic loss reported. Vehicle safely secured with chocks.',
        actionTaken: 'Field repair kit dispatched'
      },
      {
        id: 'evt-r2',
        timestamp: '2026-09-25 16:30 UTC',
        author: 'Vikramaditya Chauhan',
        note: 'Reinforced braided hydraulic line installed, fluid bled and pressure tested to 250 bar. Tractor returned to service.',
        actionTaken: 'Incident marked RESOLVED'
      }
    ]
  }
];

export const INITIAL_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'auto-01',
    title: 'Critical Medical & Fuel Low Stock Alert',
    description: 'Automatically triggers high-priority alerts and generates restock requisition when medical items or winter diesel fall below safe thresholds.',
    trigger: 'INVENTORY_QUANTITY_UPDATED',
    condition: 'Item.quantity < Item.reorderThreshold && (Item.category == "Medical" || Item.category == "Fuel")',
    action: 'DISPATCH_ALERT & CREATE_PURCHASE_ORDER',
    enabled: true,
    lastTriggered: '2026-09-27T08:00:00Z',
    executionCount: 14,
    category: 'INVENTORY'
  },
  {
    id: 'auto-02',
    title: 'Cargo Transit Delay Detection & Logistics Recalculation',
    description: 'Monitors vessel AIS progress and weather slowdowns. If ETA slips by >24 hours, recalculates station buffer consumption and notifies station commander.',
    trigger: 'VESSEL_ETA_CHANGED',
    condition: 'Vessel.speedKnots < 5.0 || DelayHours > 24',
    action: 'MARK_CARGO_DELAYED & NOTIFY_LOGISTICS_CHIEF',
    enabled: true,
    lastTriggered: '2026-09-26T04:30:00Z',
    executionCount: 7,
    category: 'CARGO'
  },
  {
    id: 'auto-03',
    title: 'Personnel Check-in Overdue Safety Escalation',
    description: 'Monitors last check-in timestamp of all active personnel in polar field. If last check-in exceeds 4 hours, escalates to command and prepares SAR alert.',
    trigger: 'CHECKIN_TIMER_EXPIRED',
    condition: 'Now - Personnel.lastCheckIn > 4 Hours',
    action: 'FLAG_OVERDUE & DISPATCH_WATCH_ALERT',
    enabled: true,
    lastTriggered: '2026-09-27T09:00:00Z',
    executionCount: 3,
    category: 'PERSONNEL'
  },
  {
    id: 'auto-04',
    title: 'Severe Polar Weather Route Optimization',
    description: 'Analyzes atmospheric isobar and satellite SAR ice radar data. If wind gusts > 100 km/h detected along vessel route, suggests safe alternative waypoint corridor.',
    trigger: 'WEATHER_SURGE_DETECTED',
    condition: 'Station.weather.windKmh > 90 || WeatherAlert == "Severe"',
    action: 'ALERT_BRIDGE_COMMAND & SUGGEST_WAYPOINT_OFFSET',
    enabled: true,
    lastTriggered: '2026-09-27T08:15:00Z',
    executionCount: 9,
    category: 'WEATHER'
  },
  {
    id: 'auto-05',
    title: 'Critical Emergency Command Center Broadcast',
    description: 'When an incident with severity CRITICAL is logged or acknowledged, activates emergency UI mode, pushes audio chime, and alerts all station consoles.',
    trigger: 'EMERGENCY_STATUS_CHANGE',
    condition: 'Emergency.severity == "CRITICAL" && Emergency.status != "RESOLVED"',
    action: 'TRIGGER_GLOBAL_TICKER & ESCALATE_MISSION_DIRECTOR',
    enabled: true,
    executionCount: 2,
    category: 'EMERGENCY'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    timestamp: '2026-09-27T08:15:00Z',
    title: 'Emergency Incident Declared',
    message: 'High severity weather surge at Larsemann Ridge (Sector 4). Personnel check-in overdue.',
    severity: 'CRITICAL',
    category: 'EMERGENCY',
    read: false,
    targetRoute: '/emergency',
    entityId: 'emg-2026-01'
  },
  {
    id: 'notif-02',
    timestamp: '2026-09-27T07:30:00Z',
    title: 'Low Stock Advisory: Medical Rewarming Fluids',
    message: 'Bharati Station inventory is at 14 units (Threshold: 25). Smart Reorder suggested.',
    severity: 'WARNING',
    category: 'INVENTORY',
    read: false,
    targetRoute: '/inventory',
    entityId: 'inv-med-01'
  },
  {
    id: 'notif-03',
    timestamp: '2026-09-26T04:30:00Z',
    title: 'Cargo Delay: Polar Diesel Fuel Bladders',
    message: 'MV Ocean Explorer delayed by 36h due to Southern Ocean gale force 9.',
    severity: 'WARNING',
    category: 'CARGO',
    read: true,
    targetRoute: '/cargo',
    entityId: 'crg-102'
  },
  {
    id: 'notif-04',
    timestamp: '2026-09-25T18:00:00Z',
    title: 'Milestone Completed: Southern Ocean Transit',
    message: 'MV Polar Star crossed 60°S latitude ice edge boundary nominal telemetry.',
    severity: 'SUCCESS',
    category: 'VESSEL',
    read: true,
    targetRoute: '/planning',
    entityId: 'exp-isea-45'
  }
];
