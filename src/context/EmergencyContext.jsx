import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../services/api";
import { EMERGENCY_STATUS } from "../utils/constants";
import { playAlertChime, playSuccessTone } from "../utils/audio";

const EmergencyContext = createContext(null);

const STORAGE_KEY = "resqlink_emergency_sos";
const EVENT_NAME = "resqlink:sos-created";

// Global simulation timer storage
let simulationTimers = [];

export function EmergencyProvider({ children }) {
  const [emergencies, setEmergencies] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [bloodInventory, setBloodInventory] = useState([]);
  const [pharmacyInventory, setPharmacyInventory] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [pharmacyOrders, setPharmacyOrders] = useState([]);

  const [activeSOS, setActiveSOS] = useState(null);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isCreatingSOS, setIsCreatingSOS] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: "notif_1",
      type: "critical",
      title: "🚨 Beacon Monitor Online",
      message: "ResQLink active standby. GPS tracking available.",
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
      read: false,
    },
  ]);

  // Load all data from localStorage API client
  const loadAllData = useCallback(async () => {
    try {
      const [e, a, h, bInv, pInv, bReq, pOrd] = await Promise.all([
        api.getEmergencies(),
        api.getAmbulances(),
        api.getHospitals(),
        api.getBloodInventory(),
        api.getPharmacyInventory(),
        api.getBloodRequests(),
        api.getPharmacyOrders(),
      ]);

      setEmergencies(e || []);
      setAmbulances(a || []);
      setHospitals(h || []);
      setBloodInventory(bInv || []);
      setPharmacyInventory(pInv || []);
      setBloodRequests(bReq || []);
      setPharmacyOrders(pOrd || []);

      // Check if there is an active emergency in the list
      const active = (e || []).find(
        (item) =>
          item.status !== EMERGENCY_STATUS.RESOLVED &&
          item.status !== EMERGENCY_STATUS.CANCELLED
      );
      setActiveSOS(active || null);
    } catch (err) {
      console.error("Failed to load ResQLink data:", err);
    }
  }, []);

  // Sync data across tabs when storage changes
  useEffect(() => {
    loadAllData();

    const handleSync = () => {
      loadAllData();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("resqlink:sos-created", handleSync);
    window.addEventListener("resqlink:sos-cancelled", handleSync);
    window.addEventListener("resqlink:sync-data", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("resqlink:sos-created", handleSync);
      window.removeEventListener("resqlink:sos-cancelled", handleSync);
      window.removeEventListener("resqlink:sync-data", handleSync);
    };
  }, [loadAllData]);

  // Notifications Actions
  const addNotification = useCallback((type, title, message) => {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);

    if (soundEnabled) {
      if (type === "critical") {
        playAlertChime();
      } else {
        playSuccessTone();
      }
    }
  }, [soundEnabled]);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Modal Actions
  const openSOSModal = useCallback(() => {
    setIsSOSModalOpen(true);
  }, []);

  const closeSOSModal = useCallback(() => {
    setIsSOSModalOpen(false);
  }, []);

  // Clear any running simulation timers
  const clearSimulation = useCallback(() => {
    simulationTimers.forEach((timer) => clearTimeout(timer));
    simulationTimers = [];
  }, []);

  // Main high-fidelity emergency simulation state machine loop (14 stages)
  const runSimulation = useCallback((emergencyId) => {
    clearSimulation();

    const scheduleStage = (delayMs, action) => {
      const timer = setTimeout(async () => {
        try {
          await action();
          // Broadcast sync event to other tabs
          window.dispatchEvent(new CustomEvent("resqlink:sync-data"));
        } catch (e) {
          console.error("Simulation step error:", e);
        }
      }, delayMs);
      simulationTimers.push(timer);
    };

    // Stage 1: ACTIVE / SOS_ACTIVATED (happened immediately)

    // Stage 2: LOCATION_DETECTED (2s)
    scheduleStage(2000, async () => {
      await api.updateEmergencyStatus(
        emergencyId,
        "LOCATION_DETECTED",
        "GPS coordinates resolved: Anna Nagar, Madurai (Accuracy: ±8 meters)"
      );
      addNotification("info", "📍 Location Shared", "Accurate GPS coordinates broadcasted to central dispatch.");
      await loadAllData();
    });

    // Stage 3: CONTROL_ROOM_NOTIFIED (4s)
    scheduleStage(4000, async () => {
      await api.updateEmergencyStatus(
        emergencyId,
        "CONTROL_ROOM_NOTIFIED",
        "Control Room Alerted. Handshake confirmed by dispatcher."
      );
      addNotification("info", "🖥️ Control Room Alerted", "Command center has received your SOS beacon.");
      await loadAllData();
    });

    // Stage 4: SEARCHING_DRIVER (6s)
    scheduleStage(6000, async () => {
      await api.updateEmergencyStatus(
        emergencyId,
        "SEARCHING_DRIVER",
        "Scanning nearby available advanced life support (ALS) ambulances..."
      );
      addNotification("info", "🚑 Scanning Fleet", "Finding nearby responders.");
      await loadAllData();
    });

    // Stage 5: DRIVER_ASSIGNED / AMBULANCE_ASSIGNED (8s)
    scheduleStage(8000, async () => {
      const currentEmergencies = await api.getEmergencies();
      const emg = currentEmergencies.find((e) => e.id === emergencyId);
      const ambulancesList = await api.getAmbulances();
      const availableAmb = ambulancesList.find((a) => a.status === "AVAILABLE") || ambulancesList[0];

      if (emg && availableAmb) {
        // Manually update data in api client to assign ambulance
        await api.assignAmbulance(emergencyId, availableAmb.id);
        // Overwrite driver info specifically for high fidelity requirements:
        // John Driver, TN 58 AB 1234, ETA: 5 min, 2.4 km
        const updatedEmergencies = await api.getEmergencies();
        const updatedEmg = updatedEmergencies.find((e) => e.id === emergencyId);
        if (updatedEmg) {
          updatedEmg.driverName = "John Driver";
          updatedEmg.driverPhone = "+91 98765 43210";
          updatedEmg.ambulanceNumber = "TN 58 AB 1234";
          updatedEmg.distanceKm = 2.4;
          updatedEmg.eta = "5 min";
          updatedEmergencies.forEach((item, idx) => {
            if (item.id === emergencyId) updatedEmergencies[idx] = updatedEmg;
          });
          localStorage.setItem("resqlink_emergencies", JSON.stringify(updatedEmergencies));
        }

        addNotification("critical", "🚑 Ambulance Dispatched", "Ambulance TN 58 AB 1234 (John Driver) is en route. ETA: 5 min.");
      }
      await loadAllData();
    });

    // Stage 6: SEARCHING_HOSPITAL (10s)
    scheduleStage(10000, async () => {
      await api.updateEmergencyStatus(
        emergencyId,
        "SEARCHING_HOSPITAL",
        "Evaluating nearest trauma centers for emergency bed and ICU capacity..."
      );
      await loadAllData();
    });

    // Stage 7: HOSPITAL_SELECTED (12s)
    scheduleStage(12000, async () => {
      const currentEmergencies = await api.getEmergencies();
      const emg = currentEmergencies.find((e) => e.id === emergencyId);
      if (emg) {
        // Apollo Hospital recommended with distance 2.8 km, ETA 8 min
        emg.hospitalId = "hosp_2";
        emg.hospitalName = "Apollo Hospital";
        emg.timeline.push({
          status: "HOSPITAL_SELECTED",
          time: new Date().toISOString(),
          message: "Apollo Hospital selected. ER Beds: 12 Open, ICU Beds: 4 Open.",
        });
        localStorage.setItem("resqlink_emergencies", JSON.stringify(currentEmergencies));
        addNotification("info", "🏥 Hospital Pre-Allocated", "Apollo Hospital ER Bay reserved for incoming transfer.");
      }
      await loadAllData();
    });

    // Stage 8: DRIVER_EN_ROUTE (14s)
    scheduleStage(14000, async () => {
      await api.updateEmergencyStatus(
        emergencyId,
        EMERGENCY_STATUS.EN_ROUTE,
        "Driver John Driver confirmed route. Navigating to pickup address."
      );
      await loadAllData();
    });

    // Stage 9: ARRIVED_PICKUP (20s)
    scheduleStage(20000, async () => {
      await api.updateEmergencyStatus(
        emergencyId,
        EMERGENCY_STATUS.ON_SCENE,
        "Ambulance arrived at patient's location. Initiating triage."
      );
      addNotification("critical", "🚨 Ambulance Arrived", "Paramedics are on scene.");
      await loadAllData();
    });

    // Stage 10: PATIENT_ONBOARD (24s)
    scheduleStage(24000, async () => {
      await api.updateEmergencyStatus(
        emergencyId,
        EMERGENCY_STATUS.TRANSPORTING,
        "Patient onboard. Transporting to Apollo Hospital under high priority."
      );
      addNotification("info", "🚑 Patient Onboard", "Transfer to hospital is in progress.");
      await loadAllData();
    });

    // Stage 11: EN_ROUTE_HOSPITAL (28s)
    scheduleStage(28000, async () => {
      await api.updateEmergencyStatus(
        emergencyId,
        EMERGENCY_STATUS.TRANSPORTING,
        "En route to Apollo Hospital. Vital signs stabilized."
      );
      await loadAllData();
    });

    // Stage 12: ARRIVED_HOSPITAL (32s)
    scheduleStage(32000, async () => {
      await api.updateEmergencyStatus(
        emergencyId,
        EMERGENCY_STATUS.ARRIVED,
        "Arrived at Apollo Hospital ER Bay. Commencing medical handover."
      );
      addNotification("info", "🏥 Arrived at Hospital", "Ambulance arrived at trauma bay.");
      await loadAllData();
    });

    // Stage 13: COMPLETED (36s)
    scheduleStage(36000, async () => {
      await api.updateEmergencyStatus(
        emergencyId,
        EMERGENCY_STATUS.RESOLVED,
        "Handover complete. Patient admitted. SOS resolved."
      );
      addNotification("info", "✅ Incident Resolved", "Emergency case successfully completed.");
      clearSimulation();
      await loadAllData();
    });
  }, [addNotification, loadAllData, clearSimulation]);

  // Create SOS
  const createSOS = useCallback(async (details = {}) => {
    setIsCreatingSOS(true);
    try {
      // Use fallback GPS coordinates if navigator.geolocation fails
      let lat = 9.9252;
      let lng = 78.1198;
      let accuracy = 50;

      try {
        const pos = await new Promise((res, rej) => {
          if (!navigator.geolocation) rej(new Error("No Geolocation"));
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 4000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        accuracy = pos.coords.accuracy;
      } catch (err) {
        console.warn("Using fallback coordinates:", err.message);
      }

      const sos = await api.createSOS({
        patientId: details.patientId || "user_patient",
        patientName: details.patientName || "Sarah Jenkins",
        patientPhone: details.patientPhone || "+1 (555) 234-5678",
        category: details.category || "general",
        categoryLabel: details.categoryLabel || "Emergency SOS Beacon",
        severity: "CRITICAL",
        lat,
        lng,
        accuracy,
        address: details.address || "Anna Nagar, Madurai",
        notes: details.notes || "Emergency SOS activated by patient mobile app.",
        bloodGroup: details.bloodGroup || "O+",
        allergies: details.allergies || "Penicillin, Peanuts",
        medicalConditions: details.medicalConditions || "Mild Asthma, Hypertension",
      });

      setActiveSOS(sos);
      setIsSOSModalOpen(false);

      // Trigger automatic simulation flow
      runSimulation(sos.id);

      // Dispatch local event
      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
          detail: sos,
        })
      );

      addNotification("critical", "🚨 SOS Emergency Beacon Triggered", "Your GPS location is shared with emergency dispatchers.");

      return sos;
    } catch (error) {
      console.error("SOS creation error:", error);
      throw error;
    } finally {
      setIsCreatingSOS(false);
    }
  }, [runSimulation, addNotification]);

  // Cancel SOS
  const cancelSOS = useCallback(async (sosId = null, reason = "Cancelled by patient") => {
    clearSimulation();
    try {
      const currentActive = activeSOS;
      if (currentActive) {
        await api.updateEmergencyStatus(currentActive.id, EMERGENCY_STATUS.CANCELLED, reason);
        addNotification("info", "🚨 SOS Beacon Deactivated", `Emergency request ${currentActive.id} cancelled.`);
      }
      setActiveSOS(null);
      await loadAllData();

      window.dispatchEvent(
        new CustomEvent("resqlink:sos-cancelled", {
          detail: { id: sosId },
        })
      );
    } catch (e) {
      console.error("Cancel SOS failed:", e);
    }
  }, [activeSOS, clearSimulation, addNotification, loadAllData]);

  // Resolve SOS
  const resolveSOS = useCallback(async (sosId) => {
    clearSimulation();
    try {
      await api.updateEmergencyStatus(sosId, EMERGENCY_STATUS.RESOLVED, "Resolved by coordinator");
      addNotification("info", "✅ SOS Resolved", `Emergency request ${sosId} resolved.`);
      setActiveSOS(null);
      await loadAllData();
    } catch (e) {
      console.error("Resolve SOS failed:", e);
    }
  }, [clearSimulation, addNotification, loadAllData]);

  // Other contextual functions
  const updateEmergencyStatus = useCallback(async (id, status, notes = "") => {
    const updated = await api.updateEmergencyStatus(id, status, notes);
    await loadAllData();
    return updated;
  }, [loadAllData]);

  const assignAmbulance = useCallback(async (emergencyId, ambulanceId) => {
    const res = await api.assignAmbulance(emergencyId, ambulanceId);
    await loadAllData();
    return res;
  }, [loadAllData]);

  const updateHospitalBeds = useCallback(async (hospitalId, bedUpdates) => {
    const res = await api.updateHospitalBeds(hospitalId, bedUpdates);
    await loadAllData();
    return res;
  }, [loadAllData]);

  const requestBlood = useCallback(async (reqData) => {
    const res = await api.createBloodRequest(reqData);
    addNotification("critical", "🩸 Blood Bank Alerted", `Urgent ${reqData.units} units of ${reqData.bloodGroup} requested.`);
    await loadAllData();
    return res;
  }, [addNotification, loadAllData]);

  const updateBloodStock = useCallback(async (group, delta) => {
    await api.updateBloodInventory(group, delta);
    await loadAllData();
  }, [loadAllData]);

  const createPharmacyOrder = useCallback(async (orderData) => {
    const res = await api.createPharmacyOrder(orderData);
    addNotification("info", "💊 Pharmacy Ordered", `Emergency pharmaceuticals order received.`);
    await loadAllData();
    return res;
  }, [addNotification, loadAllData]);

  const updatePharmacyStock = useCallback(async (id, delta) => {
    await api.updatePharmacyStock(id, delta);
    await loadAllData();
  }, [loadAllData]);

  const value = useMemo(
    () => ({
      emergencies,
      ambulances,
      hospitals,
      bloodInventory,
      pharmacyInventory,
      bloodRequests,
      pharmacyOrders,
      soundEnabled,
      setSoundEnabled,

      activeSOS,
      hasActiveSOS: Boolean(activeSOS),

      isSOSModalOpen,
      openSOSModal,
      closeSOSModal,

      createSOS,
      triggerSOS: createSOS,
      cancelSOS,
      resolveSOS,
      updateEmergencyStatus,
      assignAmbulance,
      updateHospitalBeds,
      requestBlood,
      updateBloodStock,
      createPharmacyOrder,
      updatePharmacyStock,

      isCreatingSOS,
      notifications,
      recentNotifications: notifications,
      addNotification,
      markNotificationRead,
      clearAllNotifications,
    }),
    [
      emergencies,
      ambulances,
      hospitals,
      bloodInventory,
      pharmacyInventory,
      bloodRequests,
      pharmacyOrders,
      soundEnabled,
      activeSOS,
      isSOSModalOpen,
      createSOS,
      cancelSOS,
      resolveSOS,
      updateEmergencyStatus,
      assignAmbulance,
      updateHospitalBeds,
      requestBlood,
      updateBloodStock,
      createPharmacyOrder,
      updatePharmacyStock,
      isCreatingSOS,
      notifications,
      addNotification,
      markNotificationRead,
      clearAllNotifications,
    ]
  );

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error("useEmergency must be used inside EmergencyProvider.");
  }
  return context;
}

export default EmergencyContext;