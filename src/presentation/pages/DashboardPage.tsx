/**
 * ============================================================
 * File: DashboardPage.tsx
 * Purpose: Home screen after login.
 * Shows the three doors and a quick entry into Review Ready.
 * Assignment requirement: Home page with navigation.
 * ============================================================
 */

import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import type { CSSProperties } from "react";

export default function DashboardPage() {
  const { user } = useAuth0();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* Welcome */}
        <div style={styles.welcomeSection}>
          <span style={styles.eyebrow}>Career Decision Intelligence</span>
          <h1 style={styles.headline}>
            Welcome back, {firstName}.
          </h1>
          <p style={styles.subText}>
            Where do you need leverage today?
          </p>
        </div>

        {/* Three Doors */}
        <div style={styles.doorsGrid}>

          <div style={styles.doorCard}>
            <div style={styles.doorNumber}>01</div>
            <h2 style={styles.doorTitle}>Review Ready</h2>
            <span style={styles.doorProblem}>
              Performance review coming up
            </span>
            <p style={styles.doorDescription}>
              Five questions. Fifteen minutes. A document that makes
              your case for you in business value language.
            </p>
            <p style={styles.doorPromise}>
              Walk in with a stronger case than your manager expects.
            </p>
            <Link to="/review-ready" style={styles.doorButton}>
              Start Building My Case →
            </Link>
          </div>

          <div style={{ ...styles.doorCard, ...styles.doorCardDim }}>
            <div style={styles.doorNumber}>02</div>
            <h2 style={styles.doorTitle}>Offer Lens</h2>
            <span style={styles.doorProblem}>
              Job offer on the table
            </span>
            <p style={styles.doorDescription}>
              Calculate the real value of any offer including work
              mode costs, financial anchors forfeited, and trajectory.
            </p>
            <p style={styles.doorPromise}>
              Know what the offer is actually worth before you say yes.
            </p>
            <span style={styles.comingSoon}>Coming Soon</span>
          </div>

          <div style={{ ...styles.doorCard, ...styles.doorCardDim }}>
            <div style={styles.doorNumber}>03</div>
            <h2 style={styles.doorTitle}>Signal Check</h2>
            <span style={styles.doorProblem}>
              Something feels wrong
            </span>
            <p style={styles.doorDescription}>
              A structured assessment of your compensation trajectory,
              visibility, sponsorship, and ceiling patterns.
            </p>
            <p style={styles.doorPromise}>
              Stop guessing whether it is time to go.
            </p>
            <span style={styles.comingSoon}>Coming Soon</span>
          </div>

        </div>

        {/* Quick action bar */}
        <div style={styles.quickBar}>
          <p style={styles.quickLabel}>Your contribution record</p>
          <div style={styles.quickActions}>
            <Link to="/entries" style={styles.quickLink}>
              View All Entries
            </Link>
            <Link to="/entries/new" style={styles.quickLinkPrimary}>
              + Add New Entry
            </Link>
          </div>
        </div>

        {/* API mode indicator — visible in dev only */}
        {import.meta.env.DEV && (
          <p style={styles.devNote}>
            API mode: {import.meta.env.VITE_API_MODE ?? "fakestore"}
          </p>
        )}

      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "var(--ink)",
    padding: "48px 24px",
    fontFamily: "var(--font-sans)",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  welcomeSection: {
    marginBottom: "48px",
  },
  eyebrow: {
    display: "inline-block",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "3px",
    textTransform: "uppercase" as const,
    color: "var(--teal-light)",
    marginBottom: "12px",
    padding: "4px 10px",
    border: "1px solid rgba(18,165,146,0.25)",
    borderRadius: "4px",
    background: "rgba(18,165,146,0.06)",
  },
  headline: {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "8px",
    lineHeight: 1.1,
  },
  subText: {
    fontSize: "1rem",
    color: "var(--muted)",
    fontWeight: 300,
  },
  doorsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  doorCard: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    transition: "all 0.3s",
  },
  doorCardDim: {
    opacity: 0.55,
  },
  doorNumber: {
    fontFamily: "var(--font-serif)",
    fontSize: "3rem",
    fontWeight: 700,
    color: "rgba(14,124,110,0.2)",
    lineHeight: 1,
  },
  doorTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "var(--white)",
  },
  doorProblem: {
    fontSize: "0.82rem",
    color: "var(--teal-light)",
    fontWeight: 500,
    padding: "4px 10px",
    background: "var(--teal-glow)",
    borderRadius: "4px",
    display: "inline-block",
    width: "fit-content",
  },
  doorDescription: {
    fontSize: "0.88rem",
    color: "var(--muted)",
    lineHeight: 1.65,
    fontWeight: 300,
    flex: 1,
  },
  doorPromise: {
    fontFamily: "var(--font-serif)",
    fontSize: "1rem",
    fontStyle: "italic",
    color: "var(--white)",
    borderLeft: "2px solid var(--gold)",
    paddingLeft: "10px",
  },
  doorButton: {
    display: "inline-block",
    background: "var(--teal)",
    color: "var(--white)",
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "7px",
    fontSize: "0.85rem",
    fontWeight: 600,
    marginTop: "4px",
    width: "fit-content",
  },
  comingSoon: {
    display: "inline-block",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    color: "var(--muted)",
    border: "1px solid var(--border)",
    padding: "6px 14px",
    borderRadius: "6px",
    marginTop: "4px",
    width: "fit-content",
  },
  quickBar: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  quickLabel: {
    fontSize: "0.88rem",
    color: "var(--muted)",
    fontWeight: 300,
  },
  quickActions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  quickLink: {
    color: "var(--muted)",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 500,
    padding: "8px 16px",
    border: "1px solid var(--border)",
    borderRadius: "6px",
  },
  quickLinkPrimary: {
    color: "var(--white)",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 600,
    padding: "8px 16px",
    background: "var(--teal)",
    borderRadius: "6px",
  },
  devNote: {
    marginTop: "24px",
    fontSize: "0.72rem",
    color: "var(--muted)",
    fontStyle: "italic",
  },
};
