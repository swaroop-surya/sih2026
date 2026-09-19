import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IncidentRecord } from '../../types';
import {
  MapPin,
  Crosshair,
  Layers,
  Maximize2,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface IncidentMapViewProps {
  incidents: IncidentRecord[];
  onSelectIncident?: (incident: IncidentRecord) => void;
  onAddNewIncidentAt?: (coords: { lat: number; lng: number }) => void;
}

export const IncidentMapView: React.FC<IncidentMapViewProps> = ({
  incidents,
  onSelectIncident,
  onAddNewIncidentAt
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const bufferLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  const [showBufferZones, setShowBufferZones] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(false);

  // Filter incidents that have valid coordinates
  const geotaggedIncidents = useMemo(() => {
    return (incidents || []).filter(
      (inc) =>
        typeof inc.latitude === 'number' &&
        !isNaN(inc.latitude) &&
        typeof inc.longitude === 'number' &&
        !isNaN(inc.longitude)
    );
  }, [incidents]);

  const activeIncident = useMemo(() => {
    return (incidents || []).find((i) => i.id === activeIncidentId) || null;
  }, [incidents, activeIncidentId]);

  // Initialize Leaflet Map with OpenStreetMap tiles (no API KEY watermark!)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
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

      // Attribution control minimal at bottom-right
      L.control
        .attribution({
          position: 'bottomright',
          prefix: false
        })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors')
        .addTo(map);

      // Standard OpenStreetMap tiles (no watermark!)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const bufferLayer = L.layerGroup().addTo(map);
      const markersLayer = L.layerGroup().addTo(map);

      bufferLayerRef.current = bufferLayer;
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Handle map click for reporting
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onAddNewIncidentAt) {
          onAddNewIncidentAt({
            lat: Number(e.latlng.lat.toFixed(5)),
            lng: Number(e.latlng.lng.toFixed(5))
          });
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when geotagged incidents or selection changes
  useEffect(() => {
    if (!markersLayerRef.current || !bufferLayerRef.current || !mapInstanceRef.current) return;

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

      const isSelected = inc.id === activeIncidentId;

      // Marker colors: level 1-2 teal, 3 amber, 4-5 coral
      const markerColor =
        inc.severity <= 2 ? '#0B8577' : inc.severity === 3 ? '#B36B00' : '#E5314B';

      // Custom Div Icon with number inside pin
      const customIcon = L.divIcon({
        className: 'custom-incident-pin',
        iconSize: [32, 40],
        iconAnchor: [16, 38],
        popupAnchor: [0, -36],
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.15s; ${
            isSelected ? 'transform: scale(1.15); z-index: 40;' : ''
          }">
            <div style="width: 32px; height: 32px; border-radius: 9999px; background-color: ${markerColor}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; font-family: 'Bricolage Grotesque', sans-serif; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); border: 2px solid #ffffff;">
              <span>${inc.severity}</span>
            </div>
            <div style="width: 8px; height: 8px; transform: rotate(45deg); background-color: ${markerColor}; margin-top: -4px; border-right: 2px solid #ffffff; border-bottom: 2px solid #ffffff;"></div>
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

      // Buffer zone circles (optional layer)
      if (showBufferZones) {
        const radiusMeters = 100 + inc.severity * 30;
        L.circle(pos, {
          radius: radiusMeters,
          color: markerColor,
          weight: 1.5,
          dashArray: '3, 4',
          fillColor: markerColor,
          fillOpacity: isSelected ? 0.2 : 0.08
        }).addTo(bufferLayer);
      }
    });

    if (latLngs.length > 0 && !activeIncidentId) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40], maxZoom: 15 });
    }
  }, [geotaggedIncidents, activeIncidentId, showBufferZones, onSelectIncident]);

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const loc = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5))
        };
        setUserLocation(loc);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([loc.lat, loc.lng], 15);

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([loc.lat, loc.lng]);
          } else {
            const userIcon = L.divIcon({
              className: 'user-live-pin',
              iconSize: [22, 22],
              iconAnchor: [11, 11],
              html: `
                <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
                  <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: #0ea5e9; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                  <div style="width: 14px; height: 14px; border-radius: 9999px; background-color: #0ea5e9; border: 2px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
                </div>
              `
            });
            userMarkerRef.current = L.marker([loc.lat, loc.lng], { icon: userIcon }).addTo(mapInstanceRef.current);
          }
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation fallback:', err.message);
        // Default Bengaluru sample
        const fallback = { lat: 12.9784, lng: 77.6408 };
        setUserLocation(fallback);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([fallback.lat, fallback.lng], 15);
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current) return;
    const pts = geotaggedIncidents
      .filter((i) => i.latitude && i.longitude)
      .map((i) => [i.latitude!, i.longitude!] as [number, number]);

    if (userLocation) {
      pts.push([userLocation.lat, userLocation.lng]);
    }

    if (pts.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(pts), { padding: [35, 35], maxZoom: 15 });
      setActiveIncidentId(null);
    }
  };

  return (
    <div className="relative rounded-[20px] overflow-hidden border border-[var(--line)] bg-[var(--surface)] shadow-sm">
      {/* Map Canvas - at least 320px tall */}
      <div
        ref={mapContainerRef}
        className="w-full h-[340px] min-h-[320px] relative z-0"
        style={{ touchAction: 'pan-x pan-y' }}
      />

      {/* Floating round buttons on map: Zones, My location, and Recenter/Fullscreen */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {/* Recenter / Fit All */}
        <button
          onClick={handleFitAll}
          className="w-9 h-9 rounded-full bg-[var(--surface)]/95 text-[var(--text)] border border-[var(--line)] shadow-md flex items-center justify-center hover:bg-[var(--surface-2)] active:scale-95 transition"
          aria-label="Recenter map"
          title="Recenter"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* My Location */}
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className={`w-9 h-9 rounded-full bg-[var(--surface)]/95 text-[var(--text)] border border-[var(--line)] shadow-md flex items-center justify-center hover:bg-[var(--surface-2)] active:scale-95 transition ${
            isLocating ? 'animate-spin' : ''
          } ${userLocation ? 'text-[var(--safe)]' : ''}`}
          aria-label="My location"
          title="My location"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Zones Toggle */}
        <button
          onClick={() => setShowBufferZones(!showBufferZones)}
          className={`w-9 h-9 rounded-full border border-[var(--line)] shadow-md flex items-center justify-center transition active:scale-95 ${
            showBufferZones
              ? 'bg-[var(--safe)] text-[var(--on-safe)]'
              : 'bg-[var(--surface)]/95 text-[var(--text)] hover:bg-[var(--surface-2)]'
          }`}
          aria-label="Toggle safety zones"
          title="Toggle safety zones"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Small "Legend" chip that expands */}
      <div className="absolute top-3 left-3 z-10">
        <button
          onClick={() => setIsLegendExpanded(!isLegendExpanded)}
          className="h-8 px-3 rounded-full bg-[var(--surface)]/95 text-[var(--text)] border border-[var(--line)] shadow-md text-xs font-semibold flex items-center gap-1.5 hover:bg-[var(--surface-2)] transition"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--safe)]" />
          <span>Legend</span>
          {isLegendExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isLegendExpanded && (
          <div className="mt-1.5 p-3 rounded-[14px] bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--line)] shadow-lg text-xs space-y-1.5 animate-in fade-in min-w-[170px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0B8577]" />
              <span className="font-medium text-[var(--text)]">Level 1-2: Low / Notice</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#B36B00]" />
              <span className="font-medium text-[var(--text)]">Level 3: Moderate hazard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E5314B]" />
              <span className="font-medium text-[var(--text)]">Level 4-5: High risk / Danger</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Incident Drawer Card on Map bottom */}
      {activeIncident && (
        <div className="absolute bottom-2 left-2 right-2 z-10 p-3 rounded-[16px] bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--line)] shadow-lg animate-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    activeIncident.severity <= 2
                      ? 'bg-[#0B8577]'
                      : activeIncident.severity === 3
                      ? 'bg-[#B36B00]'
                      : 'bg-[#E5314B]'
                  }`}
                />
                <h4 className="card-title text-xs truncate">{activeIncident.location}</h4>
                <span className="text-[11px] font-semibold text-[var(--muted)]">
                  Lvl {activeIncident.severity}
                </span>
              </div>
              <p className="text-caption text-xs mt-0.5 truncate">
                {activeIncident.category.replace('_', ' ').toUpperCase()} • {formatDate(activeIncident.timestamp)}
              </p>
            </div>
            <button
              onClick={() => setActiveIncidentId(null)}
              className="p-1 rounded-full text-[var(--muted)] hover:text-[var(--text)]"
              aria-label="Close card"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
