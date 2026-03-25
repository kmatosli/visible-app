/**
 * ============================================================
 * File: AppHeader.tsx
 * Purpose: Navigation header with Firebase logout.
 * ============================================================
 */

import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../infrastructure/auth/AuthContext";
import type { RootState } from "../../application/store";
import type { CSSProperties } from "react";

export default function AppHeader() {
  const { logout, profile } = useAuth();
  const location = useLocation();
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/catalog", label: "Catalog" },
    { to: "/orders", label: "Case History" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoMark}>V</span>
          <span style={styles.logoText}>isible</span>
        </Link>

        {/* Nav */}
        <nav style={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...styles.navLink,
                ...(location.pathname === link.to ? styles.navLinkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={styles.actions}>
          {/* Cart badge */}
          <Link to="/cart" style={styles.cartLink}>
            🗂
            {cartCount > 0 && (
              <span style={styles.cartBadge}>{cartCount}</span>
            )}
          </Link>

          {/* User initial */}
          <Link to="/profile" style={styles.userBadge}>
            {(profile?.name ?? "V").charAt(0).toUpperCase()}
          </Link>

          {/* Logout */}
          <button
            style={styles.logoutBtn}
            onClick={() => void logout()}
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
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
    background: "rgba(15,25,35,0.95)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid var(--border)",
    fontFamily: "var(--font-sans)",
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  logo: {
    textDecoration: "none",
    display: "flex",
    alignItems: "baseline",
    gap: "1px",
    flexShrink: 0,
  },
  logoMark: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "var(--teal-light)",
    fontFamily: "var(--font-serif)",
  },
  logoText: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "var(--white)",
    fontFamily: "var(--font-serif)",
  },
  nav: {
    display: "flex",
    gap: "4px",
    flex: 1,
  },
  navLink: {
    padding: "6px 12px",
    borderRadius: "6px",
    textDecoration: "none",
    color: "var(--muted)",
    fontSize: "0.88rem",
    fontWeight: 500,
    transition: "color 0.15s",
  },
  navLinkActive: {
    color: "var(--white)",
    background: "rgba(255,255,255,0.06)",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },
  cartLink: {
    position: "relative" as const,
    fontSize: "1.2rem",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  },
  cartBadge: {
    position: "absolute" as const,
    top: "-6px",
    right: "-8px",
    background: "var(--teal)",
    color: "var(--white)",
    fontSize: "0.65rem",
    fontWeight: 700,
    borderRadius: "10px",
    minWidth: "16px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
  },
  userBadge: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(18,165,146,0.15)",
    border: "1px solid var(--teal)",
    color: "var(--teal-light)",
    fontSize: "0.85rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  logoutBtn: {
    padding: "6px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)",
    fontSize: "0.82rem",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
};
