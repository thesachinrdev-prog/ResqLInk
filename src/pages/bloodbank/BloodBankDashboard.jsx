import React, { useMemo, useState } from 'react';
import {
  Droplet,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Plus,
  Minus,
  ArrowRight,
  ShieldAlert,
  Send,
  Users,
  Activity,
  Search,
  Phone,
  MapPin,
  UserRound,
  CalendarDays,
  HeartPulse,
  Navigation,
  X,
  Filter,
  ChevronRight,
  Radio,
  PackageCheck,
  RefreshCw,
  Truck,
  Hospital,
  BadgeCheck,
  UserPlus,
  CircleDot,
  ClipboardList,
  BellRing,
  LocateFixed,
  Siren,
  TrendingUp,
  Database,
  FileText,
  Check,
  Ban,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { StatusBadge } from '../../components/common/StatusBadge';

const INITIAL_DONORS = [
  {
    id: 'DON-001',
    name: 'அரவிந்த் குமார்',
    englishName: 'Aravind Kumar',
    phone: '+91 98421 67342',
    bloodGroup: 'O-',
    age: 27,
    gender: 'Male',
    city: 'Madurai',
    area: 'Anna Nagar',
    lastDonation: '2026-07-18',
    totalDonations: 8,
    status: 'AVAILABLE',
    distance: 2.4,
    verified: true,
  },
  {
    id: 'DON-002',
    name: 'முருகன் ராஜா',
    englishName: 'Murugan Raja',
    phone: '+91 97865 43210',
    bloodGroup: 'O+',
    age: 31,
    gender: 'Male',
    city: 'Madurai',
    area: 'KK Nagar',
    lastDonation: '2026-06-29',
    totalDonations: 11,
    status: 'AVAILABLE',
    distance: 4.1,
    verified: true,
  },
  {
    id: 'DON-003',
    name: 'காவ்யா தேவி',
    englishName: 'Kavya Devi',
    phone: '+91 99521 84731',
    bloodGroup: 'AB-',
    age: 24,
    gender: 'Female',
    city: 'Madurai',
    area: 'Simmakkal',
    lastDonation: '2026-07-02',
    totalDonations: 5,
    status: 'AVAILABLE',
    distance: 3.7,
    verified: true,
  },
  {
    id: 'DON-004',
    name: 'சரவணன்',
    englishName: 'Saravanan',
    phone: '+91 98654 23187',
    bloodGroup: 'A+',
    age: 29,
    gender: 'Male',
    city: 'Madurai',
    area: 'Thirunagar',
    lastDonation: '2026-05-14',
    totalDonations: 6,
    status: 'AVAILABLE',
    distance: 6.2,
    verified: true,
  },
  {
    id: 'DON-005',
    name: 'பிரியா லட்சுமி',
    englishName: 'Priya Lakshmi',
    phone: '+91 97910 56241',
    bloodGroup: 'B+',
    age: 26,
    gender: 'Female',
    city: 'Madurai',
    area: 'Tallakulam',
    lastDonation: '2026-08-01',
    totalDonations: 4,
    status: 'AVAILABLE',
    distance: 5.3,
    verified: true,
  },
  {
    id: 'DON-006',
    name: 'விஜய் ஆனந்த்',
    englishName: 'Vijay Anand',
    phone: '+91 98847 12903',
    bloodGroup: 'O-',
    age: 33,
    gender: 'Male',
    city: 'Madurai',
    area: 'Goripalayam',
    lastDonation: '2026-04-20',
    totalDonations: 14,
    status: 'AVAILABLE',
    distance: 1.8,
    verified: true,
  },
  {
    id: 'DON-007',
    name: 'தீபிகா ரமேஷ்',
    englishName: 'Deepika Ramesh',
    phone: '+91 98765 34021',
    bloodGroup: 'A-',
    age: 28,
    gender: 'Female',
    city: 'Madurai',
    area: 'Vilangudi',
    lastDonation: '2026-07-21',
    totalDonations: 7,
    status: 'AVAILABLE',
    distance: 7.4,
    verified: true,
  },
  {
    id: 'DON-008',
    name: 'கார்த்திக் செல்வம்',
    englishName: 'Karthik Selvam',
    phone: '+91 98123 45678',
    bloodGroup: 'B-',
    age: 30,
    gender: 'Male',
    city: 'Madurai',
    area: 'Mattuthavani',
    lastDonation: '2026-06-11',
    totalDonations: 9,
    status: 'CONTACT_PENDING',
    distance: 8.2,
    verified: true,
  },
];

const MADURAI_HOSPITALS = [
  {
    id: 'HOS-001',
    name: 'Madurai Government Rajaji Hospital',
    shortName: 'GRH Madurai',
    location: 'Panagal Road, Madurai',
    distance: '3.2 km',
    status: 'CRITICAL',
    bloodGroup: 'O-',
    unitsRequired: 4,
    trauma: 'Major Trauma',
    eta: '8 min',
    requestedBy: 'டாக்டர் ராஜேஷ்',
    phone: '+91 452 253 5353',
  },
  {
    id: 'HOS-002',
    name: 'Apollo Speciality Hospitals',
    shortName: 'Apollo Madurai',
    location: 'Lake View Road, K.K. Nagar',
    distance: '5.7 km',
    status: 'URGENT',
    bloodGroup: 'AB-',
    unitsRequired: 2,
    trauma: 'Emergency Surgery',
    eta: '14 min',
    requestedBy: 'டாக்டர் மீனாட்சி',
    phone: '+91 452 258 0890',
  },
  {
    id: 'HOS-003',
    name: 'Velammal Medical College Hospital',
    shortName: 'Velammal Hospital',
    location: 'Anuppanadi, Madurai',
    distance: '9.4 km',
    status: 'URGENT',
    bloodGroup: 'O+',
    unitsRequired: 6,
    trauma: 'Accident Ward',
    eta: '19 min',
    requestedBy: 'டாக்டர் அருண்',
    phone: '+91 452 711 1111',
  },
  {
    id: 'HOS-004',
    name: 'Meenakshi Mission Hospital',
    shortName: 'Meenakshi Mission',
    location: 'Lake Area, Madurai',
    distance: '7.1 km',
    status: 'NORMAL',
    bloodGroup: 'A+',
    unitsRequired: 3,
    trauma: 'Surgical Reserve',
    eta: '16 min',
    requestedBy: 'டாக்டர் பிரவீன்',
    phone: '+91 452 258 8741',
  },
];

const BLOOD_GROUPS = [
  'O-',
  'O+',
  'A-',
  'A+',
  'B-',
  'B+',
  'AB-',
  'AB+',
];

export function BloodBankDashboard() {
  const { currentUser } = useAuth();

  const {
    bloodInventory,
    bloodRequests,
    updateBloodStock,
    addNotification,
  } = useEmergency();

  const [donors, setDonors] = useState(INITIAL_DONORS);

  const [selectedGroup, setSelectedGroup] = useState('O-');
  const [donorModalOpen, setDonorModalOpen] = useState(false);
  const [donorDetailsOpen, setDonorDetailsOpen] = useState(null);
  const [hospitalDetailsOpen, setHospitalDetailsOpen] = useState(null);

  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorGroup, setDonorGroup] = useState('O+');
  const [donorAge, setDonorAge] = useState('');
  const [donorGender, setDonorGender] = useState('Male');
  const [donorArea, setDonorArea] = useState('Anna Nagar');

  const [search, setSearch] = useState('');
  const [donorFilter, setDonorFilter] = useState('ALL');
  const [hospitalFilter, setHospitalFilter] = useState('ALL');

  const totalUnits = bloodInventory.reduce(
    (acc, curr) => acc + curr.units,
    0
  );

  const criticalGroups = bloodInventory.filter(
    (b) => b.status === 'CRITICAL' || b.status === 'LOW'
  );

  const availableDonors = donors.filter(
    (donor) => donor.status === 'AVAILABLE'
  );

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const matchesSearch =
        donor.name.toLowerCase().includes(search.toLowerCase()) ||
        donor.englishName.toLowerCase().includes(search.toLowerCase()) ||
        donor.phone.includes(search);

      const matchesGroup =
        donorFilter === 'ALL' || donor.bloodGroup === donorFilter;

      return matchesSearch && matchesGroup;
    });
  }, [donors, search, donorFilter]);

  const filteredHospitals = MADURAI_HOSPITALS.filter((hospital) => {
    if (hospitalFilter === 'ALL') return true;
    return hospital.status === hospitalFilter;
  });

  const handleStockChange = async (group, delta) => {
    await updateBloodStock(group, delta);

    addNotification(
      'info',
      'Inventory Updated',
      `${group} blood reserve changed by ${delta > 0 ? '+' : ''}${delta} unit.`
    );
  };

  const handleApproveRequest = (reqId) => {
    addNotification(
      'info',
      'Blood Units Dispatched',
      `Requisition ${reqId} approved. Units released for emergency courier handover.`
    );
  };

  const handleRegisterDonor = (e) => {
    e.preventDefault();

    const newDonor = {
      id: `DON-${String(donors.length + 1).padStart(3, '0')}`,
      name: donorName,
      englishName: donorName,
      phone: donorPhone,
      bloodGroup: donorGroup,
      age: Number(donorAge),
      gender: donorGender,
      city: 'Madurai',
      area: donorArea,
      lastDonation: new Date().toISOString().split('T')[0],
      totalDonations: 1,
      status: 'AVAILABLE',
      distance: Number((Math.random() * 9 + 1).toFixed(1)),
      verified: true,
    };

    setDonors((prev) => [newDonor, ...prev]);

    updateBloodStock(donorGroup, 1);

    addNotification(
      'info',
      'Donor Registered',
      `${donorName} has been registered as a ${donorGroup} donor and 1 unit has been added to inventory.`
    );

    setDonorName('');
    setDonorPhone('');
    setDonorAge('');
    setDonorGender('Male');
    setDonorArea('Anna Nagar');
    setDonorGroup('O+');
    setDonorModalOpen(false);
  };

  const handleContactDonor = (donor) => {
    setDonors((prev) =>
      prev.map((item) =>
        item.id === donor.id
          ? { ...item, status: 'CONTACT_PENDING' }
          : item
      )
    );

    addNotification(
      'info',
      'Donor Contact Request Sent',
      `Emergency availability request sent to ${donor.name} (${donor.bloodGroup}).`
    );
  };

  const getStatusStyle = (status) => {
    if (status === 'CRITICAL') {
      return 'bg-red-500/10 border-red-500/30 text-red-400';
    }

    if (status === 'URGENT') {
      return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    }

    return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-6 pb-16">

        {/* ========================================================= */}
        {/* COMMAND CENTER HEADER */}
        {/* ========================================================= */}

        <section className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950 shadow-2xl">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-rose-600/10 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />

          <div className="relative p-6 sm:p-8">

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

              <div className="flex items-start gap-4">

                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 shadow-lg shadow-rose-950/30">
                    <Droplet className="h-8 w-8 text-rose-400" />
                  </div>

                  <span className="absolute -right-1 -top-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-rose-500" />
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">

                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      Blood Operations Center
                    </h1>

                    <span className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] font-black tracking-wider text-rose-400">
                      HUB #BB-04
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    Central Regional Blood Bank · Madurai Emergency Grid
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">

                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Radio className="h-3.5 w-3.5" />
                      System Operational
                    </span>

                    <span className="text-slate-700">•</span>

                    <span className="flex items-center gap-1.5 text-slate-400">
                      <UserRound className="h-3.5 w-3.5" />
                      Lead Serologist:
                      <strong className="text-slate-200">
                        {currentUser?.name || 'கார்த்திகேயன்'}
                      </strong>
                    </span>

                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={() => setDonorModalOpen(true)}
                  className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-rose-950/40 transition hover:-translate-y-0.5 hover:from-rose-500 hover:to-red-500"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Blood Donor
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() =>
                    addNotification(
                      'info',
                      'Inventory Synchronized',
                      'Blood inventory synchronized with connected emergency hospitals.'
                    )
                  }
                  className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
                >
                  <RefreshCw className="h-4 w-4" />
                  Sync Grid
                </button>

              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* METRICS */}
        {/* ========================================================= */}

        <section className="grid grid-cols-2 xl:grid-cols-5 gap-4">

          <MetricCard
            icon={<PackageCheck />}
            label="Cold Vault"
            value={`${totalUnits}`}
            suffix="Units"
            description="2.4°C calibrated"
            iconClass="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
          />

          <MetricCard
            icon={<Droplet />}
            label="O- Reserve"
            value={
              bloodInventory.find((b) => b.group === 'O-')?.units || 0
            }
            suffix="Units"
            description="Universal donor"
            iconClass="text-rose-400 bg-rose-500/10 border-rose-500/20"
            danger
          />

          <MetricCard
            icon={<Hospital />}
            label="Hospital Requests"
            value={bloodRequests.length}
            suffix="Active"
            description="Emergency requisitions"
            iconClass="text-amber-400 bg-amber-500/10 border-amber-500/20"
          />

          <MetricCard
            icon={<Users />}
            label="Registered Donors"
            value={donors.length}
            suffix="Donors"
            description={`${availableDonors.length} available now`}
            iconClass="text-violet-400 bg-violet-500/10 border-violet-500/20"
          />

          <MetricCard
            icon={<ShieldAlert />}
            label="Critical Groups"
            value={criticalGroups.length}
            suffix="Groups"
            description="Immediate restock"
            iconClass="text-red-400 bg-red-500/10 border-red-500/20"
            danger
          />

        </section>

        {/* ========================================================= */}
        {/* EMERGENCY ALERT STRIP */}
        {/* ========================================================= */}

        <section className="overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/50 via-slate-950 to-slate-950">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <Siren className="h-5 w-5 text-red-400 animate-pulse" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-red-400">
                  Emergency Blood Network
                </p>
                <p className="text-sm font-semibold text-slate-200">
                  O- and AB- reserves require immediate donor mobilisation.
                </p>
              </div>

            </div>

            <button
              onClick={() => setDonorFilter('O-')}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-black text-red-300 hover:bg-red-500/20"
            >
              <LocateFixed className="h-4 w-4" />
              Find O- Donors
            </button>

          </div>
        </section>

        {/* ========================================================= */}
        {/* BLOOD INVENTORY */}
        {/* ========================================================= */}

        <section className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">

          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-rose-400" />
                <h2 className="text-lg font-black text-white">
                  8-Group Blood Reserve Matrix
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Live reserve monitoring across the Madurai emergency blood grid
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CircleDot className="h-3 w-3" />
                Synced
              </span>
            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">

            {bloodInventory.map((item) => {

              const isCritical = item.status === 'CRITICAL';
              const isLow = item.status === 'LOW';
              const isSelected = selectedGroup === item.group;

              return (
                <div
                  key={item.group}
                  onClick={() => setSelectedGroup(item.group)}
                  className={`
                    relative cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all
                    ${
                      isSelected
                        ? 'border-rose-500/60 ring-1 ring-rose-500/30'
                        : 'border-slate-800'
                    }
                    ${
                      isCritical
                        ? 'bg-red-950/40'
                        : isLow
                        ? 'bg-amber-950/20'
                        : 'bg-slate-950'
                    }
                    hover:-translate-y-1 hover:border-slate-700
                  `}
                >

                  {isCritical && (
                    <div className="absolute right-2 top-2">
                      <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    </div>
                  )}

                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-2xl font-black text-white">
                      {item.group}
                    </span>

                    <span
                      className={`rounded-md border px-1.5 py-0.5 text-[8px] font-black ${
                        isCritical
                          ? 'border-red-500/30 bg-red-500/10 text-red-400'
                          : isLow
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-2xl font-black text-white">
                    {item.units}
                    <span className="ml-1 text-[10px] font-medium text-slate-500">
                      units
                    </span>
                  </p>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        isCritical
                          ? 'bg-red-500'
                          : isLow
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (item.units / Math.max(item.safeMinimum * 2, 1)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-[9px] text-slate-500">
                    Minimum {item.safeMinimum}
                  </p>

                  <div className="mt-4 flex gap-1.5">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStockChange(item.group, -1);
                      }}
                      disabled={item.units <= 0}
                      className="flex flex-1 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 py-1.5 text-slate-400 hover:bg-slate-800 disabled:opacity-20"
                    >
                      <Minus className="h-3 w-3" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStockChange(item.group, 1);
                      }}
                      className="flex flex-1 items-center justify-center rounded-lg bg-rose-600 py-1.5 text-white hover:bg-rose-500"
                    >
                      <Plus className="h-3 w-3" />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        </section>

        {/* ========================================================= */}
        {/* MADURAI HOSPITAL GRID */}
        {/* ========================================================= */}

        <section className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">

          <div className="mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">

            <div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-black text-white">
                  Madurai Hospital Availability Grid
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Emergency blood requirements connected to the ResqLINK network
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              {['ALL', 'CRITICAL', 'URGENT', 'NORMAL'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setHospitalFilter(filter)}
                  className={`rounded-lg px-3 py-2 text-[10px] font-black transition ${
                    hospitalFilter === filter
                      ? 'bg-cyan-500 text-slate-950'
                      : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}

            </div>
          </div>

          <div className="grid gap-3">

            {filteredHospitals.map((hospital) => (

              <div
                key={hospital.id}
                className="group rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-slate-700"
              >

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
                      <Hospital className="h-5 w-5 text-cyan-400" />
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-black text-white">
                          {hospital.name}
                        </h3>

                        <span
                          className={`rounded-md border px-2 py-1 text-[9px] font-black ${getStatusStyle(
                            hospital.status
                          )}`}
                        >
                          {hospital.status}
                        </span>

                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">

                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {hospital.location}
                        </span>

                        <span className="flex items-center gap-1 text-cyan-400">
                          <Navigation className="h-3 w-3" />
                          {hospital.distance}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock3 className="h-3 w-3" />
                          {hospital.eta}
                        </span>

                      </div>

                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2">
                      <p className="text-[9px] font-bold uppercase text-slate-500">
                        Required
                      </p>
                      <p className="font-black text-rose-400">
                        {hospital.unitsRequired} × {hospital.bloodGroup}
                      </p>
                    </div>

                    <button
                      onClick={() => setHospitalDetailsOpen(hospital)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800"
                    >
                      View Details
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        addNotification(
                          'info',
                          'Hospital Request Accepted',
                          `${hospital.unitsRequired} units of ${hospital.bloodGroup} allocated to ${hospital.shortName}.`
                        );
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-rose-950/30 hover:bg-rose-500"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Dispatch
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        </section>

        {/* ========================================================= */}
        {/* DONOR COMMAND CENTER */}
        {/* ========================================================= */}

        <section className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">

          <div className="mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">

            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-400" />
                <h2 className="text-lg font-black text-white">
                  Emergency Donor Registry
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Verified Madurai blood donors available for emergency mobilisation
              </p>
            </div>

            <button
              onClick={() => setDonorModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-black text-white hover:bg-violet-500"
            >
              <Plus className="h-4 w-4" />
              Register Donor
            </button>

          </div>

          {/* SEARCH + FILTER */}

          <div className="mb-5 flex flex-col lg:flex-row gap-3">

            <div className="relative flex-1">

              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search donor name, Tamil name or phone..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-violet-500/50"
              />

            </div>

            <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-1.5">

              <Filter className="ml-2 h-4 w-4 shrink-0 text-slate-500" />

              {['ALL', ...BLOOD_GROUPS].map((group) => (

                <button
                  key={group}
                  onClick={() => setDonorFilter(group)}
                  className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-black ${
                    donorFilter === group
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {group}
                </button>

              ))}

            </div>

          </div>

          {/* DONOR CARDS */}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">

            {filteredDonors.map((donor) => (

              <div
                key={donor.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:-translate-y-1 hover:border-violet-500/30"
              >

                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-500/5 blur-2xl" />

                <div className="relative">

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <UserRound className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-black text-white">
                            {donor.name}
                          </h3>

                          {donor.verified && (
                            <BadgeCheck className="h-3.5 w-3.5 text-cyan-400" />
                          )}
                        </div>

                        <p className="text-[10px] text-slate-500">
                          {donor.englishName}
                        </p>
                      </div>

                    </div>

                    <span className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-sm font-black text-rose-400">
                      {donor.bloodGroup}
                    </span>

                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">

                    <InfoTile
                      icon={<MapPin />}
                      label="Location"
                      value={donor.area}
                    />

                    <InfoTile
                      icon={<Navigation />}
                      label="Distance"
                      value={`${donor.distance} km`}
                    />

                    <InfoTile
                      icon={<CalendarDays />}
                      label="Last Donation"
                      value={donor.lastDonation}
                    />

                    <InfoTile
                      icon={<TrendingUp />}
                      label="Donations"
                      value={`${donor.totalDonations} times`}
                    />

                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">

                    <div className="flex items-center gap-1.5">

                      <span
                        className={`h-2 w-2 rounded-full ${
                          donor.status === 'AVAILABLE'
                            ? 'bg-emerald-400'
                            : 'bg-amber-400'
                        }`}
                      />

                      <span className="text-[10px] font-bold text-slate-400">
                        {donor.status === 'AVAILABLE'
                          ? 'Available Now'
                          : 'Contact Pending'}
                      </span>

                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() => setDonorDetailsOpen(donor)}
                        className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white"
                        title="View donor"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </button>

                      <a
                        href={`tel:${donor.phone}`}
                        className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-emerald-400 hover:bg-emerald-500/10"
                        title="Call donor"
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </a>

                      <button
                        onClick={() => handleContactDonor(donor)}
                        className="rounded-lg bg-violet-600 px-3 py-2 text-[10px] font-black text-white hover:bg-violet-500"
                      >
                        Request
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {filteredDonors.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-800 py-12 text-center">
              <Users className="mx-auto h-8 w-8 text-slate-700" />
              <p className="mt-3 text-sm font-bold text-slate-400">
                No matching donors found
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Try another blood group or donor name.
              </p>
            </div>
          )}

        </section>

        {/* ========================================================= */}
        {/* EXISTING HOSPITAL REQUISITIONS */}
        {/* ========================================================= */}

        <section className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-black text-white">
                  Incoming Blood Requisitions
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Direct emergency requests from connected hospitals
              </p>
            </div>

            <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-black text-amber-400">
              {bloodRequests.length} ACTIVE
            </span>

          </div>

          <div className="space-y-3">

            {bloodRequests.map((req) => (

              <div
                key={req.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
              >

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="text-sm font-black text-white">
                        {req.hospitalName}
                      </span>

                      <span className="rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-[9px] font-black text-rose-400">
                        {req.bloodGroup} · {req.units} Units
                      </span>

                      <span className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-[9px] font-black text-red-400">
                        {req.urgency}
                      </span>

                    </div>

                    <p className="mt-2 text-[11px] text-slate-500">
                      Requested by{' '}
                      <strong className="text-slate-300">
                        {req.requestedBy}
                      </strong>{' '}
                      · Patient Ref:{' '}
                      <strong className="text-slate-300">
                        {req.patientRef}
                      </strong>
                    </p>

                  </div>

                  <button
                    onClick={() => handleApproveRequest(req.id)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-rose-950/30 hover:from-rose-500 hover:to-red-500"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve & Dispatch
                  </button>

                </div>

              </div>

            ))}

            {bloodRequests.length === 0 && (
              <div className="py-10 text-center text-sm text-slate-500">
                No active hospital requisitions.
              </div>
            )}

          </div>

        </section>

        {/* ========================================================= */}
        {/* DONOR REGISTRATION MODAL */}
        {/* ========================================================= */}

        {donorModalOpen && (
          <ModalOverlay onClose={() => setDonorModalOpen(false)}>

            <div className="relative overflow-hidden rounded-[30px] border border-violet-500/20 bg-slate-950 shadow-2xl">

              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative border-b border-slate-800 p-6">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <UserPlus className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white">
                        Register Blood Donor
                      </h3>
                      <p className="text-xs text-slate-500">
                        Add verified donor to the Madurai emergency network
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() => setDonorModalOpen(false)}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-500 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>

              </div>

              <form
                onSubmit={handleRegisterDonor}
                className="relative space-y-5 p-6"
              >

                <div className="grid sm:grid-cols-2 gap-4">

                  <FormInput
                    label="Donor Full Name"
                    value={donorName}
                    onChange={setDonorName}
                    placeholder="e.g. அருண் குமார்"
                    required
                  />

                  <FormInput
                    label="Mobile Number"
                    value={donorPhone}
                    onChange={setDonorPhone}
                    placeholder="+91 98400 11223"
                    required
                  />

                  <FormInput
                    label="Age"
                    value={donorAge}
                    onChange={setDonorAge}
                    placeholder="25"
                    type="number"
                    required
                  />

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-300">
                      Gender
                    </label>

                    <select
                      value={donorGender}
                      onChange={(e) => setDonorGender(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-3 text-sm text-white outline-none focus:border-violet-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-300">
                      Blood Group
                    </label>

                    <select
                      value={donorGroup}
                      onChange={(e) => setDonorGroup(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-3 text-sm font-black text-rose-400 outline-none focus:border-rose-500"
                    >
                      {BLOOD_GROUPS.map((group) => (
                        <option key={group}>{group}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-300">
                      Madurai Area
                    </label>

                    <select
                      value={donorArea}
                      onChange={(e) => setDonorArea(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-3 text-sm text-white outline-none focus:border-violet-500"
                    >
                      <option>Anna Nagar</option>
                      <option>KK Nagar</option>
                      <option>Goripalayam</option>
                      <option>Tallakulam</option>
                      <option>Simmakkal</option>
                      <option>Mattuthavani</option>
                      <option>Thirunagar</option>
                      <option>Vilangudi</option>
                    </select>
                  </div>

                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">

                  <div className="flex gap-3">

                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

                    <div>
                      <p className="text-xs font-black text-cyan-300">
                        Donor Verification
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        Donor information will be added to the emergency
                        registry. Medical eligibility and screening should be
                        verified by authorized blood-bank staff before release.
                      </p>
                    </div>

                  </div>

                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-black text-white shadow-xl shadow-violet-950/30 hover:from-violet-500 hover:to-indigo-500"
                >
                  <BadgeCheck className="h-4 w-4" />
                  Verify & Register Donor
                </button>

              </form>

            </div>

          </ModalOverlay>
        )}

        {/* ========================================================= */}
        {/* DONOR DETAILS MODAL */}
        {/* ========================================================= */}

        {donorDetailsOpen && (
          <ModalOverlay onClose={() => setDonorDetailsOpen(null)}>

            <div className="rounded-[30px] border border-violet-500/20 bg-slate-950 p-6 shadow-2xl">

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                    <UserRound className="h-7 w-7" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white">
                        {donorDetailsOpen.name}
                      </h3>

                      {donorDetailsOpen.verified && (
                        <BadgeCheck className="h-5 w-5 text-cyan-400" />
                      )}
                    </div>

                    <p className="text-xs text-slate-500">
                      {donorDetailsOpen.englishName}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => setDonorDetailsOpen(null)}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>

              </div>

              <div className="mt-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 text-center">

                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Blood Group
                </p>

                <p className="mt-1 text-5xl font-black text-rose-400">
                  {donorDetailsOpen.bloodGroup}
                </p>

                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                  {donorDetailsOpen.status === 'AVAILABLE'
                    ? 'Available for Emergency Contact'
                    : 'Contact Request Pending'}
                </span>

              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <DetailItem
                  label="Phone"
                  value={donorDetailsOpen.phone}
                  icon={<Phone />}
                />

                <DetailItem
                  label="Age"
                  value={`${donorDetailsOpen.age} years`}
                  icon={<UserRound />}
                />

                <DetailItem
                  label="Gender"
                  value={donorDetailsOpen.gender}
                  icon={<Users />}
                />

                <DetailItem
                  label="Location"
                  value={`${donorDetailsOpen.area}, Madurai`}
                  icon={<MapPin />}
                />

                <DetailItem
                  label="Last Donation"
                  value={donorDetailsOpen.lastDonation}
                  icon={<CalendarDays />}
                />

                <DetailItem
                  label="Total Donations"
                  value={`${donorDetailsOpen.totalDonations} donations`}
                  icon={<HeartPulse />}
                />

              </div>

              <div className="mt-5 flex gap-3">

                <a
                  href={`tel:${donorDetailsOpen.phone}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-black text-white hover:bg-emerald-500"
                >
                  <Phone className="h-4 w-4" />
                  Call Donor
                </a>

                <button
                  onClick={() => {
                    handleContactDonor(donorDetailsOpen);
                    setDonorDetailsOpen(null);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-xs font-black text-white hover:bg-violet-500"
                >
                  <Send className="h-4 w-4" />
                  Emergency Request
                </button>

              </div>

            </div>

          </ModalOverlay>
        )}

        {/* ========================================================= */}
        {/* HOSPITAL DETAILS MODAL */}
        {/* ========================================================= */}

        {hospitalDetailsOpen && (
          <ModalOverlay onClose={() => setHospitalDetailsOpen(null)}>

            <div className="rounded-[30px] border border-cyan-500/20 bg-slate-950 p-6 shadow-2xl">

              <div className="flex items-start justify-between">

                <div>
                  <div className="flex items-center gap-2">
                    <Hospital className="h-5 w-5 text-cyan-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                      Hospital Request
                    </span>
                  </div>

                  <h3 className="mt-2 text-xl font-black text-white">
                    {hospitalDetailsOpen.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {hospitalDetailsOpen.location}
                  </p>
                </div>

                <button
                  onClick={() => setHospitalDetailsOpen(null)}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>

              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">

                <DetailItem
                  label="Blood Required"
                  value={`${hospitalDetailsOpen.unitsRequired} × ${hospitalDetailsOpen.bloodGroup}`}
                  icon={<Droplet />}
                />

                <DetailItem
                  label="Priority"
                  value={hospitalDetailsOpen.status}
                  icon={<Siren />}
                />

                <DetailItem
                  label="Department"
                  value={hospitalDetailsOpen.trauma}
                  icon={<Activity />}
                />

                <DetailItem
                  label="Estimated ETA"
                  value={hospitalDetailsOpen.eta}
                  icon={<Clock3 />}
                />

                <DetailItem
                  label="Requested By"
                  value={hospitalDetailsOpen.requestedBy}
                  icon={<UserRound />}
                />

                <DetailItem
                  label="Distance"
                  value={hospitalDetailsOpen.distance}
                  icon={<Navigation />}
                />

              </div>

              <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">

                <div className="flex gap-3">

                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />

                  <p className="text-xs leading-5 text-slate-400">
                    Dispatch should only be confirmed after verifying stock,
                    compatibility, cross-matching requirements and authorized
                    hospital requisition details.
                  </p>

                </div>

              </div>

              <div className="mt-5 flex gap-3">

                <a
                  href={`tel:${hospitalDetailsOpen.phone}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-3 text-xs font-black text-slate-200 hover:bg-slate-800"
                >
                  <Phone className="h-4 w-4" />
                  Hospital
                </a>

                <button
                  onClick={() => {
                    addNotification(
                      'info',
                      'Emergency Dispatch Started',
                      `${hospitalDetailsOpen.unitsRequired} × ${hospitalDetailsOpen.bloodGroup} prepared for ${hospitalDetailsOpen.shortName}.`
                    );

                    setHospitalDetailsOpen(null);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-black text-white hover:bg-rose-500"
                >
                  <Truck className="h-4 w-4" />
                  Start Dispatch
                </button>

              </div>

            </div>

          </ModalOverlay>
        )}

      </div>
    </DashboardLayout>
  );
}

/* =============================================================== */
/* REUSABLE COMPONENTS */
/* =============================================================== */

function MetricCard({
  icon,
  label,
  value,
  suffix,
  description,
  iconClass,
  danger,
}) {
  return (
    <div
      className={`group rounded-2xl border p-5 transition hover:-translate-y-1 ${
        danger
          ? 'border-red-500/20 bg-red-950/10'
          : 'border-slate-800 bg-slate-900'
      }`}
    >
      <div className="flex items-start justify-between">

        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
            {label}
          </p>

          <div className="mt-2 flex items-end gap-1.5">
            <span className="text-3xl font-black tracking-tight text-white">
              {value}
            </span>

            <span className="mb-1 text-[10px] font-bold text-slate-500">
              {suffix}
            </span>
          </div>

          <p
            className={`mt-1 text-[10px] font-semibold ${
              danger ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconClass}`}
        >
          {React.cloneElement(icon, {
            className: 'h-5 w-5',
          })}
        </div>

      </div>
    </div>
  );
}

function InfoTile({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5">

      <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-slate-600">
        {React.cloneElement(icon, {
          className: 'h-3 w-3',
        })}
        {label}
      </div>

      <p className="mt-1 truncate text-[10px] font-bold text-slate-300">
        {value}
      </p>

    </div>
  );
}

function DetailItem({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">

      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-600">

        {React.cloneElement(icon, {
          className: 'h-3 w-3',
        })}

        {label}

      </div>

      <p className="mt-1 text-xs font-bold text-slate-200">
        {value}
      </p>

    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold text-slate-300">
        {label}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10"
      />

    </div>
  );
}

function ModalOverlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-xl"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl">
        {children}
      </div>
    </div>
  );
}