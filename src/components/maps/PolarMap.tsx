import React, { useEffect, useRef, useState } from 'react';
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
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MapDetailDrawer, MapSelectedEntity } from './MapDetailDrawer';
import { cn } from '../../utils/formatters';

interface PolarMapProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  highlightVesselId?: string;
  highlightCargoId?: string;
}

export const PolarMap: React.FC<PolarMapProps> = ({
  className,
  initialCenter = [-70.0, 45.0],
  initialZoom = 3,
  highlightVesselId,
  highlightCargoId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{
    stations: L.LayerGroup;
    vessels: L.LayerGroup;
    cargo: L.LayerGroup;
    personnel: L.LayerGroup;
    emergencies: L.LayerGroup;
    weather: L.LayerGroup;
    routes: L.LayerGroup;
  } | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const {
    stations,
    vessels,
    cargo,
    personnel,
    emergencies,
    activeExpedition
  } = useApp();

  const [selectedEntity, setSelectedEntity] = useState<MapSelectedEntity | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapType, setMapType] = useState<'dark' | 'satellite'>('dark');
  const [layerVisibility, setLayerVisibility] = useState({
    stations: true,
    vessels: true,
    cargo: true,
    personnel: true,
    emergencies: true,
    weather: true,
    routes: true
  });
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 2,
      maxZoom: 10,
      zoomControl: false,
      attributionControl: false
    });

    // Custom dark basemap
    const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const tileLayer = L.tileLayer(darkTileUrl, {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create Layer Groups
    const layerGroups = {
      stations: L.layerGroup().addTo(map),
      vessels: L.layerGroup().addTo(map),
      cargo: L.layerGroup().addTo(map),
      personnel: L.layerGroup().addTo(map),
      emergencies: L.layerGroup().addTo(map),
      weather: L.layerGroup().addTo(map),
      routes: L.layerGroup().addTo(map)
    };

    layerGroupsRef.current = layerGroups;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Type Change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const tileUrl =
      mapType === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    const newTileLayer = L.tileLayer(tileUrl, {
      subdomains: mapType === 'dark' ? 'abcd' : '',
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [mapType]);

  // Update Layers & Markers
  useEffect(() => {
    const lg = layerGroupsRef.current;
    if (!lg || !mapInstanceRef.current) return;

    // 1. Stations Layer (Blue)
    lg.stations.clearLayers();
    if (layerVisibility.stations) {
      stations.forEach(st => {
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="absolute -inset-2 bg-sky-500/20 rounded-full animate-ping"></div>
            <div class="h-7 w-7 rounded-lg bg-polar-900 border-2 border-sky-400 flex items-center justify-center text-xs shadow-[0_0_12px_rgba(56,189,248,0.7)] group-hover:scale-125 transition-transform">
              <span class="text-xs leading-none">${st.flag}</span>
            </div>
            <div class="absolute top-8 px-2 py-0.5 rounded bg-polar-950/90 border border-sky-500/40 text-[10px] text-sky-300 font-mono font-bold whitespace-nowrap shadow-md pointer-events-none group-hover:bg-polar-900">
              ${st.name}
            </div>
          </div>
        `;
        const markerIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-station-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([st.coords.lat, st.coords.lng], { icon: markerIcon });
        marker.on('click', () => setSelectedEntity({ type: 'station', data: st }));
        marker.addTo(lg.stations);
      });
    }

    // 2. Vessels Layer (Cyan)
    lg.vessels.clearLayers();
    if (layerVisibility.vessels) {
      vessels.forEach(v => {
        const isHighlighted = highlightVesselId === v.id;
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="absolute -inset-2 bg-cyan-400/25 rounded-full ${isHighlighted ? 'animate-ping' : ''}"></div>
            <div class="h-8 w-8 rounded-full bg-cyan-950 border-2 ${isHighlighted ? 'border-cyan-200 ring-2 ring-cyan-400' : 'border-cyan-400'} flex items-center justify-center shadow-[0_0_14px_rgba(6,182,212,0.8)] group-hover:scale-125 transition-all">
              <svg style="transform: rotate(${v.heading}deg);" class="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 19 21 12 17 5 21" />
              </svg>
            </div>
            <div class="absolute top-9 px-2 py-0.5 rounded bg-polar-950/90 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono font-bold whitespace-nowrap shadow-md pointer-events-none">
              ${v.name} (${v.speedKnots} kts)
            </div>
          </div>
        `;
        const markerIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-vessel-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([v.coords.lat, v.coords.lng], { icon: markerIcon });
        marker.on('click', () => setSelectedEntity({ type: 'vessel', data: v }));
        marker.addTo(lg.vessels);
      });
    }

    // 3. Cargo Layer (Amber)
    lg.cargo.clearLayers();
    if (layerVisibility.cargo) {
      cargo.forEach(c => {
        const isHighlighted = highlightCargoId === c.id;
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="h-6 w-6 rounded bg-amber-950 border-2 ${isHighlighted ? 'border-amber-200 ring-2 ring-amber-400' : 'border-amber-400'} flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.6)] group-hover:scale-125 transition-all">
              <svg class="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="absolute top-7 px-1.5 py-0.5 rounded bg-polar-950/90 border border-amber-500/40 text-[9px] text-amber-300 font-mono font-bold whitespace-nowrap shadow-md pointer-events-none">
              ${c.trackingNumber}
            </div>
          </div>
        `;
        const markerIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-cargo-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([c.currentCoords.lat, c.currentCoords.lng], { icon: markerIcon });
        marker.on('click', () => setSelectedEntity({ type: 'cargo', data: c }));
        marker.addTo(lg.cargo);
      });
    }

    // 4. Personnel Layer (Green)
    lg.personnel.clearLayers();
    if (layerVisibility.personnel) {
      personnel.forEach(p => {
        const isOverdue = p.checkInOverdue;
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            ${isOverdue ? '<div class="absolute -inset-2 bg-rose-500/40 rounded-full animate-ping"></div>' : ''}
            <div class="h-6 w-6 rounded-full ${isOverdue ? 'bg-rose-950 border-2 border-rose-500 text-rose-300' : 'bg-emerald-950 border-2 border-emerald-400 text-emerald-300'} flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.6)] group-hover:scale-125 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="absolute top-7 px-1.5 py-0.5 rounded bg-polar-950/90 border ${isOverdue ? 'border-rose-500/50 text-rose-300' : 'border-emerald-500/40 text-emerald-300'} text-[9px] font-mono font-bold whitespace-nowrap shadow-md pointer-events-none">
              ${p.name.split(' ')[0]} ${isOverdue ? '(!)' : ''}
            </div>
          </div>
        `;
        const markerIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-personnel-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([p.coords.lat, p.coords.lng], { icon: markerIcon });
        marker.on('click', () => setSelectedEntity({ type: 'personnel', data: p }));
        marker.addTo(lg.personnel);
      });
    }

    // 5. Emergency Layer (Red)
    lg.emergencies.clearLayers();
    if (layerVisibility.emergencies) {
      emergencies
        .filter(e => e.status !== 'RESOLVED')
        .forEach(e => {
          // Perimeter circle
          L.circle([e.coords.lat, e.coords.lng], {
            radius: (e.radiusKm || 10) * 1000,
            color: '#ef4444',
            weight: 2,
            fillColor: '#ef4444',
            fillOpacity: 0.15,
            dashArray: '4, 6'
          }).addTo(lg.emergencies);

          const iconHtml = `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="absolute -inset-3 bg-rose-500/40 rounded-full animate-ping"></div>
              <div class="h-8 w-8 rounded-lg bg-rose-950 border-2 border-rose-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.9)] animate-bounce">
                <svg class="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="absolute top-9 px-2 py-0.5 rounded bg-rose-950/95 border border-rose-500 text-[10px] text-rose-200 font-mono font-bold whitespace-nowrap shadow-lg">
                ${e.title}
              </div>
            </div>
          `;
          const markerIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-emergency-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = L.marker([e.coords.lat, e.coords.lng], { icon: markerIcon });
          marker.on('click', () => setSelectedEntity({ type: 'emergency', data: e }));
          marker.addTo(lg.emergencies);
        });
    }

    // 6. Weather Layer (Katabatic winds & storm zones)
    lg.weather.clearLayers();
    if (layerVisibility.weather) {
      // Katabatic wind zones near Queen Maud Land & Larsemann Hills
      const windZones = [
        { lat: -68.5, lng: 15.0, label: 'Katabatic Flow 45kts', radius: 180000 },
        { lat: -67.0, lng: 75.0, label: 'Katabatic Surge 52kts', radius: 150000 },
        { lat: -56.0, lng: 35.0, label: 'Southern Ocean Gale Force 9', radius: 240000 }
      ];

      windZones.forEach(wz => {
        L.circle([wz.lat, wz.lng], {
          radius: wz.radius,
          color: '#38bdf8',
          weight: 1,
          dashArray: '6, 8',
          fillColor: '#0284c7',
          fillOpacity: 0.08
        }).addTo(lg.weather);
      });
    }

    // 7. Routes Layer
    lg.routes.clearLayers();
    if (layerVisibility.routes && activeExpedition?.routeCoordinates) {
      const latlngs = activeExpedition.routeCoordinates.map(c => [c.lat, c.lng] as [number, number]);

      L.polyline(latlngs, {
        color: '#06b6d4',
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(lg.routes);
    }
  }, [
    stations,
    vessels,
    cargo,
    personnel,
    emergencies,
    activeExpedition,
    layerVisibility,
    highlightVesselId,
    highlightCargoId
  ]);

  const toggleLayer = (layerKey: keyof typeof layerVisibility) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetCenter = () => {
    mapInstanceRef.current?.setView(initialCenter, initialZoom, { animate: true });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  };

  return (
    <div
      className={cn(
        'relative bg-polar-950 border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl transition-all font-mono',
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'w-full h-[520px]',
        className
      )}
    >
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Detail Slide-over Inspector */}
      <MapDetailDrawer entity={selectedEntity} onClose={() => setSelectedEntity(null)} />

      {/* Top Left: Polar Header & Coordinate Telemetry */}
      <div className="absolute top-3 left-3 z-[400] bg-polar-900/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-2.5 shadow-lg text-xs space-y-1 pointer-events-auto">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="font-bold text-slate-100 tracking-wider uppercase">
            ANTARCTIC THEATRE OF OPERATIONS
          </span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            60°S - 90°S
          </span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-3">
          <span>Active Trackers: {vessels.length + stations.length + personnel.length}</span>
          <span>•</span>
          <span className="text-cyan-400 font-bold">Projection: EPSG:3857 Dark Mode</span>
        </div>
      </div>

      {/* Top Right: Layer Visibility & Base Map Toggles */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2 pointer-events-auto">
        {/* Layer Visibility Menu */}
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-polar-900/90 backdrop-blur-md border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs shadow-lg transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Map Layers</span>
          </button>

          {isLayerMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-polar-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl p-3 text-xs space-y-2 z-50 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block pb-1 border-b border-slate-800">
                Toggle Overlay Layers
              </span>

              <button
                onClick={() => toggleLayer('stations')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white py-1"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  <span>Research Stations</span>
                </div>
                {layerVisibility.stations ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>

              <button
                onClick={() => toggleLayer('vessels')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white py-1"
              >
                <div className="flex items-center gap-2">
                  <Ship className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Vessels & Icebreakers</span>
                </div>
                {layerVisibility.vessels ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>

              <button
                onClick={() => toggleLayer('cargo')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white py-1"
              >
                <div className="flex items-center gap-2">
                  <Box className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tracked Cargo</span>
                </div>
                {layerVisibility.cargo ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>

              <button
                onClick={() => toggleLayer('personnel')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white py-1"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Field Personnel</span>
                </div>
                {layerVisibility.personnel ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>

              <button
                onClick={() => toggleLayer('emergencies')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white py-1"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Emergency Zones</span>
                </div>
                {layerVisibility.emergencies ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>

              <button
                onClick={() => toggleLayer('weather')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white py-1"
              >
                <div className="flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  <span>Katabatic Weather</span>
                </div>
                {layerVisibility.weather ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>

              <button
                onClick={() => toggleLayer('routes')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white py-1"
              >
                <div className="flex items-center gap-2">
                  <span className="h-0.5 w-3 bg-cyan-400 inline-block" />
                  <span>Expedition Routes</span>
                </div>
                {layerVisibility.routes ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>

              {/* Base Map Switch */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block pb-1">
                  Base Map Source
                </span>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <button
                    onClick={() => setMapType('dark')}
                    className={cn(
                      'py-1 px-2 rounded text-[10px] text-center font-bold border transition-all',
                      mapType === 'dark'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                        : 'bg-polar-950 text-slate-400 border-slate-800'
                    )}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setMapType('satellite')}
                    className={cn(
                      'py-1 px-2 rounded text-[10px] text-center font-bold border transition-all',
                      mapType === 'satellite'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                        : 'bg-polar-950 text-slate-400 border-slate-800'
                    )}
                  >
                    Satellite
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center Button */}
        <button
          onClick={handleResetCenter}
          className="p-2 rounded-lg bg-polar-900/90 backdrop-blur-md border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs shadow-lg transition-all"
          title="Center on Antarctica"
        >
          <Globe2 className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-polar-900/90 backdrop-blur-md border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs shadow-lg transition-all"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Right: Zoom Controls & Legend */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col items-end gap-2 pointer-events-auto">
        {/* Map Legend */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-polar-900/90 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 shadow-lg">
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
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span>Emergency</span>
          </div>
        </div>

        {/* Zoom In/Out */}
        <div className="flex items-center gap-1 bg-polar-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-1 shadow-lg">
          <button
            onClick={handleZoomIn}
            className="h-8 w-8 rounded flex items-center justify-center text-slate-200 hover:text-white hover:bg-polar-800 transition-colors text-base font-bold"
            title="Zoom In"
          >
            +
          </button>
          <div className="w-[1px] h-4 bg-slate-700" />
          <button
            onClick={handleZoomOut}
            className="h-8 w-8 rounded flex items-center justify-center text-slate-200 hover:text-white hover:bg-polar-800 transition-colors text-base font-bold"
            title="Zoom Out"
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};
