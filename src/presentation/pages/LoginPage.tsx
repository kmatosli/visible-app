/**
 * ============================================================
 * File: LoginPage.tsx
 * Purpose: Public entry point for Visible.
 * Auth0 Universal Login handles the actual authentication.
 * ============================================================
 */

import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import type { CSSProperties } from "react";

export default function LoginPage() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <main style={styles.page}>
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <span style={styles.eyebrow}>Career Decision Intelligence</span>

        <h1 style={styles.headline}>
          Know your leverage<br />
          <span style={{ color: "var(--gold)" }}>before the meeting.</span>
        </h1>

        <p style={styles.body}>
          Your employer knows what your work is worth.
          You should too. Visible gives you the evidence,
          the language, and the analysis to walk into your
          next career moment with complete information.
        </p>

        <button
          style={styles.primaryButton}
          onClick={() => { void loginWithRedirect(); }}
        >
          Sign In to Visible
        </button>

        <p style={styles.note}>
          Free to start. No subscription required to experience value.
        </p>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "32px",
    backgroundColor: "var(--ink)",
    fontFamily: "var(--font-sans)",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "var(--ink-mid)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "var(--shadow-lg)",
  },
  eyebrow: {
    display: "inline-block",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "3px",
    textTransform: "uppercase" as const,
    color: "var(--teal-light)",
    marginBottom: "16px",
    padding: "4px 10px",
    border: "1px solid rgba(18,165,146,0.25)",
    borderRadius: "4px",
    background: "rgba(18,165,146,0.06)",
  },
  headline: {
    fontFamily: "var(--font-serif)",
    fontSize: "2.2rem",
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: "16px",
    color: "var(--white)",
  },
  body: {
    fontSize: "0.95rem",
    color: "var(--muted)",
    lineHeight: 1.75,
    fontWeight: 300,
    marginBottom: "28px",
  },
  primaryButton: {
    display: "block",
    width: "100%",
    background: "var(--teal)",
    color: "var(--white)",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    letterSpacing: "0.2px",
  },
  note: {
    fontSize: "0.78rem",
    color: "var(--muted)",
    textAlign: "center" as const,
    marginTop: "12px",
    fontWeight: 300,
  },
};
