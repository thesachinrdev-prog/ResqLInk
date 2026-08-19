import React, { useState, useRef, useEffect } from 'react';
import {
  Navigation,
  Crosshair,
  Layers,
  Plus,
  Minus,
  Ambulance,
  Building2,
  AlertOctagon,
  Radio,
  Clock,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import { EMERGENCY_STATUS } from '../../utils/constants';
import { calculateDistance, estimateETA } from '../../utils/geo';

// City bounding box for map normalization
const MAP_BOUNDS = {
  minLat: 37.755,
  maxLat: 37.805,
  minLng: -122.445,
  maxLng: -122.395,
};

export function LiveMap({
  emergencies = [],
  ambulances = [],
  hospitals = [],
  focusedEmergencyId = null,
  onSelectEmergency = () => {},
  height = '420px',
  interactive = true,
}) {
  const [zoom, setZoom] = useState(1);
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [selectedPin, setSelectedPin] = useState(null);
  const mapContainerRef = useRef(null);

  // Convert GPS (lat, lng) to percentage (x%, y%) in normalized container
  const gpsToPercent = (lat, lng) => {
    const latClamped = Math.max(MAP_BOUNDS.minLat, Math.min(MAP_BOUNDS.maxLat, lat));
    const lngClamped = Math.max(MAP_BOUNDS.minLng, Math.min(MAP_BOUNDS.maxLng, lng));

    // Y is inverted (higher latitude is higher on map)
    const y = ((MAP_BOUNDS.maxLat - latClamped) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
    const x = ((lngClamped - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const activeIncident = emergencies.find((e) => e.id === focusedEmergencyId) || emergencies[0];
  const assignedAmbulance = activeIncident
    ? ambulances.find((a) => a.id === activeIncident.ambulanceId)
    : null;
  const targetHospital = activeIncident
    ? hospitals.find((h) => h.id === activeIncident.hospitalId)
    : null;

  return (
    <div
      ref={mapContainerRef}
      className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl select-none"
      style={{ height }}
    >
      {/* City Tactical Grid & Streets Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="2 2" />
            </pattern>
            <pattern id="major-grid" width="160" height="160" patternUnits="userSpaceOnUse">
              <rect width="160" height="160" fill="url(#grid-pattern)" />
              <path d="M 160 0 L 0 0 0 160" fill="none" stroke="#475569" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#major-grid)" />
          {/* Simulated highway arteries */}
          <path d="M 0 140 Q 200 180 500 120 T 1000 220" fill="none" stroke="#1e293b" strokeWidth="6" />
          <path d="M 180 0 Q 240 300 280 600" fill="none" stroke="#1e293b" strokeWidth="5" />
          <path d="M 650 0 Q 600 250 720 600" fill="none" stroke="#1e293b" strokeWidth="5" />
        </svg>
      </div>

      {/* Radar scanning animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-emerald-500/10 pointer-events-none animate-ping duration-1000 opacity-20"></div>

      {/* Trajectory Polyline connecting Ambulance -> Incident -> Hospital */}
      {activeIncident && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {assignedAmbulance && (
            (() => {
              const ambPos = gpsToPercent(assignedAmbulance.lat, assignedAmbulance.lng);
              const incPos = gpsToPercent(activeIncident.lat, activeIncident.lng);
              return (
                <g>
                  <line
                    x1={`${ambPos.x}%`}
                    y1={`${ambPos.y}%`}
                    x2={`${incPos.x}%`}
                    y2={`${incPos.y}%`}
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                  <circle cx={`${ambPos.x}%`} cy={`${ambPos.y}%`} r="4" fill="#38bdf8" />
                </g>
              );
            })()
          )}
          {targetHospital && (
            (() => {
              const incPos = gpsToPercent(activeIncident.lat, activeIncident.lng);
              const hospPos = gpsToPercent(targetHospital.lat, targetHospital.lng);
              return (
                <line
                  x1={`${incPos.x}%`}
                  y1={`${incPos.y}%`}
                  x2={`${hospPos.x}%`}
                  y2={`${hospPos.y}%`}
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
              );
            })()
          )}
        </svg>
      )}

      {/* Hospital Markers */}
      {showHospitals &&
        hospitals.map((hosp) => {
          const pos = gpsToPercent(hosp.lat, hosp.lng);
          const isSelected = selectedPin?.type === 'hospital' && selectedPin.id === hosp.id;
          return (
            <div
              key={hosp.id}
              onClick={() => setSelectedPin({ type: 'hospital', id: hosp.id, data: hosp })}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-transform duration-200 hover:scale-125 ${
                isSelected ? 'scale-125' : ''
              }`}
            >
              <div className="relative group">
                <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-950">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold tracking-tight text-emerald-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  {hosp.name.split(' ')[0]} ({hosp.erBeds.available} Beds)
                </span>
              </div>
            </div>
          );
        })}

      {/* Ambulance Markers */}
      {showAmbulances &&
        ambulances.map((amb) => {
          const pos = gpsToPercent(amb.lat, amb.lng);
          const isAvailable = amb.status === 'AVAILABLE';
          const isSelected = selectedPin?.type === 'ambulance' && selectedPin.id === amb.id;
          return (
            <div
              key={amb.id}
              onClick={() => setSelectedPin({ type: 'ambulance', id: amb.id, data: amb })}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 transition-all duration-700 ease-out hover:scale-125 ${
                isSelected ? 'scale-125' : ''
              }`}
            >
              <div className="relative group">
                {/* Wave pulse if responding */}
                {!isAvailable && (
                  <span className="absolute -inset-2 rounded-full bg-sky-500/30 animate-ping"></span>
                )}
                <div
                  className={`flex items-center justify-center h-9 w-9 rounded-xl border-2 shadow-xl ${
                    isAvailable
                      ? 'bg-slate-900 border-sky-400 text-sky-300'
                      : 'bg-sky-600 border-white text-white animate-pulse'
                  }`}
                >
                  <Ambulance className="h-5 w-5" />
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-sky-200 bg-slate-950/90 px-1.5 py-0.5 rounded border border-sky-500/30">
                  {amb.vehicleNumber}
                </div>
              </div>
            </div>
          );
        })}

      {/* Emergency Incident Markers */}
      {showIncidents &&
        emergencies
          .filter((e) => e.status !== EMERGENCY_STATUS.RESOLVED && e.status !== EMERGENCY_STATUS.CANCELLED)
          .map((emg) => {
            const pos = gpsToPercent(emg.lat, emg.lng);
            const isFocused = emg.id === focusedEmergencyId;
            const isSelected = selectedPin?.type === 'emergency' && selectedPin.id === emg.id;

            return (
              <div
                key={emg.id}
                onClick={() => {
                  onSelectEmergency(emg.id);
                  setSelectedPin({ type: 'emergency', id: emg.id, data: emg });
                }}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-40 transition-transform hover:scale-125 ${
                  isFocused || isSelected ? 'scale-125' : ''
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-12 w-12 rounded-full bg-red-500/30 animate-ping"></span>
                  <span className="absolute h-8 w-8 rounded-full bg-red-600/40"></span>
                  <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-red-600 border-2 border-white text-white shadow-2xl">
                    <AlertOctagon className="h-4 w-4" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-white bg-red-950/95 px-2 py-0.5 rounded border border-red-500/50">
                    SOS {emg.categoryLabel.split(' ')[0]}
                  </div>
                </div>
              </div>
            );
          })}

      {/* Selected Marker Popup Overlay */}
      {selectedPin && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {selectedPin.type}
              </span>
              <h4 className="text-sm font-bold text-white">
                {selectedPin.type === 'emergency' && selectedPin.data.categoryLabel}
                {selectedPin.type === 'ambulance' && `${selectedPin.data.vehicleNumber} (${selectedPin.data.type})`}
                {selectedPin.type === 'hospital' && selectedPin.data.name}
              </h4>
            </div>
            <button
              onClick={() => setSelectedPin(null)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 text-xs text-slate-300 space-y-1">
            {selectedPin.type === 'emergency' && (
              <>
                <p><strong>Patient:</strong> {selectedPin.data.patientName} ({selectedPin.data.bloodGroup})</p>
                <p><strong>Status:</strong> {selectedPin.data.status}</p>
                <p><strong>Location:</strong> {selectedPin.data.address}</p>
                <p><strong>Assigned:</strong> {selectedPin.data.driverName || 'Awaiting Dispatch'}</p>
              </>
            )}
            {selectedPin.type === 'ambulance' && (
              <>
                <p><strong>Driver:</strong> {selectedPin.data.driverName}</p>
                <p><strong>Status:</strong> {selectedPin.data.status}</p>
                <p><strong>Base:</strong> {selectedPin.data.hospitalBase}</p>
                <p><strong>Phone:</strong> {selectedPin.data.driverPhone}</p>
              </>
            )}
            {selectedPin.type === 'hospital' && (
              <>
                <p><strong>ER Beds:</strong> {selectedPin.data.erBeds.available} of {selectedPin.data.erBeds.total} available</p>
                <p><strong>ICU Beds:</strong> {selectedPin.data.icuBeds.available} available</p>
                <p><strong>Specialties:</strong> {selectedPin.data.specialties.join(', ')}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tactical Map UI Controls */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-40 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-800/80 rounded-lg text-slate-300">
          <Radio className="h-3 w-3 text-red-400 animate-pulse" />
          <span className="font-semibold">METRO LIVE GPS</span>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-40 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`px-2 py-1 rounded-lg font-medium transition-colors ${
            showIncidents ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          SOS ({emergencies.filter((e) => e.status !== EMERGENCY_STATUS.RESOLVED && e.status !== EMERGENCY_STATUS.CANCELLED).length})
        </button>
        <button
          onClick={() => setShowAmbulances(!showAmbulances)}
          className={`px-2 py-1 rounded-lg font-medium transition-colors ${
            showAmbulances ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Fleet ({ambulances.length})
        </button>
        <button
          onClick={() => setShowHospitals(!showHospitals)}
          className={`px-2 py-1 rounded-lg font-medium transition-colors ${
            showHospitals ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Hospitals ({hospitals.length})
        </button>
      </div>

      {/* Map telemetry footer */}
      <div className="absolute bottom-3 right-3 z-40 text-[10px] text-slate-500 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800 hidden sm:block">
        GRID: METRO-37.77N / 122.41W • REFRESH 2.5s
      </div>
    </div>
  );
}
