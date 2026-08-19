import React, { useEffect, useState } from 'react';
import {
  Activity,
  Ambulance,
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  Command,
  Droplet,
  HeartPulse,
  Layers,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PhoneCall,
  Pill,
  Radio,
  Search,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { ROLES, ROLE_CONFIG } from '../../utils/constants';

// IMPORTANT:
// DashboardLayout.jsx is inside:
// src/components/common/
// favicon is inside:
// src/assets/favicon.png

import favicon from '../../assets/favicon.png';


export function DashboardLayout({ children }) {
  const {
    currentUser,
    role,
    logout,
    switchRole,
  } = useAuth();

  const {
    emergencies = [],
    notifications = [],
  } = useEmergency();

  const navigate = useNavigate();
  const location = useLocation();

  // ------------------------------------------------------------
  // UI STATE
  // ------------------------------------------------------------

  const [mobileDrawerOpen, setMobileDrawerOpen] =
    useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [roleMenuOpen, setRoleMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  // ------------------------------------------------------------
  // DATA
  // ------------------------------------------------------------

  const unreadNotifs = notifications.filter(
    (notification) => !notification.read
  ).length;

  const currentRoleConfig =
    ROLE_CONFIG[role] ||
    ROLE_CONFIG[ROLES.PATIENT];

  const activeEmergencies = emergencies.filter(
    (emergency) =>
      emergency.status !== 'resolved' &&
      emergency.status !== 'cancelled'
  );

  const hasEmergency =
    activeEmergencies.length > 0;

  // ------------------------------------------------------------
  // ROLE NAVIGATION
  // ------------------------------------------------------------

  const roleNavItems = {
    [ROLES.PATIENT]: [
      {
        id: 'dashboard',
        label: 'Overview',
        icon: HeartPulse,
      },
      {
        id: 'emergency',
        label: 'Active Emergency',
        icon: ShieldAlert,
        emergency: true,
      },
      {
        id: 'requests',
        label: 'Blood & Rx Requests',
        icon: Droplet,
      },
      {
        id: 'contacts',
        label: 'Emergency Contacts',
        icon: PhoneCall,
      },
      {
        id: 'medical',
        label: 'Medical Information',
        icon: Activity,
      },
      {
        id: 'profile',
        label: 'Profile',
        icon: User,
      },
    ],

    [ROLES.DRIVER]: [
      {
        id: 'dashboard',
        label: 'Operations',
        icon: Ambulance,
      },
      {
        id: 'requests',
        label: 'Emergency Requests',
        icon: ShieldAlert,
        emergency: true,
      },
      {
        id: 'navigation',
        label: 'Navigation',
        icon: Activity,
      },
      {
        id: 'history',
        label: 'Trip History',
        icon: Layers,
      },
      {
        id: 'availability',
        label: 'Duty Status',
        icon: Radio,
      },
      {
        id: 'profile',
        label: 'Driver Profile',
        icon: User,
      },
    ],

    [ROLES.CONTROL_ROOM]: [
      {
        id: 'dashboard',
        label: 'Command Center',
        icon: Radio,
      },
      {
        id: 'emergencies',
        label: 'Incidents',
        icon: ShieldAlert,
        emergency: true,
      },
      {
        id: 'ambulances',
        label: 'Ambulance Fleet',
        icon: Ambulance,
      },
      {
        id: 'hospitals',
        label: 'Hospital Network',
        icon: Building2,
      },
      {
        id: 'alerts',
        label: 'Broadcast Alerts',
        icon: Bell,
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: Activity,
      },
    ],

    [ROLES.HOSPITAL]: [
      {
        id: 'dashboard',
        label: 'Operations',
        icon: Building2,
      },
      {
        id: 'emergencies',
        label: 'Incoming Emergencies',
        icon: Ambulance,
        emergency: true,
      },
      {
        id: 'patients',
        label: 'Triage',
        icon: HeartPulse,
      },
      {
        id: 'beds',
        label: 'Beds & Capacity',
        icon: Activity,
      },
      {
        id: 'blood',
        label: 'Blood Requests',
        icon: Droplet,
      },
      {
        id: 'pharmacy',
        label: 'Pharmacy',
        icon: Pill,
      },
    ],

    [ROLES.BLOOD_BANK]: [
      {
        id: 'dashboard',
        label: 'Overview',
        icon: Droplet,
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: Activity,
      },
      {
        id: 'requests',
        label: 'Hospital Requests',
        icon: Building2,
      },
      {
        id: 'reservations',
        label: 'Reservations',
        icon: ShieldAlert,
        emergency: true,
      },
      {
        id: 'donors',
        label: 'Donors',
        icon: User,
      },
    ],

    [ROLES.PHARMACY]: [
      {
        id: 'dashboard',
        label: 'Operations',
        icon: Pill,
      },
      {
        id: 'inventory',
        label: 'Drug Inventory',
        icon: Activity,
      },
      {
        id: 'requests',
        label: 'Prescriptions',
        icon: Building2,
      },
      {
        id: 'orders',
        label: 'Paramedic Orders',
        icon: Ambulance,
      },
      {
        id: 'hospitals',
        label: 'Hospital Network',
        icon: Layers,
      },
    ],
  };

  const navItems =
    roleNavItems[role] ||
    roleNavItems[ROLES.PATIENT];

  // ------------------------------------------------------------
  // ROLE ICON
  // ------------------------------------------------------------

  const getRoleIcon = () => {
    switch (role) {
      case ROLES.PATIENT:
        return HeartPulse;

      case ROLES.DRIVER:
        return Ambulance;

      case ROLES.CONTROL_ROOM:
        return Radio;

      case ROLES.HOSPITAL:
        return Building2;

      case ROLES.BLOOD_BANK:
        return Droplet;

      case ROLES.PHARMACY:
        return Pill;

      default:
        return User;
    }
  };

  const RoleIcon = getRoleIcon();

  // ------------------------------------------------------------
  // ACTIVE TAB
  // ------------------------------------------------------------

  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/notifications')) return 'notifications';
    
    if (role === ROLES.PATIENT) {
      if (path.includes('/patient/dashboard')) return 'dashboard';
      if (path.includes('/patient/emergency')) return 'emergency';
      if (path.includes('/patient/requests')) return 'requests';
      if (path.includes('/patient/emergency-contacts')) return 'contacts';
      if (path.includes('/patient/medical-records')) return 'medical';
      if (path.includes('/patient/profile')) return 'profile';
      if (path.includes('/patient/settings')) return 'settings';
    } else if (role === ROLES.DRIVER) {
      if (path.includes('/driver/dashboard')) return 'dashboard';
      if (path.includes('/driver/emergencies')) return 'requests';
      if (path.includes('/driver/navigation')) return 'navigation';
      if (path.includes('/driver/history')) return 'history';
      if (path.includes('/driver/availability')) return 'availability';
      if (path.includes('/driver/profile')) return 'profile';
    } else if (role === ROLES.CONTROL_ROOM) {
      if (path.includes('/control-room/dashboard')) return 'dashboard';
      if (path.includes('/control-room/emergencies')) return 'emergencies';
      if (path.includes('/control-room/ambulances')) return 'ambulances';
      if (path.includes('/control-room/dispatch')) return 'hospitals';
      if (path.includes('/control-room/notifications')) return 'alerts';
      if (path.includes('/control-room/analytics')) return 'analytics';
    }
    return 'dashboard';
  };

  const activeTab = getActiveTabFromPath();

  // ------------------------------------------------------------
  // SCROLL
  // ------------------------------------------------------------

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, []);

  // ------------------------------------------------------------
  // CLOSE MENUS ON ESC
  // ------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setRoleMenuOpen(false);
        setMobileDrawerOpen(false);
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, []);

  // ------------------------------------------------------------
  // ACTIONS
  // ------------------------------------------------------------

  const handleNavigation = (id) => {
    setMobileDrawerOpen(false);

    if (id === 'notifications') {
      navigate('/notifications');
      return;
    }

    if (role === ROLES.PATIENT) {
      if (id === 'dashboard') navigate('/patient/dashboard');
      else if (id === 'emergency') navigate('/patient/emergency');
      else if (id === 'requests') navigate('/patient/requests');
      else if (id === 'contacts') navigate('/patient/emergency-contacts');
      else if (id === 'medical') navigate('/patient/medical-records');
      else if (id === 'profile') navigate('/patient/profile');
      else if (id === 'settings') navigate('/patient/settings');
    } else if (role === ROLES.DRIVER) {
      if (id === 'dashboard') navigate('/driver/dashboard');
      else if (id === 'requests') navigate('/driver/emergencies');
      else if (id === 'navigation') navigate('/driver/navigation');
      else if (id === 'history') navigate('/driver/history');
      else if (id === 'availability') navigate('/driver/availability');
      else if (id === 'profile') navigate('/driver/profile');
    } else if (role === ROLES.CONTROL_ROOM) {
      if (id === 'dashboard') navigate('/control-room/dashboard');
      else if (id === 'emergencies') navigate('/control-room/emergencies');
      else if (id === 'ambulances') navigate('/control-room/ambulances');
      else if (id === 'hospitals') navigate('/control-room/dispatch');
      else if (id === 'alerts') navigate('/control-room/notifications');
      else if (id === 'analytics') navigate('/control-room/analytics');
    }
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const handleRoleSelect = (newRoleKey) => {
    const targetPath =
      switchRole(newRoleKey);

    setRoleMenuOpen(false);
    setMobileDrawerOpen(false);

    navigate(targetPath);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEmergencyStatusClick = () => {
    const emergencyItem =
      navItems.find(
        (item) =>
          item.emergency
      );

    if (emergencyItem) {
      handleNavigation(
        emergencyItem.id
      );
    }
  };

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------

  return (
    <div
      className="
        min-h-screen
        bg-[#05070a]
        text-slate-100
        selection:bg-red-500/30
        selection:text-white
      "
    >

      {/* ========================================================
          AMBIENT BACKGROUND
      ======================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-32
            -top-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-red-500/[0.035]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            -bottom-40
            right-0
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-500/[0.025]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
          "
          style={{
            backgroundImage:
              `
              linear-gradient(
                rgba(255,255,255,.5) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.5) 1px,
                transparent 1px
              )
              `,
            backgroundSize:
              '40px 40px',
          }}
        />
      </div>


      {/* ========================================================
          TOP BAR
      ======================================================== */}

      <header
        className={`
          fixed
          left-0
          right-0
          top-0
          z-50
          h-[68px]
          border-b
          transition-all
          duration-300

          ${
            scrolled
              ? `
                border-white/[0.09]
                bg-[#05070a]/90
                shadow-[0_10px_40px_rgba(0,0,0,0.25)]
                backdrop-blur-2xl
              `
              : `
                border-white/[0.055]
                bg-[#05070a]/75
                backdrop-blur-xl
              `
          }
        `}
      >

        <div
          className="
            flex
            h-full
            items-center
            justify-between
            px-4
            sm:px-6
            xl:px-8
          "
        >

          {/* ====================================================
              BRAND
          ==================================================== */}

          <div className="flex items-center gap-3">

            {/* Mobile Menu */}
            <button
              onClick={() =>
                setMobileDrawerOpen(
                  !mobileDrawerOpen
                )
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                text-slate-400
                transition-all
                hover:border-white/[0.14]
                hover:bg-white/[0.07]
                hover:text-white
                lg:hidden
              "
              aria-label="Open navigation"
            >
              {mobileDrawerOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>


            {/* Logo */}
            <Link
              to="/dashboard"
              className="
                group
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-white/[0.12]
                  bg-white/[0.055]
                  shadow-[0_0_25px_rgba(255,255,255,0.04)]
                  transition-all
                  duration-300
                  group-hover:border-red-500/30
                  group-hover:bg-red-500/[0.08]
                "
              >
                <img
                  src={favicon}
                  alt="ResQLink"
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

                <span
                  className="
                    absolute
                    bottom-0.5
                    right-0.5
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_8px_rgba(52,211,153,0.9)]
                  "
                />
              </div>


              <div className="hidden sm:block">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      text-[17px]
                      font-black
                      tracking-[-0.045em]
                      text-white
                    "
                  >
                    ResQ
                    <span className="text-red-500">
                      Link
                    </span>
                  </span>

                  <span
                    className="
                      rounded-full
                      border
                      border-emerald-400/20
                      bg-emerald-400/[0.06]
                      px-1.5
                      py-0.5
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-emerald-400
                    "
                  >
                    LIVE
                  </span>
                </div>

                <p
                  className="
                    mt-0.5
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.17em]
                    text-slate-600
                  "
                >
                  Emergency Response Network
                </p>

              </div>
            </Link>


            {/* Divider */}

            <div
              className="
                hidden
                h-7
                w-px
                bg-white/[0.08]
                lg:block
              "
            />


            {/* Workspace */}

            <div
              className="
                hidden
                items-center
                gap-2.5
                lg:flex
              "
            >

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/[0.06]
                  bg-white/[0.035]
                "
              >
                <RoleIcon
                  className="
                    h-4
                    w-4
                    text-slate-300
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    text-slate-200
                  "
                >
                  {currentRoleConfig.name}
                </p>

                <p
                  className="
                    text-[8px]
                    text-slate-600
                  "
                >
                  {currentRoleConfig.subtitle}
                </p>
              </div>

            </div>

          </div>


          {/* ====================================================
              CENTER STATUS
          ==================================================== */}

          <div
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              xl:block
            "
          >

            {hasEmergency ? (

              <button
                onClick={
                  handleEmergencyStatusClick
                }
                className="
                  group
                  flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-red-500/20
                  bg-red-500/[0.055]
                  px-4
                  py-2
                  shadow-[0_0_25px_rgba(239,68,68,0.05)]
                  transition-all
                  hover:border-red-500/35
                  hover:bg-red-500/[0.09]
                "
              >

                <span
                  className="
                    relative
                    flex
                    h-2
                    w-2
                  "
                >
                  <span
                    className="
                      absolute
                      inset-0
                      animate-ping
                      rounded-full
                      bg-red-500
                      opacity-60
                    "
                  />

                  <span
                    className="
                      relative
                      h-2
                      w-2
                      rounded-full
                      bg-red-500
                    "
                  />
                </span>

                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-red-300
                  "
                >
                  {activeEmergencies.length}
                  {' '}
                  Active
                  {' '}
                  {activeEmergencies.length === 1
                    ? 'Incident'
                    : 'Incidents'}
                </span>

                <ChevronRight
                  className="
                    h-3
                    w-3
                    text-red-500/60
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                />

              </button>

            ) : (

              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-emerald-400/10
                  bg-emerald-400/[0.025]
                  px-4
                  py-2
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_8px_rgba(52,211,153,0.7)]
                  "
                />

                <span
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-slate-500
                  "
                >
                  All Systems Operational
                </span>

              </div>

            )}

          </div>


          {/* ====================================================
              RIGHT ACTIONS
          ==================================================== */}

          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >

            {/* Search */}

            <button
              onClick={() =>
                setSearchOpen(!searchOpen)
              }
              className="
                hidden
                h-9
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                px-3
                text-slate-500
                transition-all
                hover:border-white/[0.13]
                hover:bg-white/[0.05]
                hover:text-slate-300
                md:flex
              "
              title="Search"
            >

              <Search
                className="h-3.5 w-3.5"
              />

              <span
                className="
                  text-[9px]
                  font-medium
                "
              >
                Search
              </span>

              <kbd
                className="
                  ml-1
                  rounded-md
                  border
                  border-white/[0.08]
                  bg-white/[0.02]
                  px-1.5
                  py-0.5
                  text-[7px]
                  text-slate-600
                "
              >
                ⌘K
              </kbd>

            </button>


            {/* Notification */}

            <button
              onClick={
                handleNotificationClick
              }
              className={`
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                transition-all
                duration-200

                ${
                  activeTab === 'notifications'
                    ? `
                      border-red-500/25
                      bg-red-500/[0.08]
                      text-red-300
                    `
                    : `
                      border-white/[0.07]
                      bg-white/[0.025]
                      text-slate-400
                      hover:border-white/[0.13]
                      hover:bg-white/[0.06]
                      hover:text-white
                    `
                }
              `}
              aria-label="Notification Center"
              title="Notification Center"
            >

              <Bell
                className="h-4 w-4"
                strokeWidth={1.8}
              />

              {unreadNotifs > 0 && (
                <>
                  <span
                    className="
                      absolute
                      right-1
                      top-1
                      h-1.5
                      w-1.5
                      animate-pulse
                      rounded-full
                      bg-red-500
                    "
                  />

                  <span
                    className="
                      absolute
                      right-0.5
                      top-0.5
                      h-2.5
                      w-2.5
                      rounded-full
                      ring-2
                      ring-[#05070a]
                    "
                  />
                </>
              )}

            </button>


            {/* User */}

            <div
              className="
                relative
                ml-1
                border-l
                border-white/[0.07]
                pl-2
              "
            >

              <button
                onClick={() =>
                  setRoleMenuOpen(
                    !roleMenuOpen
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  px-1.5
                  py-1
                  transition-all
                  hover:bg-white/[0.04]
                "
              >

                {currentUser?.avatar ? (

                  <img
                    src={currentUser.avatar}
                    alt={
                      currentUser?.name ||
                      'User'
                    }
                    className="
                      h-8
                      w-8
                      rounded-xl
                      object-cover
                      ring-1
                      ring-white/[0.1]
                    "
                  />

                ) : (

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-white/[0.045]
                    "
                  >
                    <User
                      className="
                        h-3.5
                        w-3.5
                        text-slate-400
                      "
                    />
                  </div>

                )}

                <div
                  className="
                    hidden
                    text-left
                    lg:block
                  "
                >
                  <p
                    className="
                      max-w-[105px]
                      truncate
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    {currentUser?.name ||
                      'User'}
                  </p>

                  <p
                    className="
                      max-w-[105px]
                      truncate
                      text-[8px]
                      text-slate-600
                    "
                  >
                    {currentRoleConfig.name}
                  </p>
                </div>

                <ChevronDown
                  className="
                    hidden
                    h-3
                    w-3
                    text-slate-600
                    lg:block
                  "
                />

              </button>


              {/* User / Workspace Menu */}

              {roleMenuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-[80]
                    w-[230px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.09]
                    bg-[#0a0e14]/95
                    shadow-[0_20px_70px_rgba(0,0,0,0.55)]
                    backdrop-blur-2xl
                  "
                >

                  <div
                    className="
                      border-b
                      border-white/[0.06]
                      p-3
                    "
                  >

                    <p
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-slate-600
                      "
                    >
                      Signed in as
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-xs
                        font-bold
                        text-white
                      "
                    >
                      {currentUser?.name ||
                        'User'}
                    </p>

                  </div>


                  <div className="p-2">

                    <p
                      className="
                        px-2
                        py-1.5
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.14em]
                        text-slate-700
                      "
                    >
                      Switch Workspace
                    </p>

                    {Object.values(ROLES).map(
                      (roleKey) => {

                        const cfg =
                          ROLE_CONFIG[
                            roleKey
                          ];

                        const isCurrent =
                          role === roleKey;

                        return (
                          <button
                            key={roleKey}
                            onClick={() =>
                              handleRoleSelect(
                                roleKey
                              )
                            }
                            className={`
                              flex
                              w-full
                              items-center
                              justify-between
                              rounded-xl
                              px-2.5
                              py-2
                              text-left
                              transition-all

                              ${
                                isCurrent
                                  ? `
                                    bg-white/[0.06]
                                    text-white
                                  `
                                  : `
                                    text-slate-500
                                    hover:bg-white/[0.035]
                                    hover:text-slate-200
                                  `
                              }
                            `}
                          >

                            <span
                              className="
                                text-[9px]
                                font-semibold
                              "
                            >
                              {cfg.name}
                            </span>

                            {isCurrent && (
                              <span
                                className="
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  bg-emerald-400
                                  shadow-[0_0_8px_rgba(52,211,153,.7)]
                                "
                              />
                            )}

                          </button>
                        );
                      }
                    )}

                  </div>


                  <div
                    className="
                      border-t
                      border-white/[0.06]
                      p-2
                    "
                  >

                    <button
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2.5
                        rounded-xl
                        px-2.5
                        py-2
                        text-red-400
                        transition-all
                        hover:bg-red-500/[0.07]
                      "
                    >

                      <LogOut
                        className="
                          h-3.5
                          w-3.5
                        "
                      />

                      <span
                        className="
                          text-[9px]
                          font-semibold
                        "
                      >
                        Sign out
                      </span>

                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>


        {/* Search Overlay */}

        {searchOpen && (
          <div
            className="
              absolute
              left-1/2
              top-[68px]
              w-[min(560px,calc(100%-32px))]
              -translate-x-1/2
            "
          >

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.09]
                bg-[#090d13]/95
                p-3
                shadow-[0_20px_70px_rgba(0,0,0,0.5)]
                backdrop-blur-2xl
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-3
                  py-2.5
                "
              >

                <Search
                  className="
                    h-4
                    w-4
                    text-slate-600
                  "
                />

                <input
                  autoFocus
                  placeholder="
                    Search ResQLink...
                  "
                  className="
                    flex-1
                    bg-transparent
                    text-xs
                    text-white
                    outline-none
                    placeholder:text-slate-700
                  "
                />

                <kbd
                  className="
                    rounded-md
                    border
                    border-white/[0.08]
                    px-1.5
                    py-1
                    text-[8px]
                    text-slate-600
                  "
                >
                  ESC
                </kbd>

              </div>

            </div>

          </div>
        )}

      </header>


      {/* ========================================================
          APP BODY
      ======================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          pt-[68px]
        "
      >


        {/* ======================================================
            DESKTOP SIDEBAR
        ====================================================== */}

        <aside
          className={`
            fixed
            bottom-0
            left-0
            top-[68px]
            z-40
            hidden
            flex-col
            border-r
            border-white/[0.06]
            bg-[#070a0e]/95
            backdrop-blur-xl
            transition-all
            duration-300
            lg:flex

            ${
              sidebarCollapsed
                ? 'w-[76px]'
                : 'w-[258px]'
            }
          `}
        >

          {/* Sidebar Header */}

          <div
            className={`
              flex
              h-[68px]
              items-center
              border-b
              border-white/[0.055]

              ${
                sidebarCollapsed
                  ? 'justify-center'
                  : 'justify-between px-4'
              }
            `}
          >

            {!sidebarCollapsed && (
              <div>

                <p
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-700
                  "
                >
                  Workspace
                </p>

                <p
                  className="
                    mt-1
                    text-[11px]
                    font-bold
                    text-slate-300
                  "
                >
                  {currentRoleConfig.title}
                </p>

              </div>
            )}

            <button
              onClick={() =>
                setSidebarCollapsed(
                  !sidebarCollapsed
                )
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.06]
                text-slate-600
                transition-all
                hover:border-white/[0.12]
                hover:bg-white/[0.05]
                hover:text-slate-300
              "
              title={
                sidebarCollapsed
                  ? 'Expand sidebar'
                  : 'Collapse sidebar'
              }
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen
                  className="h-4 w-4"
                />
              ) : (
                <PanelLeftClose
                  className="h-4 w-4"
                />
              )}
            </button>

          </div>


          {/* Navigation */}

          <nav
            className="
              flex-1
              overflow-y-auto
              px-2.5
              py-5
            "
          >

            {!sidebarCollapsed && (
              <p
                className="
                  mb-3
                  px-3
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.17em]
                  text-slate-700
                "
              >
                Main Navigation
              </p>
            )}


            <div className="space-y-1">

              {navItems.map(
                (item) => {

                  const Icon =
                    item.icon;

                  const isSelected =
                    activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        handleNavigation(
                          item.id
                        )
                      }
                      title={
                        sidebarCollapsed
                          ? item.label
                          : undefined
                      }
                      className={`
                        group
                        relative
                        flex
                        w-full
                        items-center
                        rounded-xl
                        transition-all
                        duration-200

                        ${
                          sidebarCollapsed
                            ? `
                              justify-center
                              px-0
                              py-3
                            `
                            : `
                              gap-3
                              px-3
                              py-2.5
                            `
                        }

                        ${
                          isSelected
                            ? `
                              bg-white/[0.065]
                              text-white
                              shadow-[inset_0_0_20px_rgba(255,255,255,0.015)]
                            `
                            : `
                              text-slate-600
                              hover:bg-white/[0.035]
                              hover:text-slate-200
                            `
                        }
                      `}
                    >

                      {/* Active bar */}

                      {isSelected && (
                        <span
                          className="
                            absolute
                            left-0
                            top-1/2
                            h-5
                            w-[2px]
                            -translate-y-1/2
                            rounded-r-full
                            bg-red-500
                            shadow-[0_0_10px_rgba(239,68,68,.7)]
                          "
                        />
                      )}


                      <div
                        className={`
                          flex
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition-all

                          ${
                            sidebarCollapsed
                              ? 'h-8 w-8'
                              : 'h-7 w-7'
                          }

                          ${
                            isSelected
                              ? `
                                bg-red-500/[0.09]
                                text-red-400
                              `
                              : `
                                bg-white/[0.025]
                                text-slate-600
                                group-hover:text-slate-300
                              `
                          }
                        `}
                      >

                        <Icon
                          className="
                            h-[15px]
                            w-[15px]
                          "
                          strokeWidth={
                            isSelected
                              ? 2.1
                              : 1.8
                          }
                        />

                      </div>


                      {!sidebarCollapsed && (
                        <>

                          <span
                            className="
                              flex-1
                              text-left
                              text-[10px]
                              font-semibold
                            "
                          >
                            {item.label}
                          </span>


                          {item.emergency &&
                            hasEmergency && (
                              <span
                                className="
                                  h-1.5
                                  w-1.5
                                  animate-pulse
                                  rounded-full
                                  bg-red-500
                                  shadow-[0_0_7px_rgba(239,68,68,.7)]
                                "
                              />
                            )}


                          {isSelected && (
                            <ChevronRight
                              className="
                                h-3
                                w-3
                                text-slate-700
                              "
                            />
                          )}

                        </>
                      )}

                    </button>
                  );
                }
              )}


              {/* Notifications */}

              <button
                onClick={() =>
                  handleNotificationClick()
                }
                title={
                  sidebarCollapsed
                    ? 'Notification Center'
                    : undefined
                }
                className={`
                  group
                  relative
                  flex
                  w-full
                  items-center
                  rounded-xl
                  transition-all

                  ${
                    sidebarCollapsed
                      ? `
                        justify-center
                        px-0
                        py-3
                      `
                      : `
                        gap-3
                        px-3
                        py-2.5
                      `
                  }

                  ${
                    activeTab ===
                    'notifications'
                      ? `
                        bg-white/[0.065]
                        text-white
                      `
                      : `
                        text-slate-600
                        hover:bg-white/[0.035]
                        hover:text-slate-200
                      `
                  }
                `}
              >

                {activeTab ===
                  'notifications' && (
                  <span
                    className="
                      absolute
                      left-0
                      top-1/2
                      h-5
                      w-[2px]
                      -translate-y-1/2
                      rounded-r-full
                      bg-red-500
                      shadow-[0_0_10px_rgba(239,68,68,.7)]
                    "
                  />
                )}

                <div
                  className={`
                    relative
                    flex
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg

                    ${
                      sidebarCollapsed
                        ? 'h-8 w-8'
                        : 'h-7 w-7'
                    }

                    ${
                      activeTab ===
                      'notifications'
                        ? `
                          bg-red-500/[0.09]
                          text-red-400
                        `
                        : `
                          bg-white/[0.025]
                          text-slate-600
                        `
                    }
                  `}
                >

                  <Bell
                    className="
                      h-[15px]
                      w-[15px]
                    "
                  />

                  {unreadNotifs > 0 && (
                    <span
                      className="
                        absolute
                        -right-0.5
                        -top-0.5
                        h-2
                        w-2
                        rounded-full
                        bg-red-500
                        ring-2
                        ring-[#070a0e]
                      "
                    />
                  )}

                </div>


                {!sidebarCollapsed && (
                  <>

                    <span
                      className="
                        flex-1
                        text-left
                        text-[10px]
                        font-semibold
                      "
                    >
                      Notifications
                    </span>

                    {unreadNotifs > 0 && (
                      <span
                        className="
                          rounded-full
                          bg-red-500/10
                          px-1.5
                          py-0.5
                          text-[7px]
                          font-bold
                          text-red-400
                        "
                      >
                        {unreadNotifs}
                      </span>
                    )}

                  </>
                )}

              </button>

            </div>


            {/* Divider */}

            <div
              className="
                my-5
                h-px
                bg-white/[0.045]
              "
            />


            {/* System */}

            {!sidebarCollapsed && (
              <p
                className="
                  mb-3
                  px-3
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.17em]
                  text-slate-700
                "
              >
                System
              </p>
            )}

            <div className="space-y-1">

              <div
                className={`
                  flex
                  items-center
                  rounded-xl
                  border
                  border-emerald-400/[0.08]
                  bg-emerald-400/[0.025]

                  ${
                    sidebarCollapsed
                      ? `
                        justify-center
                        p-2.5
                      `
                      : `
                        gap-3
                        px-3
                        py-2.5
                      `
                  }
                `}
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_8px_rgba(52,211,153,.7)]
                  "
                />

                {!sidebarCollapsed && (
                  <div>

                    <p
                      className="
                        text-[9px]
                        font-bold
                        text-emerald-300
                      "
                    >
                      Network Online
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[7px]
                        text-slate-700
                      "
                    >
                      All services operational
                    </p>

                  </div>
                )}

              </div>

            </div>

          </nav>


          {/* Sidebar Bottom */}

          <div
            className="
              border-t
              border-white/[0.055]
              p-2.5
            "
          >

            {!sidebarCollapsed ? (

              <div
                className="
                  rounded-2xl
                  border
                  border-red-500/[0.11]
                  bg-red-500/[0.025]
                  p-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-xl
                      bg-red-500/[0.08]
                    "
                  >
                    <PhoneCall
                      className="
                        h-4
                        w-4
                        text-red-400
                      "
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-600
                      "
                    >
                      Emergency
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[12px]
                        font-black
                        text-white
                      "
                    >
                      108
                      <span
                        className="
                          mx-1
                          text-slate-700
                        "
                      >
                        /
                      </span>
                      911
                    </p>
                  </div>

                </div>


                <a
                  href="tel:108"
                  className="
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-red-500/[0.14]
                    bg-red-500/[0.045]
                    py-2
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-red-400
                    transition-all
                    hover:bg-red-500/[0.09]
                  "
                >
                  <PhoneCall
                    className="h-3 w-3"
                  />

                  Call Emergency
                </a>

              </div>

            ) : (

              <a
                href="tel:108"
                title="Emergency hotline"
                className="
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-500/[0.06]
                  text-red-400
                  transition-all
                  hover:bg-red-500/[0.11]
                "
              >
                <PhoneCall
                  className="h-4 w-4"
                />
              </a>

            )}

          </div>

        </aside>


        {/* ======================================================
            MOBILE DRAWER
        ====================================================== */}

        {mobileDrawerOpen && (
          <div
            className="
              fixed
              inset-0
              z-[70]
              lg:hidden
            "
          >

            {/* Backdrop */}

            <button
              onClick={() =>
                setMobileDrawerOpen(false)
              }
              className="
                absolute
                inset-0
                bg-black/75
                backdrop-blur-sm
              "
              aria-label="Close navigation"
            />


            {/* Drawer */}

            <aside
              className="
                relative
                flex
                h-full
                w-[300px]
                flex-col
                border-r
                border-white/[0.08]
                bg-[#080b10]
                shadow-[30px_0_80px_rgba(0,0,0,.55)]
              "
            >

              {/* Drawer Header */}

              <div
                className="
                  flex
                  h-[68px]
                  items-center
                  justify-between
                  border-b
                  border-white/[0.06]
                  px-4
                "
              >

                <Link
                  to="/dashboard"
                  onClick={() =>
                    setMobileDrawerOpen(
                      false
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >

                  <img
                    src={favicon}
                    alt="ResQLink"
                    className="
                      h-8
                      w-8
                      rounded-xl
                      object-cover
                    "
                  />

                  <span
                    className="
                      text-sm
                      font-black
                      text-white
                    "
                  >
                    ResQ
                    <span className="text-red-500">
                      Link
                    </span>
                  </span>

                </Link>


                <button
                  onClick={() =>
                    setMobileDrawerOpen(
                      false
                    )
                  }
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-xl
                    text-slate-500
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  <X
                    className="h-4 w-4"
                  />
                </button>

              </div>


              {/* Role */}

              <div
                className="
                  border-b
                  border-white/[0.05]
                  p-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.07]
                      bg-white/[0.04]
                    "
                  >
                    <RoleIcon
                      className="
                        h-4
                        w-4
                        text-slate-300
                      "
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[11px]
                        font-bold
                        text-white
                      "
                    >
                      {currentRoleConfig.name}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[8px]
                        text-slate-600
                      "
                    >
                      {currentRoleConfig.subtitle}
                    </p>
                  </div>

                </div>

              </div>


              {/* Mobile Nav */}

              <nav
                className="
                  flex-1
                  overflow-y-auto
                  px-3
                  py-5
                "
              >

                <p
                  className="
                    mb-3
                    px-2
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.17em]
                    text-slate-700
                  "
                >
                  Navigation
                </p>


                <div className="space-y-1">

                  {navItems.map(
                    (item) => {

                      const Icon =
                        item.icon;

                      const isSelected =
                        activeTab ===
                        item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() =>
                            handleNavigation(
                              item.id
                            )
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-left
                            transition-all

                            ${
                              isSelected
                                ? `
                                  bg-white/[0.065]
                                  text-white
                                `
                                : `
                                  text-slate-500
                                  hover:bg-white/[0.035]
                                  hover:text-slate-200
                                `
                            }
                          `}
                        >

                          <Icon
                            className={`
                              h-4
                              w-4

                              ${
                                isSelected
                                  ? 'text-red-400'
                                  : 'text-slate-600'
                              }
                            `}
                          />

                          <span
                            className="
                              flex-1
                              text-[10px]
                              font-semibold
                            "
                          >
                            {item.label}
                          </span>

                          {item.emergency &&
                            hasEmergency && (
                              <span
                                className="
                                  h-1.5
                                  w-1.5
                                  animate-pulse
                                  rounded-full
                                  bg-red-500
                                "
                              />
                            )}

                        </button>
                      );
                    }
                  )}


                  {/* Notifications */}

                  <button
                    onClick={
                      handleNotificationClick
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-left
                      transition-all

                      ${
                        activeTab ===
                        'notifications'
                          ? `
                            bg-white/[0.065]
                            text-white
                          `
                          : `
                            text-slate-500
                            hover:bg-white/[0.035]
                            hover:text-slate-200
                          `
                      }
                    `}
                  >

                    <Bell
                      className={`
                        h-4
                        w-4

                        ${
                          activeTab ===
                          'notifications'
                            ? 'text-red-400'
                            : 'text-slate-600'
                        }
                      `}
                    />

                    <span
                      className="
                        flex-1
                        text-[10px]
                        font-semibold
                      "
                    >
                      Notifications
                    </span>

                    {unreadNotifs > 0 && (
                      <span
                        className="
                          rounded-full
                          bg-red-500/10
                          px-1.5
                          py-0.5
                          text-[7px]
                          font-bold
                          text-red-400
                        "
                      >
                        {unreadNotifs}
                      </span>
                    )}

                  </button>

                </div>


                {/* Workspace Switcher */}

                <div
                  className="
                    mt-8
                    border-t
                    border-white/[0.05]
                    pt-6
                  "
                >

                  <p
                    className="
                      mb-3
                      px-2
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[0.17em]
                      text-slate-700
                    "
                  >
                    Switch Workspace
                  </p>

                  <div className="space-y-1">

                    {Object.values(
                      ROLES
                    ).map(
                      (roleKey) => {

                        const cfg =
                          ROLE_CONFIG[
                            roleKey
                          ];

                        const isCurrent =
                          role === roleKey;

                        return (
                          <button
                            key={roleKey}
                            onClick={() =>
                              handleRoleSelect(
                                roleKey
                              )
                            }
                            className={`
                              flex
                              w-full
                              items-center
                              justify-between
                              rounded-xl
                              px-3
                              py-2.5
                              text-left
                              transition-all

                              ${
                                isCurrent
                                  ? `
                                    bg-white/[0.055]
                                    text-white
                                  `
                                  : `
                                    text-slate-600
                                    hover:bg-white/[0.035]
                                    hover:text-slate-300
                                  `
                              }
                            `}
                          >

                            <span
                              className="
                                text-[9px]
                                font-semibold
                              "
                            >
                              {cfg.name}
                            </span>

                            {isCurrent && (
                              <span
                                className="
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  bg-emerald-400
                                "
                              />
                            )}

                          </button>
                        );
                      }
                    )}

                  </div>

                </div>

              </nav>


              {/* Mobile Logout */}

              <div
                className="
                  border-t
                  border-white/[0.055]
                  p-3
                "
              >

                <button
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-red-400
                    transition-all
                    hover:bg-red-500/[0.06]
                  "
                >

                  <LogOut
                    className="h-4 w-4"
                  />

                  <span
                    className="
                      text-[10px]
                      font-bold
                    "
                  >
                    Sign out
                  </span>

                </button>

              </div>

            </aside>

          </div>
        )}


        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <main
          className={`
            min-w-0
            flex-1
            transition-all
            duration-300

            ${
              sidebarCollapsed
                ? 'lg:pl-[76px]'
                : 'lg:pl-[258px]'
            }
          `}
        >

          <div
            className="
              mx-auto
              min-h-[calc(100vh-68px)]
              w-full
              max-w-[1800px]
              px-4
              py-5
              sm:px-6
              sm:py-6
              xl:px-8
              2xl:px-10
            "
          >

            {/* Page top meta */}

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >

              <div>
                <p
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-700
                  "
                >
                  ResQLink
                  {' '}
                  /
                  {' '}
                  {currentRoleConfig.name}
                </p>
              </div>

              <div
                className="
                  hidden
                  items-center
                  gap-2
                  sm:flex
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                  "
                />

                <span
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-600
                  "
                >
                  Secure session
                </span>

              </div>

            </div>


            {/* Actual Page */}

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}