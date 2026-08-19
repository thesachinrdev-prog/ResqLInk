import {
  INITIAL_HOSPITALS,
  INITIAL_AMBULANCES,
  INITIAL_BLOOD_INVENTORY,
  INITIAL_PHARMACY_INVENTORY,
  DEMO_USERS,
  EMERGENCY_STATUS,
  ROLES
} from '../utils/constants';
import { calculateDistance, estimateETA } from '../utils/geo';

const STORAGE_KEYS = {
  USERS: 'resqlink_users',
  EMERGENCIES: 'resqlink_emergencies',
  AMBULANCES: 'resqlink_ambulances',
  HOSPITALS: 'resqlink_hospitals',
  BLOOD_INVENTORY: 'resqlink_blood_inventory',
  BLOOD_REQUESTS: 'resqlink_blood_requests',
  BLOOD_DONORS: 'resqlink_blood_donors',
  PHARMACY_INVENTORY: 'resqlink_pharmacy_inventory',
  PHARMACY_ORDERS: 'resqlink_pharmacy_orders',
  AUDIT_LOGS: 'resqlink_audit_logs',
  BROADCAST_ALERTS: 'resqlink_broadcast_alerts',
};

// Helper to load or initialize LocalStorage
function getStoredData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
}

function setStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

// Initial seed for sample emergency if empty
const INITIAL_EMERGENCIES = [
  {
    id: 'EMG-1092',
    patientId: 'usr_patient_1',
    patientName: 'Sarah Jenkins',
    patientPhone: '+1 (555) 234-5678',
    category: 'cardiac',
    categoryLabel: 'Cardiac Arrest / Chest Pain',
    severity: 'CRITICAL',
    status: EMERGENCY_STATUS.EN_ROUTE,
    lat: 37.7749,
    lng: -122.4194,
    address: '742 Evergreen Terrace, Metro City',
    ambulanceId: 'AMB-704',
    ambulanceNumber: 'MEDIC-04',
    driverName: 'Marcus Vance',
    driverPhone: '+1 (555) 876-5432',
    hospitalId: 'hosp_1',
    hospitalName: 'City General Trauma Center',
    notes: 'Severe crushing chest pain radiating to left arm. Patient is conscious.',
    bloodGroup: 'O+',
    allergies: 'Penicillin, Peanuts',
    medicalConditions: 'Asthma (Mild), Hypertensive',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    eta: '4 mins',
    timeline: [
      { status: EMERGENCY_STATUS.PENDING, time: new Date(Date.now() - 12 * 60 * 1000).toISOString(), message: 'SOS triggered by patient mobile app' },
      { status: EMERGENCY_STATUS.DISPATCHED, time: new Date(Date.now() - 10 * 60 * 1000).toISOString(), message: 'Control Room assigned Ambulance MEDIC-04 (ALS)' },
      { status: EMERGENCY_STATUS.EN_ROUTE, time: new Date(Date.now() - 8 * 60 * 1000).toISOString(), message: 'Paramedic Marcus Vance accepted & en route' },
    ],
  },
];

const INITIAL_BLOOD_REQUESTS = [
  {
    id: 'BRQ-402',
    hospitalId: 'hosp_1',
    hospitalName: 'City General Trauma Center',
    requestedBy: 'Dr. Gregory Thorne (ER Triage)',
    bloodGroup: 'O-',
    units: 4,
    urgency: 'CRITICAL',
    status: 'IN_TRANSIT',
    patientRef: 'Trauma Bay 2 - Severe Hemorrhage',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'BRQ-403',
    hospitalId: 'hosp_2',
    hospitalName: 'St. Jude Heart & Vascular',
    requestedBy: 'Surgical ICU Desk',
    bloodGroup: 'A+',
    units: 2,
    urgency: 'HIGH',
    status: 'APPROVED',
    patientRef: 'Scheduled Cardiac Bypass Prep',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_PHARMACY_ORDERS = [
  {
    id: 'RXO-819',
    hospitalId: 'hosp_1',
    hospitalName: 'City General Trauma Center',
    orderedBy: 'Paramedic Unit MEDIC-04',
    items: [
      { name: 'Epinephrine Auto-Injector', quantity: 4 },
      { name: '0.9% Sodium Chloride IV (1000mL)', quantity: 6 },
    ],
    urgency: 'EMERGENCY_RESTOCK',
    status: 'DISPATCHED',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

const INITIAL_DONORS = [
  { id: 'dn_1', name: 'Robert Miller', bloodGroup: 'O-', phone: '+1 (555) 777-8899', lastDonation: '2026-05-10', status: 'Eligible' },
  { id: 'dn_2', name: 'Amelia Watson', bloodGroup: 'A+', phone: '+1 (555) 333-2211', lastDonation: '2026-06-14', status: 'Eligible' },
  { id: 'dn_3', name: 'Carlos Gomez', bloodGroup: 'B+', phone: '+1 (555) 444-5566', lastDonation: '2026-07-02', status: 'Scheduled' },
];

export const api = {
  // Authentication & Users
  async login(email, role) {
    await new Promise((r) => setTimeout(r, 200));
    const users = getStoredData(STORAGE_KEYS.USERS, DEMO_USERS);
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role));
    if (!user) {
      user = users.find((u) => u.role === role) || users[0];
    }
    return { user, token: `jwt_${user.id}_${Date.now()}` };
  },

  async register(userData) {
    await new Promise((r) => setTimeout(r, 250));
    const users = getStoredData(STORAGE_KEYS.USERS, DEMO_USERS);
    const newUser = {
      id: `usr_${Date.now()}`,
      ...userData,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    users.push(newUser);
    setStoredData(STORAGE_KEYS.USERS, users);
    return { user: newUser, token: `jwt_${newUser.id}_${Date.now()}` };
  },

  async getUsers() {
    return getStoredData(STORAGE_KEYS.USERS, DEMO_USERS);
  },

  // Emergency Management
  async getEmergencies() {
    return getStoredData(STORAGE_KEYS.EMERGENCIES, INITIAL_EMERGENCIES);
  },

  async getEmergencyById(id) {
    const emergencies = getStoredData(STORAGE_KEYS.EMERGENCIES, INITIAL_EMERGENCIES);
    return emergencies.find((e) => e.id === id) || null;
  },

  async createSOS(sosData) {
    await new Promise((r) => setTimeout(r, 200));
    const emergencies = getStoredData(STORAGE_KEYS.EMERGENCIES, INITIAL_EMERGENCIES);
    const ambulances = getStoredData(STORAGE_KEYS.AMBULANCES, INITIAL_AMBULANCES);
    const hospitals = getStoredData(STORAGE_KEYS.HOSPITALS, INITIAL_HOSPITALS);

    // Find nearest available ambulance
    const availableAmb = ambulances.find((a) => a.status === 'AVAILABLE');
    // Find nearest hospital
    const nearestHosp = hospitals[0];

    const newId = `EMG-${Math.floor(1000 + Math.random() * 9000)}`;
    const distanceToAmb = availableAmb ? calculateDistance(sosData.lat, sosData.lng, availableAmb.lat, availableAmb.lng) : 3.2;
    const initialETA = estimateETA(distanceToAmb);

    const newEmergency = {
      id: newId,
      patientId: sosData.patientId || 'usr_patient_1',
      patientName: sosData.patientName || 'Emergency Patient',
      patientPhone: sosData.patientPhone || '+1 (555) 234-5678',
      category: sosData.category || 'general',
      categoryLabel: sosData.categoryLabel || 'Medical Emergency',
      severity: sosData.severity || 'CRITICAL',
      status: availableAmb ? EMERGENCY_STATUS.DISPATCHED : EMERGENCY_STATUS.PENDING,
      lat: sosData.lat || 37.7749,
      lng: sosData.lng || -122.4194,
      address: sosData.address || '742 Evergreen Terrace, Metro City',
      notes: sosData.notes || '',
      bloodGroup: sosData.bloodGroup || 'O+',
      allergies: sosData.allergies || 'None reported',
      medicalConditions: sosData.medicalConditions || 'None',
      ambulanceId: availableAmb ? availableAmb.id : null,
      ambulanceNumber: availableAmb ? availableAmb.vehicleNumber : null,
      driverName: availableAmb ? availableAmb.driverName : null,
      driverPhone: availableAmb ? availableAmb.driverPhone : null,
      hospitalId: nearestHosp.id,
      hospitalName: nearestHosp.name,
      createdAt: new Date().toISOString(),
      eta: initialETA,
      timeline: [
        {
          status: EMERGENCY_STATUS.PENDING,
          time: new Date().toISOString(),
          message: 'SOS Signal transmitted to Central Dispatch',
        },
        ...(availableAmb ? [{
          status: EMERGENCY_STATUS.DISPATCHED,
          time: new Date().toISOString(),
          message: `Auto-dispatched ${availableAmb.vehicleNumber} (${availableAmb.driverName})`,
        }] : []),
      ],
    };

    emergencies.unshift(newEmergency);
    setStoredData(STORAGE_KEYS.EMERGENCIES, emergencies);

    if (availableAmb) {
      availableAmb.status = 'DISPATCHED';
      availableAmb.assignedEmergencyId = newId;
      setStoredData(STORAGE_KEYS.AMBULANCES, ambulances);
    }

    return newEmergency;
  },

  async updateEmergencyStatus(id, newStatus, messageExtra = '') {
    const emergencies = getStoredData(STORAGE_KEYS.EMERGENCIES, INITIAL_EMERGENCIES);
    const emg = emergencies.find((e) => e.id === id);
    if (!emg) return null;

    emg.status = newStatus;
    emg.timeline.push({
      status: newStatus,
      time: new Date().toISOString(),
      message: messageExtra || `Status updated to ${newStatus}`,
    });

    if (newStatus === EMERGENCY_STATUS.RESOLVED || newStatus === EMERGENCY_STATUS.CANCELLED) {
      // Free up the assigned ambulance
      if (emg.ambulanceId) {
        const ambulances = getStoredData(STORAGE_KEYS.AMBULANCES, INITIAL_AMBULANCES);
        const amb = ambulances.find((a) => a.id === emg.ambulanceId);
        if (amb) {
          amb.status = 'AVAILABLE';
          amb.assignedEmergencyId = null;
          setStoredData(STORAGE_KEYS.AMBULANCES, ambulances);
        }
      }
    }

    setStoredData(STORAGE_KEYS.EMERGENCIES, emergencies);
    return emg;
  },

  async assignAmbulance(emergencyId, ambulanceId) {
    const emergencies = getStoredData(STORAGE_KEYS.EMERGENCIES, INITIAL_EMERGENCIES);
    const ambulances = getStoredData(STORAGE_KEYS.AMBULANCES, INITIAL_AMBULANCES);

    const emg = emergencies.find((e) => e.id === emergencyId);
    const amb = ambulances.find((a) => a.id === ambulanceId);

    if (!emg || !amb) return null;

    emg.ambulanceId = amb.id;
    emg.ambulanceNumber = amb.vehicleNumber;
    emg.driverName = amb.driverName;
    emg.driverPhone = amb.driverPhone;
    emg.status = EMERGENCY_STATUS.DISPATCHED;
    emg.timeline.push({
      status: EMERGENCY_STATUS.DISPATCHED,
      time: new Date().toISOString(),
      message: `Control Room manually assigned ${amb.vehicleNumber} (${amb.driverName})`,
    });

    amb.status = 'DISPATCHED';
    amb.assignedEmergencyId = emergencyId;

    setStoredData(STORAGE_KEYS.EMERGENCIES, emergencies);
    setStoredData(STORAGE_KEYS.AMBULANCES, ambulances);

    return { emergency: emg, ambulance: amb };
  },

  // Ambulances
  async getAmbulances() {
    return getStoredData(STORAGE_KEYS.AMBULANCES, INITIAL_AMBULANCES);
  },

  async updateAmbulanceStatus(id, status, lat, lng) {
    const ambulances = getStoredData(STORAGE_KEYS.AMBULANCES, INITIAL_AMBULANCES);
    const amb = ambulances.find((a) => a.id === id);
    if (!amb) return null;

    if (status) amb.status = status;
    if (lat && lng) {
      amb.lat = lat;
      amb.lng = lng;
    }

    setStoredData(STORAGE_KEYS.AMBULANCES, ambulances);
    return amb;
  },

  // Hospitals
  async getHospitals() {
    return getStoredData(STORAGE_KEYS.HOSPITALS, INITIAL_HOSPITALS);
  },

  async updateHospitalBeds(hospitalId, bedUpdates) {
    const hospitals = getStoredData(STORAGE_KEYS.HOSPITALS, INITIAL_HOSPITALS);
    const hosp = hospitals.find((h) => h.id === hospitalId);
    if (!hosp) return null;

    if (bedUpdates.erBedsAvailable !== undefined) {
      hosp.erBeds.available = Math.max(0, Math.min(hosp.erBeds.total, bedUpdates.erBedsAvailable));
    }
    if (bedUpdates.icuBedsAvailable !== undefined) {
      hosp.icuBeds.available = Math.max(0, Math.min(hosp.icuBeds.total, bedUpdates.icuBedsAvailable));
    }
    if (bedUpdates.divertStatus !== undefined) {
      hosp.divertStatus = bedUpdates.divertStatus;
    }

    setStoredData(STORAGE_KEYS.HOSPITALS, hospitals);
    return hosp;
  },

  // Blood Bank
  async getBloodInventory() {
    return getStoredData(STORAGE_KEYS.BLOOD_INVENTORY, INITIAL_BLOOD_INVENTORY);
  },

  async updateBloodInventory(group, changeUnits) {
    const inventory = getStoredData(STORAGE_KEYS.BLOOD_INVENTORY, INITIAL_BLOOD_INVENTORY);
    const item = inventory.find((i) => i.group === group);
    if (item) {
      item.units = Math.max(0, item.units + changeUnits);
      item.status = item.units < item.safeMinimum ? 'Critical Need' : 'Optimal';
    }
    setStoredData(STORAGE_KEYS.BLOOD_INVENTORY, inventory);
    return inventory;
  },

  async getBloodRequests() {
    return getStoredData(STORAGE_KEYS.BLOOD_REQUESTS, INITIAL_BLOOD_REQUESTS);
  },

  async createBloodRequest(requestData) {
    const requests = getStoredData(STORAGE_KEYS.BLOOD_REQUESTS, INITIAL_BLOOD_REQUESTS);
    const newReq = {
      id: `BRQ-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      ...requestData,
    };
    requests.unshift(newReq);
    setStoredData(STORAGE_KEYS.BLOOD_REQUESTS, requests);
    return newReq;
  },

  async updateBloodRequestStatus(id, status) {
    const requests = getStoredData(STORAGE_KEYS.BLOOD_REQUESTS, INITIAL_BLOOD_REQUESTS);
    const req = requests.find((r) => r.id === id);
    if (req) {
      req.status = status;
      setStoredData(STORAGE_KEYS.BLOOD_REQUESTS, requests);
    }
    return req;
  },

  async getDonors() {
    return getStoredData(STORAGE_KEYS.BLOOD_DONORS, INITIAL_DONORS);
  },

  async registerDonor(donorData) {
    const donors = getStoredData(STORAGE_KEYS.BLOOD_DONORS, INITIAL_DONORS);
    const newDonor = {
      id: `dn_${Date.now()}`,
      status: 'Eligible',
      lastDonation: 'Never',
      ...donorData,
    };
    donors.unshift(newDonor);
    setStoredData(STORAGE_KEYS.BLOOD_DONORS, donors);
    return newDonor;
  },

  // Pharmacy
  async getPharmacyInventory() {
    return getStoredData(STORAGE_KEYS.PHARMACY_INVENTORY, INITIAL_PHARMACY_INVENTORY);
  },

  async updatePharmacyStock(id, changeAmount) {
    const inventory = getStoredData(STORAGE_KEYS.PHARMACY_INVENTORY, INITIAL_PHARMACY_INVENTORY);
    const item = inventory.find((i) => i.id === id);
    if (item) {
      item.stock = Math.max(0, item.stock + changeAmount);
      item.status = item.stock <= item.criticalThreshold ? 'Low Stock' : 'In Stock';
    }
    setStoredData(STORAGE_KEYS.PHARMACY_INVENTORY, inventory);
    return inventory;
  },

  async getPharmacyOrders() {
    return getStoredData(STORAGE_KEYS.PHARMACY_ORDERS, INITIAL_PHARMACY_ORDERS);
  },

  async createPharmacyOrder(orderData) {
    const orders = getStoredData(STORAGE_KEYS.PHARMACY_ORDERS, INITIAL_PHARMACY_ORDERS);
    const newOrder = {
      id: `RXO-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'PROCESSING',
      ...orderData,
    };
    orders.unshift(newOrder);
    setStoredData(STORAGE_KEYS.PHARMACY_ORDERS, orders);
    return newOrder;
  },

  async updatePharmacyOrderStatus(id, status) {
    const orders = getStoredData(STORAGE_KEYS.PHARMACY_ORDERS, INITIAL_PHARMACY_ORDERS);
    const order = orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      setStoredData(STORAGE_KEYS.PHARMACY_ORDERS, orders);
    }
    return order;
  },

  // System & Admin
  async getSystemStats() {
    const emergencies = getStoredData(STORAGE_KEYS.EMERGENCIES, INITIAL_EMERGENCIES);
    const ambulances = getStoredData(STORAGE_KEYS.AMBULANCES, INITIAL_AMBULANCES);
    const hospitals = getStoredData(STORAGE_KEYS.HOSPITALS, INITIAL_HOSPITALS);
    const bloodInv = getStoredData(STORAGE_KEYS.BLOOD_INVENTORY, INITIAL_BLOOD_INVENTORY);
    const totalBloodUnits = bloodInv.reduce((sum, item) => sum + item.units, 0);

    const activeEmergencies = emergencies.filter(
      (e) => e.status !== EMERGENCY_STATUS.RESOLVED && e.status !== EMERGENCY_STATUS.CANCELLED
    ).length;

    const availableAmbulances = ambulances.filter((a) => a.status === 'AVAILABLE').length;

    const totalErAvailable = hospitals.reduce((sum, h) => sum + h.erBeds.available, 0);
    const totalIcuAvailable = hospitals.reduce((sum, h) => sum + h.icuBeds.available, 0);

    return {
      activeEmergencies,
      totalEmergenciesToday: emergencies.length + 14,
      avgResponseTimeMin: 4.8,
      availableAmbulances,
      totalAmbulances: ambulances.length,
      availableErBeds: totalErAvailable,
      availableIcuBeds: totalIcuAvailable,
      totalBloodUnits,
      networkOperationalRate: '99.98%',
    };
  },

  async getAuditLogs() {
    return [
      { id: 'log_1', time: 'Just now', event: 'SOS Dispatched', detail: 'AMB-704 assigned to incident EMG-1092', user: 'System Auto-Dispatch' },
      { id: 'log_2', time: '5m ago', event: 'Bed Status Update', detail: 'City General updated ER beds to 8 available', user: 'Dr. Gregory Thorne' },
      { id: 'log_3', time: '12m ago', event: 'Blood Unit Dispatched', detail: '4 units O- delivered to Trauma Bay 2', user: 'Dr. Maya Patel' },
      { id: 'log_4', time: '28m ago', event: 'Emergency Restock', detail: 'Naloxone & EpiPens restocked at Station 4', user: 'Kenneth Ross, PharmD' },
      { id: 'log_5', time: '42m ago', event: 'Driver Check-in', detail: 'MEDIC-12 (Cardiac Care) marked AVAILABLE', user: 'Jessica Morales' },
    ];
  },
};
