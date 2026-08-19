import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const EmergencyContext = createContext(null);

const STORAGE_KEY = "resqlink_emergency_sos";
const EVENT_NAME = "resqlink:sos-created";

const generateSOSId = () => {
  return `SOS-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
};

const getStoredSOS = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load SOS history:", error);
    return [];
  }
};

export function EmergencyProvider({ children }) {
  const [sosHistory, setSOSHistory] = useState(getStoredSOS);
  const [activeSOS, setActiveSOS] = useState(null);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isCreatingSOS, setIsCreatingSOS] = useState(false);

  /* -------------------------------------------------------
     Save SOS history
  ------------------------------------------------------- */

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sosHistory));
    } catch (error) {
      console.error("Failed to save SOS:", error);
    }
  }, [sosHistory]);

  /* -------------------------------------------------------
     Get Current Location
  ------------------------------------------------------- */

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          latitude: null,
          longitude: null,
          accuracy: null,
          locationAvailable: false,
        });

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            locationAvailable: true,
            timestamp: new Date().toISOString(),
          });
        },

        (error) => {
          console.warn("Location unavailable:", error.message);

          resolve({
            latitude: null,
            longitude: null,
            accuracy: null,
            locationAvailable: false,
            error: error.message,
          });
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  /* -------------------------------------------------------
     CREATE SOS
  ------------------------------------------------------- */

  const createSOS = useCallback(
    async (details = {}) => {
      if (isCreatingSOS) {
        return activeSOS;
      }

      try {
        setIsCreatingSOS(true);

        // Get live GPS location immediately
        const location = await getCurrentLocation();

        const sos = {
          id: generateSOSId(),

          type: "MEDICAL_EMERGENCY",

          status: "ACTIVE",

          priority: "CRITICAL",

          createdAt: new Date().toISOString(),

          patient: {
            id:
              details.patientId ||
              localStorage.getItem("patientId") ||
              "PATIENT-UNKNOWN",

            name:
              details.patientName ||
              localStorage.getItem("patientName") ||
              "Emergency Patient",

            phone:
              details.patientPhone ||
              localStorage.getItem("patientPhone") ||
              "Not Available",
          },

          emergency: {
            reason: details.reason || "Medical Emergency",

            description:
              details.description ||
              "Emergency SOS activated by patient.",

            symptoms: details.symptoms || [],

            bloodGroup: details.bloodGroup || "Unknown",
          },

          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            locationAvailable: location.locationAvailable,

            googleMapsUrl:
              location.latitude !== null &&
              location.longitude !== null
                ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
                : null,
          },

          controlRoom: {
            notified: true,

            notifiedAt: new Date().toISOString(),

            notificationStatus: "SENT",
          },
        };

        // Save as active emergency
        setActiveSOS(sos);

        // Add to history
        setSOSHistory((previous) => [sos, ...previous]);

        // Persist immediately
        localStorage.setItem(STORAGE_KEY, JSON.stringify([sos, ...sosHistory]));

        // Notify other frontend components
        window.dispatchEvent(
          new CustomEvent(EVENT_NAME, {
            detail: sos,
          })
        );

        // Also dispatch a generic event for Control Room
        window.dispatchEvent(
          new CustomEvent("resqlink:control-room-alert", {
            detail: sos,
          })
        );

        console.log("🚨 RESQLINK SOS CREATED:", sos);

        return sos;
      } catch (error) {
        console.error("SOS creation failed:", error);

        throw error;
      } finally {
        setIsCreatingSOS(false);
      }
    },
    [
      activeSOS,
      getCurrentLocation,
      isCreatingSOS,
      sosHistory,
    ]
  );

  /* -------------------------------------------------------
     CANCEL SOS
  ------------------------------------------------------- */

  const cancelSOS = useCallback((sosId = null) => {
    setActiveSOS((current) => {
      if (!current) {
        return null;
      }

      if (sosId && current.id !== sosId) {
        return current;
      }

      const updatedSOS = {
        ...current,
        status: "CANCELLED",
        cancelledAt: new Date().toISOString(),
      };

      setSOSHistory((history) =>
        history.map((item) =>
          item.id === current.id ? updatedSOS : item
        )
      );

      window.dispatchEvent(
        new CustomEvent("resqlink:sos-cancelled", {
          detail: updatedSOS,
        })
      );

      return null;
    });
  }, []);

  /* -------------------------------------------------------
     RESOLVE SOS
  ------------------------------------------------------- */

  const resolveSOS = useCallback((sosId) => {
    setSOSHistory((history) =>
      history.map((item) =>
        item.id === sosId
          ? {
              ...item,
              status: "RESOLVED",
              resolvedAt: new Date().toISOString(),
            }
          : item
      )
    );

    setActiveSOS((current) =>
      current?.id === sosId ? null : current
    );
  }, []);

  /* -------------------------------------------------------
     UPDATE SOS
  ------------------------------------------------------- */

  const updateSOS = useCallback((sosId, updates) => {
    setSOSHistory((history) =>
      history.map((item) =>
        item.id === sosId
          ? {
              ...item,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    setActiveSOS((current) =>
      current?.id === sosId
        ? {
            ...current,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : current
    );
  }, []);

  /* -------------------------------------------------------
     OPEN / CLOSE SOS MODAL
  ------------------------------------------------------- */

  const openSOSModal = useCallback(() => {
    setIsSOSModalOpen(true);
  }, []);

  const closeSOSModal = useCallback(() => {
    setIsSOSModalOpen(false);
  }, []);

  /* -------------------------------------------------------
     Listen for SOS events
  ------------------------------------------------------- */

  useEffect(() => {
    const handleExternalSOS = (event) => {
      const sos = event.detail;

      if (!sos?.id) {
        return;
      }

      setActiveSOS(sos);

      setSOSHistory((history) => {
        const alreadyExists = history.some(
          (item) => item.id === sos.id
        );

        if (alreadyExists) {
          return history;
        }

        return [sos, ...history];
      });
    };

    window.addEventListener(EVENT_NAME, handleExternalSOS);

    return () => {
      window.removeEventListener(EVENT_NAME, handleExternalSOS);
    };
  }, []);

  /* -------------------------------------------------------
     Context Value
  ------------------------------------------------------- */

  const value = useMemo(
    () => ({
      // SOS state
      sosHistory,
      activeSOS,

      // Modal state
      isSOSModalOpen,
      openSOSModal,
      closeSOSModal,

      // SOS actions
      createSOS,
      cancelSOS,
      resolveSOS,
      updateSOS,

      // Loading
      isCreatingSOS,

      // Location
      getCurrentLocation,

      // Status
      hasActiveSOS: Boolean(activeSOS),
    }),
    [
      sosHistory,
      activeSOS,
      isSOSModalOpen,
      openSOSModal,
      closeSOSModal,
      createSOS,
      cancelSOS,
      resolveSOS,
      updateSOS,
      isCreatingSOS,
      getCurrentLocation,
    ]
  );

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
}

/* -------------------------------------------------------
   Hook
------------------------------------------------------- */

export function useEmergency() {
  const context = useContext(EmergencyContext);

  if (!context) {
    throw new Error(
      "useEmergency must be used inside EmergencyProvider."
    );
  }

  return context;
}

export default EmergencyContext;