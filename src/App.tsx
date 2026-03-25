/**
 * ============================================================
 * File: App.tsx
 * Purpose: Main routing shell for Visible.
 *
 * Routes:
 *   /          Dashboard (protected)
 *   /catalog   Product catalog with category filter
 *   /cart      Promotion case builder / shopping cart
 *   /orders    Order history
 *   /profile   User profile (CRUD)
 *   /login     Login / Register
 *   *          Redirect to /
 * ============================================================
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./infrastructure/auth/AuthContext";

import ProtectedRoute from "./infrastructure/auth/ProtectedRoute";
import AppHeader from "./presentation/components/AppHeader";
import LoginPage from "./presentation/pages/LoginPage";
import DashboardPage from "./presentation/pages/DashboardPage";
import CatalogPage from "./presentation/pages/CatalogPage";
import CartPage from "./presentation/pages/CartPage";
import OrdersPage from "./presentation/pages/OrdersPage";
import ProfilePage from "./presentation/pages/ProfilePage";

export default function App() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div style={loadingStyles}>
        <div style={spinnerStyles} />
      </div>
    );
  }

  return (
    <>
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
          path="/catalog"
          element={
            <ProtectedRoute>
              <CatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
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
