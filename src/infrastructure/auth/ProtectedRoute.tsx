/**
 * ============================================================
 * File: ProtectedRoute.tsx
 * Purpose: Route guard using Auth0 authentication state.
 * Redirects unauthenticated users to Auth0 Universal Login.
 * ============================================================
 */

import { useEffect, type ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading) {
    return (
      <div style={loadingStyles}>
        <p style={{ color: "#7d94a8" }}>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={loadingStyles}>
        <p style={{ color: "#7d94a8" }}>Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}

const loadingStyles: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#0f1923",
  fontFamily: "system-ui, sans-serif",
};
