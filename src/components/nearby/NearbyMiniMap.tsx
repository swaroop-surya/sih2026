import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAreaBoundingBox, decodePinGeohash } from '../../services/nearbyService';
import { getVolunteerApproxCoords } from '../../services/volunteerService';
import { NearbyMessage } from '../../types/nearby';
import { Volunteer } from '../../types/volunteer';

interface NearbyMiniMapProps {
  areaId: string;
  userCoords: { lat: number; lng: number } | null;
  alerts?: NearbyMessage[];
  volunteers?: Volunteer[];
  onPinClick?: (message: NearbyMessage) => void;
  onVolunteerClick?: (volunteer: Volunteer) => void;
  className?: string;
}

export const NearbyMiniMap: React.FC<NearbyMiniMapProps> = ({
  areaId,
  userCoords,
  alerts = [],
  volunteers = [],
  onPinClick,
  onVolunteerClick,
  className = 'h-40 w-full'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const availableVolunteers = (volunteers || []).filter((v) => v.available && !v.hidden);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const bbox = getAreaBoundingBox(areaId);
      const centerLat = (bbox[0] + bbox[2]) / 2;
      const centerLng = (bbox[1] + bbox[3]) / 2;

      const map = L.map(containerRef.current, {
        center: [centerLat, centerLng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
        doubleClickZoom: false
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapRef.current = map;
    }

    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    // Clear previous drawings
    layerGroup.clearLayers();

    // 1. Draw the Room's Rectangle boundary
    const bbox = getAreaBoundingBox(areaId);
    const bounds: L.LatLngBoundsExpression = [
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]]
    ];

    const rect = L.rectangle(bounds, {
      color: '#f97316',
      weight: 2,
      dashArray: '4, 4',
      fillColor: '#f97316',
      fillOpacity: 0.08
    });
    layerGroup.addLayer(rect);

    // 2. Draw the User's dot LOCALLY ONLY (never sent anywhere)
    if (userCoords) {
      const userDot = L.circleMarker([userCoords.lat, userCoords.lng], {
        radius: 6,
        color: '#ffffff',
        weight: 2,
        fillColor: '#2563eb',
        fillOpacity: 1
      }).bindTooltip('You (local only)', { direction: 'top', offset: [0, -6] });
      layerGroup.addLayer(userDot);
    }

    // 3. Draw approximate alert pins (~150m accuracy)
    alerts.forEach((alert) => {
      if (alert.pin_geohash) {
        const coords = decodePinGeohash(alert.pin_geohash);

        // Small diamond marker or circle
        const marker = L.circleMarker([coords.latitude, coords.longitude], {
          radius: 5,
          color: '#ffffff',
          weight: 1.5,
          fillColor: alert.fixed_count >= 2 ? '#10b981' : '#ea580c',
          fillOpacity: 0.95
        });

        marker.bindTooltip(
          `${alert.category ? alert.category.replace(/_/g, ' ') : 'Alert'} (~150m)`,
          { direction: 'top' }
        );

        if (onPinClick) {
          marker.on('click', () => onPinClick(alert));
        }

        layerGroup.addLayer(marker);
      }
    });

    // 4. Draw Available Volunteers (~300m privacy protected location)
    availableVolunteers.forEach((vol) => {
      const coords = getVolunteerApproxCoords(vol, areaId);

      // Custom Leaflet DivIcon for volunteers
      const volIcon = L.divIcon({
        className: 'volunteer-minimap-pin',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -10],
        html: `
          <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: #10b981; opacity: 0.4; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 16px; height: 16px; border-radius: 9999px; background-color: #059669; border: 2px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 8px; font-weight: bold;">
              ♥
            </div>
          </div>
        `
      });

      const marker = L.marker([coords.lat, coords.lng], { icon: volIcon });

      marker.bindTooltip(
        `Volunteer • ${vol.alias} (Available)`,
        { direction: 'top', offset: [0, -10] }
      );

      if (onVolunteerClick) {
        marker.on('click', () => onVolunteerClick(vol));
      }

      layerGroup.addLayer(marker);
    });

    // Fit map bounds to show cell with a bit of padding
    map.fitBounds(bounds, { padding: [12, 12] });

    // Handle container resize
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [areaId, userCoords, alerts, availableVolunteers, onPinClick, onVolunteerClick]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--surface-2)] shadow-xs ${className}`}>
      <div ref={containerRef} className="w-full h-full" tabIndex={-1} aria-hidden="true" />
      <div className="absolute bottom-1.5 right-2 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-white/90 pointer-events-none select-none flex items-center gap-1.5">
        <span>5 km × 5 km room</span>
        {availableVolunteers.length > 0 && (
          <>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {availableVolunteers.length} volunteer{availableVolunteers.length > 1 ? 's' : ''}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
