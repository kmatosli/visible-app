/**
 * ============================================================
 * File: ProtectedRoute.tsx
 * Purpose: Route guard using Firebase auth.
 * Redirects unauthenticated users to /login.
 * ============================================================
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={loadingStyles}>
        <div style={spinnerStyles} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
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
