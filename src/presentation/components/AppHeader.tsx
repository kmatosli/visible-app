/**
 * ============================================================
 * File: AppHeader.tsx
 * Purpose: Top navigation for the authenticated Visible app.
 * Shows the current user, navigation links, and logout.
 * ============================================================
 */

import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";

export default function AppHeader() {
  const { user, logout } = useAuth0();
  const location = useLocation();

  function isActive(path: string): boolean {
    return location.pathname === path ||
      location.pathname.startsWith(path + "/");
  }

  return (
    <header style={styles.header}>
      <div style={styles.inner}>

        {/* Brand */}
        <Link to="/" style={styles.brand}>
          Visi<span style={{ color: "var(--teal-light)" }}>ble</span>
        </Link>

        {/* Nav links */}
        <nav style={styles.nav}>
          <Link
            to="/"
            style={{
              ...styles.navLink,
              ...(isActive("/") && location.pathname === "/" ? styles.navLinkActive : {}),
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/entries"
            style={{
              ...styles.navLink,
              ...(isActive("/entries") ? styles.navLinkActive : {}),
            }}
          >
            Contributions
          </Link>
          <Link
            to="/entries/new"
            style={{
              ...styles.navLink,
              ...(location.pathname === "/entries/new" ? styles.navLinkActive : {}),
            }}
          >
            + Add Entry
          </Link>
          <Link
            to="/review-ready"
            style={{
              ...styles.navLink,
              ...(isActive("/review-ready") ? styles.navLinkActive : {}),
            }}
          >
            Review Ready
          </Link>
        </nav>

        {/* User and logout */}
        <div style={styles.userSection}>
          {user?.name && (
            <span style={styles.userName}>
              {user.name}
            </span>
          )}
          <button
            style={styles.logoutButton}
            onClick={() => {
              void logout({
                logoutParams: { returnTo: window.location.origin },
              });
            }}
          >
            Sign Out
          </button>
        </div>

      </div>
    </header>
  );
}

const styles: Record<string, CSSProperties> = {
  header: {
    backgroundColor: "rgba(15,25,35,0.97)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    padding: "0 24px",
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
  },
  brand: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "var(--white)",
    textDecoration: "none",
    flexShrink: 0,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flex: 1,
  },
  navLink: {
    color: "var(--muted)",
    textDecoration: "none",
    fontSize: "0.82rem",
    fontWeight: 500,
    letterSpacing: "0.5px",
    padding: "6px 12px",
    borderRadius: "6px",
    transition: "all 0.2s",
  },
  navLinkActive: {
    color: "var(--white)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },
  userName: {
    fontSize: "0.8rem",
    color: "var(--muted)",
    fontWeight: 300,
  },
  logoutButton: {
    background: "transparent",
    border: "1px solid rgba(125,148,168,0.25)",
    color: "var(--muted)",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "0.78rem",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    transition: "all 0.2s",
  },
};
