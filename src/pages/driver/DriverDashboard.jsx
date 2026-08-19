import React, { useState } from 'react';
import {
  Ambulance,
  Navigation,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Building2,
  HeartPulse,
  Radio,
  Volume2,
  VolumeX,
  ShieldAlert,
  ArrowRight,
  Activity,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { StatusBadge, SeverityBadge } from '../../components/common/StatusBadge';
import { LiveMap } from '../../components/common/LiveMap';
import { EMERGENCY_STATUS } from '../../utils/constants';
import { startEmergencySiren, stopEmergencySiren } from '../../utils/audio';

export function DriverDashboard() {
  const { currentUser } = useAuth();
  const {
    emergencies,
    ambulances,
    hospitals,
    updateEmergencyStatus,
  } = useEmergency();

  const [dutyStatus, setDutyStatus] = useState('AVAILABLE');
  const [sirenOn, setSirenOn] = useState(false);

  // Current assigned ambulance
  const myVehicle = ambulances.find((a) => a.driverName === currentUser?.name) || ambulances[0];

  // Active mission assigned to this ambulance
  const activeMission = emergencies.find(
    (e) =>
      e.ambulanceId === myVehicle?.id &&
      e.status !== EMERGENCY_STATUS.RESOLVED &&
      e.status !== EMERGENCY_STATUS.CANCELLED
  ) || emergencies.find(
    (e) => e.status === EMERGENCY_STATUS.EN_ROUTE || e.status === EMERGENCY_STATUS.DISPATCHED
  );

  const pendingEmergency = emergencies.find(
    (e) => e.status === EMERGENCY_STATUS.PENDING
  );

  const handleToggleSiren = () => {
    if (!sirenOn) {
      startEmergencySiren();
      setSirenOn(true);
    } else {
      stopEmergencySiren();
      setSirenOn(false);
    }
  };

  const handleStatusProgression = async () => {
    if (!activeMission) return;

    if (activeMission.status === EMERGENCY_STATUS.DISPATCHED) {
      await updateEmergencyStatus(activeMission.id, EMERGENCY_STATUS.EN_ROUTE, 'Ambulance en route with sirens active');
    } else if (activeMission.status === EMERGENCY_STATUS.EN_ROUTE) {
      await updateEmergencyStatus(activeMission.id, EMERGENCY_STATUS.ON_SCENE, 'Paramedic on scene conducting primary triage');
    } else if (activeMission.status === EMERGENCY_STATUS.ON_SCENE) {
      await updateEmergencyStatus(activeMission.id, EMERGENCY_STATUS.TRANSPORTING, 'Patient stabilized and being transported to Trauma Center');
    } else if (activeMission.status === EMERGENCY_STATUS.TRANSPORTING) {
      await updateEmergencyStatus(activeMission.id, EMERGENCY_STATUS.ARRIVED, 'Ambulance arrived at Hospital ER Bay');
    } else if (activeMission.status === EMERGENCY_STATUS.ARRIVED) {
      await updateEmergencyStatus(activeMission.id, EMERGENCY_STATUS.RESOLVED, 'Patient handover complete. Unit clear.');
      if (sirenOn) {
        stopEmergencySiren();
        setSirenOn(false);
      }
    }
  };

  const getActionLabel = () => {
    if (!activeMission) return 'No Active Mission';
    switch (activeMission.status) {
      case EMERGENCY_STATUS.DISPATCHED:
        return '1. Start Trip (Mark En Route) →';
      case EMERGENCY_STATUS.EN_ROUTE:
        return '2. Mark Arrived On Scene →';
      case EMERGENCY_STATUS.ON_SCENE:
        return '3. Begin Transport to Hospital →';
      case EMERGENCY_STATUS.TRANSPORTING:
        return '4. Mark Arrived at Hospital ER →';
      case EMERGENCY_STATUS.ARRIVED:
        return '5. Complete Trip & Clear Unit ✓';
      default:
        return 'Mission Active';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Driver Cockpit Header */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Ambulance className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  {myVehicle?.vehicleNumber} • {myVehicle?.type?.split(' ')[0]}
                </h2>
                <StatusBadge status={dutyStatus} />
              </div>
              <p className="text-xs text-slate-400">
                Paramedic: <strong className="text-slate-200">{currentUser?.name || myVehicle?.driverName}</strong> • Base: {myVehicle?.hospitalBase}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Siren Toggle */}
            <button
              onClick={handleToggleSiren}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg ${
                sirenOn
                  ? 'bg-red-600 text-white animate-pulse shadow-red-600/40 ring-2 ring-red-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {sirenOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
              <span>{sirenOn ? 'SIREN ACTIVE (Wail)' : 'Siren Inactive'}</span>
            </button>

            {/* Duty Status Switcher */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
              {['AVAILABLE', 'BUSY', 'OFFLINE'].map((status) => (
                <button
                  key={status}
                  onClick={() => setDutyStatus(status)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    dutyStatus === status
                      ? 'bg-sky-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Incoming Dispatch Card if available (Section 14) */}
        {pendingEmergency && !activeMission && (
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-amber-500/60 shadow-2xl shadow-amber-950/40 space-y-4 animate-pulse">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                NEW EMERGENCY DISPATCH REQUEST
              </span>
              <span className="text-xs font-bold text-white">Pending Confirmation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient</span>
                <p className="font-bold text-white">{pendingEmergency.patientName}</p>
                <p className="text-slate-400">{pendingEmergency.address}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pickup Distance</span>
                <p className="text-lg font-black text-white">{pendingEmergency.distanceKm || '2.4'} km</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target ETA</span>
                <p className="text-lg font-black text-emerald-400">{pendingEmergency.eta || '06 min'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => updateEmergencyStatus(pendingEmergency.id, EMERGENCY_STATUS.DISPATCHED, 'Accepted by driver')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-1 shadow"
                >
                  <Check className="h-4 w-4" />
                  ACCEPT REQUEST
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Nearest Pickup & Turn-by-Turn Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Cols: Live Tactical Map & Mission Controls */}
          <div className="lg:col-span-8 space-y-6">
            {activeMission ? (
              <div className="p-6 rounded-3xl bg-slate-900 border-2 border-sky-500/50 shadow-2xl space-y-6">
                {/* Header & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-sky-400 uppercase tracking-wider">
                        NEAREST EMERGENCY PICKUP
                      </span>
                      <SeverityBadge severity={activeMission.severity} />
                    </div>
                    <h3 className="text-xl font-black text-white mt-0.5">{activeMission.categoryLabel}</h3>
                    <p className="text-xs text-slate-400">Incident #{activeMission.id} • Assigned to {myVehicle?.vehicleNumber}</p>
                  </div>

                  <StatusBadge status={activeMission.status} size="lg" />
                </div>

                {/* Tactical Live GPS Map */}
                <div>
                  <LiveMap
                    emergencies={[activeMission]}
                    ambulances={[myVehicle]}
                    hospitals={hospitals}
                    focusedEmergencyId={activeMission.id}
                    height="340px"
                  />
                </div>

                {/* Action Progression Button */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Mission Phase:</span>
                    <p className="text-sm font-black text-white uppercase">{activeMission.status.replace(/_/g, ' ')}</p>
                  </div>

                  <button
                    onClick={handleStatusProgression}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs tracking-wider shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{getActionLabel()}</span>
                  </button>
                </div>

                {/* Route Summaries */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Patient Pickup Location
                    </span>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-red-400 shrink-0" />
                      <span className="truncate">{activeMission.address}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">Distance: ~{activeMission.distanceKm || '2.4'} km (ETA: {activeMission.eta || '06 min'})</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Designated Trauma Center
                    </span>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{activeMission.hospitalName}</span>
                    </p>
                    <p className="text-[11px] text-emerald-400 font-semibold">Trauma Bay Pre-Allocated</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
                <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Unit {myVehicle?.vehicleNumber} On Standby</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Ready for emergency dispatch. Listening to Central 911 telemetry stream.
                </p>
                <LiveMap emergencies={[]} ambulances={[myVehicle]} hospitals={hospitals} height="280px" />
              </div>
            )}
          </div>

          {/* Right 4 Cols: Patient Medical ID & On-Board Equipment */}
          <div className="lg:col-span-4 space-y-6">
            {activeMission && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-red-400" />
                    Patient Medical Summary
                  </h3>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                    {activeMission.bloodGroup || 'O+'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="text-sm font-bold text-white">{activeMission.patientName}</p>
                  <p className="text-xs text-slate-400">{activeMission.patientPhone}</p>
                  <a
                    href={`tel:${activeMission.patientPhone}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:underline pt-1"
                  >
                    <PhoneCall className="h-3 w-3" /> Call Patient Phone
                  </a>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Reported Symptoms:</span>
                    <span className="font-semibold text-amber-300">{activeMission.notes}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Known Allergies:</span>
                    <span className="font-semibold text-slate-200">{activeMission.allergies}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Medical Conditions:</span>
                    <span className="font-medium text-slate-300">{activeMission.medicalConditions}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Equipment Checklist */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Ambulance className="h-4 w-4 text-sky-400" />
                On-Board ALS Equipment Checklist
              </h3>
              <div className="space-y-1.5 text-xs text-slate-300">
                {(myVehicle?.equipment || ['Defibrillator (AED)', '12-Lead ECG Monitor', 'Ventilator', 'Intubation Kit', 'Emergency Drugs (Epi/Atropine)']).map((eq, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span>{eq}</span>
                    <span className="text-[10px] font-bold text-emerald-400">READY</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
