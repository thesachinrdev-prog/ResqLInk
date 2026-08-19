import React, { useMemo, useState } from 'react';
import {
  Activity,
  Ambulance,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Droplet,
  FileText,
  HeartPulse,
  Hospital,
  MapPin,
  Package,
  Radio,
  RefreshCw,
  Search,
  Server,
  Shield,
  Star,
  Truck,
  UserCheck,
  Users,
  Wifi,
  X,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { StatusBadge } from '../../components/common/StatusBadge';

import {
  DEMO_USERS,
  EMERGENCY_STATUS,
  SEVERITY_LEVELS,
} from '../../utils/constants';

export function AdminDashboard() {
  const { currentUser } = useAuth();

  const {
    emergencies = [],
    ambulances = [],
    hospitals = [],
    bloodInventory = [],
    pharmacyInventory = [],
    addNotification,
  } = useEmergency();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* ============================================================
     NETWORK METRICS
  ============================================================ */

  const activeEmergencies = useMemo(
    () =>
      emergencies.filter(
        (emergency) =>
          emergency.status !== EMERGENCY_STATUS.RESOLVED &&
          emergency.status !== EMERGENCY_STATUS.CANCELLED
      ),
    [emergencies]
  );

  const criticalEmergencies = useMemo(
    () =>
      emergencies.filter(
        (emergency) =>
          emergency.severity === SEVERITY_LEVELS.CRITICAL
      ),
    [emergencies]
  );

  const enRouteEmergencies = useMemo(
    () =>
      emergencies.filter(
        (emergency) =>
          emergency.status === EMERGENCY_STATUS.EN_ROUTE ||
          emergency.status === EMERGENCY_STATUS.DISPATCHED
      ),
    [emergencies]
  );

  const completedOperations = useMemo(
    () =>
      emergencies.filter(
        (emergency) =>
          emergency.status === EMERGENCY_STATUS.RESOLVED
      ).length + 248,
    [emergencies]
  );

  const availableAmbulances = useMemo(
    () =>
      ambulances.filter(
        (ambulance) => ambulance.status === 'AVAILABLE'
      ),
    [ambulances]
  );

  const activeAmbulances = useMemo(
    () =>
      ambulances.filter((ambulance) =>
        ['EN_ROUTE', 'ON_SCENE', 'DISPATCHED'].includes(
          ambulance.status
        )
      ),
    [ambulances]
  );

  const totalErBeds = useMemo(
    () =>
      hospitals.reduce(
        (sum, hospital) =>
          sum + Number(hospital?.erBeds?.available || 0),
        0
      ),
    [hospitals]
  );

  const totalErCapacity = useMemo(
    () =>
      hospitals.reduce(
        (sum, hospital) =>
          sum + Number(hospital?.erBeds?.total || 0),
        0
      ),
    [hospitals]
  );

  const totalIcuBeds = useMemo(
    () =>
      hospitals.reduce(
        (sum, hospital) =>
          sum + Number(hospital?.icuBeds?.available || 0),
        0
      ),
    [hospitals]
  );

  const totalBloodUnits = useMemo(
    () =>
      bloodInventory.reduce(
        (sum, item) => sum + Number(item?.units || 0),
        0
      ),
    [bloodInventory]
  );

  const criticalBloodGroups = useMemo(
    () =>
      bloodInventory.filter(
        (item) => item?.status === 'CRITICAL'
      ),
    [bloodInventory]
  );

  const averageDriverRating = 4.86;
  const averageHospitalRating = 4.72;
  const networkHealth = 99.98;

  /* ============================================================
     DRIVER PERFORMANCE
  ============================================================ */

  const driverPerformance = useMemo(() => {
    const ratings = [4.9, 4.8, 4.7, 4.9, 4.85];

    const missions = [248, 193, 176, 221, 154];

    const responseTimes = [
      '06:42',
      '08:15',
      '07:38',
      '06:58',
      '09:02',
    ];

    const onTimeRates = [98, 96, 94, 97, 92];

    return ambulances.map((ambulance, index) => ({
      ...ambulance,

      rating: ratings[index % ratings.length],

      completedMissions:
        missions[index % missions.length],

      responseTime:
        responseTimes[index % responseTimes.length],

      onTimeRate:
        onTimeRates[index % onTimeRates.length],

      status:
        ambulance?.status === 'AVAILABLE'
          ? 'ONLINE'
          : ambulance?.status || 'OFFLINE',
    }));
  }, [ambulances]);

  /* ============================================================
     HOSPITAL PERFORMANCE
  ============================================================ */

  const hospitalPerformance = useMemo(() => {
    const ratings = [4.9, 4.7, 4.8, 4.6, 4.7];

    const handled = [842, 721, 654, 489, 371];

    const readiness = [96, 91, 94, 88, 90];

    const handovers = [
      '07:12',
      '08:04',
      '07:48',
      '09:11',
      '08:37',
    ];

    return hospitals.map((hospital, index) => ({
      ...hospital,

      rating:
        ratings[index % ratings.length],

      emergenciesHandled:
        handled[index % handled.length],

      responseReadiness:
        readiness[index % readiness.length],

      avgHandover:
        handovers[index % handovers.length],
    }));
  }, [hospitals]);

  /* ============================================================
     AUDIT LOGS
  ============================================================ */

  const auditLogs = [
    {
      id: 'audit-1',
      time: 'Just now',
      event: 'Emergency Dispatch',
      details:
        'TN-58-EM-1081 assigned to critical cardiac incident EMG-1092.',
      user: 'ResQLink Dispatch Engine',
      type: 'critical',
    },
    {
      id: 'audit-2',
      time: '4 mins ago',
      event: 'Hospital Capacity Updated',
      details:
        'Government Rajaji Hospital reported 12 available ER beds.',
      user: 'Dr. Aravind Kumar',
      type: 'hospital',
    },
    {
      id: 'audit-3',
      time: '8 mins ago',
      event: 'Blood Allocation',
      details:
        '4 units O- reserved for emergency trauma response.',
      user: 'Dr. Malathi Pandian',
      type: 'blood',
    },
    {
      id: 'audit-4',
      time: '13 mins ago',
      event: 'Ambulance Online',
      details:
        'TN-58-EM-1084 completed vehicle diagnostics and entered active fleet.',
      user: 'Praveen Kumar',
      type: 'fleet',
    },
    {
      id: 'audit-5',
      time: '21 mins ago',
      event: 'Pharmacy Restock',
      details:
        'Emergency oxygen inventory replenished at ResQLink Pharmacy.',
      user: 'Saravanan Murugan',
      type: 'pharmacy',
    },
    {
      id: 'audit-6',
      time: '34 mins ago',
      event: 'Emergency Resolved',
      details:
        'Trauma incident EMG-1088 successfully handed over to hospital team.',
      user: 'Control Room',
      type: 'success',
    },
  ];

  /* ============================================================
     SEARCH
  ============================================================ */

  const normalizedSearch =
    searchQuery.trim().toLowerCase();

  const filteredEmergencies = useMemo(() => {
    if (!normalizedSearch) {
      return emergencies;
    }

    return emergencies.filter((emergency) => {
      const searchableFields = [
        emergency?.id,
        emergency?.patientName,
        emergency?.category,
        emergency?.categoryLabel,
        emergency?.hospitalName,
        emergency?.ambulanceNumber,
        emergency?.driverName,
        emergency?.bloodGroup,
        emergency?.status,
      ];

      return searchableFields.some((field) =>
        String(field || '')
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [emergencies, normalizedSearch]);

  /* ============================================================
     ACTIONS
  ============================================================ */

  const handleRefresh = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);

      addNotification?.(
        'success',
        'Network Refreshed',
        'ResQLink operational telemetry is up to date.'
      );
    }, 900);
  };

  const handleExport = () => {
    const exportData = {
      generatedAt: new Date().toISOString(),
      networkHealth,
      emergencies,
      ambulances,
      hospitals,
      bloodInventory,
      pharmacyInventory,
      driverPerformance,
      hospitalPerformance,
      auditLogs,
    };

    const dataStr =
      'data:application/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(exportData, null, 2)
      );

    const anchor = document.createElement('a');

    anchor.href = dataStr;

    anchor.download =
      `ResQLink_Admin_Operations_${Date.now()}.json`;

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    addNotification?.(
      'success',
      'Audit Export Complete',
      'Complete operational telemetry exported successfully.'
    );
  };

  /* ============================================================
     TABS
  ============================================================ */

  const tabs = [
    {
      id: 'overview',
      label: 'Command Center',
      icon: Activity,
    },
    {
      id: 'operations',
      label: 'Live Operations',
      icon: Radio,
    },
    {
      id: 'fleet',
      label: 'Fleet & Drivers',
      icon: Ambulance,
    },
    {
      id: 'hospitals',
      label: 'Hospitals',
      icon: Building2,
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: Package,
    },
    {
      id: 'users',
      label: 'Personnel',
      icon: Users,
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: FileText,
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen pb-16 space-y-6">

        {/* ======================================================
            COMMAND HEADER
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-slate-800 bg-slate-950 shadow-2xl">

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="absolute -bottom-40 left-20 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
          </div>

          <div className="relative p-6 lg:p-8">

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

              <div className="flex items-center gap-4">

                <div className="relative">

                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/10 border border-purple-400/30 flex items-center justify-center">

                    <Shield className="h-8 w-8 text-purple-300" />

                  </div>

                  <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-emerald-400 border-4 border-slate-950" />

                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                      ResQLink Command Center
                    </h1>

                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-300 tracking-wider">
                      ROOT ADMIN
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    Unified emergency operations intelligence for Madurai
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">

                    <span className="flex items-center gap-1.5 text-slate-300">
                      <UserCheck className="h-3.5 w-3.5 text-purple-400" />

                      {currentUser?.name ||
                        'System Administrator'}
                    </span>

                    <span className="text-slate-700">
                      •
                    </span>

                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Wifi className="h-3.5 w-3.5" />

                      Network Operational
                    </span>

                    <span className="text-slate-700">
                      •
                    </span>

                    <span className="text-slate-400">
                      Health {networkHealth}%
                    </span>

                  </div>

                </div>

              </div>

              <div className="flex flex-wrap items-center gap-2">

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  <RefreshCw
                    className={`h-4 w-4 ${
                      isRefreshing
                        ? 'animate-spin'
                        : ''
                    }`}
                  />

                  {isRefreshing
                    ? 'Refreshing...'
                    : 'Refresh Network'}

                </button>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition shadow-lg shadow-purple-900/20"
                >

                  <Download className="h-4 w-4" />

                  Export Telemetry

                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================================
            GLOBAL SEARCH
        ====================================================== */}

        <div className="relative">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />

          <input
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search incident ID, patient, ambulance, hospital, category..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 py-3.5 pl-11 pr-10 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

        </div>

        {/* ======================================================
            TABS
        ====================================================== */}

        <div className="overflow-x-auto no-scrollbar">

          <div className="flex min-w-max gap-1 rounded-2xl border border-slate-800 bg-slate-900 p-1">

            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    activeTab === tab.id
                      ? 'bg-slate-800 text-white shadow ring-1 ring-white/10'
                      : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />

                  {tab.label}
                </button>
              );
            })}

          </div>

        </div>

        {/* ======================================================
            NETWORK KPI
        ====================================================== */}

        <section className="grid grid-cols-2 xl:grid-cols-6 gap-3">

          <KpiCard
            label="Active Emergencies"
            value={activeEmergencies.length}
            sub={`${criticalEmergencies.length} critical`}
            icon={HeartPulse}
            accent="rose"
          />

          <KpiCard
            label="Active Ambulances"
            value={activeAmbulances.length}
            sub={`${availableAmbulances.length} available`}
            icon={Ambulance}
            accent="sky"
          />

          <KpiCard
            label="Operations Completed"
            value={completedOperations}
            sub="+18 today"
            icon={CheckCircle2}
            accent="emerald"
          />

          <KpiCard
            label="ER Beds Available"
            value={totalErBeds}
            sub={`${totalErCapacity} total capacity`}
            icon={Hospital}
            accent="amber"
          />

          <KpiCard
            label="Blood Reserve"
            value={totalBloodUnits}
            sub={`${criticalBloodGroups.length} critical groups`}
            icon={Droplet}
            accent="rose"
          />

          <KpiCard
            label="Network Health"
            value={`${networkHealth}%`}
            sub="All systems operational"
            icon={Server}
            accent="purple"
          />

        </section>

        {/* ======================================================
            OVERVIEW
        ====================================================== */}

        {activeTab === 'overview' && (
          <div className="space-y-6">

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900 p-6">

                <div className="flex items-center justify-between mb-6">

                  <div>
                    <p className="text-sm font-black text-white">
                      Network Operations
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Real-time system performance
                    </p>
                  </div>

                  <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-[10px] font-black text-emerald-400 border border-emerald-500/20">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />

                    LIVE

                  </span>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                  <MiniMetric
                    label="Dispatch Success"
                    value="99.4%"
                    icon={Radio}
                    trend="+2.1%"
                  />

                  <MiniMetric
                    label="Avg Response"
                    value="07:42"
                    icon={Clock3}
                    trend="-14 sec"
                  />

                  <MiniMetric
                    label="Fleet Uptime"
                    value="98.7%"
                    icon={Truck}
                    trend="+1.4%"
                  />

                  <MiniMetric
                    label="Hospital Ready"
                    value="94.2%"
                    icon={Building2}
                    trend="+3.2%"
                  />

                </div>

                <div className="mt-6">

                  <div className="flex items-center justify-between mb-3">

                    <span className="text-xs font-bold text-slate-300">
                      Emergency Response Performance
                    </span>

                    <span className="text-[10px] text-slate-500">
                      Last 24 hours
                    </span>

                  </div>

                  <div className="h-36 flex items-end gap-1.5 sm:gap-2">

                    {[
                      45,
                      62,
                      52,
                      75,
                      68,
                      88,
                      72,
                      92,
                      78,
                      96,
                      82,
                      100,
                      89,
                      94,
                      76,
                      91,
                      84,
                      98,
                      88,
                      95,
                    ].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 h-full flex items-end group relative"
                      >
                        <div
                          style={{
                            height: `${height}%`,
                          }}
                          className="w-full rounded-t-md bg-gradient-to-t from-purple-600/20 to-purple-400/80 transition-all group-hover:from-purple-500/40 group-hover:to-purple-300"
                        />
                      </div>
                    ))}

                  </div>

                  <div className="flex justify-between mt-2 text-[9px] text-slate-600">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>NOW</span>
                  </div>

                </div>

              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

                <p className="text-sm font-black text-white">
                  Infrastructure Status
                </p>

                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Core ResQLink services
                </p>

                <div className="space-y-3">

                  <SystemStatus
                    name="Dispatch Engine"
                    status="Operational"
                    value="99.99%"
                  />

                  <SystemStatus
                    name="Ambulance Telemetry"
                    status="Operational"
                    value="99.97%"
                  />

                  <SystemStatus
                    name="Hospital Network"
                    status="Operational"
                    value="99.95%"
                  />

                  <SystemStatus
                    name="Blood Inventory"
                    status="Operational"
                    value="99.91%"
                  />

                  <SystemStatus
                    name="Pharmacy Network"
                    status="Operational"
                    value="99.88%"
                  />

                  <SystemStatus
                    name="Notification Gateway"
                    status="Operational"
                    value="99.99%"
                  />

                </div>

              </div>

            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <PerformancePanel
                title="Top Active Riders"
                subtitle="Driver performance & completed operations"
                icon={Ambulance}
              >

                {[...driverPerformance]
                  .sort(
                    (a, b) =>
                      b.rating - a.rating
                  )
                  .slice(0, 5)
                  .map((driver, index) => (
                    <DriverRow
                      key={
                        driver.id ||
                        driver.vehicleNumber ||
                        index
                      }
                      driver={driver}
                      rank={index + 1}
                    />
                  ))}

                {driverPerformance.length === 0 && (
                  <EmptyPanel
                    icon={Ambulance}
                    title="No fleet data"
                    description="No ambulance units are currently registered."
                  />
                )}

              </PerformancePanel>

              <PerformancePanel
                title="Hospital Network Performance"
                subtitle="Capacity, rating & emergency readiness"
                icon={Building2}
              >

                {[...hospitalPerformance]
                  .sort(
                    (a, b) =>
                      b.rating - a.rating
                  )
                  .slice(0, 5)
                  .map((hospital, index) => (
                    <HospitalRow
                      key={
                        hospital.id ||
                        hospital.name ||
                        index
                      }
                      hospital={hospital}
                      rank={index + 1}
                    />
                  ))}

                {hospitalPerformance.length === 0 && (
                  <EmptyPanel
                    icon={Building2}
                    title="No hospital data"
                    description="No connected hospitals are available."
                  />
                )}

              </PerformancePanel>

            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

              <div className="p-5 border-b border-slate-800 flex items-center justify-between">

                <div>
                  <h3 className="text-sm font-black text-white">
                    Live Emergency Operations
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Active incidents requiring operational awareness
                  </p>
                </div>

                <button
                  onClick={() =>
                    setActiveTab('operations')
                  }
                  className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300"
                >
                  View all

                  <ChevronRight className="h-4 w-4" />
                </button>

              </div>

              <EmergencyTable
                emergencies={filteredEmergencies.slice(
                  0,
                  6
                )}
                onSelect={setSelectedEmergency}
              />

            </section>

          </div>
        )}

        {/* ======================================================
            OPERATIONS
        ====================================================== */}

        {activeTab === 'operations' && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

            <div className="p-6 border-b border-slate-800">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div>

                  <h2 className="text-lg font-black text-white">
                    Live Emergency Operations
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    {activeEmergencies.length} active incidents across the network
                  </p>

                </div>

                <div className="flex gap-2">

                  <StatusPill
                    label="Critical"
                    value={
                      criticalEmergencies.length
                    }
                    type="critical"
                  />

                  <StatusPill
                    label="En Route"
                    value={
                      enRouteEmergencies.length
                    }
                    type="active"
                  />

                </div>

              </div>

            </div>

            <EmergencyTable
              emergencies={filteredEmergencies}
              onSelect={setSelectedEmergency}
              detailed
            />

          </section>
        )}

        {/* ======================================================
            FLEET
        ====================================================== */}

        {activeTab === 'fleet' && (
          <section className="space-y-4">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              <KpiCard
                label="Total Fleet"
                value={ambulances.length}
                sub="Registered units"
                icon={Ambulance}
                accent="sky"
              />

              <KpiCard
                label="Available"
                value={
                  availableAmbulances.length
                }
                sub="Ready for dispatch"
                icon={CheckCircle2}
                accent="emerald"
              />

              <KpiCard
                label="Active Riders"
                value={activeAmbulances.length}
                sub="Currently operating"
                icon={Truck}
                accent="amber"
              />

              <KpiCard
                label="Driver Rating"
                value={averageDriverRating}
                sub="Network average"
                icon={Star}
                accent="purple"
              />

            </div>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

              <div className="p-6 border-b border-slate-800">

                <h2 className="text-lg font-black text-white">
                  Ambulance Fleet & Rider Intelligence
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Vehicle status, driver performance, response times and mission history
                </p>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full text-left min-w-[1000px]">

                  <thead className="bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-500">

                    <tr>
                      <th className="px-5 py-4">
                        Rider / Vehicle
                      </th>

                      <th className="px-5 py-4">
                        Unit Type
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Rating
                      </th>

                      <th className="px-5 py-4">
                        Operations
                      </th>

                      <th className="px-5 py-4">
                        Response
                      </th>

                      <th className="px-5 py-4">
                        On-Time
                      </th>

                      <th className="px-5 py-4">
                        Base
                      </th>
                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-800">

                    {driverPerformance.map(
                      (driver, index) => (
                        <tr
                          key={
                            driver.id ||
                            driver.vehicleNumber ||
                            index
                          }
                          className="hover:bg-slate-800/30 transition"
                        >

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                                <Truck className="h-5 w-5 text-sky-400" />
                              </div>

                              <div>

                                <p className="text-sm font-bold text-white">
                                  {driver.driverName ||
                                    'Unassigned Driver'}
                                </p>

                                <p className="text-[11px] text-slate-500">
                                  {driver.vehicleNumber ||
                                    'No vehicle assigned'}
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-4 text-xs text-slate-300">
                            {driver.type ||
                              'Emergency Ambulance'}
                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-black border ${
                                driver.status ===
                                'ONLINE'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                              }`}
                            >

                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  driver.status ===
                                  'ONLINE'
                                    ? 'bg-emerald-400'
                                    : 'bg-sky-400'
                                }`}
                              />

                              {driver.status}

                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-1 text-amber-400">

                              <Star className="h-3.5 w-3.5 fill-current" />

                              <span className="text-sm font-black">
                                {driver.rating}
                              </span>

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <p className="text-sm font-black text-white">
                              {
                                driver.completedMissions
                              }
                            </p>

                            <p className="text-[10px] text-slate-500">
                              missions
                            </p>

                          </td>

                          <td className="px-5 py-4 text-xs font-bold text-slate-300">
                            {driver.responseTime}
                          </td>

                          <td className="px-5 py-4">

                            <span className="text-xs font-bold text-emerald-400">
                              {driver.onTimeRate}%
                            </span>

                          </td>

                          <td className="px-5 py-4 text-xs text-slate-400">
                            {driver.hospitalBase ||
                              'Central Command'}
                          </td>

                        </tr>
                      )
                    )}

                    {driverPerformance.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-16 text-center"
                        >
                          <EmptyPanel
                            icon={Ambulance}
                            title="No ambulance units"
                            description="Fleet data will appear here when ambulances are registered."
                          />
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </section>

          </section>
        )}

        {/* ======================================================
            HOSPITALS
        ====================================================== */}

        {activeTab === 'hospitals' && (
          <section className="space-y-4">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              <KpiCard
                label="Hospitals"
                value={hospitals.length}
                sub="Connected facilities"
                icon={Building2}
                accent="emerald"
              />

              <KpiCard
                label="ER Capacity"
                value={totalErBeds}
                sub={`${totalErCapacity} total beds`}
                icon={Hospital}
                accent="amber"
              />

              <KpiCard
                label="ICU Available"
                value={totalIcuBeds}
                sub="Critical care beds"
                icon={HeartPulse}
                accent="rose"
              />

              <KpiCard
                label="Hospital Rating"
                value={averageHospitalRating}
                sub="Network average"
                icon={Star}
                accent="purple"
              />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

              {hospitalPerformance.map(
                (hospital, index) => (
                  <div
                    key={
                      hospital.id ||
                      hospital.name ||
                      index
                    }
                    className="rounded-3xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-3">

                        <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">

                          <Building2 className="h-5 w-5 text-emerald-400" />

                        </div>

                        <div>

                          <h3 className="text-sm font-black text-white">
                            {hospital.shortName ||
                              hospital.name ||
                              'Unknown Hospital'}
                          </h3>

                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {hospital.level ||
                              'Emergency Facility'}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-1 text-amber-400">

                        <Star className="h-3.5 w-3.5 fill-current" />

                        <span className="text-xs font-black">
                          {hospital.rating}
                        </span>

                      </div>

                    </div>

                    <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-400">

                      <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />

                      <span>
                        {hospital.address ||
                          'Address unavailable'}
                      </span>

                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-5">

                      <ResourceBox
                        label="ER"
                        value={
                          hospital.erBeds
                            ?.available || 0
                        }
                        sub={`/ ${
                          hospital.erBeds?.total ||
                          0
                        }`}
                        type="emerald"
                      />

                      <ResourceBox
                        label="ICU"
                        value={
                          hospital.icuBeds
                            ?.available || 0
                        }
                        sub={`/ ${
                          hospital.icuBeds?.total ||
                          0
                        }`}
                        type="rose"
                      />

                      <ResourceBox
                        label="Blood"
                        value={
                          hospital.bloodUnits || 0
                        }
                        sub="units"
                        type="amber"
                      />

                    </div>

                    <div className="mt-4">

                      <div className="flex justify-between text-[10px] mb-1.5">

                        <span className="text-slate-500">
                          Emergency Readiness
                        </span>

                        <span className="font-bold text-emerald-400">
                          {hospital.responseReadiness}%
                        </span>

                      </div>

                      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">

                        <div
                          style={{
                            width: `${Math.min(
                              hospital.responseReadiness,
                              100
                            )}%`,
                          }}
                          className="h-full rounded-full bg-emerald-400"
                        />

                      </div>

                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">

                      <span className="text-[10px] text-slate-500">
                        {
                          hospital.emergenciesHandled
                        }{' '}
                        emergencies handled
                      </span>

                      <span className="text-[10px] text-slate-400">
                        Handover{' '}
                        {hospital.avgHandover}
                      </span>

                    </div>

                  </div>
                )
              )}

            </div>

            {hospitalPerformance.length === 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900">
                <EmptyPanel
                  icon={Building2}
                  title="No connected hospitals"
                  description="Hospital network information will appear here."
                />
              </div>
            )}

          </section>
        )}

        {/* ======================================================
            RESOURCES
        ====================================================== */}

        {activeTab === 'resources' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* BLOOD */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

              <div className="p-5 border-b border-slate-800">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-black text-white">
                      Blood Reserve Matrix
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Live emergency blood availability
                    </p>

                  </div>

                  <Droplet className="h-5 w-5 text-rose-400" />

                </div>

              </div>

              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">

                {bloodInventory.map(
                  (blood, index) => {

                    const status =
                      blood?.status || 'READY';

                    return (
                      <div
                        key={
                          blood?.group ||
                          blood?.id ||
                          index
                        }
                        className={`rounded-2xl border p-4 ${
                          status === 'CRITICAL'
                            ? 'border-rose-500/30 bg-rose-500/5'
                            : status === 'LOW'
                            ? 'border-amber-500/20 bg-amber-500/5'
                            : 'border-slate-800 bg-slate-950'
                        }`}
                      >

                        <div className="flex items-center justify-between">

                          <span className="text-lg font-black text-white">
                            {blood?.group ||
                              'Unknown'}
                          </span>

                          <span
                            className={`h-2 w-2 rounded-full ${
                              status ===
                              'CRITICAL'
                                ? 'bg-rose-400'
                                : status ===
                                  'LOW'
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                          />

                        </div>

                        <p className="text-2xl font-black text-white mt-3">
                          {blood?.units || 0}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          Safe min{' '}
                          {blood?.safeMinimum || 0}
                        </p>

                        <p className="text-[9px] uppercase font-black mt-2 text-slate-500">
                          {status}
                        </p>

                      </div>
                    );
                  }
                )}

              </div>

              {bloodInventory.length === 0 && (
                <EmptyPanel
                  icon={Droplet}
                  title="No blood inventory"
                  description="Blood reserve data will appear here."
                />
              )}

            </div>

            {/* PHARMACY */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

              <div className="p-5 border-b border-slate-800">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-black text-white">
                      Emergency Pharmacy
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Critical medicine inventory
                    </p>

                  </div>

                  <Package className="h-5 w-5 text-teal-400" />

                </div>

              </div>

              <div className="p-5 space-y-3">

                {pharmacyInventory
                  .slice(0, 6)
                  .map((medicine, index) => {

                    const stock =
                      Number(
                        medicine?.stock || 0
                      );

                    const threshold =
                      Number(
                        medicine?.criticalThreshold ||
                          1
                      );

                    const percentage = Math.min(
                      (stock /
                        (threshold * 3)) *
                        100,
                      100
                    );

                    const low =
                      stock <= threshold;

                    return (
                      <div
                        key={
                          medicine?.id ||
                          medicine?.name ||
                          index
                        }
                      >

                        <div className="flex items-center justify-between gap-3">

                          <div className="min-w-0">

                            <p className="text-xs font-bold text-white truncate">
                              {medicine?.name ||
                                'Unknown Medicine'}
                            </p>

                            <p className="text-[10px] text-slate-500">
                              {stock}{' '}
                              {medicine?.unit ||
                                'units'}
                            </p>

                          </div>

                          <span
                            className={`text-[10px] font-black ${
                              low
                                ? 'text-rose-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {low
                              ? 'LOW'
                              : 'READY'}
                          </span>

                        </div>

                        <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">

                          <div
                            style={{
                              width: `${percentage}%`,
                            }}
                            className={`h-full rounded-full ${
                              low
                                ? 'bg-rose-400'
                                : 'bg-teal-400'
                            }`}
                          />

                        </div>

                      </div>
                    );
                  })}

                {pharmacyInventory.length === 0 && (
                  <EmptyPanel
                    icon={Package}
                    title="No pharmacy inventory"
                    description="Medicine stock data will appear here."
                  />
                )}

              </div>

            </div>

          </section>
        )}

        {/* ======================================================
            PERSONNEL
        ====================================================== */}

        {activeTab === 'users' && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

            <div className="p-6 border-b border-slate-800">

              <h2 className="text-lg font-black text-white">
                Personnel & Accounts
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                All registered ResQLink stakeholders
              </p>

            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

              {DEMO_USERS.map((user, index) => (

                <div
                  key={
                    user?.id ||
                    user?.email ||
                    index
                  }
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex items-center gap-3"
                >

                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={
                        user?.name ||
                        'User avatar'
                      }
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-700"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-400" />
                    </div>
                  )}

                  <div className="min-w-0">

                    <p className="text-sm font-bold text-white truncate">
                      {user?.name ||
                        'Unknown User'}
                    </p>

                    <p className="text-[11px] text-slate-500 truncate">
                      {user?.email ||
                        'No email available'}
                    </p>

                    <span className="inline-flex mt-1 text-[9px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded px-2 py-0.5">
                      {user?.role ||
                        'STAFF'}
                    </span>

                  </div>

                </div>

              ))}

            </div>

            {DEMO_USERS.length === 0 && (
              <EmptyPanel
                icon={Users}
                title="No personnel accounts"
                description="Registered stakeholders will appear here."
              />
            )}

          </section>
        )}

        {/* ======================================================
            AUDIT TRAIL
        ====================================================== */}

        {activeTab === 'audit' && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

            <div className="p-6 border-b border-slate-800">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-black text-white">
                    System Audit Trail
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Chronological operational activity
                  </p>

                </div>

                <FileText className="h-5 w-5 text-purple-400" />

              </div>

            </div>

            <div className="p-5 space-y-3">

              {auditLogs.map((log) => (

                <div
                  key={log.id}
                  className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4"
                >

                  <div className="h-9 w-9 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">

                    <Activity className="h-4 w-4 text-purple-400" />

                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">

                      <p className="text-xs font-black text-white">
                        {log.event}
                      </p>

                      <span className="text-[10px] text-slate-600">
                        {log.time}
                      </span>

                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      {log.details}
                    </p>

                    <p className="text-[10px] text-slate-600 mt-2">
                      Initiated by {log.user}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </section>
        )}

        {/* ======================================================
            EMERGENCY MODAL
        ====================================================== */}

        {selectedEmergency && (

          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() =>
              setSelectedEmergency(null)
            }
          >

            <div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950 shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="p-6 border-b border-slate-800 flex items-start justify-between">

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="text-lg font-black text-white">
                      {selectedEmergency.id ||
                        'Emergency Incident'}
                    </span>

                    <SeverityBadge
                      severity={
                        selectedEmergency.severity
                      }
                    />

                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    {selectedEmergency.categoryLabel ||
                      selectedEmergency.category ||
                      'Emergency Incident'}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelectedEmergency(null)
                  }
                  className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition"
                  aria-label="Close emergency details"
                >
                  <X className="h-4 w-4" />
                </button>

              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

                <DetailItem
                  label="Patient"
                  value={
                    selectedEmergency.patientName
                  }
                />

                <DetailItem
                  label="Blood Group"
                  value={
                    selectedEmergency.bloodGroup
                  }
                />

                <DetailItem
                  label="Ambulance"
                  value={
                    selectedEmergency.ambulanceNumber
                  }
                />

                <DetailItem
                  label="Driver"
                  value={
                    selectedEmergency.driverName
                  }
                />

                <DetailItem
                  label="Hospital"
                  value={
                    selectedEmergency.hospitalName
                  }
                />

                <DetailItem
                  label="ETA"
                  value={selectedEmergency.eta}
                />

                <div className="sm:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-4">

                  <p className="text-[10px] uppercase font-black text-slate-600">
                    Location
                  </p>

                  <p className="text-sm font-bold text-white mt-1">
                    {selectedEmergency.address ||
                      'Location unavailable'}
                  </p>

                </div>

                <div className="sm:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-4">

                  <p className="text-[10px] uppercase font-black text-slate-600">
                    Medical Notes
                  </p>

                  <p className="text-sm text-slate-300 mt-1">
                    {selectedEmergency.notes ||
                      'No medical notes available.'}
                  </p>

                </div>

              </div>

              <div className="px-6 pb-6">

                <button
                  onClick={() =>
                    setSelectedEmergency(null)
                  }
                  className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 text-xs font-black text-white transition"
                >
                  Close Inspection
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </DashboardLayout>
  );
}

/* =============================================================
   KPI CARD
============================================================= */

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}) {
  const accents = {
    rose:
      'text-rose-400 bg-rose-500/10 border-rose-500/20',

    sky:
      'text-sky-400 bg-sky-500/10 border-sky-500/20',

    emerald:
      'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',

    amber:
      'text-amber-400 bg-amber-500/10 border-amber-500/20',

    purple:
      'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 hover:border-slate-700 transition">

      <div className="flex items-center justify-between gap-2">

        <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">
          {label}
        </span>

        <div
          className={`h-8 w-8 shrink-0 rounded-lg border flex items-center justify-center ${
            accents[accent] ||
            accents.purple
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>

      </div>

      <p className="text-2xl font-black text-white mt-3">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 mt-1">
        {sub}
      </p>

    </div>
  );
}

/* =============================================================
   MINI METRIC
============================================================= */

function MiniMetric({
  label,
  value,
  icon: Icon,
  trend,
}) {
  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">

      <Icon className="h-4 w-4 text-purple-400" />

      <p className="text-xl font-black text-white mt-3">
        {value}
      </p>

      <p className="text-[10px] text-slate-500">
        {label}
      </p>

      <p className="text-[10px] text-emerald-400 mt-2 font-bold">
        {trend}
      </p>

    </div>
  );
}

/* =============================================================
   SYSTEM STATUS
============================================================= */

function SystemStatus({
  name,
  status,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">

      <div className="flex items-center gap-2.5 min-w-0">

        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30" />

        <span className="text-xs font-bold text-slate-300 truncate">
          {name}
        </span>

      </div>

      <div className="flex items-center gap-3 shrink-0">

        <span className="text-[10px] font-bold text-emerald-400">
          {status}
        </span>

        <span className="text-[10px] text-slate-600">
          {value}
        </span>

      </div>

    </div>
  );
}

/* =============================================================
   PERFORMANCE PANEL
============================================================= */

function PerformancePanel({
  title,
  subtitle,
  icon: Icon,
  children,
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

      <div className="p-5 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">

            <Icon className="h-5 w-5 text-purple-400" />

          </div>

          <div className="min-w-0">

            <h3 className="text-sm font-black text-white truncate">
              {title}
            </h3>

            <p className="text-[10px] text-slate-500 mt-1">
              {subtitle}
            </p>

          </div>

        </div>

      </div>

      <div className="divide-y divide-slate-800">
        {children}
      </div>

    </section>
  );
}

/* =============================================================
   DRIVER ROW
============================================================= */

function DriverRow({
  driver,
  rank,
}) {
  return (
    <div className="p-4 flex items-center gap-3 hover:bg-slate-800/30 transition">

      <div className="h-7 w-7 shrink-0 rounded-lg bg-slate-950 flex items-center justify-center text-[10px] font-black text-slate-500">
        #{rank}
      </div>

      <div className="h-9 w-9 shrink-0 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
        <Ambulance className="h-4 w-4 text-sky-400" />
      </div>

      <div className="flex-1 min-w-0">

        <p className="text-xs font-bold text-white truncate">
          {driver?.driverName ||
            'Unassigned Driver'}
        </p>

        <p className="text-[10px] text-slate-600 truncate">
          {driver?.vehicleNumber ||
            'No vehicle assigned'}
        </p>

      </div>

      <div className="text-right shrink-0">

        <div className="flex items-center justify-end gap-1 text-amber-400">

          <Star className="h-3 w-3 fill-current" />

          <span className="text-xs font-black">
            {driver?.rating || '—'}
          </span>

        </div>

        <p className="text-[9px] text-slate-600">
          {driver?.completedMissions || 0} ops
        </p>

      </div>

    </div>
  );
}

/* =============================================================
   HOSPITAL ROW
============================================================= */

function HospitalRow({
  hospital,
  rank,
}) {
  return (
    <div className="p-4 flex items-center gap-3 hover:bg-slate-800/30 transition">

      <div className="h-7 w-7 shrink-0 rounded-lg bg-slate-950 flex items-center justify-center text-[10px] font-black text-slate-500">
        #{rank}
      </div>

      <div className="h-9 w-9 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <Building2 className="h-4 w-4 text-emerald-400" />
      </div>

      <div className="flex-1 min-w-0">

        <p className="text-xs font-bold text-white truncate">
          {hospital?.shortName ||
            hospital?.name ||
            'Unknown Hospital'}
        </p>

        <p className="text-[10px] text-slate-600">
          {hospital?.emergenciesHandled || 0}{' '}
          emergencies handled
        </p>

      </div>

      <div className="text-right shrink-0">

        <div className="flex items-center justify-end gap-1 text-amber-400">

          <Star className="h-3 w-3 fill-current" />

          <span className="text-xs font-black">
            {hospital?.rating || '—'}
          </span>

        </div>

        <p className="text-[9px] text-emerald-400">
          {hospital?.responseReadiness || 0}% ready
        </p>

      </div>

    </div>
  );
}

/* =============================================================
   EMERGENCY TABLE
============================================================= */

function EmergencyTable({
  emergencies,
  onSelect,
  detailed = false,
}) {
  return (
    <div className="overflow-x-auto">

      <table className="w-full text-left min-w-[900px]">

        <thead className="bg-slate-950/50 text-[10px] uppercase font-black tracking-wider text-slate-600">

          <tr>

            <th className="px-5 py-4">
              Incident
            </th>

            <th className="px-5 py-4">
              Patient
            </th>

            <th className="px-5 py-4">
              Severity
            </th>

            <th className="px-5 py-4">
              Status
            </th>

            <th className="px-5 py-4">
              Ambulance
            </th>

            <th className="px-5 py-4">
              Hospital
            </th>

            <th className="px-5 py-4">
              ETA
            </th>

            {detailed && (
              <th className="px-5 py-4">
                Action
              </th>
            )}

          </tr>

        </thead>

        <tbody className="divide-y divide-slate-800">

          {emergencies.map(
            (emergency, index) => (

              <tr
                key={
                  emergency?.id ||
                  `emergency-${index}`
                }
                onClick={() =>
                  onSelect?.(emergency)
                }
                className="hover:bg-slate-800/30 transition cursor-pointer"
              >

                <td className="px-5 py-4">

                  <p className="text-xs font-black text-white">
                    {emergency?.id ||
                      'Unknown Incident'}
                  </p>

                  <p className="text-[10px] text-slate-600 mt-1">
                    {emergency?.category ||
                      'Emergency'}
                  </p>

                </td>

                <td className="px-5 py-4">

                  <p className="text-xs font-bold text-white">
                    {emergency?.patientName ||
                      'Unknown Patient'}
                  </p>

                  <p className="text-[10px] text-slate-500">
                    {emergency?.bloodGroup ||
                      'Blood group N/A'}
                  </p>

                </td>

                <td className="px-5 py-4">

                  <SeverityBadge
                    severity={
                      emergency?.severity
                    }
                  />

                </td>

                <td className="px-5 py-4">

                  <StatusBadge
                    status={
                      emergency?.status ||
                      'UNKNOWN'
                    }
                    size="sm"
                  />

                </td>

                <td className="px-5 py-4">

                  <p className="text-xs font-bold text-slate-200">
                    {emergency?.ambulanceNumber ||
                      'Unassigned'}
                  </p>

                  <p className="text-[10px] text-slate-600">
                    {emergency?.driverName ||
                      'Pending'}
                  </p>

                </td>

                <td className="px-5 py-4">

                  <p className="text-xs text-slate-300 max-w-[180px] truncate">
                    {emergency?.hospitalName ||
                      'Awaiting assignment'}
                  </p>

                </td>

                <td className="px-5 py-4">

                  <span className="text-xs font-black text-sky-400">
                    {emergency?.eta || '--'}
                  </span>

                </td>

                {detailed && (
                  <td
                    className="px-5 py-4"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >

                    <button
                      onClick={() =>
                        onSelect?.(emergency)
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition"
                    >
                      Inspect
                    </button>

                  </td>
                )}

              </tr>
            )
          )}

          {emergencies.length === 0 && (

            <tr>

              <td
                colSpan={
                  detailed ? 8 : 7
                }
                className="py-14 text-center"
              >

                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />

                <p className="text-sm font-bold text-white mt-3">
                  No emergency records
                </p>

                <p className="text-xs text-slate-600 mt-1">
                  ResQLink network is clear.
                </p>

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

/* =============================================================
   SEVERITY BADGE
============================================================= */

function SeverityBadge({
  severity,
}) {
  const styles = {
    CRITICAL:
      'bg-rose-500/10 text-rose-400 border-rose-500/20',

    HIGH:
      'bg-orange-500/10 text-orange-400 border-orange-500/20',

    MEDIUM:
      'bg-amber-500/10 text-amber-400 border-amber-500/20',

    LOW:
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  const normalizedSeverity =
    String(
      severity || 'MEDIUM'
    ).toUpperCase();

  return (
    <span
      className={`inline-flex rounded-lg border px-2 py-1 text-[9px] font-black ${
        styles[normalizedSeverity] ||
        styles.MEDIUM
      }`}
    >
      {normalizedSeverity}
    </span>
  );
}

/* =============================================================
   STATUS PILL
============================================================= */

function StatusPill({
  label,
  value,
  type,
}) {
  const critical =
    type === 'critical';

  return (
    <div
      className={`rounded-xl px-3 py-2 border ${
        critical
          ? 'bg-rose-500/10 border-rose-500/20'
          : 'bg-sky-500/10 border-sky-500/20'
      }`}
    >

      <span className="text-[9px] uppercase font-black text-slate-500">
        {label}
      </span>

      <p
        className={`text-sm font-black ${
          critical
            ? 'text-rose-400'
            : 'text-sky-400'
        }`}
      >
        {value}
      </p>

    </div>
  );
}

/* =============================================================
   RESOURCE BOX
============================================================= */

function ResourceBox({
  label,
  value,
  sub,
  type,
}) {
  const styles = {
    emerald:
      'text-emerald-400 bg-emerald-500/5',

    rose:
      'text-rose-400 bg-rose-500/5',

    amber:
      'text-amber-400 bg-amber-500/5',
  };

  return (
    <div
      className={`rounded-xl p-3 ${
        styles[type] ||
        styles.emerald
      }`}
    >

      <p className="text-[9px] uppercase font-black text-slate-600">
        {label}
      </p>

      <p className="text-lg font-black mt-1">
        {value}

        <span className="text-[10px] text-slate-600 ml-0.5">
          {sub}
        </span>
      </p>

    </div>
  );
}

/* =============================================================
   DETAIL ITEM
============================================================= */

function DetailItem({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">

      <p className="text-[9px] uppercase font-black text-slate-600">
        {label}
      </p>

      <p className="text-sm font-bold text-white mt-1 truncate">
        {value || '--'}
      </p>

    </div>
  );
}

/* =============================================================
   EMPTY PANEL
============================================================= */

function EmptyPanel({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="p-8 text-center">

      <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">

        <Icon className="h-5 w-5 text-slate-600" />

      </div>

      <p className="text-sm font-bold text-white mt-3">
        {title}
      </p>

      <p className="text-xs text-slate-600 mt-1">
        {description}
      </p>

    </div>
  );
}