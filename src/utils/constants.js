/**
 * ResQLink Constants & Mock Data Configuration
 * Madurai / Tamil Nadu Demo Dataset
 */

export const ROLES = {
  PATIENT: 'PATIENT',
  DRIVER: 'DRIVER',
  CONTROL_ROOM: 'CONTROL_ROOM',
  HOSPITAL: 'HOSPITAL',
  BLOOD_BANK: 'BLOOD_BANK',
  PHARMACY: 'PHARMACY',
};

export const ROLE_CONFIG = {
  [ROLES.PATIENT]: {
    id: ROLES.PATIENT,
    name: 'Patient',
    title: 'Patient Emergency Portal',
    subtitle: 'Personal emergency access & SOS',
    description:
      'Instant 1-touch emergency SOS, medical ID broadcast & live ambulance tracking.',
    path: '/patient/dashboard',
    demoEmail: 'patient@resqlink.demo',
    color: 'red',
    badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30',
  },

  [ROLES.DRIVER]: {
    id: ROLES.DRIVER,
    name: 'Ambulance Driver',
    title: 'Paramedic & Ambulance Cockpit',
    subtitle: 'Emergency pickup & navigation',
    description:
      'Incoming dispatch radar, shortest-route navigation, sirens & hospital triage handover.',
    path: '/driver/dashboard',
    demoEmail: 'driver@resqlink.demo',
    color: 'sky',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  },

  [ROLES.CONTROL_ROOM]: {
    id: ROLES.CONTROL_ROOM,
    name: 'Control Room',
    title: 'Emergency Command Center',
    subtitle: 'Emergency coordination & dispatch',
    description:
      'Citywide tactical telemetry, emergency queue, auto-dispatch & hospital coordination.',
    path: '/control-room/dashboard',
    demoEmail: 'control@resqlink.demo',
    color: 'purple',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },

  [ROLES.HOSPITAL]: {
    id: ROLES.HOSPITAL,
    name: 'Hospital',
    title: 'Hospital Emergency Operations',
    subtitle: 'Emergency care coordination',
    description:
      'Inbound trauma radar, ER/ICU capacity, emergency preparation & medical team coordination.',
    path: '/hospital/dashboard',
    demoEmail: 'hospital@resqlink.demo',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },

  [ROLES.BLOOD_BANK]: {
    id: ROLES.BLOOD_BANK,
    name: 'Blood Bank',
    title: 'Central Blood Bank & Reserve',
    subtitle: 'Blood inventory & emergency requests',
    description:
      'Live blood inventory, emergency hospital allocations & donor coordination.',
    path: '/blood-bank/dashboard',
    demoEmail: 'bloodbank@resqlink.demo',
    color: 'rose',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },

  [ROLES.PHARMACY]: {
    id: ROLES.PHARMACY,
    name: 'Pharmacy',
    title: '24/7 Emergency Pharmacy',
    subtitle: 'Emergency medicine support',
    description:
      'Critical medicine inventory, ambulance restock & emergency hospital supply.',
    path: '/pharmacy/dashboard',
    demoEmail: 'pharmacy@resqlink.demo',
    color: 'teal',
    badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  },
};

/* =========================================================
   EMERGENCY STATUS
========================================================= */

export const EMERGENCY_STATUS = {
  PENDING: 'PENDING',
  DISPATCHED: 'DISPATCHED',
  EN_ROUTE: 'EN_ROUTE',
  ON_SCENE: 'ON_SCENE',
  TRANSPORTING: 'TRANSPORTING',
  ARRIVED: 'ARRIVED',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED',
};

/* =========================================================
   SEVERITY LEVELS
========================================================= */

export const SEVERITY_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

/* =========================================================
   DEMO USERS
========================================================= */

export const DEMO_USERS = [
  {
    id: 'user_patient',
    email: 'patient@resqlink.demo',
    password: 'password123',

    name: 'Kavya Rajendran',

    role: ROLES.PATIENT,

    phone: '+91 98401 23456',

    bloodGroup: 'O+',

    allergies: 'Penicillin, Peanuts',

    medicalConditions: 'Mild Asthma, Hypertension',

    emergencyContacts: [
      {
        name: 'Aravind Rajendran',
        relation: 'Spouse',
        phone: '+91 98401 98765',
      },
      {
        name: 'Dr. R. Sundaram',
        relation: 'Physician',
        phone: '+91 98402 34567',
      },
    ],

    address: 'Anna Nagar, Madurai, Tamil Nadu',

    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },

  {
    id: 'user_driver',
    email: 'driver@resqlink.demo',
    password: 'password123',

    name: 'Karthik Raja',

    role: ROLES.DRIVER,

    phone: '+91 97890 12345',

    ambulanceId: 'amb_1',

    ambulanceNumber: 'TN-58-EM-1081',

    unitType: 'ALS Critical Care Unit',

    rating: 4.9,

    completedMissions: 248,

    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },

  {
    id: 'user_driver_2',
    email: 'driver2@resqlink.demo',
    password: 'password123',

    name: 'Suresh Kumar',

    role: ROLES.DRIVER,

    phone: '+91 97890 23456',

    ambulanceId: 'amb_2',

    ambulanceNumber: 'TN-58-EM-1082',

    unitType: 'BLS Basic Trauma Unit',

    rating: 4.8,

    completedMissions: 193,

    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },

  {
    id: 'user_control',
    email: 'control@resqlink.demo',
    password: 'password123',

    name: 'Commander Meena Selvam',

    role: ROLES.CONTROL_ROOM,

    badgeId: 'DISPATCH-CMD-09',

    shift: 'Duty Watch A — Day',

    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },

  {
    id: 'user_hospital',
    email: 'hospital@resqlink.demo',
    password: 'password123',

    name: 'Dr. Aravind Kumar',

    role: ROLES.HOSPITAL,

    hospitalId: 'hosp_1',

    hospitalName: 'Government Rajaji Hospital, Madurai',

    department: 'Emergency & Acute Trauma Care',

    avatar:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },

  {
    id: 'user_bloodbank',
    email: 'bloodbank@resqlink.demo',
    password: 'password123',

    name: 'Dr. Malathi Pandian',

    role: ROLES.BLOOD_BANK,

    facilityName: 'Madurai Central Blood Bank',

    license: 'REG-BB-8832',

    avatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  },

  {
    id: 'user_pharmacy',
    email: 'pharmacy@resqlink.demo',
    password: 'password123',

    name: 'Saravanan Murugan',

    role: ROLES.PHARMACY,

    pharmacyName: 'ResQLink Emergency Pharmacy — Madurai',

    license: 'PHARM-EM-4091',

    avatar:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
  },
];

/* =========================================================
   MADURAI HOSPITAL NETWORK
========================================================= */

export const INITIAL_HOSPITALS = [
  {
    id: 'hosp_1',

    name: 'Government Rajaji Hospital',

    shortName: 'GRH Madurai',

    city: 'Madurai',

    level: 'Level-1 Tertiary Trauma Hub',

    address: 'Panagal Road, Madurai, Tamil Nadu',

    phone: '+91 452 253 2535',

    coords: {
      lat: 9.9252,
      lng: 78.1198,
    },

    erBeds: {
      total: 40,
      available: 12,
    },

    icuBeds: {
      total: 20,
      available: 4,
    },

    divertStatus: false,

    bloodUnits: 142,

    specialties: [
      'Emergency Trauma',
      'Cardiology',
      'Neurology',
      'Critical Care',
    ],
  },

  {
    id: 'hosp_2',

    name: 'Apollo Speciality Hospital',

    shortName: 'Apollo Madurai',

    city: 'Madurai',

    level: 'Level-2 Cardiac & Neuro Hub',

    address: 'K.K. Nagar, Madurai, Tamil Nadu',

    phone: '+91 452 258 0880',

    coords: {
      lat: 9.9320,
      lng: 78.1450,
    },

    erBeds: {
      total: 30,
      available: 9,
    },

    icuBeds: {
      total: 15,
      available: 6,
    },

    divertStatus: false,

    bloodUnits: 98,

    specialties: [
      'Cardiology',
      'Neurology',
      'Emergency Medicine',
      'Critical Care',
    ],
  },

  {
    id: 'hosp_3',

    name: 'Meenakshi Mission Hospital & Research Centre',

    shortName: 'Meenakshi Mission',

    city: 'Madurai',

    level: 'Super Speciality Trauma Centre',

    address: 'Melur Main Road, Madurai, Tamil Nadu',

    phone: '+91 452 426 3000',

    coords: {
      lat: 9.9540,
      lng: 78.1610,
    },

    erBeds: {
      total: 50,
      available: 18,
    },

    icuBeds: {
      total: 25,
      available: 8,
    },

    divertStatus: false,

    bloodUnits: 185,

    specialties: [
      'Trauma Care',
      'Cardiac Sciences',
      'Neurosciences',
      'Critical Care',
    ],
  },

  {
    id: 'hosp_4',

    name: 'Velammal Medical College Hospital',

    shortName: 'Velammal Medical College',

    city: 'Madurai',

    level: 'Tertiary Emergency Care Hub',

    address: 'Anuppanadi, Madurai, Tamil Nadu',

    phone: '+91 452 711 1000',

    coords: {
      lat: 9.8787,
      lng: 78.1290,
    },

    erBeds: {
      total: 35,
      available: 11,
    },

    icuBeds: {
      total: 18,
      available: 5,
    },

    divertStatus: false,

    bloodUnits: 116,

    specialties: [
      'Emergency Medicine',
      'Orthopaedics',
      'General Surgery',
      'Critical Care',
    ],
  },

  {
    id: 'hosp_5',

    name: 'Devadoss Multispeciality Hospital',

    shortName: 'Devadoss Hospital',

    city: 'Madurai',

    level: 'Multispeciality Emergency Hub',

    address: 'Alagarkoil Road, Madurai, Tamil Nadu',

    phone: '+91 452 452 2000',

    coords: {
      lat: 9.9685,
      lng: 78.1432,
    },

    erBeds: {
      total: 25,
      available: 7,
    },

    icuBeds: {
      total: 12,
      available: 3,
    },

    divertStatus: false,

    bloodUnits: 72,

    specialties: [
      'Emergency Care',
      'General Medicine',
      'Surgery',
      'Orthopaedics',
    ],
  },
];

/* =========================================================
   AMBULANCE FLEET
========================================================= */

export const INITIAL_AMBULANCES = [
  {
    id: 'amb_1',

    vehicleNumber: 'TN-58-EM-1081',

    type: 'ALS Critical Care Unit',

    status: 'AVAILABLE',

    driverName: 'Karthik Raja',

    driverPhone: '+91 97890 12345',

    hospitalBase: 'Government Rajaji Hospital',

    coords: {
      lat: 9.9180,
      lng: 78.1150,
    },

    speedKmH: 52,

    equipment: [
      'Defibrillator',
      '12-Lead ECG Monitor',
      'Ventilator',
      'Intubation Kit',
      'Emergency Drugs',
    ],
  },

  {
    id: 'amb_2',

    vehicleNumber: 'TN-58-EM-1082',

    type: 'BLS Basic Trauma Unit',

    status: 'AVAILABLE',

    driverName: 'Suresh Kumar',

    driverPhone: '+91 97890 23456',

    hospitalBase: 'Apollo Speciality Hospital',

    coords: {
      lat: 9.9300,
      lng: 78.1380,
    },

    speedKmH: 48,

    equipment: [
      'AED',
      'Oxygen Delivery System',
      'Spine Board',
      'Suction Unit',
      'Splints & Dressings',
    ],
  },

  {
    id: 'amb_3',

    vehicleNumber: 'TN-58-EM-1083',

    type: 'Neonatal & Pediatric ICU',

    status: 'AVAILABLE',

    driverName: 'M. Anand',

    driverPhone: '+91 97890 34567',

    hospitalBase: 'Meenakshi Mission Hospital',

    coords: {
      lat: 9.9480,
      lng: 78.1550,
    },

    speedKmH: 50,

    equipment: [
      'Transport Incubator',
      'Pediatric Ventilator',
      'Infusion Pumps',
      'Pulse Oximeter',
    ],
  },

  {
    id: 'amb_4',

    vehicleNumber: 'TN-58-EM-1084',

    type: 'ALS Advanced Life Support',

    status: 'AVAILABLE',

    driverName: 'Praveen Kumar',

    driverPhone: '+91 97890 45678',

    hospitalBase: 'Velammal Medical College Hospital',

    coords: {
      lat: 9.8820,
      lng: 78.1320,
    },

    speedKmH: 46,

    equipment: [
      'AED',
      'ECG Monitor',
      'Ventilator',
      'Oxygen System',
      'Trauma Kit',
    ],
  },

  {
    id: 'amb_5',

    vehicleNumber: 'TN-58-EM-1085',

    type: 'Advanced Trauma Response Unit',

    status: 'AVAILABLE',

    driverName: 'Vijay Sekar',

    driverPhone: '+91 97890 56789',

    hospitalBase: 'Devadoss Multispeciality Hospital',

    coords: {
      lat: 9.9650,
      lng: 78.1410,
    },

    speedKmH: 49,

    equipment: [
      'Trauma Kit',
      'AED',
      'Oxygen System',
      'Suction Unit',
      'Spinal Immobilization Kit',
    ],
  },
];

/* =========================================================
   BLOOD INVENTORY
========================================================= */

export const INITIAL_BLOOD_INVENTORY = [
  {
    group: 'A+',
    units: 28,
    safeMinimum: 20,
    status: 'OPTIMAL',
  },
  {
    group: 'A-',
    units: 8,
    safeMinimum: 12,
    status: 'LOW',
  },
  {
    group: 'B+',
    units: 32,
    safeMinimum: 20,
    status: 'OPTIMAL',
  },
  {
    group: 'B-',
    units: 6,
    safeMinimum: 10,
    status: 'LOW',
  },
  {
    group: 'O+',
    units: 45,
    safeMinimum: 25,
    status: 'OPTIMAL',
  },
  {
    group: 'O-',
    units: 4,
    safeMinimum: 15,
    status: 'CRITICAL',
  },
  {
    group: 'AB+',
    units: 14,
    safeMinimum: 10,
    status: 'GOOD',
  },
  {
    group: 'AB-',
    units: 3,
    safeMinimum: 8,
    status: 'CRITICAL',
  },
];

/* =========================================================
   PHARMACY INVENTORY
========================================================= */

export const INITIAL_PHARMACY_INVENTORY = [
  {
    id: 'med_1',
    name: 'Adrenaline / Epinephrine (1mg/mL)',
    category: 'Resuscitation / Anaphylaxis',
    stock: 140,
    unit: 'Ampoules',
    criticalThreshold: 40,
    status: 'IN_STOCK',
  },

  {
    id: 'med_2',
    name: 'Amiodarone (150mg/3mL)',
    category: 'Antiarrhythmic',
    stock: 65,
    unit: 'Vials',
    criticalThreshold: 25,
    status: 'IN_STOCK',
  },

  {
    id: 'med_3',
    name: 'Naloxone HCl (0.4mg/mL)',
    category: 'Opioid Antagonist',
    stock: 80,
    unit: 'Vials',
    criticalThreshold: 30,
    status: 'IN_STOCK',
  },

  {
    id: 'med_4',
    name: 'Medical Oxygen Cylinders (D-Type)',
    category: 'Respiratory Support',
    stock: 24,
    unit: 'Cylinders',
    criticalThreshold: 10,
    status: 'IN_STOCK',
  },

  {
    id: 'med_5',
    name: 'Normal Saline 0.9% (500mL IV)',
    category: 'Volume Resuscitation',
    stock: 320,
    unit: 'Bags',
    criticalThreshold: 100,
    status: 'IN_STOCK',
  },

  {
    id: 'med_6',
    name: 'Atropine Sulfate (0.6mg/mL)',
    category: 'Bradycardia',
    stock: 95,
    unit: 'Ampoules',
    criticalThreshold: 30,
    status: 'IN_STOCK',
  },

  {
    id: 'med_7',
    name: 'Morphine Sulfate (10mg/mL)',
    category: 'Severe Analgesia',
    stock: 45,
    unit: 'Ampoules',
    criticalThreshold: 20,
    status: 'IN_STOCK',
  },

  {
    id: 'med_8',
    name: 'Tranexamic Acid (500mg/5mL)',
    category: 'Trauma Hemorrhage',
    stock: 110,
    unit: 'Ampoules',
    criticalThreshold: 35,
    status: 'IN_STOCK',
  },
];

/* =========================================================
   EMERGENCY INCIDENTS
========================================================= */

export const INITIAL_EMERGENCIES = [
  {
    id: 'EMG-1092',

    category: 'CARDIAC',

    categoryLabel: 'Severe Acute Cardiac Distress',

    severity: SEVERITY_LEVELS.CRITICAL,

    status: EMERGENCY_STATUS.EN_ROUTE,

    patientName: 'Kavya Rajendran',

    patientPhone: '+91 98401 23456',

    bloodGroup: 'O+',

    allergies: 'Penicillin, Peanuts',

    medicalConditions: 'Mild Asthma, Hypertension',

    address:
      '7th Cross Street, Anna Nagar, Madurai, Tamil Nadu',

    coords: {
      lat: 9.9210,
      lng: 78.1250,
    },

    ambulanceId: 'amb_1',

    ambulanceNumber: 'TN-58-EM-1081',

    driverName: 'Karthik Raja',

    driverPhone: '+91 97890 12345',

    hospitalId: 'hosp_1',

    hospitalName: 'Government Rajaji Hospital',

    eta: '06 MIN',

    distanceKm: 2.4,

    notes:
      'Severe crushing chest pain radiating to left arm. Shortness of breath.',

    createdAt:
      new Date(Date.now() - 4 * 60000).toISOString(),

    isSimulated: true,
  },

  {
    id: 'EMG-1093',

    category: 'TRAUMA',

    categoryLabel: 'Road Traffic Accident',

    severity: SEVERITY_LEVELS.HIGH,

    status: EMERGENCY_STATUS.DISPATCHED,

    patientName: 'Aravind Murugan',

    patientPhone: '+91 97911 22334',

    bloodGroup: 'B+',

    allergies: 'None Known',

    medicalConditions: 'No Known Conditions',

    address:
      'Mattuthavani Bus Stand Road, Madurai, Tamil Nadu',

    coords: {
      lat: 9.9390,
      lng: 78.1340,
    },

    ambulanceId: 'amb_2',

    ambulanceNumber: 'TN-58-EM-1082',

    driverName: 'Suresh Kumar',

    driverPhone: '+91 97890 23456',

    hospitalId: 'hosp_3',

    hospitalName:
      'Meenakshi Mission Hospital & Research Centre',

    eta: '09 MIN',

    distanceKm: 4.1,

    notes:
      'Two-wheeler collision. Suspected lower-limb fracture and facial trauma.',

    createdAt:
      new Date(Date.now() - 8 * 60000).toISOString(),

    isSimulated: true,
  },

  {
    id: 'EMG-1094',

    category: 'RESPIRATORY',

    categoryLabel: 'Acute Respiratory Distress',

    severity: SEVERITY_LEVELS.CRITICAL,

    status: EMERGENCY_STATUS.ON_SCENE,

    patientName: 'Nandhini Balakrishnan',

    patientPhone: '+91 98840 55667',

    bloodGroup: 'A+',

    allergies: 'Dust Allergy',

    medicalConditions: 'Asthma',

    address:
      'K.K. Nagar, Madurai, Tamil Nadu',

    coords: {
      lat: 9.9340,
      lng: 78.1420,
    },

    ambulanceId: 'amb_3',

    ambulanceNumber: 'TN-58-EM-1083',

    driverName: 'M. Anand',

    driverPhone: '+91 97890 34567',

    hospitalId: 'hosp_2',

    hospitalName: 'Apollo Speciality Hospital',

    eta: 'ON SCENE',

    distanceKm: 0.8,

    notes:
      'Severe wheezing and respiratory distress. Oxygen support initiated.',

    createdAt:
      new Date(Date.now() - 12 * 60000).toISOString(),

    isSimulated: true,
  },

  {
    id: 'EMG-1095',

    category: 'NEUROLOGICAL',

    categoryLabel: 'Suspected Acute Stroke',

    severity: SEVERITY_LEVELS.HIGH,

    status: EMERGENCY_STATUS.TRANSPORTING,

    patientName: 'Ramesh Pandian',

    patientPhone: '+91 98421 77889',

    bloodGroup: 'O-',

    allergies: 'None Known',

    medicalConditions: 'Hypertension',

    address:
      'Tallakulam, Madurai, Tamil Nadu',

    coords: {
      lat: 9.9440,
      lng: 78.1260,
    },

    ambulanceId: 'amb_4',

    ambulanceNumber: 'TN-58-EM-1084',

    driverName: 'Praveen Kumar',

    driverPhone: '+91 97890 45678',

    hospitalId: 'hosp_3',

    hospitalName:
      'Meenakshi Mission Hospital & Research Centre',

    eta: '04 MIN',

    distanceKm: 1.7,

    notes:
      'Sudden facial drooping and difficulty speaking. Stroke protocol activated.',

    createdAt:
      new Date(Date.now() - 18 * 60000).toISOString(),

    isSimulated: true,
  },

  {
    id: 'EMG-1096',

    category: 'PEDIATRIC',

    categoryLabel: 'Pediatric Emergency',

    severity: SEVERITY_LEVELS.MEDIUM,

    status: EMERGENCY_STATUS.DISPATCHED,

    patientName: 'Harini Selvakumar',

    patientPhone: '+91 99521 33445',

    bloodGroup: 'AB+',

    allergies: 'None Known',

    medicalConditions: 'Febrile Illness',

    address:
      'Thiruppalai, Madurai, Tamil Nadu',

    coords: {
      lat: 9.9680,
      lng: 78.1480,
    },

    ambulanceId: 'amb_5',

    ambulanceNumber: 'TN-58-EM-1085',

    driverName: 'Vijay Sekar',

    driverPhone: '+91 97890 56789',

    hospitalId: 'hosp_4',

    hospitalName:
      'Velammal Medical College Hospital',

    eta: '11 MIN',

    distanceKm: 5.2,

    notes:
      'High fever with reduced responsiveness. Pediatric emergency team notified.',

    createdAt:
      new Date(Date.now() - 23 * 60000).toISOString(),

    isSimulated: true,
  },
];