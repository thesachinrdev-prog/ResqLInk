import React, { useState } from 'react';

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
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';

import { DashboardLayout } from '../../components/common/DashboardLayout';
import { EmergencySOSButton } from '../../components/common/EmergencySOSButton';
import { LiveMap } from '../../components/common/LiveMap';
import { StatusBadge } from '../../components/common/StatusBadge';

import { EMERGENCY_STATUS } from '../../utils/constants';

export function PatientDashboard() {
  const { currentUser } = useAuth();

  const {
    emergencies = [],
    ambulances = [],
    hospitals = [],
    cancelSOS,
    createSOS,
    requestBlood,
    createPharmacyOrder,
  } = useEmergency();

  // =========================================================
  // MODALS
  // =========================================================

  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [bloodModalOpen, setBloodModalOpen] = useState(false);
  const [pharmacyModalOpen, setPharmacyModalOpen] = useState(false);

  // =========================================================
  // SOS STATE
  // =========================================================

  const [emergencyType, setEmergencyType] = useState('MEDICAL');

  const [sosLoading, setSosLoading] = useState(false);

  const [locationStatus, setLocationStatus] = useState('idle');

  const [userLocation, setUserLocation] = useState(null);

  // =========================================================
  // BLOOD REQUEST STATE
  // =========================================================

  const [bloodGroupReq, setBloodGroupReq] = useState(
    currentUser?.bloodGroup || 'O+'
  );

  const [bloodUnitsReq, setBloodUnitsReq] = useState(2);

  // =========================================================
  // PHARMACY STATE
  // =========================================================

  const [selectedMedicine, setSelectedMedicine] = useState(
    'Adrenaline / Epinephrine (1mg/mL)'
  );

  const [medicineQuantity, setMedicineQuantity] = useState(1);

  // =========================================================
  // FIND CURRENT PATIENT EMERGENCY
  // =========================================================

  const myActiveEmergency =
    emergencies.find((emergency) => {
      const samePatient =
        emergency.patientId === currentUser?.id ||
        emergency.patient?.id === currentUser?.id;

      const activeStatus =
        emergency.status !== EMERGENCY_STATUS.RESOLVED &&
        emergency.status !== EMERGENCY_STATUS.CANCELLED;

      return samePatient && activeStatus;
    }) || null;

  const isSOSActive = Boolean(myActiveEmergency);

  // =========================================================
  // GET CURRENT GPS LOCATION
  // =========================================================

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setLocationStatus('failed');

        reject(
          new Error(
            'Geolocation is not supported by this browser.'
          )
        );

        return;
      }

      setLocationStatus('detecting');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setUserLocation(location);
          setLocationStatus('detected');

          resolve(location);
        },

        (error) => {
          console.error(
            'GPS location error:',
            error
          );

          setLocationStatus('failed');

          reject(error);
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // =========================================================
  // OPEN SOS MODAL
  // =========================================================

  const handleSOSButtonClick = () => {
    if (isSOSActive) {
      return;
    }

    setLocationStatus('idle');
    setUserLocation(null);
    setSosModalOpen(true);
  };

  // =========================================================
  // ACTIVATE SOS
  // =========================================================

  const handleActivateSOS = async () => {
    if (sosLoading || isSOSActive) {
      return;
    }

    try {
      setSosLoading(true);

      let location = userLocation;

      // -----------------------------------------------------
      // GET LIVE GPS
      // -----------------------------------------------------

      try {
        location = await getCurrentLocation();
      } catch (gpsError) {
        console.warn(
          'GPS unavailable:',
          gpsError
        );

        /*
         * Demo fallback.
         *
         * For production, you may choose to stop SOS
         * activation when GPS permission is unavailable.
         */
        location = {
          latitude: 9.9252,
          longitude: 78.1198,
          accuracy: 50,
        };

        setUserLocation(location);
      }

      // -----------------------------------------------------
      // CHECK CONTEXT FUNCTION
      // -----------------------------------------------------

      if (typeof createSOS !== 'function') {
        throw new Error(
          'EmergencyContext is missing createSOS(). Replace EmergencyContext.jsx with the compatible version provided below.'
        );
      }

      // -----------------------------------------------------
      // CREATE SOS
      // -----------------------------------------------------

      const emergency = await createSOS({
        patientId: currentUser?.id,

        patientName:
          currentUser?.name || 'Unknown Patient',

        patientPhone:
          currentUser?.phone || 'Not Available',

        patientEmail:
          currentUser?.email || '',

        category: emergencyType,

        categoryLabel:
          emergencyType === 'ACCIDENT'
            ? 'Road Accident'
            : emergencyType === 'CARDIAC'
            ? 'Cardiac Emergency'
            : emergencyType === 'FIRE'
            ? 'Fire Emergency'
            : 'Medical Emergency',

        emergencyType,

        priority: 'CRITICAL',

        latitude: location.latitude,

        longitude: location.longitude,

        accuracy: location.accuracy,

        address:
          currentUser?.address ||
          'Current GPS Location',

        bloodGroup:
          currentUser?.bloodGroup || 'Unknown',

        allergies:
          currentUser?.allergies || 'Not specified',

        medicalConditions:
          currentUser?.medicalConditions ||
          'Not specified',

        emergencyContacts:
          currentUser?.emergencyContacts || [],

        status: EMERGENCY_STATUS.ACTIVE,

        createdAt: new Date().toISOString(),
      });

      console.log(
        '🚨 Patient SOS successfully created:',
        emergency
      );

      // -----------------------------------------------------
      // CLOSE MODAL
      // -----------------------------------------------------

      setSosModalOpen(false);

      setLocationStatus('detected');

    } catch (error) {
      console.error(
        'SOS activation failed:',
        error
      );

      alert(
        error?.message ||
          'Unable to activate SOS. Please try again.'
      );
    } finally {
      setSosLoading(false);
    }
  };

  // =========================================================
  // CANCEL SOS
  // =========================================================

  const handleCancelSOS = async () => {
    if (!myActiveEmergency) {
      return;
    }

    try {
      if (typeof cancelSOS !== 'function') {
        throw new Error(
          'cancelSOS() is not available in EmergencyContext.'
        );
      }

      await cancelSOS(
        myActiveEmergency.id,
        'Cancelled by patient'
      );
    } catch (error) {
      console.error(
        'Unable to cancel SOS:',
        error
      );

      alert(
        error?.message ||
          'Unable to cancel emergency.'
      );
    }
  };

  // =========================================================
  // BLOOD REQUEST
  // =========================================================

  const handleBloodSubmit = async (event) => {
    event.preventDefault();

    try {
      if (typeof requestBlood !== 'function') {
        throw new Error(
          'requestBlood() is not available in EmergencyContext.'
        );
      }

      await requestBlood({
        hospitalId: 'hosp_1',

        hospitalName:
          hospitals[0]?.name ||
          'Government Rajaji Trauma Center',

        requestedBy:
          currentUser?.name ||
          'Patient Direct Requisition',

        bloodGroup: bloodGroupReq,

        units: Number(bloodUnitsReq),

        urgency: 'HIGH',

        patientRef: `${currentUser?.name || 'Patient'} (${
          currentUser?.phone || 'No phone'
        })`,

        patientId: currentUser?.id,
      });

      setBloodModalOpen(false);
    } catch (error) {
      console.error(
        'Blood request failed:',
        error
      );

      alert(
        error?.message ||
          'Unable to submit blood request.'
      );
    }
  };

  // =========================================================
  // PHARMACY REQUEST
  // =========================================================

  const handlePharmacySubmit = async (event) => {
    event.preventDefault();

    try {
      if (
        typeof createPharmacyOrder !== 'function'
      ) {
        throw new Error(
          'createPharmacyOrder() is not available in EmergencyContext.'
        );
      }

      await createPharmacyOrder({
        hospitalId: 'hosp_1',

        hospitalName:
          'Patient Direct Emergency Order',

        orderedBy: `${currentUser?.name || 'Patient'} (Patient Prescription)`,

        patientId: currentUser?.id,

        items: [
          {
            name: selectedMedicine,

            quantity: Number(
              medicineQuantity
            ),
          },
        ],

        urgency: 'URGENT',
      });

      setPharmacyModalOpen(false);
    } catch (error) {
      console.error(
        'Pharmacy request failed:',
        error
      );

      alert(
        error?.message ||
          'Unable to submit pharmacy order.'
      );
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">

        {/* =====================================================
            PATIENT HEADER
        ====================================================== */}

        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl sm:p-8 md:flex-row md:items-center">

          <div className="space-y-1">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Emergency Beacon Standby
              </span>

            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Good Evening,{' '}
              {currentUser?.name?.split(' ')[0] ||
                'Citizen'}
            </h1>

            <p className="text-sm font-semibold text-slate-300">
              Are you safe? Help is one tap away whenever
              seconds matter.
            </p>

          </div>

          <div className="flex items-center gap-3">

            <a
              href="tel:108"
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-2.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-900/40"
            >
              <PhoneCall className="h-4 w-4" />

              <span>
                Direct 108
              </span>
            </a>

          </div>
        </div>

        {/* =====================================================
            ACTIVE EMERGENCY BANNER
        ====================================================== */}

        {isSOSActive && (
          <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-red-950/40 p-4 shadow-xl shadow-red-950/30 sm:p-5">

            <div className="absolute inset-0 animate-pulse bg-red-500/5" />

            <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/20">

                  <Siren className="h-6 w-6 animate-pulse text-red-400" />

                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-wider text-red-400">
                    Active Emergency
                  </p>

                  <p className="text-sm font-bold text-white">
                    Emergency assistance is currently active
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <span className="text-xs font-bold text-emerald-400">
                  ● LIVE
                </span>

                <button
                  type="button"
                  onClick={handleCancelSOS}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Cancel SOS
                </button>

              </div>

            </div>
          </div>
        )}

        {/* =====================================================
            MAIN SOS SECTION
        ====================================================== */}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">

          {/* ===================================================
              LEFT COLUMN
          ==================================================== */}

          <div className="space-y-6 lg:col-span-8">

            {isSOSActive ? (

              /* =================================================
                 ACTIVE SOS
              ================================================== */

              <div className="space-y-6 rounded-3xl border-2 border-red-500/50 bg-slate-900 p-6 shadow-2xl shadow-red-950/50 sm:p-8">

                <div className="flex flex-col justify-between gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl border border-red-500/40 bg-red-600/20 text-red-500">

                      <AlertOctagon className="h-7 w-7" />

                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <h2 className="text-lg font-black text-white">
                          {myActiveEmergency.categoryLabel ||
                            myActiveEmergency.category ||
                            'Medical Emergency'}
                        </h2>

                        <StatusBadge
                          status={
                            myActiveEmergency.status
                          }
                        />

                      </div>

                      <p className="text-xs text-slate-400">

                        Incident #
                        {myActiveEmergency.id}

                        {' • '}

                        Transmitted{' '}

                        {myActiveEmergency.createdAt
                          ? new Date(
                              myActiveEmergency.createdAt
                            ).toLocaleTimeString()
                          : 'Just now'}

                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={handleCancelSOS}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-700"
                  >
                    Cancel SOS
                  </button>

                </div>

                {/* TELEMETRY */}

                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">

                  {/* LOCATION */}

                  <div className="space-y-1 rounded-2xl border border-slate-800 bg-slate-950 p-3.5">

                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      LOCATION
                    </span>

                    <p className="flex items-center gap-1 font-bold text-emerald-400">

                      <CheckCircle className="h-3.5 w-3.5" />

                      Shared

                    </p>

                    <p className="truncate text-[11px] text-slate-400">
                      {myActiveEmergency.address ||
                        'Current GPS Location'}
                    </p>

                  </div>

                  {/* AMBULANCE */}

                  <div className="space-y-1 rounded-2xl border border-slate-800 bg-slate-950 p-3.5">

                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      AMBULANCE
                    </span>

                    <p className="flex items-center gap-1 font-bold text-sky-400">

                      <Ambulance className="h-3.5 w-3.5" />

                      {myActiveEmergency.ambulanceNumber
                        ? 'Assigned'
                        : 'Searching'}

                    </p>

                    <p className="truncate text-[11px] text-slate-400">

                      {myActiveEmergency.ambulanceNumber ||
                        'Finding nearest unit...'}

                    </p>

                  </div>

                  {/* ETA */}

                  <div className="space-y-1 rounded-2xl border border-slate-800 bg-slate-950 p-3.5">

                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      ETA
                    </span>

                    <p className="flex items-center gap-1 font-bold text-emerald-400">

                      <Clock className="h-3.5 w-3.5" />

                      {myActiveEmergency.eta ||
                        'Calculating...'}

                    </p>

                    <p className="text-[11px] text-slate-400">

                      {myActiveEmergency.distanceKm
                        ? `~${Number(
                            myActiveEmergency.distanceKm
                          ).toFixed(1)} km away`
                        : 'Route calculating'}

                    </p>

                  </div>

                  {/* HOSPITAL */}

                  <div className="space-y-1 rounded-2xl border border-slate-800 bg-slate-950 p-3.5">

                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      HOSPITAL
                    </span>

                    <p className="flex items-center gap-1 font-bold text-amber-400">

                      <Building2 className="h-3.5 w-3.5" />

                      {myActiveEmergency.hospitalName
                        ? 'Selected'
                        : 'Searching'}

                    </p>

                    <p className="truncate text-[11px] text-slate-400">

                      {myActiveEmergency.hospitalName ||
                        'Finding suitable hospital...'}

                    </p>

                  </div>

                </div>

                {/* LIVE MAP */}

                <div className="space-y-2">

                  <div className="flex items-center justify-between text-xs">

                    <span className="flex items-center gap-1.5 font-bold text-white">

                      <Radio className="h-4 w-4 animate-pulse text-red-400" />

                      Live Ambulance GPS Radar

                    </span>

                    <span className="text-slate-500">
                      Auto-updating telemetry
                    </span>

                  </div>

                  <LiveMap
                    emergencies={[
                      myActiveEmergency,
                    ]}
                    ambulances={ambulances}
                    hospitals={hospitals}
                    focusedEmergencyId={
                      myActiveEmergency.id
                    }
                    height="300px"
                  />

                </div>

                {/* DRIVER */}

                {myActiveEmergency.driverName && (
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">

                    <div>

                      <p className="text-xs font-bold text-white">
                        Paramedic:{' '}
                        {myActiveEmergency.driverName}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Assigned unit{' '}
                        {myActiveEmergency.ambulanceNumber ||
                          'Emergency Vehicle'}
                      </p>

                    </div>

                    {myActiveEmergency.driverPhone && (
                      <a
                        href={`tel:${myActiveEmergency.driverPhone}`}
                        className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />

                        Call Paramedic
                      </a>
                    )}

                  </div>
                )}

                <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-center text-xs font-bold text-amber-300/90">
                  ⚡ Simulated emergency response active
                </p>

              </div>

            ) : (

              /* =================================================
                 STANDBY SOS
              ================================================== */

              <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl sm:p-12">

                <div>

                  <div className="mb-3 flex justify-center">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">

                      <ShieldAlert className="h-5 w-5 text-red-400" />

                    </div>

                  </div>

                  <h2 className="text-xl font-black text-white">
                    Emergency Assistance
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Need immediate medical assistance?
                  </p>

                </div>

                {/* SOS BUTTON */}

                <div className="flex justify-center">

                  <EmergencySOSButton
                    onClick={
                      handleSOSButtonClick
                    }
                  />

                </div>

                <p className="text-xs text-slate-500">
                  Press SOS to share your location and
                  request emergency assistance.
                </p>

                {/* QUICK REQUESTS */}

                <div className="grid grid-cols-1 gap-3 border-t border-slate-800 pt-6 text-left sm:grid-cols-2">

                  <button
                    type="button"
                    onClick={() =>
                      setBloodModalOpen(true)
                    }
                    className="group rounded-2xl border border-slate-800 bg-slate-950 p-4 transition-colors hover:border-rose-500/50"
                  >

                    <Droplet className="mb-1 h-5 w-5 text-rose-400 transition-transform group-hover:scale-110" />

                    <p className="text-xs font-bold text-white">
                      Request Emergency Blood Units
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Direct hospital bank allocation
                    </p>

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPharmacyModalOpen(true)
                    }
                    className="group rounded-2xl border border-slate-800 bg-slate-950 p-4 transition-colors hover:border-teal-500/50"
                  >

                    <Pill className="mb-1 h-5 w-5 text-teal-400 transition-transform group-hover:scale-110" />

                    <p className="text-xs font-bold text-white">
                      Emergency Pharmacy Delivery
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Critical prescription restock
                    </p>

                  </button>

                </div>

              </div>
            )}

            {/* ===================================================
                HOSPITALS
            ==================================================== */}

            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6">

              <div className="flex items-center justify-between">

                <h3 className="flex items-center gap-2 text-sm font-bold text-white">

                  <Building2 className="h-4 w-4 text-emerald-400" />

                  Nearby Verified Trauma Centers

                </h3>

                <span className="text-xs text-slate-400">
                  {hospitals.length} Centers
                </span>

              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                {hospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs"
                  >

                    <div className="flex items-start justify-between">

                      <h4 className="font-bold text-white">
                        {hospital.name}
                      </h4>

                      <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        {hospital.level?.split(' ')[0] ||
                          'ER'}
                      </span>

                    </div>

                    <p className="truncate text-[11px] text-slate-400">
                      {hospital.address}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-800 pt-2">

                      <span className="font-bold text-emerald-400">
                        {hospital.erBeds?.available ?? 0}
                        {' '}ER Beds Open
                      </span>

                      <a
                        href={`tel:${hospital.phone}`}
                        className="font-bold text-sky-400 hover:underline"
                      >
                        Call ER
                      </a>

                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* =====================================================
              RIGHT COLUMN
          ====================================================== */}

          <div className="space-y-6 lg:col-span-4">

            {/* MEDICAL ID */}

            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Shield className="h-5 w-5 text-red-400" />

                  <h3 className="text-sm font-bold text-white">
                    Emergency Medical ID
                  </h3>

                </div>

                <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  VERIFIED
                </span>

              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">

                <img
                  src={
                    currentUser?.avatar ||
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser?.name || 'Patient'}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-red-500/30"
                />

                <div>

                  <h4 className="text-sm font-bold text-white">
                    {currentUser?.name ||
                      'Patient'}
                  </h4>

                  <p className="text-xs text-slate-400">
                    {currentUser?.phone ||
                      'Phone not available'}
                  </p>

                </div>

              </div>

              <div className="space-y-2 text-xs">

                <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-950 p-2.5">

                  <span className="text-slate-400">
                    Blood Group:
                  </span>

                  <span className="rounded border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-bold text-rose-400">
                    {currentUser?.bloodGroup ||
                      'O+'}
                  </span>

                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">

                  <span className="block text-[10px] font-bold uppercase text-slate-400">
                    Known Allergies:
                  </span>

                  <span className="font-semibold text-amber-300">
                    {currentUser?.allergies ||
                      'Not specified'}
                  </span>

                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">

                  <span className="block text-[10px] font-bold uppercase text-slate-400">
                    Medical Conditions:
                  </span>

                  <span className="font-semibold text-slate-200">
                    {currentUser?.medicalConditions ||
                      'Not specified'}
                  </span>

                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">

                  <span className="block text-[10px] font-bold uppercase text-slate-400">
                    Home Address:
                  </span>

                  <span className="font-medium text-slate-300">
                    {currentUser?.address ||
                      'Address not specified'}
                  </span>

                </div>

              </div>

            </div>

            {/* EMERGENCY CONTACTS */}

            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <HeartPulse className="h-5 w-5 text-rose-400" />

                  <h3 className="text-sm font-bold text-white">
                    Emergency Contacts
                  </h3>

                </div>

                <span className="text-[10px] text-slate-400">
                  Auto-Alerted on SOS
                </span>

              </div>

              <div className="space-y-2 text-xs">

                {(
                  currentUser?.emergencyContacts || [
                    {
                      name: 'Emergency Contact',
                      phone: '+91 00000 00000',
                    },
                  ]
                ).map((contact, index) => (

                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-3"
                  >

                    <div>

                      <p className="font-bold text-white">
                        {contact.name}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        {contact.phone}
                      </p>

                    </div>

                    <a
                      href={`tel:${contact.phone}`}
                      className="rounded-xl bg-slate-800 p-2 text-sky-400 transition-colors hover:bg-slate-700"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                    </a>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            SOS MODAL
        ====================================================== */}

        {sosModalOpen && (

          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-xl"
            onClick={() => {
              if (!sosLoading) {
                setSosModalOpen(false);
              }
            }}
          >

            <div
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-red-500/40 bg-slate-900 shadow-2xl shadow-red-950/50"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="border-b border-slate-800 p-6">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/40 bg-red-600/20">

                      <Siren className="h-6 w-6 animate-pulse text-red-400" />

                    </div>

                    <div>

                      <h2 className="text-lg font-black text-white">
                        Emergency SOS
                      </h2>

                      <p className="text-xs text-slate-400">
                        Request immediate emergency assistance
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSosModalOpen(false)
                    }
                    disabled={sosLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>

              </div>

              {/* BODY */}

              <div className="space-y-5 p-6">

                {/* WARNING */}

                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">

                  <div className="flex gap-3">

                    <AlertOctagon className="h-5 w-5 shrink-0 text-red-400" />

                    <div>

                      <p className="text-sm font-bold text-red-300">
                        Emergency assistance will be activated
                      </p>

                      <p className="mt-1 text-xs text-red-200/60">
                        Your live location and emergency
                        information will be transmitted to
                        the ResQLINK response system.
                      </p>

                    </div>

                  </div>

                </div>

                {/* EMERGENCY TYPE */}

                <div>

                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Emergency Type
                  </label>

                  <select
                    value={emergencyType}
                    onChange={(event) =>
                      setEmergencyType(
                        event.target.value
                      )
                    }
                    disabled={sosLoading}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                  >

                    <option value="MEDICAL">
                      Medical Emergency
                    </option>

                    <option value="ACCIDENT">
                      Road Accident
                    </option>

                    <option value="CARDIAC">
                      Cardiac Emergency
                    </option>

                    <option value="FIRE">
                      Fire Emergency
                    </option>

                  </select>

                </div>

                {/* LOCATION */}

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">

                  <div className="flex items-center gap-3">

                    <MapPin className="h-5 w-5 text-emerald-400" />

                    <div className="flex-1">

                      <p className="text-xs font-bold text-white">
                        Your Location
                      </p>

                      {locationStatus ===
                        'detecting' && (

                        <p className="mt-1 flex items-center gap-1 text-[11px] text-amber-400">

                          <Loader2 className="h-3 w-3 animate-spin" />

                          Detecting GPS location...

                        </p>

                      )}

                      {locationStatus ===
                        'detected' &&
                        userLocation && (

                          <p className="mt-1 text-[11px] text-emerald-400">

                            GPS detected • ±
                            {Math.round(
                              userLocation.accuracy
                            )}
                            m

                          </p>

                        )}

                      {locationStatus ===
                        'failed' && (

                          <p className="mt-1 text-[11px] text-amber-400">
                            GPS unavailable. Demo
                            location will be used.
                          </p>

                        )}

                      {locationStatus ===
                        'idle' && (

                          <p className="mt-1 text-[11px] text-slate-500">
                            GPS location will be detected
                            when SOS is activated.
                          </p>

                        )}

                    </div>

                  </div>

                </div>

                {/* RESPONSE */}

                <div className="space-y-2">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Emergency Response
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">

                      <Radio className="mb-2 h-4 w-4 text-sky-400" />

                      <p className="text-xs font-bold text-white">
                        Control Room
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Emergency alert sent
                      </p>

                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">

                      <Ambulance className="mb-2 h-4 w-4 text-red-400" />

                      <p className="text-xs font-bold text-white">
                        Emergency Vehicle
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Nearest available unit
                      </p>

                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">

                      <Building2 className="mb-2 h-4 w-4 text-amber-400" />

                      <p className="text-xs font-bold text-white">
                        Hospital
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Suitable hospital selected
                      </p>

                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">

                      <Navigation className="mb-2 h-4 w-4 text-emerald-400" />

                      <p className="text-xs font-bold text-white">
                        Fastest Route
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Route calculated
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="flex gap-3 border-t border-slate-800 p-6">

                <button
                  type="button"
                  onClick={() =>
                    setSosModalOpen(false)
                  }
                  disabled={sosLoading}
                  className="flex-1 rounded-2xl bg-slate-800 py-3 text-sm font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleActivateSOS}
                  disabled={sosLoading}
                  className="flex-[2] rounded-2xl bg-red-600 py-3 text-sm font-black text-white shadow-lg shadow-red-950/40 hover:bg-red-500 disabled:bg-red-900"
                >

                  {sosLoading ? (

                    <span className="flex items-center justify-center gap-2">

                      <Loader2 className="h-4 w-4 animate-spin" />

                      Activating SOS...

                    </span>

                  ) : (

                    <span className="flex items-center justify-center gap-2">

                      <Siren className="h-4 w-4" />

                      ACTIVATE SOS

                    </span>

                  )}

                </button>

              </div>

            </div>

          </div>

        )}

        {/* =====================================================
            BLOOD MODAL
        ====================================================== */}

        {bloodModalOpen && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">

            <div className="w-full max-w-md space-y-4 rounded-3xl border border-rose-500/40 bg-slate-900 p-6 shadow-2xl">

              <div className="flex items-center justify-between">

                <h3 className="text-base font-bold text-white">
                  Request Emergency Blood Units
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setBloodModalOpen(false)
                  }
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              <form
                onSubmit={handleBloodSubmit}
                className="space-y-4 text-xs"
              >

                <div>

                  <label className="mb-1 block font-bold text-slate-300">
                    Blood Group
                  </label>

                  <select
                    value={bloodGroupReq}
                    onChange={(event) =>
                      setBloodGroupReq(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                  >

                    {[
                      'O+',
                      'O-',
                      'A+',
                      'A-',
                      'B+',
                      'B-',
                      'AB+',
                      'AB-',
                    ].map((group) => (

                      <option
                        key={group}
                        value={group}
                      >
                        {group}
                      </option>

                    ))}

                  </select>

                </div>

                <div>

                  <label className="mb-1 block font-bold text-slate-300">
                    Units
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={bloodUnitsReq}
                    onChange={(event) =>
                      setBloodUnitsReq(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                  />

                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-500"
                >
                  Submit Blood Request
                </button>

              </form>

            </div>

          </div>

        )}

        {/* =====================================================
            PHARMACY MODAL
        ====================================================== */}

        {pharmacyModalOpen && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">

            <div className="w-full max-w-md space-y-4 rounded-3xl border border-teal-500/40 bg-slate-900 p-6 shadow-2xl">

              <div className="flex items-center justify-between">

                <h3 className="text-base font-bold text-white">
                  Order Emergency Medicines
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setPharmacyModalOpen(false)
                  }
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              <form
                onSubmit={handlePharmacySubmit}
                className="space-y-4 text-xs"
              >

                <div>

                  <label className="mb-1 block font-bold text-slate-300">
                    Medicine Name
                  </label>

                  <input
                    type="text"
                    value={selectedMedicine}
                    onChange={(event) =>
                      setSelectedMedicine(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                  />

                </div>

                <div>

                  <label className="mb-1 block font-bold text-slate-300">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={medicineQuantity}
                    onChange={(event) =>
                      setMedicineQuantity(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                  />

                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-500"
                >
                  Submit Pharmacy Order
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