/**
 * ============================================================
 * File: CartPage.tsx
 * Purpose: Shopping cart / Promotion case builder.
 * Assignment 9: Cart display, remove, total, checkout
 * Assignment 10: Checkout saves order to Firestore
 * ============================================================
 */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  resetCheckout,
} from "../../application/store";
import { ordersRepo } from "../../infrastructure/repositories/firestoreRepository";
import { useAuth } from "../../infrastructure/auth/AuthContext";
import type { RootState } from "../../application/store";
import type { CSSProperties } from "react";

const PLACEHOLDER = "https://via.placeholder.com/80x80?text=V";

export default function CartPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items, checkoutSuccess } = useSelector((s: RootState) => s.cart);
  const [checkingOut, setCheckingOut] = useState(false);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (!user || items.length === 0) return;
    setCheckingOut(true);
    try {
      // Save order to Firestore
      await ordersRepo.create(
        user.uid,
        user.email ?? "",
        items.map((i) => ({
          id: i.id,
          product_name: i.product_name,
          category: i.category,
          price: i.price,
          quantity: i.quantity,
        }))
      );
      // Clear Redux state and session storage
      dispatch(clearCart());
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setCheckingOut(false);
    }
  };

  // Success screen
  if (checkoutSuccess) {
    return (
      <main style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Case Submitted</h2>
          <p style={styles.successBody}>
            Your promotion case has been documented and saved.
            Your manager review is ready to schedule.
          </p>
          <p style={styles.successBody}>
            <em>Know your leverage before the meeting.</em>
          </p>
          <div style={styles.successActions}>
            <Link to="/orders" style={styles.primaryButton}>
              View Case History
            </Link>
            <button
              style={styles.secondaryButton}
              onClick={() => dispatch(resetCheckout())}
            >
              Build Another Case
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <main style={styles.page}>
        <div style={styles.emptyCard}>
          <h2 style={styles.emptyTitle}>No contributions in your case</h2>
          <p style={styles.emptyBody}>
            Go to the catalog and add your documented contributions
            to build your promotion case.
          </p>
          <Link to="/catalog" style={styles.primaryButton}>
            Browse Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Promotion Case Builder</h1>
      <p style={styles.subtitle}>
        Review your contribution evidence before submitting to your manager.
      </p>

      <div style={styles.layout}>
        {/* Item list */}
        <div style={styles.itemList}>
          {items.map((item) => (
            <div key={item.id} style={styles.itemCard}>
              <img
                src={item.image || PLACEHOLDER}
                alt={item.product_name}
                style={styles.itemImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER;
                }}
              />
              <div style={styles.itemInfo}>
                <span style={styles.itemCategory}>{item.category}</span>
                <h3 style={styles.itemName}>{item.product_name}</h3>
                <span style={styles.itemPrice}>
                  Impact: {item.price.toFixed(1)} / 100
                </span>
              </div>
              <div style={styles.itemControls}>
                <div style={styles.quantityRow}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity - 1,
                        })
                      )
                    }
                  >
                    −
                  </button>
                  <span style={styles.qtyVal}>{item.quantity}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  style={styles.removeBtn}
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary panel */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Case Summary</h2>

          <div style={styles.summaryRow}>
            <span style={{ color: "var(--muted)" }}>Total contributions</span>
            <span style={{ color: "var(--white)", fontWeight: 600 }}>
              {totalItems}
            </span>
          </div>

          <div style={styles.summaryRow}>
            <span style={{ color: "var(--muted)" }}>Avg impact score</span>
            <span style={{ color: "var(--gold)", fontWeight: 700 }}>
              {totalItems > 0
                ? (totalPrice / totalItems).toFixed(1)
                : "—"}{" "}
              / 100
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.summaryRow}>
            <span style={{ color: "var(--white)", fontWeight: 600 }}>
              Total evidence weight
            </span>
            <span style={{ color: "var(--white)", fontWeight: 700 }}>
              {totalPrice.toFixed(1)}
            </span>
          </div>

          <button
            style={{
              ...styles.checkoutBtn,
              opacity: checkingOut ? 0.7 : 1,
            }}
            onClick={() => void handleCheckout()}
            disabled={checkingOut}
          >
            {checkingOut ? "Submitting..." : "Submit Case to Manager"}
          </button>

          <Link to="/catalog" style={styles.continueLink}>
            ← Add More Evidence
          </Link>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 24px",
    fontFamily: "var(--font-sans)",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "4px",
  },
  subtitle: {
    color: "var(--muted)",
    marginBottom: "32px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: "24px",
    alignItems: "start",
  },
  itemList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  itemCard: {
    display: "flex",
    gap: "16px",
    background: "var(--ink-mid)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "16px",
    alignItems: "center",
  },
  itemImage: {
    width: "80px",
    height: "80px",
    objectFit: "contain" as const,
    background: "var(--ink)",
    borderRadius: "8px",
    padding: "8px",
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  itemCategory: {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--teal-light)",
  },
  itemName: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "var(--white)",
    lineHeight: 1.4,
  },
  itemPrice: {
    fontSize: "0.85rem",
    color: "var(--gold)",
    fontWeight: 600,
  },
  itemControls: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    gap: "12px",
  },
  quantityRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  qtyBtn: {
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "var(--ink)",
    color: "var(--white)",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyVal: {
    color: "var(--white)",
    fontWeight: 600,
    minWidth: "24px",
    textAlign: "center" as const,
  },
  removeBtn: {
    background: "transparent",
    border: "none",
    color: "#f87171",
    cursor: "pointer",
    fontSize: "0.82rem",
    padding: 0,
  },
  summary: {
    background: "var(--ink-mid)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "24px",
    position: "sticky" as const,
    top: "80px",
  },
  summaryTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "20px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontSize: "0.9rem",
  },
  divider: {
    borderTop: "1px solid var(--border)",
    margin: "16px 0",
  },
  checkoutBtn: {
    display: "block",
    width: "100%",
    background: "var(--teal)",
    color: "var(--white)",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "20px",
    fontFamily: "var(--font-sans)",
  },
  continueLink: {
    display: "block",
    textAlign: "center" as const,
    color: "var(--muted)",
    fontSize: "0.85rem",
    marginTop: "12px",
    textDecoration: "none",
  },
  successCard: {
    maxWidth: "480px",
    margin: "80px auto",
    background: "var(--ink-mid)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "48px 40px",
    textAlign: "center" as const,
  },
  successIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "rgba(18,165,146,0.15)",
    border: "2px solid var(--teal)",
    color: "var(--teal-light)",
    fontSize: "1.8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  },
  successTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "16px",
  },
  successBody: {
    color: "var(--muted)",
    lineHeight: 1.7,
    marginBottom: "12px",
  },
  successActions: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginTop: "28px",
  },
  primaryButton: {
    display: "block",
    background: "var(--teal)",
    color: "var(--white)",
    border: "none",
    padding: "13px 24px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center" as const,
    fontFamily: "var(--font-sans)",
  },
  secondaryButton: {
    display: "block",
    background: "transparent",
    color: "var(--muted)",
    border: "1px solid var(--border)",
    padding: "13px 24px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
  emptyCard: {
    maxWidth: "480px",
    margin: "80px auto",
    background: "var(--ink-mid)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "48px 40px",
    textAlign: "center" as const,
  },
  emptyTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "12px",
  },
  emptyBody: {
    color: "var(--muted)",
    lineHeight: 1.7,
    marginBottom: "24px",
  },
};
