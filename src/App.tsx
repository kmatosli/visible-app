/**
 * ============================================================
 * File: App.tsx
 * Purpose: Main routing shell for the Visible app.
 *
 * Routes:
 *   /                    Dashboard (protected)
 *   /entries             Entry list (protected)
 *   /entries/new         Add entry form (protected)
 *   /entries/:id         Entry detail (protected)
 *   /entries/:id/edit    Edit entry form (protected)
 *   /review-ready        Review Ready flow (protected)
 *   /login               Login page (public)
 *   *                    404 redirect to dashboard
 * ============================================================
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import ProtectedRoute from "./infrastructure/auth/ProtectedRoute";
import AppHeader from "./presentation/components/AppHeader";
import LoginPage from "./presentation/pages/LoginPage";
import DashboardPage from "./presentation/pages/DashboardPage";
import EntryListPage from "./presentation/pages/EntryListPage";
import EntryDetailPage from "./presentation/pages/EntryDetailPage";
import EntryFormPage from "./presentation/pages/EntryFormPage";
import ReviewReadyPage from "./presentation/pages/ReviewReadyPage";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div style={loadingStyles}>
        <div style={spinnerStyles} />
      </div>
    );
  }

  return (
    <>
      {/* Header only shown when authenticated */}
      {isAuthenticated && <AppHeader />}

      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entries"
          element={
            <ProtectedRoute>
              <EntryListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entries/new"
          element={
            <ProtectedRoute>
              <EntryFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entries/:id"
          element={
            <ProtectedRoute>
              <EntryDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entries/:id/edit"
          element={
            <ProtectedRoute>
              <EntryFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review-ready"
          element={
            <ProtectedRoute>
              <ReviewReadyPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

const loadingStyles: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#0f1923",
};

const spinnerStyles: React.CSSProperties = {
  width: "40px",
  height: "40px",
  border: "3px solid rgba(14,124,110,0.2)",
  borderTop: "3px solid #12a592",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};
