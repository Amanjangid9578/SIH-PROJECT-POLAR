import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  Maximize2,
  Minimize2,
  Compass,
  Ship,
  Box,
  Users,
  AlertTriangle,
  Wind,
  Globe2,
  Eye,
  EyeOff,
  Radio,
  Building2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MapDetailDrawer, MapSelectedEntity } from './MapDetailDrawer';
import { cn, formatCoordinates, formatUtcDateTime } from '../../utils/formatters';
import {
  CargoItem,
  EmergencyIncident,
  ExpeditionStatus,
  Personnel,
  ResearchStation,
  Vessel
} from '../../types';
import 'leaflet/dist/leaflet.css';

const ANTARCTICA_CENTER: [number, number] = [-75, 0];
const ANTARCTICA_ZOOM = 3;

const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

interface PolarMapProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  highlightVesselId?: string;
  highlightCargoId?: string;
}

type LayerKey =
  | 'stations'
  | 'vessels'
  | 'cargo'
  | 'personnel'
  | 'emergencies'
  | 'weather'
  | 'routes';

function createDivIcon(html: string, size: number, className: string): L.DivIcon {
  return L.divIcon({
    html,
    className,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

function stationIcon(st: ResearchStation): L.DivIcon {
  return createDivIcon(
    `<div class="relative flex items-center justify-center cursor-pointer group">
      <div class="absolute -inset-2 bg-sky-500/20 rounded-full animate-ping"></div>
      <div class="h-7 w-7 rounded-lg bg-polar-900 border-2 border-sky-400 flex items-center justify-center text-xs shadow-[0_0_12px_rgba(56,189,248,0.7)] group-hover:scale-125 transition-transform">
        <span class="text-xs leading-none">${st.flag}</span>
      </div>
      <div class="absolute top-8 px-2 py-0.5 rounded bg-polar-950/90 border border-sky-500/40 text-[10px] text-sky-300 font-mono font-bold whitespace-nowrap shadow-md pointer-events-none max-w-[140px] overflow-hidden text-ellipsis">
        ${st.name}
      </div>
    </div>`,
    28,
    'custom-station-icon'
  );
}

function vesselIcon(v: Vessel, highlighted: boolean, animating: boolean): L.DivIcon {
  return createDivIcon(
    `<div class="relative flex items-center justify-center cursor-pointer group ${animating ? 'vessel-marker-pulse' : ''}">
      <div class="absolute -inset-2 bg-cyan-400/25 rounded-full ${highlighted || animating ? 'animate-ping' : ''}"></div>
      <div class="h-8 w-8 rounded-full bg-cyan-950 border-2 ${highlighted ? 'border-cyan-200 ring-2 ring-cyan-400' : 'border-cyan-400'} flex items-center justify-center shadow-[0_0_14px_rgba(6,182,212,0.8)] group-hover:scale-125 transition-all">
        <svg style="transform: rotate(${v.heading}deg);" class="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 19 21 12 17 5 21" />
        </svg>
      </div>
      <div class="absolute top-9 px-2 py-0.5 rounded bg-polar-950/90 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono font-bold whitespace-nowrap shadow-md pointer-events-none max-w-[160px] overflow-hidden text-ellipsis">
        ${v.name} (${v.speedKnots} kts)
      </div>
    </div>`,
    32,
    'custom-vessel-icon'
  );
}

function cargoIcon(c: CargoItem, highlighted: boolean): L.DivIcon {
  return createDivIcon(
    `<div class="relative flex items-center justify-center cursor-pointer group">
      <div class="h-6 w-6 rounded bg-amber-950 border-2 ${highlighted ? 'border-amber-200 ring-2 ring-amber-400' : 'border-amber-400'} flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.6)] group-hover:scale-125 transition-all">
        <svg class="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <div class="absolute top-7 px-1.5 py-0.5 rounded bg-polar-950/90 border border-amber-500/40 text-[9px] text-amber-300 font-mono font-bold whitespace-nowrap shadow-md pointer-events-none max-w-[120px] overflow-hidden text-ellipsis">
        ${c.trackingNumber}
      </div>
    </div>`,
    24,
    'custom-cargo-icon'
  );
}

function personnelIcon(p: Personnel): L.DivIcon {
  const overdue = p.checkInOverdue;
  return createDivIcon(
    `<div class="relative flex items-center justify-center cursor-pointer group">
      ${overdue ? '<div class="absolute -inset-2 bg-rose-500/40 rounded-full animate-ping"></div>' : ''}
      <div class="h-6 w-6 rounded-full ${overdue ? 'bg-rose-950 border-2 border-rose-500 text-rose-300' : 'bg-emerald-950 border-2 border-emerald-400 text-emerald-300'} flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.6)] group-hover:scale-125 transition-all">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div class="absolute top-7 px-1.5 py-0.5 rounded bg-polar-950/90 border ${overdue ? 'border-rose-500/50 text-rose-300' : 'border-emerald-500/40 text-emerald-300'} text-[9px] font-mono font-bold whitespace-nowrap shadow-md pointer-events-none max-w-[100px] overflow-hidden text-ellipsis">
        ${p.name.split(' ')[0]} ${overdue ? '(!)' : ''}
      </div>
    </div>`,
    24,
    'custom-personnel-icon'
  );
}

function emergencyIcon(e: EmergencyIncident): L.DivIcon {
  return createDivIcon(
    `<div class="relative flex items-center justify-center cursor-pointer group">
      <div class="absolute -inset-3 bg-rose-500/40 rounded-full animate-ping"></div>
      <div class="h-8 w-8 rounded-lg bg-rose-950 border-2 border-rose-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.9)] animate-bounce">
        <svg class="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div class="absolute top-9 px-2 py-0.5 rounded bg-rose-950/95 border border-rose-500 text-[10px] text-rose-200 font-mono font-bold whitespace-nowrap shadow-lg max-w-[140px] overflow-hidden text-ellipsis">
        ${e.title}
      </div>
    </div>`,
    32,
    'custom-emergency-icon'
  );
}

function routeStyle(status: ExpeditionStatus, isEmergency = false): L.PolylineOptions {
  if (isEmergency) {
    return { color: '#f43f5e', weight: 3, opacity: 0.9, dashArray: '4, 6', lineCap: 'round' };
  }
  switch (status) {
    case 'ACTIVE':
    case 'OPERATIONAL':
    case 'TRANSIT':
      return { color: '#06b6d4', weight: 3, opacity: 0.9, lineCap: 'round' };
    case 'COMPLETED':
      return { color: '#34d399', weight: 2, opacity: 0.55, dashArray: '2, 8', lineCap: 'round' };
    case 'PLANNING':
    case 'STANDBY':
    default:
      return { color: '#f59e0b', weight: 2, opacity: 0.7, dashArray: '8, 8', lineCap: 'round' };
  }
}

const WIND_ZONES = [
  { lat: -68.5, lng: 15.0, radius: 180000 },
  { lat: -67.0, lng: 75.0, radius: 150000 },
  { lat: -56.0, lng: 35.0, radius: 240000 }
];

/** Imperative map helpers — zoom / reset / invalidate on fullscreen */
const MapController: React.FC<{
  isFullscreen: boolean;
  onReady: (map: L.Map) => void;
}> = ({ isFullscreen, onReady }) => {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  useEffect(() => {
    const t = window.setTimeout(() => map.invalidateSize(), 200);
    return () => window.clearTimeout(t);
  }, [isFullscreen, map]);

  return null;
};

const MarkerPopupRows: React.FC<{
  rows: { label: string; value: React.ReactNode }[];
}> = ({ rows }) => (
  <div className="space-y-1 min-w-[180px] max-w-[260px]">
    {rows.map(row => (
      <div key={row.label} className="flex justify-between gap-3 text-[11px] font-mono">
        <span className="text-slate-400 shrink-0">{row.label}</span>
        <span className="text-slate-100 text-right break-words min-w-0">{row.value}</span>
      </div>
    ))}
  </div>
);

export const PolarMap: React.FC<PolarMapProps> = ({
  className,
  initialCenter = ANTARCTICA_CENTER,
  initialZoom = ANTARCTICA_ZOOM,
  highlightVesselId,
  highlightCargoId
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const prevVesselCoordsRef = useRef<Record<string, { lat: number; lng: number }>>({});
  const animatingVesselsRef = useRef<Set<string>>(new Set());
  const [animTick, setAnimTick] = useState(0);

  const {
    stations,
    vessels,
    cargo,
    personnel,
    emergencies,
    expeditions,
    aisStatus
  } = useApp();

  const [selectedEntity, setSelectedEntity] = useState<MapSelectedEntity | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState<Record<LayerKey, boolean>>({
    stations: true,
    vessels: true,
    cargo: true,
    personnel: true,
    emergencies: true,
    weather: true,
    routes: true
  });
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  // Pulse vessel markers when AIS position changes (map itself is not remounted)
  useEffect(() => {
    const moved = new Set<string>();
    vessels.forEach(v => {
      const prev = prevVesselCoordsRef.current[v.id];
      if (
        prev &&
        (Math.abs(prev.lat - v.coords.lat) > 0.00001 || Math.abs(prev.lng - v.coords.lng) > 0.00001)
      ) {
        moved.add(v.id);
      }
      prevVesselCoordsRef.current[v.id] = { lat: v.coords.lat, lng: v.coords.lng };
    });

    if (moved.size === 0) return;

    animatingVesselsRef.current = moved;
    setAnimTick(n => n + 1);
    const t = window.setTimeout(() => {
      animatingVesselsRef.current = new Set();
      setAnimTick(n => n + 1);
    }, 900);
    return () => window.clearTimeout(t);
  }, [vessels]);

  const toggleLayer = (key: LayerKey) => {
    setLayerVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetCenter = () => {
    mapRef.current?.setView(initialCenter, initialZoom, { animate: true });
  };
  const toggleFullscreen = () => setIsFullscreen(v => !v);

  const aisLabel =
    aisStatus === 'LIVE_CONNECTED'
      ? 'LIVE AIS'
      : aisStatus === 'CONNECTING'
        ? 'AIS CONNECTING'
        : 'AIS DISCONNECTED';

  const aisIsLive = aisStatus === 'LIVE_CONNECTED';
  const aisIsDemo = aisStatus === 'DEMO_FALLBACK' || aisStatus === 'DISCONNECTED' || aisStatus === 'ERROR';

  const activeEmergencies = useMemo(
    () => emergencies.filter(e => e.status !== 'RESOLVED'),
    [emergencies]
  );

  const expeditionRoutes = useMemo(() => {
    return expeditions
      .filter(exp => exp.routeCoordinates?.length >= 2)
      .map(expedition => ({
        expedition,
        isEmergency:
          expedition.riskAssessment?.overallRisk === 'SEVERE' ||
          activeEmergencies.some(em =>
            em.affectedAssetIds?.some(id => expedition.assignedVesselIds.includes(id))
          )
      }));
  }, [expeditions, activeEmergencies]);

  const selectEntity = (entity: MapSelectedEntity) => setSelectedEntity(entity);

  return (
    <div
      className={cn(
        'relative bg-polar-950 border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl transition-all font-mono',
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'w-full h-[min(420px,55vh)] sm:h-[520px]',
        className
      )}
    >
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        minZoom={2}
        maxZoom={18}
        zoomControl={false}
        className="w-full h-full z-0 polar-leaflet-map"
        worldCopyJump
      >
        <TileLayer
          attribution={OSM_ATTRIBUTION}
          url={OSM_TILE_URL}
          maxZoom={19}
        />

        <MapController
          isFullscreen={isFullscreen}
          onReady={handleMapReady}
        />

        {layerVisibility.stations &&
          stations.map(st => (
            <Marker
              key={st.id}
              position={[st.coords.lat, st.coords.lng]}
              icon={stationIcon(st)}
              eventHandlers={{ click: () => selectEntity({ type: 'station', data: st }) }}
            >
              <Popup>
                <MarkerPopupRows
                  rows={[
                    { label: 'ID', value: st.id },
                    { label: 'Name', value: st.name },
                    { label: 'Type', value: 'Research Station' },
                    { label: 'Lat', value: st.coords.lat.toFixed(4) },
                    { label: 'Lng', value: st.coords.lng.toFixed(4) },
                    { label: 'Status', value: st.status },
                    { label: 'Personnel', value: `${st.currentPersonnel}/${st.capacity}` }
                  ]}
                />
              </Popup>
            </Marker>
          ))}

        {layerVisibility.vessels &&
          vessels.map(v => (
            <Marker
              key={v.id}
              position={[v.coords.lat, v.coords.lng]}
              icon={vesselIcon(
                v,
                highlightVesselId === v.id,
                animTick > 0 && animatingVesselsRef.current.has(v.id)
              )}
              eventHandlers={{ click: () => selectEntity({ type: 'vessel', data: v }) }}
            >
              <Popup>
                <MarkerPopupRows
                  rows={[
                    { label: 'ID', value: v.id },
                    { label: 'Name', value: v.name },
                    { label: 'Type', value: v.type },
                    { label: 'Lat', value: v.coords.lat.toFixed(4) },
                    { label: 'Lng', value: v.coords.lng.toFixed(4) },
                    { label: 'Status', value: v.status },
                    { label: 'Speed', value: `${v.speedKnots} kts` },
                    { label: 'Heading', value: `${v.heading}°` },
                    { label: 'Updated', value: formatUtcDateTime(v.lastUpdate) },
                    { label: 'Dest', value: v.destination },
                    { label: 'ETA', value: new Date(v.eta).toUTCString().substring(0, 22) },
                    {
                      label: 'Feed',
                      value: v.isLiveAis ? 'LIVE AIS' : 'DEMO DATA'
                    }
                  ]}
                />
              </Popup>
            </Marker>
          ))}

        {layerVisibility.cargo &&
          cargo.map(c => (
            <Marker
              key={c.id}
              position={[c.currentCoords.lat, c.currentCoords.lng]}
              icon={cargoIcon(c, highlightCargoId === c.id)}
              eventHandlers={{ click: () => selectEntity({ type: 'cargo', data: c }) }}
            >
              <Popup>
                <MarkerPopupRows
                  rows={[
                    { label: 'ID', value: c.id },
                    { label: 'Name', value: c.trackingNumber },
                    { label: 'Type', value: 'Cargo' },
                    { label: 'Lat', value: c.currentCoords.lat.toFixed(4) },
                    { label: 'Lng', value: c.currentCoords.lng.toFixed(4) },
                    { label: 'Status', value: c.status },
                    { label: 'Dest', value: c.destination },
                    { label: 'ETA', value: new Date(c.eta).toUTCString().substring(0, 22) }
                  ]}
                />
              </Popup>
            </Marker>
          ))}

        {layerVisibility.personnel &&
          personnel.map(p => (
            <Marker
              key={p.id}
              position={[p.coords.lat, p.coords.lng]}
              icon={personnelIcon(p)}
              eventHandlers={{ click: () => selectEntity({ type: 'personnel', data: p }) }}
            >
              <Popup>
                <MarkerPopupRows
                  rows={[
                    { label: 'ID', value: p.badgeNumber },
                    { label: 'Name', value: p.name },
                    { label: 'Type', value: 'Personnel' },
                    { label: 'Lat', value: p.coords.lat.toFixed(4) },
                    { label: 'Lng', value: p.coords.lng.toFixed(4) },
                    { label: 'Status', value: p.checkInOverdue ? 'OVERDUE' : p.status },
                    { label: 'Updated', value: formatUtcDateTime(p.lastCheckIn) },
                    { label: 'Dest', value: p.destination }
                  ]}
                />
              </Popup>
            </Marker>
          ))}

        {layerVisibility.emergencies &&
          activeEmergencies.map(e => (
            <React.Fragment key={e.id}>
              <Circle
                center={[e.coords.lat, e.coords.lng]}
                radius={(e.radiusKm || 10) * 1000}
                pathOptions={{
                  color: '#ef4444',
                  weight: 2,
                  fillColor: '#ef4444',
                  fillOpacity: 0.15,
                  dashArray: '4, 6'
                }}
              />
              <Marker
                position={[e.coords.lat, e.coords.lng]}
                icon={emergencyIcon(e)}
                eventHandlers={{ click: () => selectEntity({ type: 'emergency', data: e }) }}
              >
                <Popup>
                  <MarkerPopupRows
                    rows={[
                      { label: 'ID', value: e.incidentCode },
                      { label: 'Name', value: e.title },
                      { label: 'Type', value: 'Emergency' },
                      { label: 'Lat', value: e.coords.lat.toFixed(4) },
                      { label: 'Lng', value: e.coords.lng.toFixed(4) },
                      { label: 'Status', value: e.status },
                      { label: 'Updated', value: formatUtcDateTime(e.reportedAt) }
                    ]}
                  />
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

        {layerVisibility.weather &&
          WIND_ZONES.map((wz, i) => (
            <Circle
              key={`wind-${i}`}
              center={[wz.lat, wz.lng]}
              radius={wz.radius}
              pathOptions={{
                color: '#38bdf8',
                weight: 1,
                dashArray: '6, 8',
                fillColor: '#0284c7',
                fillOpacity: 0.08
              }}
            />
          ))}

        {layerVisibility.routes &&
          expeditionRoutes.map(({ expedition, isEmergency }) => {
            const latlngs = expedition.routeCoordinates.map(
              c => [c.lat, c.lng] as [number, number]
            );
            return (
              <Polyline
                key={expedition.id}
                positions={latlngs}
                pathOptions={routeStyle(expedition.status, isEmergency)}
              />
            );
          })}
      </MapContainer>

      <MapDetailDrawer entity={selectedEntity} onClose={() => setSelectedEntity(null)} />

      {/* Top Left: Header + AIS status */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-[400] max-w-[calc(100%-5.5rem)] sm:max-w-[min(100%,420px)] bg-polar-900/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-2 sm:p-2.5 shadow-lg text-xs space-y-1 sm:space-y-1.5 pointer-events-auto">
        <div className="flex items-center gap-2 min-w-0">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow shrink-0" />
          <span className="font-bold text-slate-100 tracking-wider uppercase truncate text-[10px] sm:text-xs">
            <span className="sm:hidden">ANTARCTIC THEATRE</span>
            <span className="hidden sm:inline">ANTARCTIC THEATRE OF OPERATIONS</span>
          </span>
          <span className="hidden sm:inline shrink-0 px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            60°S – 90°S
          </span>
        </div>
        <div className="hidden sm:flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="truncate">
            Trackers: {vessels.length + stations.length + personnel.length}
          </span>
          <span>•</span>
          <span className="text-cyan-400 font-bold truncate">OpenStreetMap · Leaflet</span>
          <span
            className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-bold uppercase text-[10px]',
              aisIsLive
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 text-slate-300 border-slate-600'
            )}
          >
            <Radio className={cn('w-3 h-3', aisIsLive && 'animate-pulse')} />
            {aisLabel}
          </span>
          {aisIsDemo && (
            <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold text-[10px] uppercase">
              DEMO DATA
            </span>
          )}
        </div>
      </div>

      {/* Top Right: Layers + Reset + Fullscreen */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[400] flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-polar-900/90 backdrop-blur-md border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs shadow-lg transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Map Layers</span>
          </button>

          {isLayerMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-polar-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl p-3 text-xs space-y-2 z-50 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block pb-1 border-b border-slate-800">
                Toggle Overlay Layers
              </span>

              {(
                [
                  { key: 'stations' as const, label: 'Research Stations', icon: Building2, color: 'text-sky-400' },
                  { key: 'vessels' as const, label: 'Vessels', icon: Ship, color: 'text-cyan-400' },
                  { key: 'cargo' as const, label: 'Cargo', icon: Box, color: 'text-amber-400' },
                  { key: 'personnel' as const, label: 'Personnel', icon: Users, color: 'text-emerald-400' },
                  { key: 'emergencies' as const, label: 'Emergencies', icon: AlertTriangle, color: 'text-rose-400' },
                  { key: 'weather' as const, label: 'Katabatic Weather', icon: Wind, color: 'text-sky-400' },
                  { key: 'routes' as const, label: 'Expedition Routes', icon: Globe2, color: 'text-cyan-400' }
                ] as const
              ).map(item => {
                const Icon = item.icon;
                const on = layerVisibility[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleLayer(item.key)}
                    className="w-full flex items-center justify-between text-slate-300 hover:text-white py-1 gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={cn('w-3.5 h-3.5 shrink-0', item.color)} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {on ? (
                      <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleResetCenter}
          className="p-2 rounded-lg bg-polar-900/90 backdrop-blur-md border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs shadow-lg transition-all"
          title="Reset Antarctica View (−75°, 0° · zoom 3)"
        >
          <Globe2 className="w-4 h-4 text-cyan-400" />
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-polar-900/90 backdrop-blur-md border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs shadow-lg transition-all"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Right: Legend + Zoom */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col items-end gap-2 pointer-events-auto">
        <div className="hidden sm:flex flex-wrap justify-end max-w-[320px] items-center gap-3 px-3 py-1.5 rounded-lg bg-polar-900/90 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span>Station</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>Vessel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Cargo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Personnel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Emergency</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-polar-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-1 shadow-lg">
          <button
            type="button"
            onClick={handleZoomIn}
            className="h-8 w-8 rounded flex items-center justify-center text-slate-200 hover:text-white hover:bg-polar-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-700" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="h-8 w-8 rounded flex items-center justify-center text-slate-200 hover:text-white hover:bg-polar-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen-reader friendly coords hint */}
      <span className="sr-only">
        Map centered at {formatCoordinates(initialCenter[0], initialCenter[1])}, zoom {initialZoom}
      </span>
    </div>
  );
};
