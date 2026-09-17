import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IncidentRecord } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import {
  MapPin,
  Compass,
  Crosshair,
  Layers,
  AlertTriangle,
  Calendar,
  Clock,
  Shield,
  Maximize2,
  Paperclip,
  CheckCircle,
  X,
  ChevronRight,
  Info
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface IncidentMapViewProps {
  incidents: IncidentRecord[];
  onSelectIncident?: (incident: IncidentRecord) => void;
  onAddNewIncidentAt?: (coords: { lat: number; lng: number }) => void;
  onOpenEvidenceVault?: () => void;
}

// Calculate distance between two coordinates in meters
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export const IncidentMapView: React.FC<IncidentMapViewProps> = ({
  incidents,
  onSelectIncident,
  onAddNewIncidentAt,
  onOpenEvidenceVault
}) => {
  const { isCream } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const bufferLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  const [showBufferZones, setShowBufferZones] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<number>(0);

  // Filter incidents that have valid coordinates
  const geotaggedIncidents = useMemo(() => {
    return incidents.filter(
      (inc) =>
        typeof inc.latitude === 'number' &&
        !isNaN(inc.latitude) &&
        typeof inc.longitude === 'number' &&
        !isNaN(inc.longitude) &&
        (filterSeverity === 0 || inc.severity >= filterSeverity)
    );
  }, [incidents, filterSeverity]);

  const unmappedCount = incidents.length - geotaggedIncidents.length;

  const activeIncident = useMemo(() => {
    return incidents.find((i) => i.id === activeIncidentId) || null;
  }, [incidents, activeIncidentId]);

  // Nearest incident calculation to user location
  const nearestIncidentInfo = useMemo(() => {
    if (!userLocation || geotaggedIncidents.length === 0) return null;
    let minDistance = Infinity;
    let closest: IncidentRecord | null = null;

    for (const inc of geotaggedIncidents) {
      if (inc.latitude && inc.longitude) {
        const dist = getDistanceMeters(userLocation.lat, userLocation.lng, inc.latitude, inc.longitude);
        if (dist < minDistance) {
          minDistance = dist;
          closest = inc;
        }
      }
    }

    return closest ? { incident: closest, distanceMeters: minDistance } : null;
  }, [userLocation, geotaggedIncidents]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to center of tagged incidents, or Bengaluru / default
      const defaultCenter: [number, number] =
        geotaggedIncidents.length > 0
          ? [geotaggedIncidents[0].latitude!, geotaggedIncidents[0].longitude!]
          : [12.9716, 77.5946];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Add Zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Attribution control minimal at bottom-right
      L.control
        .attribution({
          position: 'bottomright',
          prefix: false
        })
        .addAttribution('&copy; OpenStreetMap & CartoDB')
        .addTo(map);

      // Add Tile Layer based on theme
      const tileUrl = isCream
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Create Layer Groups
      const bufferLayer = L.layerGroup().addTo(map);
      const markersLayer = L.layerGroup().addTo(map);

      bufferLayerRef.current = bufferLayer;
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Handle map click for reporting/pinpointing
      map.on('click', (e: L.LeafletMouseEvent) => {
        setClickedCoords({
          lat: Number(e.latlng.lat.toFixed(5)),
          lng: Number(e.latlng.lng.toFixed(5))
        });
      });
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when Theme Changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl = isCream
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);
  }, [isCream]);

  // Render Incident Markers & Buffer Zones
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !bufferLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    const bufferLayer = bufferLayerRef.current;

    markersLayer.clearLayers();
    bufferLayer.clearLayers();

    if (geotaggedIncidents.length === 0) return;

    const latLngs: L.LatLngExpression[] = [];

    geotaggedIncidents.forEach((inc) => {
      if (typeof inc.latitude !== 'number' || typeof inc.longitude !== 'number') return;
      const pos: [number, number] = [inc.latitude, inc.longitude];
      latLngs.push(pos);

      // Severity styling
      const isCritical = inc.severity >= 4;
      const isSelected = inc.id === activeIncidentId;

      const markerColor =
        inc.severity === 5
          ? '#e11d48'
          : inc.severity === 4
          ? '#f43f5e'
          : inc.severity === 3
          ? '#f59e0b'
          : '#0ea5e9';

      const pulseHtml = isCritical
        ? `<div class="absolute -inset-2 rounded-full animate-ping opacity-30" style="background-color: ${markerColor}"></div>`
        : '';

      const borderClass = isCream ? 'border-black' : isSelected ? 'border-white' : 'border-[#242424]';
      const shadowClass = isCream ? 'shadow-[2px_2px_0px_0px_#000]' : 'shadow-lg';

      // Custom Div Icon
      const customIcon = L.divIcon({
        className: 'custom-incident-pin',
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        popupAnchor: [0, -40],
        html: `
          <div class="relative flex flex-col items-center cursor-pointer group transition-transform ${isSelected ? 'scale-115 z-30' : 'hover:scale-110 z-20'}">
            ${pulseHtml}
            <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white border-2 ${borderClass} ${shadowClass}" style="background-color: ${markerColor}">
              <span class="leading-none">${inc.severity}</span>
            </div>
            <div class="w-2 h-2.5 -mt-1 rotate-45 border-r-2 border-b-2 ${borderClass}" style="background-color: ${markerColor}"></div>
          </div>
        `
      });

      const marker = L.marker(pos, { icon: customIcon }).addTo(markersLayer);

      marker.on('click', () => {
        setActiveIncidentId(inc.id);
        if (onSelectIncident) {
          onSelectIncident(inc);
        }
      });

      // Buffer Zone circles (150m - 250m proportional to severity)
      if (showBufferZones) {
        const radiusMeters = 100 + inc.severity * 30; // 130m to 250m
        L.circle(pos, {
          radius: radiusMeters,
          color: markerColor,
          weight: 1.5,
          dashArray: '4, 4',
          fillColor: markerColor,
          fillOpacity: isSelected ? 0.22 : 0.1
        }).addTo(bufferLayer);
      }
    });

    // Auto fit bounds if map is initialized and has markers
    if (latLngs.length > 0 && !activeIncidentId) {
      const bounds = L.latLngBounds(latLngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
    }
  }, [geotaggedIncidents, activeIncidentId, showBufferZones, isCream, onSelectIncident]);

  // Recenter when an incident is explicitly selected
  useEffect(() => {
    if (!mapInstanceRef.current || !activeIncidentId) return;
    const target = geotaggedIncidents.find((i) => i.id === activeIncidentId);
    if (target && target.latitude && target.longitude) {
      mapInstanceRef.current.flyTo([target.latitude, target.longitude], 15, {
        duration: 0.8
      });
    }
  }, [activeIncidentId, geotaggedIncidents]);

  // Update user location marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userLocation) {
      const pos: [number, number] = [userLocation.lat, userLocation.lng];

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(pos);
      } else {
        const userIcon = L.divIcon({
          className: 'user-live-pin',
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          html: `
            <div class="relative flex items-center justify-center w-6 h-6">
              <div class="absolute inset-0 rounded-full bg-sky-500 animate-ping opacity-60"></div>
              <div class="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-md"></div>
            </div>
          `
        });

        userMarkerRef.current = L.marker(pos, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
      }
    } else if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
  }, [userLocation]);

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const loc = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
          accuracy: Math.round(pos.coords.accuracy)
        };
        setUserLocation(loc);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([loc.lat, loc.lng], 15);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation failed:', err.message);
        // Fallback to sample Indiranagar coordinate if in local container
        const fallback = { lat: 12.9784, lng: 77.6408, accuracy: 25 };
        setUserLocation(fallback);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([fallback.lat, fallback.lng], 15);
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleFitAllBounds = () => {
    if (!mapInstanceRef.current) return;
    const pts = geotaggedIncidents
      .filter((i) => i.latitude && i.longitude)
      .map((i) => [i.latitude!, i.longitude!] as [number, number]);

    if (userLocation) {
      pts.push([userLocation.lat, userLocation.lng]);
    }

    if (pts.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 15 });
      setActiveIncidentId(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Top Map Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
              isCream
                ? 'bg-white border-black text-[#0D0D0D] shadow-[1px_1px_0px_0px_#000]'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{geotaggedIncidents.length} Mapped Pins</span>
            {unmappedCount > 0 && (
              <span className={`text-[10px] font-normal ${isCream ? 'text-[#242424]/70' : 'text-slate-400'}`}>
                ({unmappedCount} without GPS)
              </span>
            )}
          </div>

          {/* Quick Severity Filter */}
          <div className="flex items-center gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isCream ? 'text-[#242424]' : 'text-slate-400'}`}>
              Min:
            </span>
            {[0, 3, 4].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition border ${
                  filterSeverity === sev
                    ? isCream
                      ? 'bg-[#0D0D0D] text-[#FDFBD4] border-black'
                      : 'bg-[#FDFBD4] text-black border-[#FDFBD4]'
                    : isCream
                    ? 'bg-white border-black/30 text-[#242424] hover:border-black'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {sev === 0 ? 'All' : `Lvl ${sev}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Map Control Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowBufferZones(!showBufferZones)}
            title={showBufferZones ? 'Hide Safety Buffer Radii' : 'Show Safety Buffer Radii'}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition border ${
              showBufferZones
                ? isCream
                  ? 'bg-emerald-100 border-black text-[#0D0D0D]'
                  : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : isCream
                ? 'bg-white border-black/30 text-[#242424]'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zones</span>
          </button>

          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            title="Show My Live GPS Position"
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition border ${
              userLocation
                ? isCream
                  ? 'bg-sky-100 border-black text-[#0D0D0D]'
                  : 'bg-sky-950/60 border-sky-800 text-sky-300'
                : isCream
                ? 'bg-white border-black/30 text-[#242424]'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">My Location</span>
          </button>

          <button
            onClick={handleFitAllBounds}
            title="Recenter & Fit All Incident Pins"
            className={`p-1.5 rounded-xl text-xs font-semibold transition border ${
              isCream
                ? 'bg-white border-black text-[#0D0D0D] hover:bg-black/5 shadow-[1px_1px_0px_0px_#000]'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div
        className={`relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border transition-all ${
          isCream
            ? 'border-2 border-black bg-[#f4ede2] shadow-[3px_3px_0px_0px_#000]'
            : 'border-slate-800 bg-[#121210] shadow-md'
        }`}
      >
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Severity Legend Overlay on Map (Top Left) */}
        <div
          className={`absolute top-2.5 left-2.5 z-10 px-2.5 py-2 rounded-xl text-[10px] space-y-1 backdrop-blur-md border ${
            isCream
              ? 'bg-white/95 border border-black text-[#0D0D0D] shadow-[1px_1px_0px_0px_#000]'
              : 'bg-slate-950/90 border border-slate-800 text-slate-300 shadow-md'
          }`}
        >
          <div className="font-bold flex items-center gap-1">
            <Shield className="w-3 h-3 text-rose-500" />
            <span>Hazard Index</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" /> Lvl 4-5 Critical
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Lvl 3 High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> Lvl 1-2
            </span>
          </div>
        </div>

        {/* Proximity / Nearest Incident Banner if user located */}
        {nearestIncidentInfo && (
          <div
            className={`absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto sm:max-w-xs z-10 p-2.5 rounded-xl border backdrop-blur-md flex items-center justify-between gap-2 text-xs ${
              isCream
                ? 'bg-white/95 border-2 border-black text-[#0D0D0D] shadow-[2px_2px_0px_0px_#000]'
                : 'bg-slate-900/95 border-slate-700 text-slate-200 shadow-lg'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="truncate">
                <span className="font-bold block text-[11px] truncate">
                  Nearest Event: {nearestIncidentInfo.distanceMeters > 1000 ? `${(nearestIncidentInfo.distanceMeters / 1000).toFixed(1)} km` : `${nearestIncidentInfo.distanceMeters} m`} away
                </span>
                <span className={`text-[10px] truncate block ${isCream ? 'text-[#242424]' : 'text-slate-400'}`}>
                  {nearestIncidentInfo.incident.location}
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveIncidentId(nearestIncidentInfo.incident.id)}
              className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 border ${
                isCream
                  ? 'bg-black text-[#FDFBD4] border-black'
                  : 'bg-sky-600 text-white border-sky-500'
              }`}
            >
              Focus
            </button>
          </div>
        )}

        {/* Click-to-Pin Tooltip Prompt */}
        {clickedCoords && !activeIncidentId && (
          <div
            className={`absolute top-2.5 right-12 z-10 p-2.5 rounded-xl border backdrop-blur-md max-w-xs text-xs space-y-1.5 ${
              isCream
                ? 'bg-white/95 border-2 border-black text-[#0D0D0D] shadow-[2px_2px_0px_0px_#000]'
                : 'bg-slate-900/95 border-slate-700 text-slate-200 shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-500" />
                Selected Coordinates
              </span>
              <button
                onClick={() => setClickedCoords(null)}
                className="text-slate-400 hover:text-rose-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="font-mono text-[10px] text-slate-400">
              {clickedCoords.lat}, {clickedCoords.lng}
            </p>
            {onAddNewIncidentAt && (
              <button
                onClick={() => {
                  onAddNewIncidentAt(clickedCoords);
                  setClickedCoords(null);
                }}
                className={`w-full py-1 px-2 rounded-lg text-[10px] font-bold text-center border transition ${
                  isCream
                    ? 'bg-black text-[#FDFBD4] border-black hover:bg-black/90'
                    : 'bg-sky-600 text-white border-sky-500 hover:bg-sky-500'
                }`}
              >
                Log Incident at this GPS
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selected Marker Detail Card */}
      {activeIncident ? (
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isCream
              ? 'bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-slate-900/95 border-slate-800 shadow-md'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border ${
                    activeIncident.severity >= 4
                      ? isCream
                        ? 'bg-rose-100 text-rose-800 border-rose-600 font-bold'
                        : 'bg-rose-950 text-rose-300 border-rose-800'
                      : isCream
                      ? 'bg-amber-100 text-amber-900 border-amber-600 font-bold'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}
                >
                  Severity {activeIncident.severity}/5 • {activeIncident.category.replace('_', ' ')}
                </span>
                {activeIncident.reportedToPolice && (
                  <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-950/40 border border-emerald-800 px-1.5 py-0.5 rounded">
                    Police Reported
                  </span>
                )}
              </div>

              <h4 className={`text-sm font-bold ${isCream ? 'text-[#0D0D0D]' : 'text-white'}`}>
                {activeIncident.location}
              </h4>

              <div className={`flex flex-wrap items-center gap-3 text-[11px] ${isCream ? 'text-[#242424]' : 'text-slate-400'}`}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {formatDate(activeIncident.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {activeIncident.time}
                </span>
                {activeIncident.latitude && activeIncident.longitude && (
                  <span className="font-mono text-[10px] text-sky-500">
                    GPS: {activeIncident.latitude.toFixed(4)}, {activeIncident.longitude.toFixed(4)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setActiveIncidentId(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="Close incident card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description Excerpt */}
          <p className={`text-xs mt-2.5 p-2.5 rounded-xl border leading-relaxed ${
            isCream
              ? 'bg-[#FAF8F5] border-black/20 text-[#242424]'
              : 'bg-slate-950/80 border-slate-800/80 text-slate-300'
          }`}>
            {activeIncident.description}
          </p>

          {/* Evidence Count and Actions */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/40 text-xs">
            <div className="flex items-center gap-2">
              {activeIncident.evidenceIds && activeIncident.evidenceIds.length > 0 ? (
                <button
                  onClick={onOpenEvidenceVault}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border transition ${
                    isCream
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
                      : 'bg-emerald-950/50 text-emerald-400 border-emerald-800'
                  }`}
                >
                  <Paperclip className="w-3 h-3" />
                  <span>{activeIncident.evidenceIds.length} Evidence Attached</span>
                </button>
              ) : (
                <span className={`text-[11px] ${isCream ? 'text-[#242424]/60' : 'text-slate-500'}`}>
                  No attached evidence
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeIncident.latitude || 12.9716},${activeIncident.longitude || 77.5946}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                  isCream
                    ? 'bg-white border-black text-[#0D0D0D] hover:bg-black/5 shadow-[1px_1px_0px_0px_#000]'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white'
                }`}
              >
                External Directions ↗
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            isCream
              ? 'bg-white border border-black/20 text-[#242424]'
              : 'bg-slate-900/60 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Tap any hazard marker on the map to inspect incident details and cryptographic evidence.</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Interactive GIS
          </span>
        </div>
      )}
    </div>
  );
};
