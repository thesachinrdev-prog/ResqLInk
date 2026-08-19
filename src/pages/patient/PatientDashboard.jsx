import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  ShieldAlert,
  AlertOctagon,
  PhoneCall,
  MapPin,
  Ambulance,
  Building2,
  Droplet,
  Pill,
  Clock,
  CheckCircle,
  Radio,
  Shield,
  Navigation,
  X,
  Siren,
  Loader2,
  Plus,
  User,
  Settings,
  History,
  Volume2,
  VolumeX,
  PlusCircle,
  Info,
  Calendar,
  UserPlus,
  Trash2,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { LiveMap } from '../../components/common/LiveMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EMERGENCY_STATUS } from '../../utils/constants';

export function PatientDashboard() {
  const { currentUser } = useAuth();
  const { subpage } = useParams();
  const navigate = useNavigate();

  const {
    emergencies = [],
    ambulances = [],
    hospitals = [],
    bloodRequests = [],
    pharmacyOrders = [],
    soundEnabled,
    setSoundEnabled,
    createSOS,
    cancelSOS,
    requestBlood,
    createPharmacyOrder,
    notifications,
  } = useEmergency();

  const currentTab = subpage || 'dashboard';

  // =========================================================
  // STATE MANAGEMENT
  // =========================================================
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [bloodModalOpen, setBloodModalOpen] = useState(false);
  const [pharmacyModalOpen, setPharmacyModalOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);

  // SOS inputs
  const [emergencyType, setEmergencyType] = useState('MEDICAL');
  const [customNotes, setCustomNotes] = useState('');
  const [sosLoading, setSosLoading] = useState(false);

  // Geolocation state
  const [gpsStatus, setGpsStatus] = useState('idle');
  const [coords, setCoords] = useState(null);

  // Form states
  const [bloodGroupReq, setBloodGroupReq] = useState(currentUser?.bloodGroup || 'O+');
  const [bloodUnitsReq, setBloodUnitsReq] = useState(2);
  const [selectedMedicine, setSelectedMedicine] = useState('Adrenaline / Epinephrine (1mg/mL)');
  const [medicineQuantity, setMedicineQuantity] = useState(1);

  // Contact list state
  const [contacts, setContacts] = useState(currentUser?.emergencyContacts || [
    { name: 'Aravind Rajendran', relation: 'Spouse', phone: '+91 98401 98765' },
    { name: 'Dr. R. Sundaram', relation: 'Family Doctor', phone: '+91 94432 10987' }
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // =========================================================
  // GEOLOCATION ACTION
  // =========================================================
  const acquireLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setGpsStatus('permission_denied');
        resolve({ latitude: null, longitude: null, accuracy: null, address: 'Location permission unavailable' });
        return;
      }

      setGpsStatus('detecting');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const res = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            address: 'Anna Nagar, Madurai'
          };
          setCoords(res);
          setGpsStatus('detected');
          resolve(res);
        },
        (err) => {
          console.warn('GPS location error:', err);
          let statusVal = 'unavailable';
          if (err.code === 1) statusVal = 'permission_denied';
          else if (err.code === 3) statusVal = 'timeout';

          setGpsStatus(statusVal);
          resolve({ latitude: null, longitude: null, accuracy: null, address: 'Location permission unavailable' });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  // Run geolocation on mount to pre-cache location
  useEffect(() => {
    acquireLocation();
  }, []);

  // =========================================================
  // FIND CURRENT ACTIVE SOS
  // =========================================================
  const activeSOS = emergencies.find((emergency) => {
    const isSelf = emergency.patientId === currentUser?.id || emergency.patient?.id === currentUser?.id || emergency.patientId === 'user_patient';
    const isActive = emergency.status !== EMERGENCY_STATUS.RESOLVED && emergency.status !== EMERGENCY_STATUS.CANCELLED;
    return isSelf && isActive;
  }) || null;

  const isSOSActive = Boolean(activeSOS);

  // =========================================================
  // ACTIVATE EMERGENCY SOS
  // =========================================================
  const handleSOSButtonClick = async () => {
    if (isSOSActive) return;
    setSosModalOpen(true);
    await acquireLocation();
  };

  const handleActivateSOS = async () => {
    if (sosLoading) return;
    setSosLoading(true);

    try {
      const loc = coords || await acquireLocation();
      
      await createSOS({
        patientId: currentUser?.id || 'user_patient',
        patientName: currentUser?.name || 'Sarah Jenkins',
        patientPhone: currentUser?.phone || '+91 98401 23456',
        category: emergencyType,
        categoryLabel:
          emergencyType === 'ACCIDENT'
            ? 'Road Accident Triage'
            : emergencyType === 'CARDIAC'
            ? 'Cardiac Distress'
            : emergencyType === 'FIRE'
            ? 'Fire / Burns Triage'
            : 'General Emergency',
        notes: customNotes || '1-Touch Emergency Beacon triggered.',
        lat: loc.latitude,
        lng: loc.longitude,
        address: loc.latitude ? 'Anna Nagar, Madurai' : 'Location permission unavailable',
        bloodGroup: currentUser?.bloodGroup || 'O+',
        allergies: currentUser?.allergies || 'Penicillin',
        medicalConditions: currentUser?.medicalConditions || 'Asthma',
      });

      setSosModalOpen(false);
      setCustomNotes('');
    } catch (e) {
      console.error(e);
      alert('Unable to activate SOS. Please try again.');
    } finally {
      setSosLoading(false);
    }
  };

  // =========================================================
  // CANCEL EMERGENCY SOS
  // =========================================================
  const triggerCancelConfirmation = () => {
    setCancelConfirmOpen(true);
  };

  const handleCancelSOSConfirm = async () => {
    if (!activeSOS) return;
    try {
      await cancelSOS(activeSOS.id, 'Cancelled by patient');
      setCancelConfirmOpen(false);
    } catch (err) {
      console.error(err);
      alert('Could not cancel emergency.');
    }
  };

  // =========================================================
  // REQUISITION ACTIONS
  // =========================================================
  const handleBloodRequest = async (e) => {
    e.preventDefault();
    try {
      await requestBlood({
        hospitalId: 'hosp_2',
        hospitalName: 'Apollo Hospital',
        bloodGroup: bloodGroupReq,
        units: Number(bloodUnitsReq),
        urgency: 'HIGH',
        patientId: currentUser?.id || 'user_patient',
        patientRef: currentUser?.name || 'Sarah Jenkins',
      });
      setBloodModalOpen(false);
    } catch (err) {
      alert('Failed to request blood.');
    }
  };

  const handlePharmacyOrder = async (e) => {
    e.preventDefault();
    try {
      await createPharmacyOrder({
        hospitalId: 'hosp_2',
        hospitalName: 'Apollo Hospital Pharmacy',
        orderedBy: currentUser?.name || 'Sarah Jenkins',
        patientId: currentUser?.id || 'user_patient',
        items: [{ name: selectedMedicine, quantity: Number(medicineQuantity) }],
        urgency: 'URGENT',
      });
      setPharmacyModalOpen(false);
    } catch (err) {
      alert('Failed to submit medicine order.');
    }
  };

  // =========================================================
  // CONTACT CRUD ACTIONS
  // =========================================================
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    const list = [...contacts, { name: newContactName, relation: newContactRelation || 'Contact', phone: newContactPhone }];
    setContacts(list);
    setNewContactName('');
    setNewContactRelation('');
    setNewContactPhone('');
    setAddContactOpen(false);
  };

  const handleDeleteContact = (index) => {
    const list = contacts.filter((_, idx) => idx !== index);
    setContacts(list);
  };

  // =========================================================
  // MOCK DATA CALCULATIONS
  // =========================================================
  const recentEmergencies = emergencies.slice(0, 5);

  const getSimulatedTimeline = () => {
    if (!activeSOS) return [];

    const status = activeSOS.status;
    const isLocationShared = status !== 'PENDING' && status !== 'ACTIVE';
    const isControlRoomNotified = isLocationShared && status !== 'LOCATION_DETECTED';
    const isAmbulanceAssigned = isControlRoomNotified && status !== 'SEARCHING_DRIVER';
    const isEnRoute = isAmbulanceAssigned && (status === 'EN_ROUTE' || status === 'ON_SCENE' || status === 'TRANSPORTING' || status === 'ARRIVED');
    const isOnScene = isEnRoute && (status === 'ON_SCENE' || status === 'TRANSPORTING' || status === 'ARRIVED');
    const isTransporting = isOnScene && (status === 'TRANSPORTING' || status === 'ARRIVED');
    const isArrived = isTransporting && status === 'ARRIVED';

    return [
      { id: 'sos', label: 'SOS Activated', done: true },
      { id: 'loc', label: 'Location Shared', done: isLocationShared },
      { id: 'ctrl', label: 'Control Room Notified', done: isControlRoomNotified },
      { id: 'amb', label: 'Ambulance Assigned', done: isAmbulanceAssigned },
      { id: 'route', label: 'Driver En Route', done: isEnRoute },
      { id: 'pickup', label: 'Arrived at Pickup', done: isOnScene },
      { id: 'board', label: 'Patient Onboard', done: isTransporting },
      { id: 'hosp', label: 'Hospital Arrival', done: isArrived }
    ];
  };

  // =========================================================
  // RENDER SECTIONS
  // =========================================================

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">

        {/* =====================================================
            PERSISTENT ACTIVE EMERGENCY BANNER (Section 10)
        ====================================================== */}
        {isSOSActive && (
          <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-red-950/40 p-4 shadow-xl shadow-red-950/30">
            <div className="absolute inset-0 animate-pulse bg-red-500/5" />
            <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/20">
                  <Siren className="h-6 w-6 animate-pulse text-red-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-red-400">
                    🚨 Active Emergency
                  </p>
                  <p className="text-sm font-bold text-white">
                    Ambulance arriving in {activeSOS.eta || '5 min'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Driver: {activeSOS.driverName || 'John Driver'} • Hospital: {activeSOS.hospitalName || 'Apollo Hospital'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-400 animate-pulse">● LIVE STATUS</span>
                <button
                  type="button"
                  onClick={() => navigate('/patient/emergency')}
                  className="rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold px-3 py-2 text-slate-300"
                >
                  View live emergency
                </button>
                <button
                  type="button"
                  onClick={triggerCancelConfirmation}
                  className="rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold px-3 py-2 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB PANEL 1: OVERVIEW (DASHBOARD)
        ====================================================== */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Standby Header / Title */}
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl sm:p-8 md:flex-row md:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Emergency Beacon Standby
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Good Morning, {currentUser?.name?.split(' ')[0] || 'Kavya'}
                </h1>
                <p className="text-sm font-semibold text-slate-300">
                  Are you safe? Help is one tap away whenever seconds matter.
                </p>
              </div>
              <a
                href="tel:108"
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-2.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-900/40"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Direct 108 Emergency</span>
              </a>
            </div>

            {/* Main SOS & Map Telemetry Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              
              {/* SOS CARD (Section 2) */}
              <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center shadow-xl">
                <div>
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                      <ShieldAlert className="h-6 w-6 text-red-400 animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-lg font-black text-white">EMERGENCY ASSISTANCE</h2>
                  <p className="mt-1 text-xs text-slate-400">Need immediate medical assistance?</p>
                </div>

                <div className="my-6 flex justify-center">
                  <button
                    onClick={handleSOSButtonClick}
                    disabled={isSOSActive}
                    className={`group relative flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 text-white shadow-2xl transition-all duration-300 ${
                      isSOSActive
                        ? 'border-red-900 bg-red-950 cursor-not-allowed'
                        : 'border-red-500 bg-red-600 hover:scale-105 hover:bg-red-500'
                    }`}
                  >
                    <span className="absolute -inset-2 animate-pulse rounded-full bg-red-500/10" />
                    <Siren className="h-10 w-10 animate-bounce" />
                    <span className="mt-1 text-lg font-black uppercase tracking-wider">
                      {isSOSActive ? 'ACTIVE' : 'SOS'}
                    </span>
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Press SOS to instantly share your location and request emergency assistance.
                  </p>
                  
                  {/* Operation Telemetry Statuses */}
                  <div className="divide-y divide-slate-800 border-t border-slate-800 pt-4 text-left text-xs space-y-2.5">
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500">Live GPS Location:</span>
                      <span className={`font-semibold ${gpsStatus === 'detected' ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {gpsStatus === 'detected' ? 'Detecting Location...' : gpsStatus === 'permission_denied' ? 'Permission Denied' : 'Location Detected'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500">Network Availability:</span>
                      <span className="font-semibold text-emerald-400">System Online</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500">Operational Status:</span>
                      <span className="font-bold text-red-500">
                        {isSOSActive ? 'EMERGENCY IN PROGRESS' : 'STANDBY READY'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map & ETA Display Column */}
              <div className="lg:col-span-8 space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Radio className="h-4 w-4 text-red-400 animate-pulse" />
                      Live Ambulance GPS Radar
                    </h3>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Tactical Display</span>
                  </div>
                  
                  {/* LiveMap project mapping */}
                  <LiveMap
                    emergencies={activeSOS ? [activeSOS] : []}
                    ambulances={ambulances}
                    hospitals={hospitals}
                    focusedEmergencyId={activeSOS?.id}
                    height="320px"
                  />
                </div>
              </div>
            </div>

            {/* Secondary Patient Dashboard Cards Row (Section 13) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              
              {/* Card 1: My Emergency Status */}
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900 space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">My Emergency Status</h3>
                {!isSOSActive ? (
                  <p className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    No Active Emergency
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-sm font-black text-red-400 uppercase">SOS ACTIVE</p>
                    <p className="text-xs text-slate-300">Ambulance {activeSOS.ambulanceNumber || 'TN 58 AB 1234'} En Route</p>
                    <p className="text-xs font-bold text-emerald-400">ETA: {activeSOS.eta || '5 min'}</p>
                  </div>
                )}
              </div>

              {/* Card 2: Current Location info */}
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900 space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Current Location</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    {coords ? (
                      <>
                        <p className="text-xs font-bold text-slate-200">Anna Nagar, Madurai</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Lat: {coords.latitude?.toFixed(4)}, Lng: {coords.longitude?.toFixed(4)}
                        </p>
                        <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
                          Accuracy: ±{Math.round(coords.accuracy || 8)} meters
                        </p>
                      </>
                    ) : gpsStatus === 'detecting' ? (
                      <p className="text-xs text-amber-400 flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Detecting coordinates...
                      </p>
                    ) : gpsStatus === 'permission_denied' ? (
                      <p className="text-xs text-red-400 font-semibold">
                        Location permission unavailable
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500">
                        GPS Location unavailable. Fallbacks active.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 3: Quick Requisition Actions */}
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900 space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Emergency Support</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBloodModalOpen(true)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300 hover:border-rose-500/40"
                  >
                    <Droplet className="h-4 w-4 text-rose-400 mb-1" />
                    Request Blood
                  </button>
                  <button
                    onClick={() => setPharmacyModalOpen(true)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300 hover:border-teal-500/40"
                  >
                    <Pill className="h-4 w-4 text-teal-400 mb-1" />
                    Order Pharmacy
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom section: Emergency History & Contacts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              
              {/* Emergency Contacts card list */}
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-rose-400" />
                    Emergency Contacts
                  </h3>
                  <button
                    onClick={() => navigate('/patient/emergency-contacts')}
                    className="text-[10px] font-bold text-sky-400 hover:underline"
                  >
                    Manage Contacts
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {contacts.map((c, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{c.name}</p>
                        <p className="text-[10px] text-slate-500">{c.relation} • {c.phone}</p>
                      </div>
                      <a href={`tel:${c.phone}`} className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-800 text-sky-400 flex items-center justify-center hover:bg-slate-800">
                        <PhoneCall className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trauma Centers open beds */}
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-400" />
                  Trauma Centers Availability
                </h3>
                <div className="grid grid-cols-3 gap-2.5 text-[11px]">
                  {hospitals.slice(0, 3).map((h) => (
                    <div key={h.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <p className="font-bold text-white truncate">{h.name}</p>
                      <p className="text-emerald-400 font-semibold">{h.erBeds?.available ?? 0} ER Beds</p>
                      <p className="text-sky-400 font-semibold">{h.icuBeds?.available ?? 0} ICU Beds</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =====================================================
            TAB PANEL 2: ACTIVE EMERGENCY
        ====================================================== */}
        {currentTab === 'emergency' && (
          <div className="space-y-6">
            {!isSOSActive ? (
              <div className="flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-slate-800 bg-slate-900 min-h-[400px]">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 border border-slate-800">
                  <ShieldAlert className="h-8 w-8 text-slate-600" />
                </div>
                <h2 className="text-lg font-black text-white">No Active Emergency</h2>
                <p className="mt-1 text-sm text-slate-400 max-w-md">
                  There is currently no active SOS request in your profile session. Press the Emergency SOS button if you require assistance.
                </p>
                <button
                  onClick={handleSOSButtonClick}
                  className="mt-6 rounded-xl bg-red-600 hover:bg-red-500 px-5 py-3 text-xs font-black tracking-wider uppercase text-white shadow-lg shadow-red-950/40"
                >
                  Activate Emergency SOS
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Active Header (Section 3) */}
                <div className="rounded-3xl border border-red-500/40 bg-slate-900 p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 animate-pulse">
                      <AlertOctagon className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                        🚨 EMERGENCY SOS ACTIVE
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      </h1>
                      <p className="text-xs text-slate-400">
                        Incident ID: <strong className="text-slate-300">{activeSOS.id}</strong> • Transmitted: {new Date(activeSOS.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={triggerCancelConfirmation}
                    className="rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-white"
                  >
                    Cancel Emergency SOS
                  </button>
                </div>

                {/* Status Telemetry Row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                  
                  {/* Status checklist details */}
                  <div className="md:col-span-8 space-y-6">
                    
                    {/* Location sharing box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Detection Details card */}
                      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🚨 GPS Telemetry</span>
                        <p className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4" />
                          Location Detected
                        </p>
                        <p className="text-xs text-slate-300">
                          📍 Anna Nagar, Madurai (Accuracy: ±8 meters)
                        </p>
                      </div>

                      {/* Control Room handshake */}
                      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🖥️ Command Center Link</span>
                        <p className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4" />
                          Handshake Confirmed
                        </p>
                        <p className="text-xs text-slate-300">
                          ResQLink Central Dispatch notified (Alert Sent)
                        </p>
                      </div>

                    </div>

                    {/* Driver details card (Section 6 & 7) */}
                    {activeSOS.driverName && (
                      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Ambulance className="h-4 w-4 text-sky-400" />
                            Assigned Emergency Responder
                          </h3>
                          <span className="rounded border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-400 animate-pulse">
                            {activeSOS.status?.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <p className="text-slate-500">Paramedic Driver:</p>
                            <p className="font-bold text-white text-sm mt-0.5">{activeSOS.driverName || 'John Driver'}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Ambulance Vehicle:</p>
                            <p className="font-bold text-white text-sm mt-0.5">{activeSOS.ambulanceNumber || 'TN 58 AB 1234'}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">ETA Status:</p>
                            <p className="font-bold text-emerald-400 text-sm mt-0.5">{activeSOS.eta || '5 min'}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Current Distance:</p>
                            <p className="font-bold text-white text-sm mt-0.5">
                              {activeSOS.distanceKm ? `~${activeSOS.distanceKm} km away` : '2.4 km'}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                          <a
                            href={`tel:${activeSOS.driverPhone || '+919876543210'}`}
                            className="flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-2.5 text-xs font-bold text-white"
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                            Call Paramedic Driver
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Hospital recommendations card (Section 7) */}
                    {activeSOS.hospitalName && (
                      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-emerald-400" />
                            AI Recommended Destination Trauma Center
                          </h3>
                          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            Pre-Allocated
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                          <div className="sm:col-span-8 space-y-2 text-xs">
                            <h4 className="text-base font-black text-white">{activeSOS.hospitalName || 'Apollo Hospital'}</h4>
                            <p className="text-slate-400">Fastest suitable route identified. Intake beds pre-booked.</p>
                            
                            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-slate-300">
                              <p>✓ Emergency Room: <span className="text-emerald-400 font-bold">AVAILABLE</span></p>
                              <p>✓ Intensive Care Unit: <span className="text-emerald-400 font-bold">CAPACITY OPEN</span></p>
                              <p>✓ General Trauma Beds: <span className="text-slate-200 font-semibold">12 Available</span></p>
                              <p>✓ ICU Beds: <span className="text-slate-200 font-semibold">4 Available</span></p>
                            </div>
                          </div>

                          <div className="sm:col-span-4 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-4 text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recommendation Score</p>
                            <p className="text-4xl font-black text-emerald-400 mt-1">98%</p>
                            <p className="text-[9px] text-emerald-500 font-semibold mt-1">✓ Beds & ICU Available</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Live Tracking map popup/card (Section 8) */}
                    {activeSOS.ambulanceNumber && (
                      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-black text-white flex items-center gap-2">
                            <Radio className="h-4 w-4 text-red-400 animate-pulse" />
                            Live GPS Map Tracking Popup
                          </h3>
                          <span className="text-xs text-slate-400">Updates every 2.5s</span>
                        </div>
                        <LiveMap
                          emergencies={[activeSOS]}
                          ambulances={ambulances}
                          hospitals={hospitals}
                          focusedEmergencyId={activeSOS.id}
                          height="280px"
                        />
                      </div>
                    )}

                  </div>

                  {/* Checklist and Timeline Timeline (Section 9) */}
                  <div className="md:col-span-4 space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Emergency Status Checklist</h3>
                      
                      <div className="relative pl-6 space-y-6 border-l border-slate-800">
                        {getSimulatedTimeline().map((item, idx) => (
                          <div key={item.id} className="relative">
                            <span className={`absolute -left-[30px] top-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${
                              item.done 
                                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300' 
                                : 'bg-slate-950 border-slate-800 text-slate-700'
                            }`}>
                              {item.done ? '✓' : idx + 1}
                            </span>
                            <div>
                              <p className={`text-xs font-bold ${item.done ? 'text-white' : 'text-slate-500'}`}>
                                {item.label}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

        {/* =====================================================
            TAB PANEL 3: BLOOD & RX REQUESTS
        ====================================================== */}
        {currentTab === 'requests' && (
          <div className="space-y-6">
            
            {/* Headers and Modals */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-black text-white">Emergency Blood & Medicine Requisitions</h1>
                <p className="text-xs text-slate-400 mt-1">Submit direct requisitions to Apollo Hospital networks.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setBloodModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-3.5 py-2 text-xs font-bold text-white"
                >
                  <Droplet className="h-4 w-4" />
                  Request Blood
                </button>
                <button
                  onClick={() => setPharmacyModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 px-3.5 py-2 text-xs font-bold text-white"
                >
                  <Pill className="h-4 w-4" />
                  Order Medicine
                </button>
              </div>
            </div>

            {/* Requisitions grid lists */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              
              {/* Blood requests list */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-rose-400" />
                  Your Active Blood Requests
                </h3>

                {bloodRequests.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-6 text-center">No active blood requests submitted.</p>
                ) : (
                  <div className="divide-y divide-slate-800 space-y-3">
                    {bloodRequests.map((req) => (
                      <div key={req.id} className="pt-3 first:pt-0 text-xs flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white">Request #{req.id} ({req.bloodGroup})</p>
                          <p className="text-[10px] text-slate-500">{req.hospitalName} • Units: {req.units}</p>
                          <p className="text-[9px] text-slate-700 mt-0.5">{new Date(req.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          req.status === 'APPROVED' || req.status === 'ALLOCATED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pharmacy orders list */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Pill className="h-4 w-4 text-teal-400" />
                  Your Pharmacy Orders
                </h3>

                {pharmacyOrders.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-6 text-center">No pharmacy orders submitted.</p>
                ) : (
                  <div className="divide-y divide-slate-800 space-y-3">
                    {pharmacyOrders.map((ord) => (
                      <div key={ord.id} className="pt-3 first:pt-0 text-xs flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white">Order #{ord.id}</p>
                          <p className="text-[10px] text-slate-500">{ord.hospitalName}</p>
                          <div className="mt-1 text-[10px] text-slate-400">
                            {ord.items.map((item, i) => <span key={i}>{item.name} (x{item.quantity})</span>)}
                          </div>
                          <p className="text-[9px] text-slate-700 mt-1">{new Date(ord.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          ord.status === 'DISPATCHED' || ord.status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* =====================================================
            TAB PANEL 4: EMERGENCY CONTACTS (CRUD Section 12)
        ====================================================== */}
        {currentTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-black text-white">Manage Emergency Contacts</h1>
                <p className="text-xs text-slate-400 mt-1">Configured family members who are auto-notified upon SOS activation.</p>
              </div>
              <button
                onClick={() => setAddContactOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 px-3.5 py-2 text-xs font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                Add Contact
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {contacts.map((contact, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      <User className="h-5 w-5 text-sky-400" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-white text-sm">{contact.name}</p>
                      <p className="text-slate-400 mt-0.5">Relation: {contact.relation}</p>
                      <p className="text-slate-500 font-mono mt-0.5">{contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${contact.phone}`}
                      className="h-8 w-8 rounded-lg bg-slate-950 border border-slate-800 text-sky-400 flex items-center justify-center hover:bg-slate-800"
                    >
                      <PhoneCall className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteContact(idx)}
                      className="h-8 w-8 rounded-lg bg-slate-950 border border-slate-800 text-red-400 flex items-center justify-center hover:bg-slate-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB PANEL 5: MEDICAL INFORMATION (Section 10)
        ====================================================== */}
        {currentTab === 'medical' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-xl font-black text-white">Verified Emergency Medical ID</h1>
              <p className="text-xs text-slate-400 mt-1">This medical payload is broadcasted immediately to triage teams when SOS is pressed.</p>
            </div>

            <div className="max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-red-500" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Sarah Jenkins (Citizen ID)</h3>
                    <p className="text-[10px] text-slate-500">MEMBER SINCE 2024</p>
                  </div>
                </div>
                <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                  ✓ VERIFIED DATA
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Blood Group</span>
                  <p className="text-base font-black text-rose-400">{currentUser?.bloodGroup || 'O+'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Allergies</span>
                  <p className="text-sm font-bold text-amber-300">{currentUser?.allergies || 'Penicillin, Peanuts'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Diagnosed Medical Conditions</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentUser?.medicalConditions || 'Mild Asthma, Hypertension, cardiac reserve history.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Primary Care Doctor</span>
                  <p className="text-xs text-slate-200 font-bold">Dr. R. Sundaram (Cardiologist, Madurai Heart Center)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Contact: +91 94432 10987</p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB PANEL 6: PROFILE
        ====================================================== */}
        {currentTab === 'profile' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-xl font-black text-white">Your Profile</h1>
              <p className="text-xs text-slate-400 mt-1">Manage personal demographics and details.</p>
            </div>

            <div className="max-w-xl p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                  alt="Sarah Avatar"
                  className="h-16 w-16 rounded-2xl border border-slate-700 object-cover ring-2 ring-red-500/20"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{currentUser?.name || 'Sarah Jenkins'}</h3>
                  <p className="text-xs text-slate-400">Citizen Emergency Account</p>
                </div>
              </div>

              <div className="divide-y divide-slate-800 text-xs">
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">Email Address:</span>
                  <span className="text-slate-300 font-semibold">{currentUser?.email}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">Phone Number:</span>
                  <span className="text-slate-300 font-semibold">{currentUser?.phone || '+91 98401 23456'}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">Registered Address:</span>
                  <span className="text-slate-300 font-semibold">{currentUser?.address || 'Anna Nagar, Madurai, TN'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB PANEL 7: SETTINGS
        ====================================================== */}
        {currentTab === 'settings' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-xl font-black text-white">System Settings</h1>
              <p className="text-xs text-slate-400 mt-1">Configure audio alert systems and preferences.</p>
            </div>

            <div className="max-w-xl p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Emergency Sound Alerts</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Play synthesizer alarm sounds for high-priority dispatch notifications.</p>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold border transition-all ${
                    soundEnabled 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  Sound {soundEnabled ? 'On' : 'Off'}
                </button>
              </div>

              <div className="divide-y divide-slate-800 pt-3 text-xs">
                <div className="py-3.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">Push Notifications</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Receive immediate status changes on lockscreen.</p>
                  </div>
                  <span className="text-emerald-400 font-bold">Enabled</span>
                </div>
                <div className="py-3.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">GPS High Accuracy</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Request precision location updates when SOS is active.</p>
                  </div>
                  <span className="text-emerald-400 font-bold">Always On</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            PERSISTENT FLOATING SOS BUTTON (Section 11)
        ====================================================== */}
        <div className="fixed bottom-6 right-6 z-[80] block">
          <button
            onClick={handleSOSButtonClick}
            disabled={isSOSActive}
            className={`flex items-center gap-2 rounded-full px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-2xl transition-transform hover:scale-105 active:scale-95 ${
              isSOSActive
                ? 'bg-red-800 ring-4 ring-red-500/30 cursor-not-allowed'
                : 'bg-red-600 shadow-red-950/40 hover:bg-red-500'
            }`}
          >
            <Siren className={`h-4 w-4 ${isSOSActive ? 'animate-pulse' : ''}`} />
            <span>{isSOSActive ? '● ACTIVE' : '🚨 SOS'}</span>
          </button>
        </div>

        {/* =====================================================
            MODAL A: SOS ACTIVATION CONFIRMATION (Section 4)
        ====================================================== */}
        {sosModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-xl"
            onClick={() => {
              if (!sosLoading) setSosModalOpen(false);
            }}
          >
            <div
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-red-500/40 bg-slate-900 shadow-2xl shadow-red-950/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-slate-800 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/40 bg-red-600/20">
                    <Siren className="h-6 w-6 animate-pulse text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Emergency SOS Confirmation</h2>
                    <p className="text-xs text-slate-400">Request immediate response teams</p>
                  </div>
                </div>
                <button
                  onClick={() => setSosModalOpen(false)}
                  disabled={sosLoading}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-5 p-6">
                
                {/* Warning details */}
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex gap-3 text-xs leading-relaxed text-red-300">
                  <AlertOctagon className="h-5 w-5 shrink-0 text-red-400" />
                  <div>
                    <p className="font-bold text-red-300">Important</p>
                    <p className="mt-1 text-red-200/70">
                      Your current location details, medical ID, and emergency history will be transmitted to central command rooms immediately.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-500">Patient Name:</p>
                    <p className="font-bold text-white text-sm mt-0.5">{currentUser?.name || 'Sarah Jenkins'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Mobile Broadcast ID:</p>
                    <p className="font-bold text-white text-sm mt-0.5">{currentUser?.phone || '+91 98401 23456'}</p>
                  </div>
                </div>

                {/* Emergency Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Emergency Category</label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    disabled={sosLoading}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                  >
                    <option value="MEDICAL">Medical Emergency / Triage</option>
                    <option value="ACCIDENT">Road Accident / Crash Triage</option>
                    <option value="CARDIAC">Cardiac Emergency / Chest Pain</option>
                    <option value="FIRE">Burns / Fire Hazard Triage</option>
                  </select>
                </div>

                {/* Notes Input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Additional Message (Optional)</label>
                  <textarea
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="Describe symptoms, exact location details, or help required..."
                    disabled={sosLoading}
                    rows={2}
                    className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white outline-none focus:border-red-500"
                  />
                </div>

                {/* Location detector box */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex items-center gap-3 text-xs">
                  <MapPin className="h-5 w-5 text-emerald-400 shrink-0 animate-bounce" />
                  <div>
                    <p className="font-bold text-white">Detection Coordinates</p>
                    {gpsStatus === 'detecting' ? (
                      <p className="text-[11px] text-amber-400 mt-0.5 flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Detecting GPS location...
                      </p>
                    ) : coords ? (
                      <p className="text-[11px] text-emerald-400 mt-0.5">
                        GPS detected: Anna Nagar, Madurai (Accuracy: ±8 meters)
                      </p>
                    ) : (
                      <p className="text-[11px] text-amber-400 mt-0.5">
                        GPS unavailable. Defaulting to Madurai coordinates.
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* Actions footer */}
              <div className="flex gap-3 border-t border-slate-800 p-6">
                <button
                  type="button"
                  onClick={() => setSosModalOpen(false)}
                  disabled={sosLoading}
                  className="flex-1 rounded-2xl bg-slate-800 py-3 text-sm font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleActivateSOS}
                  disabled={sosLoading}
                  className="flex-[2] rounded-2xl bg-red-600 py-3 text-sm font-black text-white shadow-lg hover:bg-red-500 disabled:bg-red-900 flex items-center justify-center gap-2"
                >
                  {sosLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Activating SOS...
                    </>
                  ) : (
                    <>
                      <Siren className="h-4 w-4" />
                      ACTIVATE EMERGENCY
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* =====================================================
            MODAL B: CANCEL SOS CONFIRMATION (Section 12)
        ====================================================== */}
        {cancelConfirmOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-xl">
            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-black text-white">Cancel Emergency?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to cancel the active emergency request? This will deactivate the beacon tracking and release responders.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCancelConfirmOpen(false)}
                  className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  KEEP SOS ACTIVE
                </button>
                <button
                  onClick={handleCancelSOSConfirm}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-500"
                >
                  CANCEL EMERGENCY
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MODAL C: REQUEST BLOOD
        ====================================================== */}
        {bloodModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-md space-y-4 rounded-3xl border border-rose-500/40 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Request Emergency Blood Units</h3>
                <button onClick={() => setBloodModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleBloodRequest} className="space-y-4 text-xs">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">Blood Group</label>
                  <select
                    value={bloodGroupReq}
                    onChange={(e) => setBloodGroupReq(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">Units Required</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={bloodUnitsReq}
                    onChange={(e) => setBloodUnitsReq(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white"
                  />
                </div>
                <button type="submit" className="w-full rounded-2xl bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-500">
                  Submit Blood Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================
            MODAL D: ORDER PHARMACY
        ====================================================== */}
        {pharmacyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-md space-y-4 rounded-3xl border border-teal-500/40 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Order Emergency Medicines</h3>
                <button onClick={() => setPharmacyModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handlePharmacyOrder} className="space-y-4 text-xs">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">Select Critical Medication</label>
                  <select
                    value={selectedMedicine}
                    onChange={(e) => setSelectedMedicine(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white"
                  >
                    <option>Adrenaline / Epinephrine (1mg/mL)</option>
                    <option>Normal Saline 0.9% (500mL IV)</option>
                    <option>Naloxone HCl Injection (0.4mg)</option>
                    <option>Aspirin Dispersible Tablets (300mg)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={medicineQuantity}
                    onChange={(e) => setMedicineQuantity(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white"
                  />
                </div>
                <button type="submit" className="w-full rounded-2xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-500">
                  Submit Pharmacy Order
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================
            MODAL E: ADD CONTACT
        ====================================================== */}
        {addContactOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-md space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Add Emergency Contact</h3>
                <button onClick={() => setAddContactOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddContact} className="space-y-4 text-xs">
                <div>
                  <label className="mb-1 block font-bold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">Relation</label>
                  <input
                    type="text"
                    required
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    placeholder="Spouse, Doctor, Sibling, etc."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-slate-300">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500"
                  />
                </div>
                <button type="submit" className="w-full rounded-2xl bg-sky-600 py-3 text-sm font-bold text-white hover:bg-sky-500">
                  Save Contact
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;