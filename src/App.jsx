// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./Pages/Login";
import VerifyOTP from "./Pages/VerifyOTP";
import Dashboard from "./Pages/Dashboard";
import Tickets from "./Pages/Tickets";
import TicketDetails from "./Pages/TicketDetails";
import CreateTicket from "./Pages/CreateTicket";
import AssignTicket from "./Pages/AssignTicket";
import EditTicket from "./Pages/EditTicket";
import Reports from "./Pages/Reports";
import Settings from "./Pages/Settings";
import TicketLookup from "./Pages/TicketLookup";
import TicketHistory from "./Pages/TicketHistory";
import CallsByStatus from "./Pages/CallsByStatus";

import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth Pages */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
          </Route>

          {/* Protected Pages with AppLayout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Main pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="tickets/create" element={<CreateTicket />} />
            <Route path="tickets/:ticketId" element={<TicketDetails />} />
            <Route path="tickets/:ticketId/history" element={<TicketHistory />} />
            <Route path="tickets/:ticketId/edit" element={<EditTicket />} />
            <Route path="calls-by-status" element={<CallsByStatus />} />
            <Route path="ticket-lookup" element={<TicketLookup />} />
            <Route path="settings" element={<Settings />} />

            {/* Admin/Supervisor only pages */}
            <Route
              path="tickets/:ticketId/assign"
              element={
                <ProtectedRoute roles={["admin", "supervisor"]}>
                  <AssignTicket />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute roles={["admin", "supervisor"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all fallback (must be last) */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}