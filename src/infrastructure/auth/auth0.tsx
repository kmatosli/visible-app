/**
 * ============================================================
 * File: auth0.tsx
 * Purpose: Auth0 provider for Visible.
 * Context: Wraps the app with Auth0Provider using env vars.
 * Falls back gracefully if env vars are not configured.
 * ============================================================
 */

import { Auth0Provider } from "@auth0/auth0-react";
import type { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

const domain   = import.meta.env.VITE_AUTH0_DOMAIN   as string | undefined;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;

export function AuthProvider({ children }: AuthProviderProps) {
  if (!domain || !clientId) {
    return (
      <main
        style={{
          maxWidth: "600px",
          margin: "80px auto",
          padding: "32px",
          fontFamily: "system-ui, sans-serif",
          color: "#ffffff",
          backgroundColor: "#0f1923",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <h2 style={{ marginBottom: "12px", color: "#12a592" }}>
          Auth0 Configuration Required
        </h2>
        <p style={{ color: "#7d94a8", lineHeight: 1.6 }}>
          Create a <code>.env</code> file in the project root and add:
        </p>
        <pre
          style={{
            marginTop: "12px",
            padding: "16px",
            backgroundColor: "rgba(255,255,255,0.04)",
            borderRadius: "8px",
            fontSize: "0.85rem",
            color: "#c8a84b",
          }}
        >
          {`VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com\nVITE_AUTH0_CLIENT_ID=your_client_id`}
        </pre>
        <p style={{ marginTop: "12px", color: "#7d94a8", fontSize: "0.85rem" }}>
          See <code>.env.example</code> for the full configuration reference.
        </p>
      </main>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
