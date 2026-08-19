import React, { useState } from 'react';
import {
  Radio,
  ShieldAlert,
  Ambulance,
  Building2,
  AlertOctagon,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Send,
  Filter,
  Layers,
  Activity,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { StatusBadge, SeverityBadge } from '../../components/common/StatusBadge';
import { LiveMap } from '../../components/common/LiveMap';
import { EMERGENCY_STATUS, SEVERITY_LEVELS } from '../../utils/constants';

export function ControlRoomCenter() {
  const { currentUser } = useAuth();
  const {
    emergencies,
    ambulances,
    hospitals,
    updateEmergencyStatus,
    assignAmbulance,
    addNotification,
  } = useEmergency();

  const [selectedIncident, setSelectedIncident] = useState(emergencies[0] || null);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('REGIONAL TRAFFIC CLEARANCE PROTOCOL');
  const [broadcastMessage, setBroadcastMessage] = useState('All units please be advised: Green corridor active on Ring Road for Inbound Cardiac Unit TN-58-EM-1081.');

  const activeEmergencies = emergencies.filter(
    (e) => e.status !== EMERGENCY_STATUS.RESOLVED && e.status !== EMERGENCY_STATUS.CANCELLED
  );

  const availableAmbulances = ambulances.filter((a) => a.status === 'AVAILABLE');
  const busyAmbulances = ambulances.filter((a) => a.status !== 'AVAILABLE' && a.status !== 'OFFLINE');

  const filteredEmergencies = emergencies.filter((e) => {
    if (filterSeverity === 'ALL') return true;
    return e.severity === filterSeverity;
  });

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    addNotification('critical', `📢 ${broadcastTitle}`, broadcastMessage);
    setBroadcastModalOpen(false);
  };

  const handleQuickAssign = async (emergencyId) => {
    const amb = availableAmbulances[0] || ambulances[0];
    if (amb) {
      await assignAmbulance(emergencyId, amb.id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Command Center Telemetry Bar (Section 15) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Emergencies
              </span>
              <ShieldAlert className="h-4 w-4 text-red-500 animate-pulse" />
            </div>
            <p className="text-3xl font-black text-white">{String(activeEmergencies.length).padStart(2, '0')}</p>
            <p className="text-[11px] text-red-400 font-semibold">Priority 1 High-Alert</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ambulance Fleet
              </span>
              <Ambulance className="h-4 w-4 text-sky-400" />
            </div>
            <p className="text-3xl font-black text-sky-400">{String(ambulances.length).padStart(2, '0')}</p>
            <p className="text-[11px] text-slate-400">
              {availableAmbulances.length} Standby • {busyAmbulances.length} Active
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Hospital Network
              </span>
              <Building2 className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400">{String(hospitals.length).padStart(2, '0')}</p>
            <p className="text-[11px] text-emerald-400 font-semibold">All Trauma Hubs Linked</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Avg Response Time
              </span>
              <Clock className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-3xl font-black text-purple-400">5.8 m</p>
            <p className="text-[11px] text-purple-400 font-semibold">Target &lt; 06 MIN Met</p>
          </div>
        </div>

        {/* Tactical Control Room Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Visual: 8 Cols Citywide Telemetry Map */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <Radio className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Central 911 Telemetry Map</h3>
                    <p className="text-xs text-slate-400">Real-time GPS tracking of incidents, ambulances & hospitals</p>
                  </div>
                </div>

                <button
                  onClick={() => setBroadcastModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Broadcast Regional Alert</span>
                </button>
              </div>

              {/* Live Map Canvas */}
              <LiveMap
                emergencies={activeEmergencies}
                ambulances={ambulances}
                hospitals={hospitals}
                focusedEmergencyId={selectedIncident?.id}
                height="380px"
              />
            </div>

            {/* Live Incident Dispatch Queue */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                  <h3 className="text-sm font-bold text-white">Active Emergency Incidents Queue</h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Filter:</span>
                  {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setFilterSeverity(sev)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        filterSeverity === sev
                          ? 'bg-slate-800 text-white border border-slate-700'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredEmergencies.map((emg) => (
                  <div
                    key={emg.id}
                    onClick={() => setSelectedIncident(emg)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedIncident?.id === emg.id
                        ? 'bg-slate-800/80 border-purple-500/80 shadow-lg'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{emg.categoryLabel}</span>
                        <SeverityBadge severity={emg.severity} />
                        <StatusBadge status={emg.status} />
                      </div>
                      <span className="text-xs text-slate-400 font-mono">#{emg.id}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                      <p className="flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                        <span className="truncate">{emg.address}</span>
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <Ambulance className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                        <span>Unit: <strong>{emg.ambulanceNumber || 'Unassigned'}</strong> ({emg.eta})</span>
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <Building2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{emg.hospitalName}</span>
                      </p>
                    </div>

                    {/* Quick Dispatch Action if unassigned */}
                    {!emg.ambulanceNumber && (
                      <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAssign(emg.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-colors"
                        >
                          Dispatch Nearest Unit ({availableAmbulances[0]?.vehicleNumber || 'ALS 1'})
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Fleet & Hospital Availability */}
          <div className="lg:col-span-4 space-y-6">
            {/* Ambulance Fleet Tracker */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Ambulance className="h-4 w-4 text-sky-400" />
                  Fleet Status ({ambulances.length})
                </h3>
                <span className="text-xs text-emerald-400 font-bold">{availableAmbulances.length} Ready</span>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {ambulances.map((amb) => (
                  <div
                    key={amb.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <span>{amb.vehicleNumber}</span>
                        <span className="text-[10px] text-slate-400">({amb.type.split(' ')[0]})</span>
                      </p>
                      <p className="text-[11px] text-slate-400">Driver: {amb.driverName}</p>
                    </div>
                    <StatusBadge status={amb.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Hospital ER Capacity Tracker */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-400" />
                  Hospital ER Capacity
                </h3>
                <span className="text-xs text-slate-400">{hospitals.length} Trauma Hubs</span>
              </div>

              <div className="space-y-3">
                {hospitals.map((hosp) => (
                  <div key={hosp.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate max-w-[170px]">{hosp.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        hosp.divertStatus
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {hosp.divertStatus ? 'DIVERT' : 'RECEIVING'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-slate-400 block">ER Beds</span>
                        <span className="font-black text-emerald-400">{hosp.erBeds.available} / {hosp.erBeds.total}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-slate-400 block">ICU Beds</span>
                        <span className="font-black text-sky-400">{hosp.icuBeds.available} / {hosp.icuBeds.total}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Regional Alert Modal */}
        {broadcastModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Broadcast Emergency Network Alert</h3>
                <button onClick={() => setBroadcastModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Alert Title</label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Broadcast Message</label>
                  <textarea
                    rows={3}
                    required
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30"
                >
                  Transmit Immediate Broadcast Alert
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
