import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Crosshair,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Radio,
  Sliders,
  Droplets,
  Construction,
  Zap,
  Trash2,
  ShieldAlert,
  X
} from 'lucide-react';
import { Incident } from '../../types';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';

interface InteractiveMapProps {
  onSelectIncident: (inc: Incident) => void;
  onOpenReportModal: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSelectIncident,
  onOpenReportModal
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circlesLayerRef = useRef<L.LayerGroup | null>(null);

  const { incidents } = useIncidents();
  const { user } = useAuth();
  const { t } = useI18n();

  const [activeLayer, setActiveLayer] = useState<string>('All');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [autoSync, setAutoSync] = useState(true);

  const layers = [
    { id: 'All', label: 'All Layers' },
    { id: 'Water', label: 'Water' },
    { id: 'Roads', label: 'Roads' },
    { id: 'Electrical', label: 'Electrical' },
    { id: 'Sanitation', label: 'Sanitation' }
  ];

  // Filter incidents according to active layer
  const filteredIncidents = incidents.filter(inc => {
    if (activeLayer === 'All') return true;
    if (activeLayer === 'Water') return inc.category.toLowerCase().includes('water');
    if (activeLayer === 'Roads') return inc.category.toLowerCase().includes('road') || inc.category.toLowerCase().includes('pothole');
    if (activeLayer === 'Electrical') return inc.category.toLowerCase().includes('electric') || inc.category.toLowerCase().includes('light');
    if (activeLayer === 'Sanitation') return inc.category.toLowerCase().includes('sanitation') || inc.category.toLowerCase().includes('waste');
    return true;
  });

  // Automatically select the first incident (Test Street Light Issue or similar) if none selected
  useEffect(() => {
    if (!selectedIncident && filteredIncidents.length > 0) {
      setSelectedIncident(filteredIncidents[0]);
    }
  }, [filteredIncidents, selectedIncident]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultLat = 12.9716;
      const defaultLng = 77.6413;

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 15,
        zoomControl: false
      });

      // Reliable, free OpenStreetMap tiles with no API key requirement or watermark
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);

      // Re-position zoom control to top-left or top-right
      L.control.zoom({ position: 'topleft' }).addTo(map);

      // Layer groups for markers & circles
      markersLayerRef.current = L.layerGroup().addTo(map);
      circlesLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map instance alive across fast re-renders
    };
  }, []);

  // Update map markers when incidents or layer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const circlesGroup = circlesLayerRef.current;

    if (!map || !markersGroup || !circlesGroup) return;

    markersGroup.clearLayers();
    circlesGroup.clearLayers();

    filteredIncidents.forEach(inc => {
      const isSelected = selectedIncident?.id === inc.id;

      // Category color
      let pinColor = '#09544c'; // Default Pine Teal
      if (inc.category.toLowerCase().includes('water')) pinColor = '#0284c7';
      else if (inc.category.toLowerCase().includes('road')) pinColor = '#d97706';
      else if (inc.category.toLowerCase().includes('electric')) pinColor = '#eab308';
      else if (inc.category.toLowerCase().includes('sanitation')) pinColor = '#059669';
      else if (inc.severity === 'Critical') pinColor = '#e11d48';

      // Custom HTML Pin Icon
      const customIcon = L.divIcon({
        className: 'civic-marker-pin',
        html: `
          <div style="
            position: relative;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transform: translate(-19px, -19px);
          ">
            <div style="
              position: absolute;
              inset: 0;
              background-color: ${pinColor};
              opacity: ${isSelected ? 0.35 : 0.2};
              border-radius: 9999px;
              ${isSelected ? 'animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}
            "></div>
            <div style="
              position: relative;
              width: 32px;
              height: 32px;
              background-color: ${isSelected ? '#09544c' : pinColor};
              border: 3px solid #ffffff;
              border-radius: 9999px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-weight: 800;
              font-size: 13px;
            ">
              !
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const marker = L.marker([inc.location.lat, inc.location.lng], { icon: customIcon });
      marker.on('click', () => {
        setSelectedIncident(inc);
      });
      markersGroup.addLayer(marker);

      // Radius circle around selected incident showing neighbourhood quorum zone (150m)
      if (isSelected) {
        const circle = L.circle([inc.location.lat, inc.location.lng], {
          radius: 180,
          color: '#09544c',
          weight: 2,
          dashArray: '6, 8',
          fillColor: '#09544c',
          fillOpacity: 0.08
        });
        circlesGroup.addLayer(circle);

        map.panTo([inc.location.lat, inc.location.lng], { animate: true });
      }
    });
  }, [filteredIncidents, selectedIncident]);

  return (
    <div className="relative w-full h-[calc(100vh-var(--header-height))] overflow-hidden bg-slate-100 select-none">
      {/* Top Map Controls Bar (Matches Screenshot 2) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Category Layer Filter Pills */}
        <div className="flex items-center gap-2 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 dark:border-charcoal-700 shadow-md pointer-events-auto">
          {layers.map(layer => {
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-pine-800 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-charcoal-800'
                }`}
              >
                {layer.label}
              </button>
            );
          })}
        </div>

        {/* Counter & Sync Badge (Matches Screenshot 2: 4 Pins Live in Ward 14 • Auto-Sync) */}
        <div className="flex items-center gap-2 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-charcoal-700 shadow-md pointer-events-auto text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{filteredIncidents.length} Pins Live in Ward 14 • Auto-Sync</span>
        </div>
      </div>

      {/* Recenter Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current && selectedIncident) {
            mapInstanceRef.current.setView([selectedIncident.location.lat, selectedIncident.location.lng], 16, { animate: true });
          }
        }}
        className="absolute top-20 right-4 z-20 p-2.5 rounded-xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 shadow-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
        title="Center on Incident"
      >
        <Crosshair className="w-4 h-4 text-pine-800 dark:text-pine-400" />
      </button>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Selected Incident Floating Bottom-Sheet Card (Matches Screenshot 2) */}
      {selectedIncident && (
        <div className="absolute bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-30 bg-white dark:bg-charcoal-900 rounded-2xl border border-slate-200/80 dark:border-charcoal-700 shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-200">
          {/* Card Top: Badges & Close Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-charcoal-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-charcoal-700">
                {selectedIncident.severity}
              </span>

              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedIncident.status}</span>
              </span>
            </div>

            <button
              onClick={() => setSelectedIncident(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
              aria-label="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Description */}
          <div className="mt-2.5 space-y-1">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {selectedIncident.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {selectedIncident.description}
            </p>
          </div>

          {/* Location Badge */}
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-charcoal-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-charcoal-700">
            <MapPin className="w-3.5 h-3.5 text-pine-800 dark:text-pine-400 flex-shrink-0" />
            <span className="truncate">{selectedIncident.location?.address}</span>
          </div>

          {/* Verification Status Banner */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-pine-800 dark:text-pine-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verifies:
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-300">
              {selectedIncident.assignedTo ? 'Dispatched' : `${selectedIncident.confirmationsCount} Confirmations`}
            </span>
          </div>

          {/* Action Buttons: [Inspect Dossier ->] and [+ Report] */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-charcoal-800 flex items-center gap-2">
            <button
              onClick={() => onSelectIncident(selectedIncident)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-pine-800 hover:bg-pine-900 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>Inspect Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenReportModal}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-charcoal-800 hover:bg-slate-200 dark:hover:bg-charcoal-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
