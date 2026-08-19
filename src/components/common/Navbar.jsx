import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Bell,
  Volume2,
  VolumeX,
  Radio,
  User,
  LogOut,
  AlertCircle,
  ChevronDown,
  LayoutDashboard,
  Home,
  ShieldCheck,
  X,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { ROLE_LABELS, EMERGENCY_STATUS } from '../../utils/constants';

export function Navbar({
  onOpenNotifications,
  onTriggerSOSModal,
  currentView,
  setView,
}) {
  const { currentUser, role, logout } = useAuth();
  const { emergencies, soundEnabled, setSoundEnabled } = useEmergency();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef(null);

  const activeEmergencies = emergencies.filter(
    (e) =>
      e.status !== EMERGENCY_STATUS.RESOLVED &&
      e.status !== EMERGENCY_STATUS.CANCELLED
  );

  const hasActiveEmergency = activeEmergencies.length > 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const goTo = (view) => {
    setView(view);
    setUserMenuOpen(false);
  };

  return (
    <header
      className={`
        sticky top-0 z-50 w-full
        transition-all duration-300
        ${
          scrolled
            ? 'bg-[#070b12]/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.25)]'
            : 'bg-[#070b12]/80 backdrop-blur-xl border-b border-white/[0.05]'
        }
      `}
    >
      <div className="h-[72px] w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto h-full max-w-[1500px] flex items-center justify-between">

          {/* =========================================================
              BRAND
          ========================================================= */}
          <button
            onClick={() => goTo('dashboard')}
            className="group flex items-center gap-3 min-w-0"
          >
            {/* Minimal Logo */}
            <div
              className="
                relative
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-[13px]
                bg-white
                text-[#070b12]
                shadow-[0_0_0_1px_rgba(255,255,255,0.15)]
                transition-all duration-200
                group-hover:scale-[1.03]
                group-hover:shadow-[0_0_25px_rgba(255,255,255,0.12)]
              "
            >
              <Activity className="h-[21px] w-[21px] stroke-[2.5]" />

              {/* Tiny live indicator */}
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#070b12] bg-emerald-400" />
            </div>

            {/* Brand typography */}
            <div className="hidden xs:block min-w-0 text-left">
              <div className="flex items-baseline gap-2">
                <span className="text-[17px] sm:text-[18px] font-bold tracking-[-0.03em] text-white">
                  ResQ<span className="text-red-500">Link</span>
                </span>

                <span className="hidden xl:inline text-[9px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                  Emergency Network
                </span>
              </div>

              <p className="hidden sm:block text-[10px] font-medium tracking-wide text-slate-500">
                Unified Emergency Response
              </p>
            </div>
          </button>

          {/* =========================================================
              CENTER STATUS
          ========================================================= */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            {hasActiveEmergency ? (
              <button
                onClick={() => goTo('dashboard')}
                className="
                  group
                  flex items-center gap-3
                  rounded-full
                  border border-red-500/20
                  bg-red-500/[0.07]
                  px-4 py-2
                  transition-all duration-200
                  hover:border-red-500/35
                  hover:bg-red-500/[0.11]
                "
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>

                <span className="text-[11px] font-semibold tracking-wide text-red-300">
                  {activeEmergencies.length}{' '}
                  {activeEmergencies.length === 1
                    ? 'active incident'
                    : 'active incidents'}
                </span>

                <span className="h-3 w-px bg-red-500/20" />

                <span className="text-[10px] font-medium text-red-400/70 group-hover:text-red-300">
                  View
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.025] px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                  Network Operational
                </span>
              </div>
            )}
          </div>

          {/* =========================================================
              ACTIONS
          ========================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Desktop network status */}
            <div className="hidden xl:flex items-center gap-2 mr-2 pr-3 border-r border-white/[0.07]">
              <Radio className="h-3.5 w-3.5 text-slate-500" />

              <span className="text-[10px] font-medium text-slate-500">
                Live
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
            </div>

            {/* =====================================================
                SOS BUTTON
            ===================================================== */}
            <button
              onClick={onTriggerSOSModal}
              className="
                group
                relative
                flex items-center gap-2
                rounded-xl
                bg-red-600
                px-3 sm:px-3.5
                py-2
                text-white
                shadow-[0_5px_20px_rgba(220,38,38,0.18)]
                transition-all duration-200
                hover:bg-red-500
                hover:shadow-[0_7px_25px_rgba(220,38,38,0.28)]
                active:scale-[0.97]
              "
            >
              <AlertCircle className="h-4 w-4 stroke-[2.2]" />

              <span className="hidden sm:inline text-[11px] font-bold tracking-[0.08em]">
                SOS
              </span>

              <span className="sm:hidden text-[11px] font-bold">
                SOS
              </span>
            </button>

            {/* =====================================================
                SOUND
            ===================================================== */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label={
                soundEnabled ? 'Mute alert audio' : 'Unmute alert audio'
              }
              className="
                hidden sm:flex
                h-9 w-9
                items-center justify-center
                rounded-xl
                border border-white/[0.07]
                bg-white/[0.025]
                text-slate-400
                transition-all duration-200
                hover:border-white/[0.12]
                hover:bg-white/[0.05]
                hover:text-white
              "
              title={soundEnabled ? 'Mute alerts' : 'Unmute alerts'}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
            </button>

            {/* =====================================================
                NOTIFICATIONS
            ===================================================== */}
            <button
              onClick={onOpenNotifications}
              aria-label="Notifications"
              className="
                relative
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                border border-white/[0.07]
                bg-white/[0.025]
                text-slate-400
                transition-all duration-200
                hover:border-white/[0.12]
                hover:bg-white/[0.05]
                hover:text-white
              "
              title="Notifications"
            >
              <Bell className="h-4 w-4" />

              {hasActiveEmergency && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-[#070b12]" />
              )}
            </button>

            {/* =====================================================
                USER
            ===================================================== */}
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="
                  group
                  flex items-center gap-2
                  rounded-xl
                  border border-white/[0.07]
                  bg-white/[0.025]
                  p-1
                  pr-2 sm:pr-2.5
                  transition-all duration-200
                  hover:border-white/[0.12]
                  hover:bg-white/[0.05]
                "
              >
                {/* Avatar */}
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name || 'User'}
                    className="
                      h-7 w-7
                      rounded-lg
                      object-cover
                      ring-1 ring-white/[0.08]
                    "
                  />
                ) : (
                  <div
                    className="
                      flex h-7 w-7
                      items-center justify-center
                      rounded-lg
                      bg-white/[0.07]
                      text-slate-300
                    "
                  >
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}

                {/* User information */}
                <div className="hidden md:block text-left">
                  <p className="max-w-[110px] truncate text-[11px] font-semibold text-white">
                    {currentUser?.name || 'User'}
                  </p>

                  <p className="max-w-[110px] truncate text-[9px] font-medium text-slate-500">
                    {ROLE_LABELS[role] || role}
                  </p>
                </div>

                <ChevronDown
                  className={`
                    hidden md:block
                    h-3.5 w-3.5
                    text-slate-600
                    transition-transform duration-200
                    ${userMenuOpen ? 'rotate-180' : ''}
                  `}
                />
              </button>

              {/* ===================================================
                  USER DROPDOWN
              =================================================== */}
              {userMenuOpen && (
                <div
                  className="
                    absolute right-0 top-[calc(100%+10px)]
                    w-[270px]
                    overflow-hidden
                    rounded-2xl
                    border border-white/[0.09]
                    bg-[#0b1018]/95
                    backdrop-blur-2xl
                    shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                    animate-in
                    fade-in
                    slide-in-from-top-2
                    duration-150
                  "
                >
                  {/* User header */}
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      {currentUser?.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name || 'User'}
                          className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.07]">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {currentUser?.name || 'User'}
                        </p>

                        <p className="truncate text-[10px] text-slate-500">
                          {currentUser?.email || 'No email'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />

                      <span className="text-[10px] font-semibold text-emerald-400">
                        {ROLE_LABELS[role] || role}
                      </span>

                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  <div className="h-px bg-white/[0.06]" />

                  {/* Navigation */}
                  <div className="p-2">
                    <button
                      onClick={() => goTo('landing')}
                      className="
                        group
                        flex w-full items-center gap-3
                        rounded-xl
                        px-3 py-2.5
                        text-left
                        transition-colors
                        hover:bg-white/[0.05]
                      "
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                        <Home className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-slate-300 group-hover:text-white">
                          Emergency Portal
                        </p>

                        <p className="text-[9px] text-slate-600">
                          Return to ResQLink home
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => goTo('dashboard')}
                      className="
                        group
                        flex w-full items-center gap-3
                        rounded-xl
                        px-3 py-2.5
                        text-left
                        transition-colors
                        hover:bg-white/[0.05]
                      "
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                        <LayoutDashboard className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-slate-300 group-hover:text-white">
                          My Dashboard
                        </p>

                        <p className="text-[9px] text-slate-600">
                          Open your operational workspace
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="h-px bg-white/[0.06]" />

                  {/* Logout */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        setView('landing');
                      }}
                      className="
                        group
                        flex w-full items-center gap-3
                        rounded-xl
                        px-3 py-2.5
                        text-left
                        transition-colors
                        hover:bg-red-500/[0.07]
                      "
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/[0.06]">
                        <LogOut className="h-3.5 w-3.5 text-red-400" />
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-red-400">
                          Sign out
                        </p>

                        <p className="text-[9px] text-slate-600">
                          End this session
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =============================================================
          MOBILE ACTIVE INCIDENT BAR
      ============================================================= */}
      {hasActiveEmergency && (
        <div className="border-t border-red-500/[0.08] bg-red-500/[0.025] lg:hidden">
          <button
            onClick={() => goTo('dashboard')}
            className="flex h-9 w-full items-center justify-center gap-2"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>

            <span className="text-[9px] font-bold tracking-[0.12em] text-red-400 uppercase">
              {activeEmergencies.length}{' '}
              {activeEmergencies.length === 1
                ? 'Active Incident'
                : 'Active Incidents'}
            </span>

            <span className="text-[9px] font-medium text-red-500/50">
              · View dashboard
            </span>
          </button>
        </div>
      )}
    </header>
  );
}