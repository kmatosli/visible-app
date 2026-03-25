/**
 * ============================================================
 * File: LoginPage.tsx
 * Purpose: Public entry point. Firebase email/password auth.
 * Handles both login and registration in one page.
 * ============================================================
 */

import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../infrastructure/auth/AuthContext";
import type { CSSProperties } from "react";

type Mode = "login" | "register";

export default function LoginPage() {
  const { isAuthenticated, isLoading, login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError("Name is required.");
          setSubmitting(false);
          return;
        }
        await register(email, password, name);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      setError(msg.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim());
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* Mode toggle */}
        <div style={styles.modeRow}>
          <button
            style={mode === "login" ? styles.modeActive : styles.modeInactive}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Sign In
          </button>
          <button
            style={mode === "register" ? styles.modeActive : styles.modeInactive}
            onClick={() => { setMode("register"); setError(""); }}
          >
            Create Account
          </button>
        </div>

        {/* Name field — register only */}
        {mode === "register" && (
          <input
            style={styles.input}
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          style={styles.input}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") void handleSubmit(); }}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={{
            ...styles.primaryButton,
            opacity: submitting ? 0.7 : 1,
          }}
          onClick={() => void handleSubmit()}
          disabled={submitting}
        >
          {submitting
            ? "Please wait..."
            : mode === "login"
            ? "Sign In to Visible"
            : "Create My Account"}
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
    marginBottom: "24px",
  },
  modeRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
  },
  modeActive: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid var(--teal)",
    background: "rgba(18,165,146,0.12)",
    color: "var(--teal-light)",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  modeInactive: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)",
    fontWeight: 400,
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--ink)",
    color: "var(--white)",
    fontSize: "0.95rem",
    fontFamily: "var(--font-sans)",
    marginBottom: "12px",
    boxSizing: "border-box" as const,
    outline: "none",
  },
  error: {
    color: "#f87171",
    fontSize: "0.85rem",
    marginBottom: "12px",
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
    marginTop: "4px",
  },
  note: {
    fontSize: "0.78rem",
    color: "var(--muted)",
    textAlign: "center" as const,
    marginTop: "12px",
    fontWeight: 300,
  },
};
