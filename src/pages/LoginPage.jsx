import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ShieldAlert,
  HeartPulse,
  Ambulance,
  Radio,
  Building2,
  Droplet,
  Pill,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Activity,
  Eye,
  EyeOff,
  Zap,
  Wifi,
  Navigation,
  Clock3,
  ShieldCheck,
  Server,
  Signal,
  MapPin,
  CircleDot,
  KeyRound,
  UserRound,
  Route,
  BellRing,
  Fingerprint,
  Settings,
  Users,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_CONFIG } from '../utils/constants';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();

  const [selectedRole, setSelectedRole] = useState(ROLES.PATIENT);

  const [email, setEmail] = useState(
    ROLE_CONFIG?.[ROLES.PATIENT]?.demoEmail || ''
  );

  const [password, setPassword] = useState('password123');

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);
  const [error, setError] = useState('');

  const [networkPulse, setNetworkPulse] = useState(98.7);
  const [onlineTime, setOnlineTime] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | LIVE NETWORK TELEMETRY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineTime((value) => value + 1);

      setNetworkPulse((value) => {
        const next = value + (Math.random() - 0.5) * 0.15;

        return Math.min(
          99.9,
          Math.max(97.8, next)
        );
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | ROLE OPTIONS
  |--------------------------------------------------------------------------
  */

  const roleOptions = useMemo(
    () => [
      {
        id: ROLES.PATIENT,
        name: 'Patient',
        short: 'PATIENT',
        desc: 'Personal emergency access',
        icon: HeartPulse,
        iconClass: 'text-red-400',
        bgClass: 'bg-red-500/10',
        borderClass: 'border-red-500/25',
        glowClass: 'shadow-red-500/10',
      },

      {
        id: ROLES.DRIVER,
        name: 'Ambulance Driver',
        short: 'DRIVER',
        desc: 'Pickup & live navigation',
        icon: Ambulance,
        iconClass: 'text-sky-400',
        bgClass: 'bg-sky-500/10',
        borderClass: 'border-sky-500/25',
        glowClass: 'shadow-sky-500/10',
      },

      {
        id: ROLES.CONTROL_ROOM,
        name: 'Control Room',
        short: 'CONTROL',
        desc: 'Emergency coordination',
        icon: Radio,
        iconClass: 'text-violet-400',
        bgClass: 'bg-violet-500/10',
        borderClass: 'border-violet-500/25',
        glowClass: 'shadow-violet-500/10',
      },

      {
        id: ROLES.HOSPITAL,
        name: 'Hospital',
        short: 'HOSPITAL',
        desc: 'Emergency care coordination',
        icon: Building2,
        iconClass: 'text-emerald-400',
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/25',
        glowClass: 'shadow-emerald-500/10',
      },

      {
        id: ROLES.BLOOD_BANK,
        name: 'Blood Bank',
        short: 'BLOOD BANK',
        desc: 'Blood inventory & requests',
        icon: Droplet,
        iconClass: 'text-rose-400',
        bgClass: 'bg-rose-500/10',
        borderClass: 'border-rose-500/25',
        glowClass: 'shadow-rose-500/10',
      },

      {
        id: ROLES.PHARMACY,
        name: 'Pharmacy',
        short: 'PHARMACY',
        desc: 'Emergency medicine support',
        icon: Pill,
        iconClass: 'text-cyan-400',
        bgClass: 'bg-cyan-500/10',
        borderClass: 'border-cyan-500/25',
        glowClass: 'shadow-cyan-500/10',
      },

      {
        id: ROLES.ADMIN,
        name: 'Administrator',
        short: 'ADMIN',
        desc: 'System-wide platform control',
        icon: Settings,
        iconClass: 'text-amber-400',
        bgClass: 'bg-amber-500/10',
        borderClass: 'border-amber-500/25',
        glowClass: 'shadow-amber-500/10',
      },
    ],
    []
  );

  const selectedRoleData =
    roleOptions.find(
      (role) => role.id === selectedRole
    ) || roleOptions[0];

  /*
  |--------------------------------------------------------------------------
  | ROLE CHANGE
  |--------------------------------------------------------------------------
  */

  const handleRoleChange = (roleKey) => {
    setSelectedRole(roleKey);

    const config = ROLE_CONFIG?.[roleKey];

    setEmail(config?.demoEmail || '');

    setPassword('password123');
    setError('');
  };

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const result = await login(
        email,
        password,
        selectedRole
      );

      if (result?.success) {
        navigate(result.redirectPath);
      } else {
        setError(
          'Authentication failed. Please verify your credentials.'
        );
      }
    } catch (err) {
      console.error('Login error:', err);

      setError(
        'Authentication failed. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DEMO LOGIN
  |--------------------------------------------------------------------------
  */

  const handleUseDemo = async (roleKey) => {
    if (activeDemo) return;

    setActiveDemo(roleKey);
    setError('');

    try {
      const result = await loginAsDemo(roleKey);

      if (result?.success && result?.redirectPath) {
        navigate(result.redirectPath);
      } else {
        throw new Error('Demo login failed');
      }
    } catch (err) {
      console.error('Demo login error:', err);

      setError(
        'Unable to launch the demo account.'
      );

      setActiveDemo(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UPTIME
  |--------------------------------------------------------------------------
  */

  const formatUptime = () => {
    const hours = String(
      Math.floor(onlineTime / 3600)
    ).padStart(2, '0');

    const minutes = String(
      Math.floor((onlineTime % 3600) / 60)
    ).padStart(2, '0');

    const seconds = String(
      onlineTime % 60
    ).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-hidden relative">

      {/* ============================================================
          BACKGROUND
      ============================================================ */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div
          className="
            absolute
            -top-[350px]
            -right-[250px]
            w-[800px]
            h-[800px]
            rounded-full
            bg-red-600/[0.10]
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            -bottom-[400px]
            -left-[300px]
            w-[850px]
            h-[850px]
            rounded-full
            bg-sky-600/[0.08]
            blur-[170px]
          "
        />

        <div
          className="
            absolute
            top-[35%]
            left-[45%]
            w-[500px]
            h-[500px]
            rounded-full
            bg-violet-600/[0.035]
            blur-[140px]
          "
        />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,.8) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.8) 1px,
                transparent 1px
              )
            `,
            backgroundSize: '46px 46px',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

      </div>

      {/* ============================================================
          HEADER
      ============================================================ */}

      <header
        className="
          relative
          z-30
          border-b
          border-white/[0.07]
          bg-slate-950/65
          backdrop-blur-2xl
        "
      >
        <div
          className="
            max-w-[1550px]
            mx-auto
            px-5
            sm:px-8
            xl:px-12
            h-[82px]
            flex
            items-center
            justify-between
          "
        >

          <Link
            to="/"
            className="group flex items-center gap-3.5"
          >

            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: -2,
              }}
              className="
                relative
                h-12
                w-12
                rounded-2xl
                bg-gradient-to-br
                from-red-500
                via-red-600
                to-rose-700
                flex
                items-center
                justify-center
                shadow-[0_15px_45px_rgba(239,68,68,.28)]
              "
            >
              <div
                className="
                  absolute
                  inset-[1px]
                  rounded-[15px]
                  bg-gradient-to-br
                  from-white/15
                  to-transparent
                "
              />

              <ShieldAlert
                className="relative h-6 w-6 text-white"
              />
            </motion.div>

            <div>

              <div
                className="
                  text-[24px]
                  sm:text-[26px]
                  leading-none
                  font-black
                  tracking-[-0.05em]
                  text-white
                "
              >
                ResQ
                <span className="text-red-500">
                  Link
                </span>
              </div>

              <div
                className="
                  mt-1.5
                  text-[9px]
                  font-black
                  tracking-[0.25em]
                  text-slate-400
                "
              >
                EMERGENCY RESPONSE NETWORK
              </div>

            </div>

          </Link>

          <div className="hidden md:flex items-center gap-6">

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-xs font-black text-emerald-400">
                NETWORK ONLINE
              </span>
            </div>

            <div className="h-5 w-px bg-white/10" />

            <Link
              to="/"
              className="
                group
                flex
                items-center
                gap-2
                text-sm
                font-bold
                text-slate-400
                hover:text-white
                transition-colors
              "
            >
              Return to Launch Page

              <ArrowRight
                className="
                  h-4
                  w-4
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </Link>

          </div>

        </div>
      </header>

      {/* ============================================================
          MAIN
      ============================================================ */}

      <main
        className="
          relative
          z-10
          max-w-[1550px]
          mx-auto
          px-5
          sm:px-8
          xl:px-12
          py-10
          lg:py-14
        "
      >

        <div
          className="
            grid
            lg:grid-cols-[0.9fr_1.1fr]
            xl:grid-cols-[0.95fr_1.05fr]
            gap-10
            xl:gap-16
            items-center
            min-h-[calc(100vh-170px)]
          "
        >

          {/* ========================================================
              LEFT SIDE
          ======================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.75,
              ease: 'easeOut',
            }}
            className="max-w-2xl"
          >

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-red-500/20
                bg-red-500/[0.05]
                px-4
                py-2
              "
            >
              <CircleDot className="h-3.5 w-3.5 text-red-400 animate-pulse" />

              <span
                className="
                  text-[10px]
                  font-black
                  tracking-[0.18em]
                  text-red-300
                "
              >
                UNIFIED EMERGENCY NETWORK
              </span>
            </div>

            <h1
              className="
                mt-7
                text-[46px]
                sm:text-[56px]
                xl:text-[68px]
                font-black
                leading-[0.96]
                tracking-[-0.06em]
                text-white
              "
            >
              One platform.

              <br />

              <span className="text-red-500">
                One life.
              </span>

              <br />

              <span className="text-slate-300">
                One tap.
              </span>
            </h1>

            <p
              className="
                mt-7
                max-w-xl
                text-base
                sm:text-lg
                leading-8
                font-medium
                text-slate-300
              "
            >
              ResQLink connects patients, ambulance drivers,
              hospitals, control rooms, blood banks,
              pharmacies and administrators through one
              intelligent emergency response platform.
            </p>

            <div
              className="
                mt-6
                flex
                flex-wrap
                items-center
                gap-x-6
                gap-y-3
              "
            >

              <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Secure access
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <Navigation className="h-4 w-4 text-sky-400" />
                Live routing
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <BellRing className="h-4 w-4 text-red-400" />
                Instant alerts
              </div>

            </div>

            {/* TELEMETRY */}

            <div
              className="
                mt-9
                rounded-[28px]
                border
                border-white/[0.09]
                bg-white/[0.025]
                backdrop-blur-xl
                overflow-hidden
                shadow-2xl
              "
            >

              <div
                className="
                  px-6
                  py-5
                  border-b
                  border-white/[0.07]
                  flex
                  items-center
                  justify-between
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      h-10
                      w-10
                      rounded-xl
                      bg-emerald-500/10
                      border
                      border-emerald-500/20
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Activity className="h-5 w-5 text-emerald-400" />
                  </div>

                  <div>

                    <p className="text-sm font-black tracking-wider text-white">
                      LIVE NETWORK TELEMETRY
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Real-time emergency service health
                    </p>

                  </div>

                </div>

                <span
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-black
                    text-emerald-400
                  "
                >
                  <CircleDot className="h-4 w-4" />
                  LIVE
                </span>

              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-4
                  divide-x
                  divide-white/[0.06]
                "
              >

                {[
                  {
                    label: 'NETWORK',
                    value: `${networkPulse.toFixed(1)}%`,
                    icon: Server,
                  },
                  {
                    label: 'SERVICES',
                    value: '07 / 07',
                    icon: Signal,
                  },
                  {
                    label: 'SECURITY',
                    value: 'ACTIVE',
                    icon: ShieldCheck,
                  },
                  {
                    label: 'SESSION',
                    value: formatUptime(),
                    icon: Clock3,
                  },
                ].map((item, index) => {

                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.label}
                      animate={{
                        opacity: [0.75, 1, 0.75],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                      className="p-5"
                    >

                      <Icon className="h-4 w-4 text-slate-500 mb-4" />

                      <p className="text-[10px] font-black tracking-wider text-slate-500">
                        {item.label}
                      </p>

                      <p className="mt-1.5 text-sm font-black text-white">
                        {item.value}
                      </p>

                    </motion.div>
                  );

                })}

              </div>

              <div
                className="
                  px-6
                  py-4
                  border-t
                  border-white/[0.06]
                  bg-emerald-500/[0.025]
                  flex
                  items-center
                  justify-between
                "
              >

                <div className="flex items-center gap-2.5">

                  <Wifi className="h-4 w-4 text-emerald-400" />

                  <span
                    className="
                      text-[10px]
                      font-black
                      tracking-wider
                      text-slate-400
                    "
                  >
                    ENCRYPTED RESPONSE CHANNEL
                  </span>

                </div>

                <span className="text-[10px] font-black text-emerald-400">
                  STABLE
                </span>

              </div>

            </div>

            {/* CAPABILITIES */}

            <div className="mt-5 grid grid-cols-3 gap-3">

              {[
                {
                  icon: Route,
                  title: 'LIVE ROUTING',
                  color: 'text-sky-400',
                },
                {
                  icon: MapPin,
                  title: 'LOCATION',
                  color: 'text-emerald-400',
                },
                {
                  icon: Zap,
                  title: 'INSTANT ALERTS',
                  color: 'text-red-400',
                },
              ].map((item) => {

                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="
                      rounded-2xl
                      border
                      border-white/[0.07]
                      bg-white/[0.02]
                      px-4
                      py-4
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <Icon
                      className={`h-5 w-5 ${item.color}`}
                    />

                    <span
                      className="
                        text-[9px]
                        sm:text-[10px]
                        font-black
                        tracking-wider
                        text-slate-400
                      "
                    >
                      {item.title}
                    </span>

                  </div>
                );

              })}

            </div>

          </motion.section>

          {/* ========================================================
              RIGHT SIDE AUTH
          ======================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              x: 40,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.75,
              delay: 0.1,
              ease: 'easeOut',
            }}
          >

            <div className="relative">

              <div
                className="
                  absolute
                  -inset-2
                  rounded-[36px]
                  bg-gradient-to-r
                  from-red-600/20
                  via-rose-500/[0.05]
                  to-sky-600/10
                  blur-2xl
                "
              />

              <div
                className="
                  relative
                  rounded-[32px]
                  border
                  border-white/[0.10]
                  bg-[#090f1d]/95
                  backdrop-blur-2xl
                  shadow-[0_35px_120px_rgba(0,0,0,.55)]
                  overflow-hidden
                "
              >

                <div
                  className="
                    h-[3px]
                    bg-gradient-to-r
                    from-red-600
                    via-rose-500
                    to-transparent
                  "
                />

                <div className="p-6 sm:p-8 xl:p-9">

                  {/* CARD HEADER */}

                  <div className="flex items-start justify-between">

                    <div>

                      <div
                        className="
                          inline-flex
                          items-center
                          gap-2
                          text-[10px]
                          font-black
                          tracking-[0.18em]
                          text-red-400
                        "
                      >

                        <Fingerprint className="h-4 w-4" />

                        SECURE ACCESS

                      </div>

                      <h2
                        className="
                          mt-4
                          text-3xl
                          sm:text-4xl
                          font-black
                          tracking-[-0.045em]
                          text-white
                        "
                      >
                        Welcome back.
                      </h2>

                      <p
                        className="
                          mt-2
                          text-sm
                          sm:text-base
                          font-medium
                          text-slate-400
                        "
                      >
                        Sign in to your ResQLink network.
                      </p>

                    </div>

                    <div
                      className="
                        hidden
                        sm:flex
                        h-12
                        w-12
                        rounded-2xl
                        border
                        border-emerald-500/20
                        bg-emerald-500/5
                        items-center
                        justify-center
                      "
                    >
                      <ShieldCheck className="h-6 w-6 text-emerald-400" />
                    </div>

                  </div>

                  {/* ROLE SELECTOR */}

                  <div className="mt-8">

                    <div className="flex items-center justify-between mb-3">

                      <label
                        className="
                          text-[10px]
                          font-black
                          tracking-[0.16em]
                          text-slate-300
                        "
                      >
                        SELECT YOUR ACCESS
                      </label>

                      <span className="text-[9px] font-bold text-slate-500">
                        7 NETWORK ROLES
                      </span>

                    </div>

                    <div
                      className="
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        gap-2.5
                      "
                    >

                      {roleOptions.map((role) => {

                        const Icon = role.icon;
                        const selected = selectedRole === role.id;

                        return (
                          <motion.button
                            key={role.id}
                            type="button"
                            whileHover={{
                              y: -2,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            onClick={() =>
                              handleRoleChange(role.id)
                            }
                            className={`
                              relative
                              text-left
                              p-3.5
                              rounded-2xl
                              border
                              transition-all
                              duration-200
                              overflow-hidden

                              ${
                                selected
                                  ? `
                                    bg-white/[0.06]
                                    border-red-500/60
                                    shadow-lg
                                    ${role.glowClass}
                                  `
                                  : `
                                    bg-white/[0.018]
                                    border-white/[0.07]
                                    hover:border-white/[0.14]
                                    hover:bg-white/[0.035]
                                  `
                              }
                            `}
                          >

                            {selected && (
                              <motion.div
                                layoutId="roleActive"
                                className="
                                  absolute
                                  inset-0
                                  rounded-2xl
                                  border
                                  border-red-500/30
                                  pointer-events-none
                                "
                              />
                            )}

                            <div className="flex items-center justify-between">

                              <div
                                className={`
                                  h-9
                                  w-9
                                  rounded-xl
                                  border
                                  flex
                                  items-center
                                  justify-center
                                  ${role.bgClass}
                                  ${role.borderClass}
                                `}
                              >

                                <Icon
                                  className={`
                                    h-5
                                    w-5
                                    ${role.iconClass}
                                  `}
                                />

                              </div>

                              {selected && (
                                <CheckCircle2 className="h-4 w-4 text-red-400" />
                              )}

                            </div>

                            <p className="mt-3 text-[11px] font-black text-white">
                              {role.name}
                            </p>

                            <p className="mt-1 text-[9px] leading-4 font-medium text-slate-400">
                              {role.desc}
                            </p>

                          </motion.button>
                        );

                      })}

                    </div>

                  </div>

                  {/* ACTIVE PROFILE */}

                  <AnimatePresence mode="wait">

                    <motion.div
                      key={selectedRole}
                      initial={{
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -5,
                      }}
                      className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-red-500/15
                        bg-red-500/[0.035]
                        px-4
                        py-3
                      "
                    >

                      <div className="flex items-center gap-2.5">

                        <span
                          className="
                            h-2
                            w-2
                            rounded-full
                            bg-red-400
                            animate-pulse
                          "
                        />

                        <span className="text-[10px] font-bold text-slate-400">
                          ACTIVE ACCESS PROFILE
                        </span>

                      </div>

                      <span className="text-[10px] font-black tracking-wider text-red-400">
                        {selectedRoleData.short}
                      </span>

                    </motion.div>

                  </AnimatePresence>

                  {/* FORM */}

                  <form
                    onSubmit={handleFormSubmit}
                    className="mt-6 space-y-5"
                  >

                    {/* ERROR */}

                    <AnimatePresence>

                      {error && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: 'auto',
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="
                            rounded-xl
                            border
                            border-red-500/30
                            bg-red-500/[0.07]
                            p-4
                            text-sm
                            font-medium
                            text-red-300
                          "
                        >

                          <div className="flex items-center gap-2.5">

                            <ShieldAlert className="h-5 w-5 shrink-0" />

                            {error}

                          </div>

                        </motion.div>
                      )}

                    </AnimatePresence>

                    {/* EMAIL */}

                    <div>

                      <label
                        className="
                          mb-2.5
                          block
                          text-[10px]
                          font-black
                          tracking-[0.15em]
                          text-slate-300
                        "
                      >
                        EMAIL / PHONE
                      </label>

                      <div className="relative group">

                        <Mail
                          className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            h-5
                            w-5
                            text-slate-500
                            group-focus-within:text-red-400
                          "
                        />

                        <input
                          type="text"
                          required
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                          placeholder="name@resqlink.demo"
                          autoComplete="username"
                          className="
                            w-full
                            h-14
                            rounded-2xl
                            border
                            border-white/[0.08]
                            bg-black/25
                            pl-12
                            pr-4
                            text-base
                            font-medium
                            text-white
                            placeholder:text-slate-600
                            outline-none
                            transition-all
                            focus:border-red-500/60
                            focus:bg-red-500/[0.025]
                            focus:ring-4
                            focus:ring-red-500/[0.06]
                          "
                        />

                      </div>

                    </div>

                    {/* PASSWORD */}

                    <div>

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mb-2.5
                        "
                      >

                        <label
                          className="
                            text-[10px]
                            font-black
                            tracking-[0.15em]
                            text-slate-300
                          "
                        >
                          PASSWORD
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            setError(
                              'Password recovery is managed by your ResQLink administrator.'
                            )
                          }
                          className="
                            text-[10px]
                            font-bold
                            text-slate-500
                            hover:text-red-400
                          "
                        >
                          FORGOT PASSWORD?
                        </button>

                      </div>

                      <div className="relative group">

                        <Lock
                          className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            h-5
                            w-5
                            text-slate-500
                            group-focus-within:text-red-400
                          "
                        />

                        <input
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          required
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="
                            w-full
                            h-14
                            rounded-2xl
                            border
                            border-white/[0.08]
                            bg-black/25
                            pl-12
                            pr-12
                            text-base
                            font-medium
                            text-white
                            placeholder:text-slate-600
                            outline-none
                            transition-all
                            focus:border-red-500/60
                            focus:bg-red-500/[0.025]
                            focus:ring-4
                            focus:ring-red-500/[0.06]
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (value) => !value
                            )
                          }
                          className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-500
                            hover:text-white
                          "
                          aria-label={
                            showPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>

                      </div>

                    </div>

                    {/* REMEMBER */}

                    <div className="flex items-center justify-between">

                      <label
                        className="
                          flex
                          items-center
                          gap-2.5
                          cursor-pointer
                        "
                      >

                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) =>
                            setRememberMe(
                              e.target.checked
                            )
                          }
                          className="
                            h-4
                            w-4
                            rounded
                            border-white/10
                            bg-black/30
                            text-red-600
                            focus:ring-red-500/30
                          "
                        />

                        <span className="text-sm font-medium text-slate-400">
                          Remember this device
                        </span>

                      </label>

                      <div
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-[9px]
                          font-black
                          text-emerald-400
                        "
                      >

                        <Lock className="h-3.5 w-3.5" />

                        SECURE SESSION

                      </div>

                    </div>

                    {/* SUBMIT */}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={
                        !loading
                          ? { scale: 1.01 }
                          : {}
                      }
                      whileTap={
                        !loading
                          ? { scale: 0.985 }
                          : {}
                      }
                      className="
                        relative
                        w-full
                        h-14
                        overflow-hidden
                        rounded-2xl
                        bg-gradient-to-r
                        from-red-600
                        via-red-600
                        to-rose-600
                        text-white
                        shadow-[0_18px_50px_rgba(220,38,38,.25)]
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                      "
                    >

                      <span
                        className="
                          relative
                          flex
                          items-center
                          justify-center
                          gap-2.5
                          text-sm
                          font-black
                          tracking-[0.16em]
                        "
                      >

                        {loading ? (
                          <>
                            <span
                              className="
                                h-5
                                w-5
                                rounded-full
                                border-2
                                border-white/30
                                border-t-white
                                animate-spin
                              "
                            />

                            AUTHENTICATING...
                          </>
                        ) : (
                          <>
                            SIGN IN TO RESQLINK

                            <ArrowRight className="h-5 w-5" />
                          </>
                        )}

                      </span>

                    </motion.button>

                  </form>

                  {/* =================================================
                      DEMO ACCESS
                  ================================================= */}

                  <div
                    className="
                      mt-7
                      pt-6
                      border-t
                      border-white/[0.07]
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mb-4
                      "
                    >

                      <div className="flex items-center gap-2">

                        <Zap className="h-4 w-4 text-amber-400" />

                        <span
                          className="
                            text-[10px]
                            font-black
                            tracking-[0.15em]
                            text-slate-300
                          "
                        >
                          DEMO COMMAND ACCESS
                        </span>

                      </div>

                      <span className="text-[9px] font-bold text-slate-500">
                        FOR REVIEW
                      </span>

                    </div>

                    <div
                      className="
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        gap-2.5
                      "
                    >

                      {roleOptions.map((role) => {

                        const Icon = role.icon;

                        const isActive =
                          activeDemo === role.id;

                        return (
                          <motion.button
                            key={role.id}
                            type="button"
                            whileHover={{
                              y: -2,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            onClick={() =>
                              handleUseDemo(role.id)
                            }
                            disabled={Boolean(activeDemo)}
                            className="
                              group
                              relative
                              rounded-xl
                              border
                              border-white/[0.07]
                              bg-black/20
                              p-3
                              text-left
                              hover:border-red-500/30
                              hover:bg-red-500/[0.025]
                              transition-all
                              disabled:opacity-60
                            "
                          >

                            <div className="flex items-center gap-2.5">

                              <div
                                className="
                                  h-8
                                  w-8
                                  rounded-lg
                                  bg-white/[0.035]
                                  flex
                                  items-center
                                  justify-center
                                "
                              >

                                {isActive ? (
                                  <span
                                    className="
                                      h-4
                                      w-4
                                      rounded-full
                                      border-2
                                      border-red-400/30
                                      border-t-red-400
                                      animate-spin
                                    "
                                  />
                                ) : (
                                  <Icon
                                    className="
                                      h-4
                                      w-4
                                      text-slate-500
                                      group-hover:text-red-400
                                    "
                                  />
                                )}

                              </div>

                              <div className="min-w-0">

                                <p
                                  className="
                                    text-[10px]
                                    font-black
                                    text-slate-300
                                    truncate
                                  "
                                >
                                  {role.name}
                                </p>

                                <p
                                  className="
                                    mt-0.5
                                    text-[9px]
                                    font-bold
                                    text-red-400/70
                                    group-hover:text-red-400
                                  "
                                >
                                  {isActive
                                    ? 'OPENING...'
                                    : 'DEMO ACCESS'}
                                </p>

                              </div>

                            </div>

                          </motion.button>
                        );

                      })}

                    </div>

                  </div>

                  {/* ACCESS */}

                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      justify-center
                      gap-1.5
                      text-sm
                      text-slate-500
                    "
                  >

                    <UserRound className="h-4 w-4" />

                    New to ResQLink?

                    <button
                      type="button"
                      onClick={() =>
                        setError(
                          'Account creation is managed by your ResQLink administrator.'
                        )
                      }
                      className="
                        font-black
                        text-red-400
                        hover:text-red-300
                      "
                    >
                      REQUEST ACCESS
                    </button>

                  </div>

                </div>

                {/* CARD FOOTER */}

                <div
                  className="
                    border-t
                    border-white/[0.06]
                    bg-black/20
                    px-6
                    sm:px-8
                    py-4
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <div className="flex items-center gap-2">

                    <KeyRound className="h-4 w-4 text-slate-600" />

                    <span
                      className="
                        text-[9px]
                        font-bold
                        tracking-wider
                        text-slate-500
                      "
                    >
                      AUTHORIZED PERSONNEL ONLY
                    </span>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-[9px]
                      font-black
                      text-emerald-400
                    "
                  >

                    <ShieldCheck className="h-4 w-4" />

                    SECURE NETWORK

                  </div>

                </div>

              </div>

            </div>

          </motion.section>

        </div>

      </main>

      {/* ============================================================
          FOOTER
      ============================================================ */}

      <footer
        className="
          relative
          z-20
          border-t
          border-white/[0.05]
          bg-slate-950/60
        "
      >

        <div
          className="
            max-w-[1550px]
            mx-auto
            px-5
            sm:px-8
            xl:px-12
            py-5
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-3
          "
        >

          <div className="flex items-center gap-2.5">

            <ShieldAlert className="h-4 w-4 text-red-500" />

            <span
              className="
                text-[9px]
                font-black
                tracking-[0.2em]
                text-slate-500
              "
            >
              RESQLINK
            </span>

            <span className="text-slate-700">
              •
            </span>

            <span
              className="
                text-[9px]
                font-bold
                tracking-wider
                text-slate-600
              "
            >
              ONE PLATFORM. ONE LIFE. ONE TAP.
            </span>

          </div>

          <div
            className="
              flex
              items-center
              gap-4
              text-[9px]
              font-black
              tracking-wider
              text-slate-600
            "
          >
            <span>SECURE</span>
            <span>•</span>
            <span>REAL-TIME</span>
            <span>•</span>
            <span>COORDINATED</span>
          </div>

        </div>

      </footer>

    </div>
  );
}

export default LoginPage;