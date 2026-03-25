/**
 * ============================================================
 * File: OrdersPage.tsx
 * Purpose: Order history — past promotion cases from Firestore.
 * Assignment 10: Order History, order detail view
 * ============================================================
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../infrastructure/auth/AuthContext";
import { ordersRepo, type Order } from "../../infrastructure/repositories/firestoreRepository";
import type { CSSProperties } from "react";

export default function OrdersPage() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.uid],
    queryFn: () => ordersRepo.getByUser(user!.uid),
    enabled: !!user,
  });

  const formatDate = (ts: Order["createdAt"]) => {
    const date = ts.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <main style={styles.page}>
        <div style={styles.loading}>
          <div style={styles.spinner} />
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Promotion Case History</h1>
      <p style={styles.subtitle}>
        A record of every promotion case you have submitted.
      </p>

      {orders.length === 0 && (
        <div style={styles.empty}>
          <p style={{ color: "var(--muted)" }}>
            No cases submitted yet. Build your first promotion case in the catalog.
          </p>
        </div>
      )}

      <div style={styles.layout}>
        {/* Order list */}
        <div style={styles.orderList}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                ...styles.orderCard,
                ...(selectedOrder?.id === order.id
                  ? styles.orderCardSelected
                  : {}),
              }}
              onClick={() =>
                setSelectedOrder(
                  selectedOrder?.id === order.id ? null : order
                )
              }
            >
              <div style={styles.orderHeader}>
                <div>
                  <p style={styles.orderId}>
                    Case #{order.id?.slice(-8).toUpperCase()}
                  </p>
                  <p style={styles.orderDate}>{formatDate(order.createdAt)}</p>
                </div>
                <div style={{ textAlign: "right" as const }}>
                  <p style={styles.orderTotal}>
                    {order.totalItems} contribution
                    {order.totalItems !== 1 ? "s" : ""}
                  </p>
                  <p style={styles.orderScore}>
                    Avg: {(order.totalPrice / order.totalItems).toFixed(1)} / 100
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order detail */}
        {selectedOrder && (
          <div style={styles.detail}>
            <h2 style={styles.detailTitle}>
              Case #{selectedOrder.id?.slice(-8).toUpperCase()}
            </h2>
            <p style={styles.detailDate}>
              Submitted {formatDate(selectedOrder.createdAt)}
            </p>

            <div style={styles.detailItems}>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={styles.detailItem}>
                  <div style={styles.detailItemInfo}>
                    <span style={styles.detailCategory}>{item.category}</span>
                    <p style={styles.detailItemName}>{item.product_name}</p>
                  </div>
                  <div style={styles.detailItemMeta}>
                    <span style={styles.detailQty}>×{item.quantity}</span>
                    <span style={styles.detailPrice}>
                      {item.price.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.detailFooter}>
              <div style={styles.detailRow}>
                <span style={{ color: "var(--muted)" }}>Total contributions</span>
                <span style={{ color: "var(--white)", fontWeight: 600 }}>
                  {selectedOrder.totalItems}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={{ color: "var(--muted)" }}>Total evidence weight</span>
                <span style={{ color: "var(--gold)", fontWeight: 700 }}>
                  {selectedOrder.totalPrice.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        )}
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
  loading: {
    display: "flex",
    justifyContent: "center",
    padding: "80px 0",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid rgba(14,124,110,0.2)",
    borderTop: "3px solid #12a592",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  empty: {
    textAlign: "center" as const,
    padding: "60px 0",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: "24px",
    alignItems: "start",
  },
  orderList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  orderCard: {
    background: "var(--ink-mid)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  orderCardSelected: {
    borderColor: "var(--teal)",
    background: "rgba(18,165,146,0.05)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderId: {
    fontWeight: 700,
    color: "var(--white)",
    fontSize: "0.95rem",
    marginBottom: "4px",
  },
  orderDate: {
    color: "var(--muted)",
    fontSize: "0.83rem",
  },
  orderTotal: {
    color: "var(--teal-light)",
    fontWeight: 600,
    fontSize: "0.9rem",
    marginBottom: "4px",
  },
  orderScore: {
    color: "var(--gold)",
    fontSize: "0.83rem",
    fontWeight: 600,
  },
  detail: {
    background: "var(--ink-mid)",
    border: "1px solid var(--teal)",
    borderRadius: "12px",
    padding: "24px",
    position: "sticky" as const,
    top: "80px",
  },
  detailTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "4px",
  },
  detailDate: {
    color: "var(--muted)",
    fontSize: "0.85rem",
    marginBottom: "20px",
  },
  detailItems: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginBottom: "20px",
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid var(--border)",
  },
  detailItemInfo: {
    flex: 1,
  },
  detailCategory: {
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--teal-light)",
    display: "block",
    marginBottom: "4px",
  },
  detailItemName: {
    color: "var(--white)",
    fontSize: "0.88rem",
    lineHeight: 1.4,
  },
  detailItemMeta: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    gap: "4px",
  },
  detailQty: {
    color: "var(--muted)",
    fontSize: "0.82rem",
  },
  detailPrice: {
    color: "var(--gold)",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  detailFooter: {
    borderTop: "1px solid var(--border)",
    paddingTop: "16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
  },
};
