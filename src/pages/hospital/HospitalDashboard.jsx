import React, { useState } from 'react';
import {
  Building2,
  Ambulance,
  HeartPulse,
  Droplet,
  Pill,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Activity,
  Plus,
  Minus,
  Radio,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { StatusBadge, SeverityBadge } from '../../components/common/StatusBadge';
import { LiveMap } from '../../components/common/LiveMap';
import { EMERGENCY_STATUS } from '../../utils/constants';

export function HospitalDashboard() {
  const { currentUser } = useAuth();
  const {
    emergencies,
    ambulances,
    hospitals,
    updateHospitalBeds,
    requestBlood,
    createPharmacyOrder,
  } = useEmergency();

  const currentHospital = hospitals[0]; // Govt Rajaji Trauma Center

  const [bloodModalOpen, setBloodModalOpen] = useState(false);
  const [rxModalOpen, setRxModalOpen] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('O-');
  const [bloodUnits, setBloodUnits] = useState(3);
  const [rxDrug, setRxDrug] = useState('Adrenaline / Epinephrine (1mg/mL)');
  const [rxQty, setRxQty] = useState(20);

  // Inbound emergencies targeting this hospital
  const inboundEmergencies = emergencies.filter(
    (e) =>
      e.status === EMERGENCY_STATUS.EN_ROUTE ||
      e.status === EMERGENCY_STATUS.TRANSPORTING ||
      e.status === EMERGENCY_STATUS.DISPATCHED ||
      e.status === EMERGENCY_STATUS.ON_SCENE
  );

  const activeInbound = inboundEmergencies[0];

  const handleBedAdjust = async (type, delta) => {
    if (type === 'ER') {
      await updateHospitalBeds(currentHospital.id, {
        erBedsAvailable: currentHospital.erBeds.available + delta,
      });
    } else {
      await updateHospitalBeds(currentHospital.id, {
        icuBedsAvailable: currentHospital.icuBeds.available + delta,
      });
    }
  };

  const handleToggleDivert = async () => {
    await updateHospitalBeds(currentHospital.id, {
      divertStatus: !currentHospital.divertStatus,
    });
  };

  const handleBloodSubmit = async (e) => {
    e.preventDefault();
    await requestBlood({
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      requestedBy: currentUser?.name || 'ER Trauma Chief',
      bloodGroup,
      units: Number(bloodUnits),
      urgency: 'CRITICAL',
      patientRef: activeInbound ? `Inbound Incident #${activeInbound.id}` : 'Trauma ER Pool',
    });
    setBloodModalOpen(false);
  };

  const handleRxSubmit = async (e) => {
    e.preventDefault();
    await createPharmacyOrder({
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      orderedBy: currentUser?.name || 'ER Trauma Chief',
      items: [{ name: rxDrug, quantity: Number(rxQty) }],
      urgency: 'URGENT',
    });
    setRxModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Hospital Header */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{currentHospital?.name}</h2>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentHospital?.level}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Trauma Chief: <strong className="text-slate-200">{currentUser?.name}</strong> • {currentHospital?.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setBloodModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 font-bold text-xs border border-rose-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Droplet className="h-4 w-4" />
              <span>Request Blood</span>
            </button>

            <button
              onClick={() => setRxModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-950/40 hover:bg-teal-900/40 text-teal-400 font-bold text-xs border border-teal-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Pill className="h-4 w-4" />
              <span>Order Pharmacy</span>
            </button>

            <button
              onClick={handleToggleDivert}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs border transition-colors ${
                currentHospital?.divertStatus
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/40 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {currentHospital?.divertStatus ? 'DIVERT ACTIVE' : 'RECEIVING PATIENTS'}
            </button>
          </div>
        </div>

        {/* Inbound Trauma Highlight Card (Section 16) */}
        {activeInbound ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-emerald-500/60 shadow-2xl shadow-emerald-950/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-pulse">
                  <Ambulance className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      INCOMING EMERGENCY TRAUMA RADAR
                    </span>
                    <SeverityBadge severity={activeInbound.severity} />
                  </div>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    {activeInbound.categoryLabel} ({activeInbound.patientName})
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <span className="text-xs text-slate-400">Target ETA:</span>
                <span className="text-xl font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                  {activeInbound.eta}
                </span>
              </div>
            </div>

            {/* Inbound Telemetry Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Unit</span>
                <p className="font-bold text-white flex items-center gap-1">
                  <Ambulance className="h-3.5 w-3.5 text-sky-400" />
                  {activeInbound.ambulanceNumber}
                </p>
                <p className="text-slate-400">{activeInbound.driverName}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Patient Blood & ID</span>
                <p className="font-bold text-rose-400 flex items-center gap-1">
                  <Droplet className="h-3.5 w-3.5" />
                  {activeInbound.bloodGroup} (Pre-Matched)
                </p>
                <p className="text-slate-400 truncate">Allergy: {activeInbound.allergies}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trauma Bay</span>
                <p className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Reserved (Bay 1)
                </p>
                <p className="text-slate-400">Surgical team on standby</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Paramedic Notes</span>
                <p className="font-semibold text-amber-300 truncate">{activeInbound.notes}</p>
                <p className="text-slate-400 truncate">Vitals streaming live</p>
              </div>
            </div>

            {/* Live GPS Inbound Tracking Map */}
            <div>
              <LiveMap
                emergencies={[activeInbound]}
                ambulances={ambulances}
                hospitals={hospitals}
                focusedEmergencyId={activeInbound.id}
                height="300px"
              />
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Trauma Bays Cleared & Ready</h3>
            <p className="text-xs text-slate-400">No active priority-1 inbound ambulances at this moment.</p>
          </div>
        )}

        {/* Secondary Grid: Bed Capacity Manager & On-Call Surgeons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bed Manager (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">ER & ICU Bed Occupancy Manager</h3>
                <p className="text-xs text-slate-400">Real-time bed availability broadcast to 911 dispatch</p>
              </div>
              <span className="text-xs font-bold text-emerald-400">
                {currentHospital?.erBeds.available + currentHospital?.icuBeds.available} Total Open Beds
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ER Beds */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Emergency ER Beds</span>
                    <p className="text-2xl font-black text-emerald-400">
                      {currentHospital?.erBeds.available} / {currentHospital?.erBeds.total}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {Math.round((currentHospital?.erBeds.available / currentHospital?.erBeds.total) * 100)}% OPEN
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBedAdjust('ER', -1)}
                    disabled={currentHospital?.erBeds.available <= 0}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 flex items-center justify-center gap-1 disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                    <span>Admit Patient (-1)</span>
                  </button>
                  <button
                    onClick={() => handleBedAdjust('ER', 1)}
                    disabled={currentHospital?.erBeds.available >= currentHospital?.erBeds.total}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1 disabled:opacity-30"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Discharge (+1)</span>
                  </button>
                </div>
              </div>

              {/* ICU Beds */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Intensive Care ICU</span>
                    <p className="text-2xl font-black text-sky-400">
                      {currentHospital?.icuBeds.available} / {currentHospital?.icuBeds.total}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    {Math.round((currentHospital?.icuBeds.available / currentHospital?.icuBeds.total) * 100)}% OPEN
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBedAdjust('ICU', -1)}
                    disabled={currentHospital?.icuBeds.available <= 0}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 flex items-center justify-center gap-1 disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                    <span>Admit ICU (-1)</span>
                  </button>
                  <button
                    onClick={() => handleBedAdjust('ICU', 1)}
                    disabled={currentHospital?.icuBeds.available >= currentHospital?.icuBeds.total}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1 disabled:opacity-30"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Discharge (+1)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* On-Call Surgical Specialists (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              On-Call Trauma Specialists
            </h3>

            <div className="space-y-2 text-xs">
              {(currentHospital?.onCallSpecialists || [
                { role: 'Trauma Surgeon', name: 'Dr. Gregory Thorne', status: 'ON_SCENE' },
                { role: 'Interventional Cardiologist', name: 'Dr. S. Ramanathan', status: 'STANDBY' },
                { role: 'Neurosurgeon', name: 'Dr. Priya Varma', status: 'STANDBY' },
                { role: 'Anesthesiologist', name: 'Dr. Kevin Miller', status: 'ON_SCENE' },
              ]).map((spec, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{spec.name}</p>
                    <p className="text-[11px] text-slate-400">{spec.role}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    spec.status === 'ON_SCENE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {spec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blood Request Modal */}
        {bloodModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Emergency Blood Unit Requisition</h3>
                <button onClick={() => setBloodModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleBloodSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Blood Group Required</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Units (Packs)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bloodUnits}
                    onChange={(e) => setBloodUnits(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm"
                >
                  Transmit Blood Request to Central Bank
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Pharmacy Order Modal */}
        {rxModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-slate-900 border border-teal-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Emergency Pharmacy Restock Order</h3>
                <button onClick={() => setRxModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleRxSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Emergency Medication</label>
                  <input
                    type="text"
                    value={rxDrug}
                    onChange={(e) => setRxDrug(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Units Required</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={rxQty}
                    onChange={(e) => setRxQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm"
                >
                  Send Urgent Order to 24/7 Pharmacy
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
