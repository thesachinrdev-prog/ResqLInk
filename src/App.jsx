import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Context Providers
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { EmergencyProvider } from "./context/EmergencyContext";

// Common Components
import NotificationCenterPage from "./components/common/NotificationCenter";

// Public Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";

// Dashboard Pages
import { PatientDashboard } from "./pages/patient/PatientDashboard";
import { DriverDashboard } from "./pages/driver/DriverDashboard";
import { ControlRoomCenter } from "./pages/controlroom/ControlRoomCenter";
import { HospitalDashboard } from "./pages/hospital/HospitalDashboard";
import { BloodBankDashboard } from "./pages/bloodbank/BloodBankDashboard";
import { PharmacyDashboard } from "./pages/pharmacy/PharmacyDashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

// Constants
import { ROLE_CONFIG, ROLES } from "./utils/constants";

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role } = useAuth();

  // User is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role
  const currentRole = role?.toUpperCase();

  // Check role permission
  if (allowedRole && currentRole !== allowedRole) {
    const fallbackRole = ROLE_CONFIG[currentRole];

    // Redirect to user's correct dashboard
    if (fallbackRole?.path) {
      return <Navigate to={fallbackRole.path} replace />;
    }

    // Safe fallback
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================================================
   ROLE REDIRECT
========================================================= */

function RoleRedirect() {
  const { isAuthenticated, role } = useAuth();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role
  const currentRole = role?.toUpperCase();

  // Get dashboard configuration
  const roleConfig = ROLE_CONFIG[currentRole];

  // Redirect to role dashboard
  if (roleConfig?.path) {
    return <Navigate to={roleConfig.path} replace />;
  }

  // Safe fallback
  return <Navigate to="/patient/dashboard" replace />;
}

/* =========================================================
   APP ROUTES
========================================================= */

function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* =====================================================
          NOTIFICATION CENTER
      ===================================================== */}

      <Route
        path="/notifications"
        element={<NotificationCenterPage />}
      />

      {/* =====================================================
          PATIENT DASHBOARD
      ===================================================== */}

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRole={ROLES.PATIENT}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          DRIVER DASHBOARD
      ===================================================== */}

      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute allowedRole={ROLES.DRIVER}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          CONTROL ROOM DASHBOARD
      ===================================================== */}

      <Route
        path="/control/dashboard"
        element={
          <ProtectedRoute allowedRole={ROLES.CONTROL_ROOM}>
            <ControlRoomCenter />
          </ProtectedRoute>
        }
      />

      {/* Alternative Control Room URL */}
      <Route
        path="/controlroom/dashboard"
        element={
          <ProtectedRoute allowedRole={ROLES.CONTROL_ROOM}>
            <ControlRoomCenter />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          HOSPITAL DASHBOARD
      ===================================================== */}

      <Route
        path="/hospital/dashboard"
        element={
          <ProtectedRoute allowedRole={ROLES.HOSPITAL}>
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          BLOOD BANK DASHBOARD
      ===================================================== */}

      <Route
        path="/bloodbank/dashboard"
        element={
          <ProtectedRoute allowedRole={ROLES.BLOOD_BANK}>
            <BloodBankDashboard />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          PHARMACY DASHBOARD
      ===================================================== */}

      <Route
        path="/pharmacy/dashboard"
        element={
          <ProtectedRoute allowedRole={ROLES.PHARMACY}>
            <PharmacyDashboard />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          ADMIN DASHBOARD
      ===================================================== */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole={ROLES.ADMIN}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          GENERIC DASHBOARD REDIRECT
      ===================================================== */}

      <Route
        path="/dashboard"
        element={<RoleRedirect />}
      />

      {/* =====================================================
          FALLBACK ROUTE
      ===================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  return (
    <BrowserRouter>

      {/* Authentication */}
      <AuthProvider>

        {/* Socket / Real-Time Communication */}
        <SocketProvider>

          {/* Emergency / SOS Context */}
          <EmergencyProvider>

            {/* Application Routes */}
            <AppRoutes />

          </EmergencyProvider>

        </SocketProvider>

      </AuthProvider>

    </BrowserRouter>
  );
}