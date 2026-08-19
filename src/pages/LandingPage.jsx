import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  Radio,
  Ambulance,
  Building2,
  Droplet,
  Pill,
  HeartPulse,
  MapPin,
  ChevronRight,
  ArrowRight,
  Zap,
  Activity,
  Lock,
  Layers,
  Navigation,
  Clock3,
  Siren,
  CheckCircle2,
  Wifi,
  Route,
  Crosshair,
  BrainCircuit,
  Users,
  Gauge,
  CircleDot,
  Menu,
  X,
  Radar,
  LocateFixed,
  Timer,
  Database,
  Signal,
  PackageCheck,
  Truck,
  Hospital,
  PhoneCall,
  BellRing,
  MapPinned,
  CircleCheck,
} from 'lucide-react';

import { ROLES } from '../utils/constants';
import favicon from '../assets/favicon.png';


/* =========================================================
   ANIMATION PRESETS
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};


const stagger = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};


const floatAnimation = {
  y: [0, -8, 0],
};


/* =========================================================
   LANDING PAGE
========================================================= */

export function LandingPage() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(6);
  const [activeDispatch, setActiveDispatch] = useState(0);
  const [progress, setProgress] = useState(68);


  /* =========================================================
     NAVIGATION
  ========================================================== */

  const handleGetStarted = () => {
    navigate('/login');
  };


  const scrollTo = (id) => {

    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setMenuOpen(false);
  };


  /* =========================================================
     LIVE ETA
  ========================================================== */

  useEffect(() => {

    const timer = setInterval(() => {

      setLiveSeconds((prev) =>
        prev <= 1 ? 6 : prev - 1
      );

    }, 1000);

    return () => clearInterval(timer);

  }, []);


  /* =========================================================
     DISPATCH ANIMATION
  ========================================================== */

  useEffect(() => {

    const timer = setInterval(() => {

      setActiveDispatch((prev) => (prev + 1) % 4);

    }, 1800);

    return () => clearInterval(timer);

  }, []);


  /* =========================================================
     RESPONSE PROGRESS
  ========================================================== */

  useEffect(() => {

    const timer = setInterval(() => {

      setProgress((prev) =>
        prev >= 96 ? 62 : prev + 3
      );

    }, 900);

    return () => clearInterval(timer);

  }, []);


  /* =========================================================
     RESPONSE PIPELINE
  ========================================================== */

  const responseSteps = [

    {
      number: '01',
      title: 'SOS Activated',

      description:
        'A single emergency action initiates the response workflow and creates a live incident.',

      icon: BellRing,
    },

    {
      number: '02',
      title: 'Location Secured',

      description:
        'Live coordinates, emergency profile and critical context are attached to the incident.',

      icon: Crosshair,
    },

    {
      number: '03',
      title: 'Unit Dispatched',

      description:
        'The control room identifies the nearest suitable response unit and assigns the mission.',

      icon: Radio,
    },

    {
      number: '04',
      title: 'Route Optimized',

      description:
        'The driver receives the incident, destination and operational route in real time.',

      icon: Navigation,
    },

    {
      number: '05',
      title: 'Care Prepared',

      description:
        'The receiving hospital is alerted with ETA and relevant emergency information.',

      icon: Building2,
    },

  ];


  /* =========================================================
     ECOSYSTEM ROLES
  ========================================================== */

  const ecosystemRoles = [

    {
      role: ROLES.PATIENT,
      title: 'Patient',
      eyebrow: 'REQUEST CARE',

      description:
        'Trigger SOS, share emergency information and follow response progress from one place.',

      icon: HeartPulse,
      accent: 'red',
    },

    {
      role: ROLES.DRIVER,
      title: 'Ambulance',
      eyebrow: 'MOVE FAST',

      description:
        'Receive dispatches, patient context, optimized routes and hospital destination details.',

      icon: Ambulance,
      accent: 'sky',
    },

    {
      role: ROLES.CONTROL_ROOM,
      title: 'Control Room',
      eyebrow: 'COMMAND',

      description:
        'Monitor incidents, assign resources and coordinate every response from one operational view.',

      icon: Radio,
      accent: 'violet',
    },

    {
      role: ROLES.HOSPITAL,
      title: 'Hospital',
      eyebrow: 'PREPARE CARE',

      description:
        'Receive incoming alerts, ETA updates and emergency readiness information before arrival.',

      icon: Building2,
      accent: 'emerald',
    },

    {
      role: ROLES.BLOOD_BANK,
      title: 'Blood Bank',
      eyebrow: 'SUPPLY',

      description:
        'Surface blood availability, coordinate emergency allocation and support urgent requests.',

      icon: Droplet,
      accent: 'rose',
    },

    {
      role: ROLES.PHARMACY,
      title: 'Emergency Pharmacy',
      eyebrow: 'FULFILL',

      description:
        'Coordinate critical medication availability and urgent fulfillment across the network.',

      icon: Pill,
      accent: 'cyan',
    },

  ];


  /* =========================================================
     ACCENT MAP
  ========================================================== */

  const accentMap = {

    red: {
      icon: 'text-red-400',
      border: 'hover:border-red-500/30',
      bg: 'bg-red-500/[0.05]',
    },

    sky: {
      icon: 'text-sky-400',
      border: 'hover:border-sky-500/30',
      bg: 'bg-sky-500/[0.05]',
    },

    violet: {
      icon: 'text-violet-400',
      border: 'hover:border-violet-500/30',
      bg: 'bg-violet-500/[0.05]',
    },

    emerald: {
      icon: 'text-emerald-400',
      border: 'hover:border-emerald-500/30',
      bg: 'bg-emerald-500/[0.05]',
    },

    rose: {
      icon: 'text-rose-400',
      border: 'hover:border-rose-500/30',
      bg: 'bg-rose-500/[0.05]',
    },

    cyan: {
      icon: 'text-cyan-400',
      border: 'hover:border-cyan-500/30',
      bg: 'bg-cyan-500/[0.05]',
    },

  };


  return (

    <div
      className="
        min-h-screen
        bg-[#02050a]
        text-white
        overflow-x-hidden
        selection:bg-red-500/30
      "
    >

      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

        <div
          className="
            absolute
            top-[-320px]
            left-1/2
            -translate-x-1/2
            w-[1000px]
            h-[1000px]
            rounded-full
            bg-red-600/[0.055]
            blur-[170px]
          "
        />

        <div
          className="
            absolute
            top-[900px]
            left-[-350px]
            w-[800px]
            h-[800px]
            rounded-full
            bg-sky-600/[0.035]
            blur-[180px]
          "
        />

        <div
          className="
            absolute
            top-[1800px]
            right-[-400px]
            w-[800px]
            h-[800px]
            rounded-full
            bg-violet-600/[0.035]
            blur-[180px]
          "
        />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.8) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.8) 1px,
                transparent 1px
              )
            `,
            backgroundSize: '64px 64px',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

      </div>


      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="fixed top-0 left-0 right-0 z-[100]">

        <div
          className="
            border-b
            border-white/[0.055]
            bg-[#02050a]/80
            backdrop-blur-2xl
          "
        >

          <div
            className="
              max-w-[1400px]
              mx-auto
              px-5
              sm:px-8
              h-[78px]
              flex
              items-center
              justify-between
            "
          >

            {/* BRAND */}

            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }

              className="group flex items-center gap-3"
            >

              <div className="relative">

                <div
                  className="
                    absolute
                    inset-[-7px]
                    rounded-2xl
                    bg-red-500/20
                    blur-xl
                    opacity-70
                    group-hover:opacity-100
                    transition-opacity
                  "
                />

                <div
                  className="
                    relative
                    w-10
                    h-10
                    rounded-[13px]
                    bg-black
                    border
                    border-red-400/20
                    flex
                    items-center
                    justify-center
                    shadow-[0_10px_40px_rgba(239,68,68,0.22)]
                    overflow-hidden
                  "
                >

                  <img
                    src={favicon}
                    alt="ResQLink"
                    className="
                      w-full
                      h-full
                      object-contain
                      p-1.5
                    "
                  />

                </div>

              </div>


              <div className="text-left">

                <div
                  className="
                    text-[19px]
                    font-black
                    tracking-[-0.04em]
                  "
                >
                  ResQ
                  <span className="text-red-500">
                    Link
                  </span>
                </div>

                <div
                  className="
                    text-[7px]
                    text-slate-500
                    font-black
                    tracking-[0.24em]
                  "
                >
                  EMERGENCY RESPONSE NETWORK
                </div>

              </div>

            </button>


            {/* DESKTOP NAV */}

            <nav className="hidden lg:flex items-center gap-9">

              {[
                ['how-it-works', 'How It Works'],
                ['network', 'Response Network'],
                ['simulation', 'Live System'],
              ].map(([id, label]) => (

                <button
                  key={id}
                  onClick={() => scrollTo(id)}

                  className="
                    relative
                    text-[11px]
                    font-bold
                    text-slate-500
                    hover:text-white
                    transition-colors
                    group
                  "
                >

                  {label}

                  <span
                    className="
                      absolute
                      -bottom-2
                      left-0
                      w-0
                      h-px
                      bg-red-500
                      group-hover:w-full
                      transition-all
                      duration-300
                    "
                  />

                </button>

              ))}

            </nav>


            {/* NAV RIGHT */}

            <div className="hidden lg:flex items-center gap-3">

              


              <button
                onClick={handleGetStarted}

                className="
                  group
                  px-4
                  py-2.5
                  rounded-xl
                  bg-white
                  text-[#02050a]
                  font-black
                  text-[10px]
                  flex
                  items-center
                  gap-2
                  hover:bg-red-500
                  hover:text-white
                  transition-all
                "
              >

                ACCESS PLATFORM

                <ArrowRight
                  className="
                    w-3.5
                    h-3.5
                    group-hover:translate-x-1
                    transition-transform
                  "
                />

              </button>

            </div>


            {/* MOBILE MENU */}

            <button
              onClick={() => setMenuOpen(!menuOpen)}

              className="
                lg:hidden
                w-10
                h-10
                rounded-xl
                border
                border-white/10
                bg-white/[0.035]
                flex
                items-center
                justify-center
              "
            >

              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}

            </button>

          </div>


          {/* MOBILE NAV */}

          {menuOpen && (

            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}

              animate={{
                opacity: 1,
                height: 'auto',
              }}

              className="
                lg:hidden
                border-t
                border-white/[0.055]
                bg-[#02050a]/95
                backdrop-blur-2xl
              "
            >

              <div className="p-5 space-y-2">

                {[
                  ['how-it-works', 'How It Works'],
                  ['network', 'Response Network'],
                  ['simulation', 'Live System'],
                ].map(([id, label]) => (

                  <button
                    key={id}
                    onClick={() => scrollTo(id)}

                    className="
                      w-full
                      text-left
                      px-4
                      py-3
                      rounded-xl
                      text-sm
                      font-bold
                      text-slate-300
                      hover:bg-white/[0.04]
                    "
                  >
                    {label}
                  </button>

                ))}


                <button
                  onClick={handleGetStarted}

                  className="
                    w-full
                    mt-2
                    px-4
                    py-3.5
                    rounded-xl
                    bg-red-600
                    font-black
                    text-sm
                  "
                >
                  ACCESS PLATFORM
                </button>

              </div>

            </motion.div>

          )}

        </div>

      </header>


      <main className="relative z-10 pt-[78px]">


        {/* =====================================================
            HERO
        ====================================================== */}

        <section
          className="
            relative
            min-h-[calc(100vh-78px)]
            flex
            items-center
          "
        >

          <div
            className="
              max-w-[1400px]
              mx-auto
              w-full
              px-5
              sm:px-8
              py-20
              lg:py-24
            "
          >

            <div
              className="
                grid
                lg:grid-cols-12
                gap-16
                xl:gap-20
                items-center
              "
            >

              {/* HERO COPY */}

              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="lg:col-span-6"
              >

                


                <motion.h1
                  variants={fadeUp}

                  className="
                    mt-7
                    text-[52px]
                    sm:text-[66px]
                    xl:text-[86px]
                    leading-[0.91]
                    font-black
                    tracking-[-0.065em]
                  "
                >

                  Emergency

                  <br />

                  <span
                    className="
                      bg-gradient-to-r
                      from-white
                      via-slate-200
                      to-slate-500
                      bg-clip-text
                      text-transparent
                    "
                  >
                    coordination,
                  </span>

                  <br />

                  <span
                    className="
                      bg-gradient-to-r
                      from-red-400
                      via-rose-400
                      to-orange-300
                      bg-clip-text
                      text-transparent
                    "
                  >
                    re-engineered.
                  </span>

                </motion.h1>


                <motion.p
                  variants={fadeUp}

                  className="
                    mt-8
                    max-w-xl
                    text-[15px]
                    sm:text-[17px]
                    text-slate-400
                    leading-[1.8]
                  "
                >
                  ResQLink connects the entire emergency response chain —
                  patients, dispatchers, ambulances, hospitals, blood banks
                  and pharmacies — through one real-time operational network.
                </motion.p>


                <motion.div
                  variants={fadeUp}

                  className="
                    mt-9
                    flex
                    flex-col
                    sm:flex-row
                    gap-3
                  "
                >

                  <button
                    onClick={handleGetStarted}

                    className="
                      group
                      relative
                      overflow-hidden
                      px-8
                      py-5
                      rounded-2xl
                      bg-gradient-to-r
                      from-red-600
                      to-rose-600
                      font-black
                      text-[12px]
                      tracking-wide
                      shadow-[0_20px_60px_rgba(220,38,38,0.22)]
                      hover:scale-[1.025]
                      transition-all
                    "
                  >

                    <span
                      className="
                        relative
                        z-10
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      LAUNCH RESQLINK

                      <ArrowRight
                        className="
                          w-4
                          h-4
                          group-hover:translate-x-1
                          transition-transform
                        "
                      />

                    </span>

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-transparent
                        via-white/20
                        to-transparent
                        -translate-x-full
                        group-hover:translate-x-full
                        transition-transform
                        duration-700
                      "
                    />

                  </button>


                  <button
                    onClick={() => scrollTo('simulation')}

                    className="
                      px-8
                      py-5
                      rounded-2xl
                      border
                      border-white/[0.09]
                      bg-white/[0.025]
                      backdrop-blur-xl
                      text-[11px]
                      font-black
                      tracking-wide
                      text-slate-300
                      hover:bg-white/[0.055]
                      hover:border-white/20
                      transition-all
                    "
                  >
                    SEE THE RESPONSE FLOW
                  </button>

                </motion.div>


                {/* METRICS */}

                <motion.div
                  variants={fadeUp}

                  className="
                    mt-11
                    grid
                    grid-cols-3
                    max-w-xl
                    border-y
                    border-white/[0.065]
                    py-5
                  "
                >

                  <div>

                    <div
                      className="
                        text-[28px]
                        sm:text-[34px]
                        font-black
                        tracking-tight
                      "
                    >
                      &lt; 06
                      <span className="text-red-500">
                        m
                      </span>
                    </div>

                    <div
                      className="
                        mt-1
                        text-[8px]
                        font-black
                        text-slate-600
                        uppercase
                        tracking-[0.16em]
                      "
                    >
                      Target response
                    </div>

                  </div>


                  <div
                    className="
                      border-l
                      border-white/[0.07]
                      pl-5
                    "
                  >

                    <div
                      className="
                        text-[28px]
                        sm:text-[34px]
                        font-black
                      "
                    >
                      24
                      <span className="text-sky-400">
                        /
                      </span>
                      7
                    </div>

                    <div
                      className="
                        mt-1
                        text-[8px]
                        font-black
                        text-slate-600
                        uppercase
                        tracking-[0.16em]
                      "
                    >
                      Network readiness
                    </div>

                  </div>


                  <div
                    className="
                      border-l
                      border-white/[0.07]
                      pl-5
                    "
                  >

                    <div
                      className="
                        text-[28px]
                        sm:text-[34px]
                        font-black
                      "
                    >
                      06
                      <span className="text-emerald-400">
                        +
                      </span>
                    </div>

                    <div
                      className="
                        mt-1
                        text-[8px]
                        font-black
                        text-slate-600
                        uppercase
                        tracking-[0.16em]
                      "
                    >
                      Connected roles
                    </div>

                  </div>

                </motion.div>

              </motion.div>


              {/* =================================================
                  LIVE EMERGENCY INTELLIGENCE
              ================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  x: 25,
                }}

                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                }}

                transition={{
                  duration: 1,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}

                className="lg:col-span-6"
              >

                <div className="relative">

                  {/* glow */}

                  <div
                    className="
                      absolute
                      -inset-10
                      bg-red-600/[0.055]
                      blur-[90px]
                      rounded-full
                    "
                  />


                  {/* decorative circles */}

                  <div
                    className="
                      absolute
                      -top-5
                      -right-5
                      w-24
                      h-24
                      border
                      border-red-500/10
                      rounded-full
                    "
                  />

                  <div
                    className="
                      absolute
                      -top-2
                      -right-2
                      w-14
                      h-14
                      border
                      border-red-500/10
                      rounded-full
                    "
                  />


                  {/* MAIN HUB */}

                  <div
                    className="
                      relative
                      rounded-[34px]
                      border
                      border-white/[0.09]
                      bg-[#07101b]/90
                      backdrop-blur-3xl
                      shadow-[0_40px_120px_rgba(0,0,0,0.55)]
                      overflow-hidden
                    "
                  >

                    {/* TOP BAR */}

                    <div
                      className="
                        px-7
                        sm:px-9
                        py-6
                        border-b
                        border-white/[0.065]
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-12
                            h-12
                            rounded-xl
                            bg-red-500/[0.08]
                            border
                            border-red-500/15
                            flex
                            items-center
                            justify-center
                            overflow-hidden
                          "
                        >

                          <img
                            src={favicon}
                            alt="ResQLink"
                            className="w-8 h-8 object-contain"
                          />

                        </div>


                        <div>

                          <div
                            className="
                              text-[12px]
                              sm:text-[13px]
                              font-black
                              tracking-[0.14em]
                            "
                          >
                            LIVE EMERGENCY INTELLIGENCE
                          </div>

                          <div
                            className="
                              mt-0.5
                              text-[8px]
                              sm:text-[9px]
                              text-slate-600
                              font-bold
                              tracking-[0.16em]
                            "
                          >
                            AI-POWERED RESPONSE INTELLIGENCE
                          </div>

                        </div>

                      </div>


                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          px-2.5
                          py-1.5
                          rounded-full
                          bg-emerald-500/[0.05]
                          border
                          border-emerald-500/15
                        "
                      >

                        <span
                          className="
                            w-1.5
                            h-1.5
                            rounded-full
                            bg-emerald-400
                            animate-pulse
                          "
                        />

                        <span
                          className="
                            text-[7px]
                            font-black
                            text-emerald-400
                            tracking-[0.15em]
                          "
                        >
                          SYSTEM LIVE
                        </span>

                      </div>

                    </div>


                    <div className="p-7 sm:p-9">

                      {/* =========================================
                          ACTIVE INCIDENT
                      ========================================== */}

                      <div
                        className="
                          relative
                          overflow-hidden
                          rounded-2xl
                          border
                          border-red-500/15
                          bg-gradient-to-br
                          from-red-500/[0.09]
                          via-red-500/[0.025]
                          to-transparent
                          p-5
                        "
                      >

                        <div
                          className="
                            absolute
                            -right-16
                            -top-16
                            w-40
                            h-40
                            rounded-full
                            bg-red-500/[0.08]
                            blur-3xl
                          "
                        />


                        <div
                          className="
                            relative
                            flex
                            items-start
                            justify-between
                            gap-4
                          "
                        >

                          <div className="flex gap-3">

                            <div
                              className="
                                w-11
                                h-11
                                rounded-xl
                                bg-red-500/[0.09]
                                border
                                border-red-500/15
                                flex
                                items-center
                                justify-center
                                shrink-0
                              "
                            >

                              <Siren
                                className="
                                  w-5
                                  h-5
                                  text-red-400
                                  animate-pulse
                                "
                              />

                            </div>


                            <div>

                              <div
                                className="
                                  text-[8px]
                                  font-black
                                  text-red-400
                                  tracking-[0.18em]
                                "
                              >
                                ACTIVE EMERGENCY
                              </div>


                              <div
                                className="
                                  mt-1
                                  text-[21px]
                                  sm:text-[24px]
                                  font-black
                                  tracking-tight
                                "
                              >
                                Cardiac Emergency
                              </div>


                              <div
                                className="
                                  mt-1.5
                                  flex
                                  items-center
                                  gap-1.5
                                  text-[9px]
                                  text-slate-500
                                "
                              >

                                <MapPin
                                  className="
                                    w-3
                                    h-3
                                    text-red-400
                                  "
                                />

                                Anna Nagar West, Madurai

                              </div>

                            </div>

                          </div>


                          <div
                            className="
                              px-2
                              py-1
                              rounded-md
                              bg-red-500/[0.08]
                              border
                              border-red-500/15
                              text-[7px]
                              font-black
                              text-red-400
                              tracking-wider
                            "
                          >
                            CRITICAL
                          </div>

                        </div>


                        {/* INCIDENT META */}

                        <div
                          className="
                            relative
                            mt-5
                            grid
                            grid-cols-3
                            gap-2
                          "
                        >

                          <div
                            className="
                              rounded-lg
                              bg-black/20
                              border
                              border-white/[0.05]
                              px-3
                              py-2
                            "
                          >

                            <div
                              className="
                                text-[6px]
                                text-slate-600
                                font-black
                                tracking-widest
                              "
                            >
                              SOS
                            </div>

                            <div
                              className="
                                mt-1
                                text-[8px]
                                font-black
                                text-red-400
                              "
                            >
                              RECEIVED
                            </div>

                          </div>


                          <div
                            className="
                              rounded-lg
                              bg-black/20
                              border
                              border-white/[0.05]
                              px-3
                              py-2
                            "
                          >

                            <div
                              className="
                                text-[6px]
                                text-slate-600
                                font-black
                                tracking-widest
                              "
                            >
                              GPS
                            </div>

                            <div
                              className="
                                mt-1
                                text-[8px]
                                font-black
                                text-emerald-400
                              "
                            >
                              LOCKED
                            </div>

                          </div>


                          <div
                            className="
                              rounded-lg
                              bg-black/20
                              border
                              border-white/[0.05]
                              px-3
                              py-2
                            "
                          >

                            <div
                              className="
                                text-[6px]
                                text-slate-600
                                font-black
                                tracking-widest
                              "
                            >
                              PRIORITY
                            </div>

                            <div
                              className="
                                mt-1
                                text-[8px]
                                font-black
                                text-red-400
                              "
                            >
                              P1
                            </div>

                          </div>

                        </div>

                      </div>


                      {/* =========================================
                          LIVE DISPATCH FLOW
                      ========================================== */}

                      <div className="mt-5">

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            mb-3
                          "
                        >

                          <div
                            className="
                              text-[8px]
                              font-black
                              text-slate-600
                              tracking-[0.18em]
                            "
                          >
                            AI DECISION FLOW
                          </div>

                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                              text-[7px]
                              font-black
                              text-red-400
                            "
                          >

                            <Activity className="w-3 h-3" />

                            ACTIVE

                          </div>

                        </div>


                        <div className="grid grid-cols-4 gap-2">

                          {[
                            {
                              label: 'SOS',
                              title: 'SIGNAL',
                              icon: HeartPulse,
                              color: 'text-red-400',
                              bg: 'bg-red-500/[0.07]',
                              border: 'border-red-500/15',
                            },

                            {
                              label: 'CONTROL',
                              title: 'ASSIGNED',
                              icon: Radio,
                              color: 'text-violet-400',
                              bg: 'bg-violet-500/[0.07]',
                              border: 'border-violet-500/15',
                            },

                            {
                              label: 'AMBULANCE',
                              title: 'EN ROUTE',
                              icon: Ambulance,
                              color: 'text-sky-400',
                              bg: 'bg-sky-500/[0.07]',
                              border: 'border-sky-500/15',
                            },

                            {
                              label: 'HOSPITAL',
                              title: 'PREPARING',
                              icon: Building2,
                              color: 'text-emerald-400',
                              bg: 'bg-emerald-500/[0.07]',
                              border: 'border-emerald-500/15',
                            },

                          ].map((item, index) => {

                            const Icon = item.icon;

                            const active =
                              activeDispatch === index;

                            return (

                              <motion.div
                                key={item.label}

                                animate={{
                                  y: active ? -4 : 0,
                                  scale: active ? 1.025 : 1,
                                }}

                                transition={{
                                  duration: 0.3,
                                }}

                                className={`
                                  relative
                                  rounded-xl
                                  border
                                  ${item.border}
                                  ${item.bg}
                                  p-3
                                  text-center
                                  backdrop-blur-xl
                                `}
                              >

                                <Icon
                                  className={`
                                    w-4
                                    h-4
                                    mx-auto
                                    ${item.color}
                                  `}
                                />

                                <div
                                  className="
                                    mt-2
                                    text-[6px]
                                    font-black
                                    tracking-wide
                                  "
                                >
                                  {item.label}
                                </div>

                                <div
                                  className={`
                                    mt-0.5
                                    text-[6px]
                                    font-black
                                    ${item.color}
                                    tracking-wider
                                  `}
                                >
                                  {item.title}
                                </div>

                              </motion.div>

                            );

                          })}

                        </div>

                      </div>


                      {/* =========================================
                          OPERATIONAL CARDS
                      ========================================== */}

                      <div className="grid grid-cols-2 gap-3 mt-5">

                        {/* AMBULANCE */}

                        <div
                          className="
                            rounded-2xl
                            bg-black/25
                            border
                            border-white/[0.065]
                            p-4
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                            "
                          >

                            <div
                              className="
                                text-[7px]
                                font-black
                                text-slate-600
                                tracking-[0.15em]
                              "
                            >
                              AMBULANCE UNIT
                            </div>

                            <Truck
                              className="
                                w-3.5
                                h-3.5
                                text-sky-400
                              "
                            />

                          </div>


                          <div
                            className="
                              mt-2
                              text-[20px]
                              font-black
                              tracking-tight
                            "
                          >
                            TN-58-EM-1081
                          </div>


                          <div
                            className="
                              mt-1
                              text-[8px]
                              font-black
                              text-sky-400
                              tracking-wider
                            "
                          >
                            ALS AMBULANCE
                          </div>


                          <div
                            className="
                              mt-4
                              flex
                              items-center
                              justify-between
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-1.5
                                text-[8px]
                                text-slate-500
                              "
                            >

                              <Navigation
                                className="
                                  w-3
                                  h-3
                                  text-sky-400
                                "
                              />

                              2.4 KM

                            </div>


                            <span
                              className="
                                text-[7px]
                                font-black
                                text-sky-400
                              "
                            >
                              EN ROUTE
                            </span>

                          </div>

                        </div>


                        {/* ETA */}

                        <div
                          className="
                            rounded-2xl
                            bg-black/25
                            border
                            border-white/[0.065]
                            p-4
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                            "
                          >

                            <div
                              className="
                                text-[7px]
                                font-black
                                text-slate-600
                                tracking-[0.15em]
                              "
                            >
                              LIVE ETA
                            </div>

                            <Timer
                              className="
                                w-3.5
                                h-3.5
                                text-emerald-400
                              "
                            />

                          </div>


                          <div
                            className="
                              mt-2
                              text-[25px]
                              font-black
                              text-emerald-400
                              tracking-tight
                            "
                          >
                            0{liveSeconds}

                            <span
                              className="
                                text-[10px]
                                text-slate-600
                                ml-1
                              "
                            >
                              MIN
                            </span>

                          </div>


                          <div
                            className="
                              mt-1
                              text-[8px]
                              font-black
                              text-emerald-400
                              tracking-wider
                            "
                          >
                            TRAUMA BAY READY
                          </div>


                          <div
                            className="
                              mt-4
                              flex
                              items-center
                              gap-1.5
                              text-[7px]
                              text-slate-500
                            "
                          >

                            <CircleCheck
                              className="
                                w-3
                                h-3
                                text-emerald-400
                              "
                            />

                            ETA SHARED

                          </div>

                        </div>

                      </div>


                      {/* =========================================
                          RESOURCE READINESS
                      ========================================== */}

                      <div className="mt-4">

                        <div
                          className="
                            text-[8px]
                            font-black
                            text-slate-600
                            tracking-[0.18em]
                            mb-3
                          "
                        >
                          EMERGENCY RESOURCE READINESS
                        </div>


                        <div className="grid grid-cols-3 gap-2">

                          {/* HOSPITAL */}

                          <div
                            className="
                              rounded-xl
                              border
                              border-emerald-500/10
                              bg-emerald-500/[0.025]
                              p-3
                            "
                          >

                            <Hospital
                              className="
                                w-4
                                h-4
                                text-emerald-400
                              "
                            />

                            <div
                              className="
                                mt-2
                                text-[7px]
                                font-black
                                text-slate-500
                              "
                            >
                              HOSPITAL
                            </div>

                            <div
                              className="
                                mt-1
                                text-[7px]
                                font-black
                                text-emerald-400
                              "
                            >
                              READY
                            </div>

                          </div>


                          {/* BLOOD */}

                          <div
                            className="
                              rounded-xl
                              border
                              border-rose-500/10
                              bg-rose-500/[0.025]
                              p-3
                            "
                          >

                            <Droplet
                              className="
                                w-4
                                h-4
                                text-rose-400
                              "
                            />

                            <div
                              className="
                                mt-2
                                text-[7px]
                                font-black
                                text-slate-500
                              "
                            >
                              BLOOD BANK
                            </div>

                            <div
                              className="
                                mt-1
                                text-[7px]
                                font-black
                                text-rose-400
                              "
                            >
                              O+ READY
                            </div>

                          </div>


                          {/* PHARMACY */}

                          <div
                            className="
                              rounded-xl
                              border
                              border-cyan-500/10
                              bg-cyan-500/[0.025]
                              p-3
                            "
                          >

                            <Pill
                              className="
                                w-4
                                h-4
                                text-cyan-400
                              "
                            />

                            <div
                              className="
                                mt-2
                                text-[7px]
                                font-black
                                text-slate-500
                              "
                            >
                              PHARMACY
                            </div>

                            <div
                              className="
                                mt-1
                                text-[7px]
                                font-black
                                text-cyan-400
                              "
                            >
                              STOCK READY
                            </div>

                          </div>

                        </div>

                      </div>


                      {/* =========================================
                          DISPATCH PROGRESS
                      ========================================== */}

                      <div
                        className="
                          mt-4
                          rounded-xl
                          bg-white/[0.018]
                          border
                          border-white/[0.055]
                          p-4
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <Radar
                              className="
                                w-3.5
                                h-3.5
                                text-red-400
                              "
                            />

                            <span
                              className="
                                text-[8px]
                                font-bold
                                text-slate-500
                              "
                            >
                              RESPONSE COORDINATION
                            </span>

                          </div>


                          <span
                            className="
                              text-[8px]
                              font-black
                              text-red-400
                            "
                          >
                            {progress}%
                          </span>

                        </div>


                        <div
                          className="
                            mt-3
                            h-1.5
                            rounded-full
                            bg-white/[0.05]
                            overflow-hidden
                          "
                        >

                          <motion.div
                            animate={{
                              width: `${progress}%`,
                            }}

                            transition={{
                              duration: 0.5,
                            }}

                            className="
                              h-full
                              rounded-full
                              bg-gradient-to-r
                              from-red-500
                              via-orange-400
                              to-emerald-400
                            "
                          />

                        </div>


                        <div
                          className="
                            mt-2
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <span
                            className="
                              text-[8px]
                              sm:text-[9px]
                              text-slate-600
                            "
                          >
                            Dispatch synchronized
                          </span>

                          <span
                            className="
                              text-[7px]
                              font-black
                              text-emerald-400
                            "
                          >
                            LIVE
                          </span>

                        </div>

                      </div>


                      {/* OPEN PLATFORM */}

                      <button
                        onClick={handleGetStarted}

                        className="
                          group
                          w-full
                          mt-4
                          py-4
                          rounded-2xl
                          bg-white
                          text-[#02050a]
                          font-black
                          text-[10px]
                          tracking-wide
                          flex
                          items-center
                          justify-center
                          gap-2
                          hover:bg-red-500
                          hover:text-white
                          transition-all
                        "
                      >

                        OPEN RESQLINK OPERATIONS

                        <ChevronRight
                          className="
                            w-4
                            h-4
                            group-hover:translate-x-1
                            transition-transform
                          "
                        />

                      </button>

                    </div>

                  </div>


                 


                 

                </div>

              </motion.div>

            </div>

          </div>

        </section>


        {/* =====================================================
            TRUST STRIP
        ====================================================== */}

        <section
          className="
            border-y
            border-white/[0.055]
            bg-white/[0.012]
          "
        >

          <div
            className="
              max-w-[1400px]
              mx-auto
              px-5
              sm:px-8
              py-5
            "
          >

            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-4
                gap-6
              "
            >

              {[
                {
                  icon: Zap,
                  title: 'Instant activation',
                  text: 'One action starts the workflow',
                },

                {
                  icon: Navigation,
                  title: 'Live routing',
                  text: 'Response paths stay visible',
                },

                {
                  icon: Activity,
                  title: 'Shared telemetry',
                  text: 'Every role sees the same incident',
                },

                {
                  icon: Lock,
                  title: 'Controlled access',
                  text: 'Role-based operational visibility',
                },

              ].map((item) => {

                const Icon = item.icon;

                return (

                  <div
                    key={item.title}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        w-9
                        h-9
                        rounded-xl
                        bg-white/[0.025]
                        border
                        border-white/[0.065]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >

                      <Icon
                        className="
                          w-4
                          h-4
                          text-slate-400
                        "
                      />

                    </div>


                    <div>

                      <div
                        className="
                          text-[9px]
                          font-black
                          text-slate-300
                        "
                      >
                        {item.title}
                      </div>

                      <div
                        className="
                          text-[8px]
                          text-slate-600
                          mt-0.5
                        "
                      >
                        {item.text}
                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section
          id="how-it-works"
          className="
            max-w-[1400px]
            mx-auto
            px-5
            sm:px-8
            py-32
            scroll-mt-20
          "
        >

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.12,
            }}
            variants={stagger}
          >

            <motion.div
              variants={fadeUp}
              className="text-center"
            >

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  border
                  border-red-500/15
                  bg-red-500/[0.035]
                "
              >

                <Route
                  className="
                    w-3.5
                    h-3.5
                    text-red-400
                  "
                />

                <span
                  className="
                    text-[8px]
                    font-black
                    text-red-400
                    tracking-[0.2em]
                  "
                >
                  RESPONSE PIPELINE
                </span>

              </div>


              <h2
                className="
                  mt-6
                  text-[40px]
                  sm:text-[58px]
                  leading-[0.95]
                  font-black
                  tracking-[-0.055em]
                "
              >

                From SOS

                <br />

                <span className="text-slate-600">
                  to coordinated care.
                </span>

              </h2>


              <p
                className="
                  mt-6
                  max-w-2xl
                  mx-auto
                  text-[13px]
                  sm:text-[14px]
                  text-slate-500
                  leading-[1.8]
                "
              >
                ResQLink transforms a fragmented emergency into a visible,
                coordinated sequence — connecting the right people,
                resources and decisions at the right moment.
              </p>

            </motion.div>


            <div
              className="
                mt-16
                grid
                grid-cols-1
                md:grid-cols-5
                gap-3
              "
            >

              {responseSteps.map((step, index) => {

                const Icon = step.icon;

                return (

                  <motion.div
                    key={step.number}
                    variants={fadeUp}
                    className="group relative"
                  >

                    {index < responseSteps.length - 1 && (

                      <div
                        className="
                          hidden
                          md:block
                          absolute
                          top-10
                          left-[calc(100%-2px)]
                          w-4
                          h-px
                          bg-gradient-to-r
                          from-white/10
                          to-transparent
                          z-20
                        "
                      />

                    )}


                    <div
                      className="
                        h-full
                        rounded-[26px]
                        border
                        border-white/[0.065]
                        bg-white/[0.018]
                        p-6
                        hover:-translate-y-1
                        hover:bg-white/[0.03]
                        hover:border-red-500/15
                        transition-all
                        duration-300
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <div
                          className="
                            w-11
                            h-11
                            rounded-2xl
                            bg-red-500/[0.06]
                            border
                            border-red-500/10
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <Icon
                            className="
                              w-[18px]
                              h-[18px]
                              text-red-400
                            "
                          />

                        </div>


                        <span
                          className="
                            text-[32px]
                            font-black
                            text-white/[0.035]
                          "
                        >
                          {step.number}
                        </span>

                      </div>


                      <h3
                        className="
                          mt-7
                          text-[13px]
                          font-black
                          tracking-tight
                        "
                      >
                        {step.title}
                      </h3>


                      <p
                        className="
                          mt-3
                          text-[10px]
                          text-slate-600
                          leading-[1.7]
                        "
                      >
                        {step.description}
                      </p>

                    </div>

                  </motion.div>

                );

              })}

            </div>

          </motion.div>

        </section>


        {/* =====================================================
            NETWORK
        ====================================================== */}

        <section
          id="network"
          className="
            border-y
            border-white/[0.055]
            bg-white/[0.009]
            scroll-mt-20
          "
        >

          <div
            className="
              max-w-[1400px]
              mx-auto
              px-5
              sm:px-8
              py-32
            "
          >

            <div
              className="
                grid
                lg:grid-cols-12
                gap-16
                items-center
              "
            >

              <motion.div
                initial={{
                  opacity: 0,
                  x: -20,
                }}

                whileInView={{
                  opacity: 1,
                  x: 0,
                }}

                viewport={{
                  once: true,
                }}

                transition={{
                  duration: 0.7,
                }}

                className="lg:col-span-5"
              >

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-full
                    border
                    border-sky-500/15
                    bg-sky-500/[0.035]
                  "
                >

                  <Layers
                    className="
                      w-3.5
                      h-3.5
                      text-sky-400
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      font-black
                      text-sky-400
                      tracking-[0.2em]
                    "
                  >
                    UNIFIED RESPONSE GRID
                  </span>

                </div>


                <h2
                  className="
                    mt-6
                    text-[42px]
                    sm:text-[58px]
                    leading-[0.95]
                    font-black
                    tracking-[-0.055em]
                  "
                >

                  One platform.

                  <br />

                  <span className="text-slate-600">
                    Every critical role.
                  </span>

                </h2>


                <p
                  className="
                    mt-6
                    text-[13px]
                    text-slate-500
                    leading-[1.8]
                    max-w-lg
                  "
                >
                  Emergency response should not depend on disconnected
                  dashboards, repeated phone calls or information arriving
                  too late. ResQLink creates one shared operational layer.
                </p>


                <div className="mt-9 space-y-3.5">

                  {[
                    'Real-time incident synchronization',
                    'Role-specific operational dashboards',
                    'Emergency resource visibility',
                    'Centralized response coordination',
                  ].map((text) => (

                    <div
                      key={text}
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          w-6
                          h-6
                          rounded-full
                          bg-emerald-500/[0.06]
                          border
                          border-emerald-500/15
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <CheckCircle2
                          className="
                            w-3.5
                            h-3.5
                            text-emerald-400
                          "
                        />

                      </div>


                      <span
                        className="
                          text-[11px]
                          font-bold
                          text-slate-400
                        "
                      >
                        {text}
                      </span>

                    </div>

                  ))}

                </div>

              </motion.div>


              <div className="lg:col-span-7">

                <div
                  className="
                    grid
                    sm:grid-cols-2
                    gap-3
                  "
                >

                  {ecosystemRoles.map((eco, index) => {

                    const Icon = eco.icon;

                    const accent =
                      accentMap[eco.accent];

                    return (

                      <motion.div
                        key={eco.title}

                        initial={{
                          opacity: 0,
                          y: 20,
                        }}

                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}

                        viewport={{
                          once: true,
                        }}

                        transition={{
                          delay: index * 0.06,
                          duration: 0.55,
                        }}

                        whileHover={{
                          y: -4,
                        }}

                        className={`
                          group
                          rounded-[25px]
                          border
                          border-white/[0.065]
                          bg-white/[0.018]
                          p-5
                          transition-all
                          ${accent.border}
                        `}
                      >

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                          "
                        >

                          <div
                            className={`
                              w-11
                              h-11
                              rounded-2xl
                              border
                              border-white/[0.06]
                              ${accent.bg}
                              flex
                              items-center
                              justify-center
                            `}
                          >

                            <Icon
                              className={`
                                w-5
                                h-5
                                ${accent.icon}
                              `}
                            />

                          </div>


                          <ChevronRight
                            className="
                              w-4
                              h-4
                              text-slate-700
                              group-hover:text-slate-400
                              group-hover:translate-x-1
                              transition-all
                            "
                          />

                        </div>


                        <div className="mt-5">

                          <div
                            className={`
                              text-[7px]
                              font-black
                              ${accent.icon}
                              tracking-[0.18em]
                            `}
                          >
                            {eco.eyebrow}
                          </div>


                          <div
                            className="
                              mt-1.5
                              text-[14px]
                              font-black
                              tracking-tight
                            "
                          >
                            {eco.title}
                          </div>


                          <div
                            className="
                              mt-2.5
                              text-[10px]
                              text-slate-600
                              leading-[1.7]
                            "
                          >
                            {eco.description}
                          </div>

                        </div>


                        <div
                          className="
                            mt-5
                            pt-4
                            border-t
                            border-white/[0.045]
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <span
                            className="
                              text-[7px]
                              font-black
                              text-slate-700
                              tracking-[0.15em]
                            "
                          >
                            CONNECTED PORTAL
                          </span>


                          <span
                            className={`
                              text-[7px]
                              font-black
                              ${accent.icon}
                            `}
                          >
                            ACTIVE →
                          </span>

                        </div>

                      </motion.div>

                    );

                  })}

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            LIVE SIMULATION
        ====================================================== */}

        <section
          id="simulation"
          className="
            max-w-[1400px]
            mx-auto
            px-5
            sm:px-8
            py-32
            scroll-mt-20
          "
        >

          <div
            className="
              relative
              overflow-hidden
              rounded-[38px]
              border
              border-white/[0.08]
              bg-gradient-to-br
              from-red-500/[0.055]
              via-white/[0.018]
              to-sky-500/[0.035]
            "
          >

            <div
              className="
                absolute
                top-[-250px]
                left-1/2
                -translate-x-1/2
                w-[600px]
                h-[600px]
                rounded-full
                bg-red-500/[0.06]
                blur-[140px]
              "
            />


            <div
              className="
                relative
                p-7
                sm:p-12
                lg:p-16
              "
            >

              <div
                className="
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-end
                  justify-between
                  gap-8
                "
              >

                <div>

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-full
                      bg-red-500/[0.06]
                      border
                      border-red-500/15
                    "
                  >

                    <BrainCircuit
                      className="
                        w-3.5
                        h-3.5
                        text-red-400
                      "
                    />

                    <span
                      className="
                        text-[8px]
                        font-black
                        text-red-400
                        tracking-[0.2em]
                      "
                    >
                      LIVE RESPONSE SIMULATION
                    </span>

                  </div>


                  <h2
                    className="
                      mt-6
                      text-[36px]
                      sm:text-[56px]
                      leading-[0.95]
                      font-black
                      tracking-[-0.055em]
                    "
                  >

                    See the incident.

                    <br />

                    <span className="text-slate-600">
                      Follow every decision.
                    </span>

                  </h2>

                </div>


                <button
                  onClick={handleGetStarted}

                  className="
                    px-6
                    py-3.5
                    rounded-xl
                    bg-white
                    text-[#02050a]
                    font-black
                    text-[10px]
                    hover:bg-red-500
                    hover:text-white
                    transition-all
                  "
                >
                  OPEN LIVE GRID
                </button>

              </div>


              <div
                className="
                  mt-12
                  grid
                  lg:grid-cols-3
                  gap-3
                "
              >

                {/* INCIDENT */}

                <div
                  className="
                    rounded-[22px]
                    bg-black/20
                    border
                    border-white/[0.065]
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        text-[8px]
                        font-black
                        text-red-400
                        tracking-[0.18em]
                      "
                    >
                      INCIDENT
                    </span>

                    <Siren
                      className="
                        w-4
                        h-4
                        text-red-400
                      "
                    />

                  </div>


                  <div
                    className="
                      mt-6
                      text-[19px]
                      font-black
                      tracking-tight
                    "
                  >
                    Cardiac Emergency
                  </div>


                  <div
                    className="
                      mt-2
                      text-[10px]
                      text-slate-600
                    "
                  >
                    Anna Nagar West, Madurai
                  </div>


                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <MapPin
                      className="
                        w-3.5
                        h-3.5
                        text-red-400
                      "
                    />

                    <span
                      className="
                        text-[9px]
                        text-slate-500
                      "
                    >
                      GPS LOCKED
                    </span>

                    <span
                      className="
                        ml-auto
                        text-[9px]
                        font-black
                        text-emerald-400
                      "
                    >
                      100%
                    </span>

                  </div>

                </div>


                {/* RESPONSE */}

                <div
                  className="
                    rounded-[22px]
                    bg-black/20
                    border
                    border-white/[0.065]
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        text-[8px]
                        font-black
                        text-sky-400
                        tracking-[0.18em]
                      "
                    >
                      AMBULANCE UNIT
                    </span>

                    <Ambulance
                      className="
                        w-4
                        h-4
                        text-sky-400
                      "
                    />

                  </div>


                  <div
                    className="
                      mt-6
                      text-[19px]
                      font-black
                      tracking-tight
                    "
                  >
                    TN-58-EM-1081
                  </div>


                  <div
                    className="
                      mt-2
                      text-[10px]
                      text-slate-600
                    "
                  >
                    ALS Ambulance • Karthik Raja
                  </div>


                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <Navigation
                      className="
                        w-3.5
                        h-3.5
                        text-sky-400
                      "
                    />

                    <span
                      className="
                        text-[9px]
                        text-slate-500
                      "
                    >
                      2.4 KM AWAY
                    </span>

                    <span
                      className="
                        ml-auto
                        text-[9px]
                        font-black
                        text-sky-400
                      "
                    >
                      EN ROUTE
                    </span>

                  </div>

                </div>


                {/* DESTINATION */}

                <div
                  className="
                    rounded-[22px]
                    bg-black/20
                    border
                    border-white/[0.065]
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        text-[8px]
                        font-black
                        text-emerald-400
                        tracking-[0.18em]
                      "
                    >
                      DESTINATION
                    </span>

                    <Building2
                      className="
                        w-4
                        h-4
                        text-emerald-400
                      "
                    />

                  </div>


                  <div
                    className="
                      mt-6
                      text-[19px]
                      font-black
                      tracking-tight
                    "
                  >
                    Trauma Center
                  </div>


                  <div
                    className="
                      mt-2
                      text-[10px]
                      text-slate-600
                    "
                  >
                    Emergency Department
                  </div>


                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <CheckCircle2
                      className="
                        w-3.5
                        h-3.5
                        text-emerald-400
                      "
                    />

                    <span
                      className="
                        text-[9px]
                        text-slate-500
                      "
                    >
                      TRAUMA BAY
                    </span>

                    <span
                      className="
                        ml-auto
                        text-[9px]
                        font-black
                        text-emerald-400
                      "
                    >
                      READY
                    </span>

                  </div>

                </div>

              </div>


              {/* TIMELINE */}

              <div
                className="
                  mt-4
                  rounded-[22px]
                  border
                  border-white/[0.065]
                  bg-black/20
                  p-5
                  sm:p-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-6
                  "
                >

                  <span
                    className="
                      text-[8px]
                      font-black
                      text-slate-600
                      tracking-[0.18em]
                    "
                  >
                    RESPONSE TIMELINE
                  </span>


                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      text-[8px]
                      font-black
                      text-emerald-400
                    "
                  >

                    <span
                      className="
                        w-1.5
                        h-1.5
                        rounded-full
                        bg-emerald-400
                        animate-pulse
                      "
                    />

                    LIVE

                  </span>

                </div>


                <div className="relative">

                  <div
                    className="
                      absolute
                      top-2.5
                      left-0
                      right-0
                      h-px
                      bg-white/[0.07]
                    "
                  />


                  <motion.div
                    animate={{
                      width: ['5%', '100%'],
                    }}

                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear',
                    }}

                    className="
                      absolute
                      top-2.5
                      left-0
                      h-px
                      bg-gradient-to-r
                      from-red-500
                      via-sky-400
                      to-emerald-400
                    "
                  />


                  <div
                    className="
                      relative
                      grid
                      grid-cols-4
                      gap-3
                    "
                  >

                    {[
                      ['SOS', 'Activated'],
                      ['GPS', 'Locked'],
                      ['UNIT', 'Dispatched'],
                      ['ER', 'Prepared'],
                    ].map(([label, status]) => (

                      <div key={label}>

                        <div
                          className="
                            w-5
                            h-5
                            rounded-full
                            bg-[#02050a]
                            border-2
                            border-white/20
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <span
                            className="
                              w-1.5
                              h-1.5
                              rounded-full
                              bg-white/70
                            "
                          />

                        </div>


                        <div
                          className="
                            mt-3
                            text-[8px]
                            font-black
                          "
                        >
                          {label}
                        </div>


                        <div
                          className="
                            mt-1
                            text-[7px]
                            text-slate-700
                          "
                        >
                          {status}
                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            PRODUCT PRINCIPLES
        ====================================================== */}

        <section
          className="
            max-w-[1200px]
            mx-auto
            px-5
            sm:px-8
            pb-32
          "
        >

          <div
            className="
              grid
              md:grid-cols-3
              gap-3
            "
          >

            {[
              {
                icon: Gauge,
                title: 'Designed for seconds',
                text:
                  'Every interaction is built around reducing hesitation and unnecessary steps.',
              },

              {
                icon: Database,
                title: 'One source of truth',
                text:
                  'The incident becomes a shared operational record instead of fragmented updates.',
              },

              {
                icon: Users,
                title: 'Built around people',
                text:
                  'Each role receives the information required to make the next decision quickly.',
              },

            ].map((item) => {

              const Icon = item.icon;

              return (

                <div
                  key={item.title}

                  className="
                    rounded-[25px]
                    border
                    border-white/[0.06]
                    bg-white/[0.016]
                    p-6
                  "
                >

                  <Icon
                    className="
                      w-5
                      h-5
                      text-slate-400
                    "
                  />


                  <h3
                    className="
                      mt-5
                      text-[13px]
                      font-black
                    "
                  >
                    {item.title}
                  </h3>


                  <p
                    className="
                      mt-2
                      text-[10px]
                      leading-[1.7]
                      text-slate-600
                    "
                  >
                    {item.text}
                  </p>

                </div>

              );

            })}

          </div>

        </section>


        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section
          className="
            max-w-[1050px]
            mx-auto
            px-5
            sm:px-8
            pb-32
          "
        >

          <div
            className="
              relative
              text-center
              rounded-[40px]
              border
              border-white/[0.075]
              bg-white/[0.018]
              overflow-hidden
              p-10
              sm:p-20
            "
          >

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-b
                from-red-500/[0.055]
                via-transparent
                to-transparent
              "
            />


            <div
              className="
                absolute
                top-[-180px]
                left-1/2
                -translate-x-1/2
                w-[400px]
                h-[400px]
                rounded-full
                bg-red-500/[0.07]
                blur-[110px]
              "
            />


            <div className="relative">

              {/* FAVICON */}

              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 rgba(239,68,68,0)',
                    '0 0 50px rgba(239,68,68,0.2)',
                    '0 0 0 rgba(239,68,68,0)',
                  ],
                }}

                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}

                className="
                  mx-auto
                  w-16
                  h-16
                  rounded-[22px]
                  bg-red-500/[0.07]
                  border
                  border-red-500/15
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                "
              >

                <img
                  src={favicon}
                  alt="ResQLink"
                  className="
                    w-11
                    h-11
                    object-contain
                  "
                />

              </motion.div>


              <div
                className="
                  mt-8
                  text-[8px]
                  font-black
                  text-red-400
                  tracking-[0.25em]
                "
              >
                THE RESPONSE STARTS HERE
              </div>


              <h2
                className="
                  mt-5
                  text-[42px]
                  sm:text-[65px]
                  leading-[0.92]
                  font-black
                  tracking-[-0.06em]
                "
              >

                When seconds matter,

                <br />

                <span
                  className="
                    bg-gradient-to-r
                    from-red-400
                    to-orange-300
                    bg-clip-text
                    text-transparent
                  "
                >
                  coordination matters more.
                </span>

              </h2>


              <p
                className="
                  mt-7
                  max-w-xl
                  mx-auto
                  text-[13px]
                  sm:text-[14px]
                  text-slate-600
                  leading-[1.8]
                "
              >
                ResQLink gives emergency teams one connected environment to
                detect, dispatch, navigate, prepare and respond.
              </p>


              <button
                onClick={handleGetStarted}

                className="
                  group
                  mt-9
                  px-8
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-red-600
                  to-rose-600
                  font-black
                  text-[11px]
                  tracking-wide
                  shadow-[0_20px_70px_rgba(220,38,38,0.22)]
                  hover:scale-[1.035]
                  transition-all
                "
              >

                <span
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  ENTER RESQLINK

                  <ArrowRight
                    className="
                      w-4
                      h-4
                      group-hover:translate-x-1
                      transition-transform
                    "
                  />

                </span>

              </button>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer
        className="
          border-t
          border-white/[0.055]
          bg-black/20
        "
      >

        <div
          className="
            max-w-[1400px]
            mx-auto
            px-5
            sm:px-8
            py-8
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-5
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              {/* FAVICON */}

              <div
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-black
                  border
                  border-red-500/20
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                "
              >

                <img
                  src={favicon}
                  alt="ResQLink"
                  className="
                    w-7
                    h-7
                    object-contain
                  "
                />

              </div>


              <div>

                <div
                  className="
                    text-[14px]
                    font-black
                    tracking-tight
                  "
                >
                  ResQ
                  <span className="text-red-500">
                    Link
                  </span>
                </div>


                <div
                  className="
                    text-[7px]
                    text-slate-700
                    tracking-[0.18em]
                    font-black
                  "
                >
                  ONE PLATFORM • ONE RESPONSE • ONE LIFE
                </div>

              </div>

            </div>


            <div
              className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-5
                text-[7px]
                font-black
                text-slate-700
                tracking-[0.14em]
              "
            >

              <span
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >

                <Lock className="w-3 h-3" />

                CONTROLLED ACCESS

              </span>


              <span
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >

                <Wifi className="w-3 h-3" />

                NETWORK ONLINE

              </span>


              <button
                onClick={handleGetStarted}
                className="
                  text-slate-500
                  hover:text-white
                  transition
                "
              >
                PORTAL LOGIN
              </button>

            </div>

          </div>


          <div
            className="
              mt-6
              pt-5
              border-t
              border-white/[0.035]
              text-center
              text-[7px]
              text-slate-800
              font-black
              tracking-[0.16em]
            "
          >
            RESQLINK EMERGENCY COORDINATION NETWORK • BUILT FOR RAPID RESPONSE
          </div>

        </div>

      </footer>

    </div>

  );
}


export default LandingPage;