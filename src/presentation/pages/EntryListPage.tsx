/**
 * ============================================================
 * File: EntryListPage.tsx
 * Purpose: Displays all work entries fetched from the API.
 * Assignment: Product Listing Page requirement.
 * FakeStore mode: shows products from fakestoreapi.com
 * Visible mode: shows work entries from localStorage / backend
 * ============================================================
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../../infrastructure/repositories/local/apiService";
import type { WorkEntry } from "../../infrastructure/repositories/local/apiService";
import type { CSSProperties } from "react";

export default function EntryListPage() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    void loadEntries();
    void loadCategories();
  }, []);

  async function loadEntries() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getAll();
      setEntries(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load entries. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const cats = await apiService.getCategories();
      setCategories(cats);
    } catch {
      // categories are optional, fail silently
    }
  }

  const filtered =
    categoryFilter === "all"
      ? entries
      : entries.filter((e) => e.category === categoryFilter);

  if (isLoading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingState}>
          <div style={styles.spinner} />
          <p style={{ color: "var(--muted)", marginTop: "16px" }}>
            Loading contributions...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBox}>
            <p style={styles.errorText}>⚠ {error}</p>
            <button style={styles.retryButton} onClick={() => { void loadEntries(); }}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.headline}>Contribution Record</h1>
            <p style={styles.subText}>
              {entries.length} {entries.length === 1 ? "entry" : "entries"} documented
              {apiService.mode === "fakestore" && (
                <span style={styles.modeBadge}> · FakeStore Demo Mode</span>
              )}
            </p>
          </div>
          <Link to="/entries/new" style={styles.addButton}>
            + Add Entry
          </Link>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div style={styles.filterRow}>
            <button
              style={{
                ...styles.filterChip,
                ...(categoryFilter === "all" ? styles.filterChipActive : {}),
              }}
              onClick={() => { setCategoryFilter("all"); }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                style={{
                  ...styles.filterChip,
                  ...(categoryFilter === cat ? styles.filterChipActive : {}),
                }}
                onClick={() => { setCategoryFilter(cat); }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Entry grid */}
        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No entries yet.</p>
            <Link to="/entries/new" style={styles.addButton}>
              Add Your First Entry
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((entry) => (
              <div key={entry.id} style={styles.card}>
                {entry.image && (
                  <div style={styles.cardImageWrapper}>
                    <img
                      src={entry.image}
                      alt={entry.title}
                      style={styles.cardImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div style={styles.cardBody}>
                  <span style={styles.cardCategory}>{entry.category}</span>
                  <h3 style={styles.cardTitle}>{entry.title}</h3>
                  <p style={styles.cardDescription}>
                    {entry.description.length > 120
                      ? entry.description.slice(0, 120) + "..."
                      : entry.description}
                  </p>
                  {entry.price > 0 && (
                    <p style={styles.cardPrice}>
                      ${entry.price.toFixed(2)}
                    </p>
                  )}
                  <Link
                    to={`/entries/${entry.id}`}
                    style={styles.viewButton}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "var(--ink)",
    padding: "40px 24px",
    fontFamily: "var(--font-sans)",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(14,124,110,0.2)",
    borderTop: "3px solid var(--teal-light)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorBox: {
    background: "var(--error-bg)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "10px",
    padding: "24px",
    textAlign: "center" as const,
  },
  errorText: {
    color: "var(--error)",
    marginBottom: "16px",
    fontSize: "0.95rem",
  },
  retryButton: {
    background: "var(--teal)",
    color: "var(--white)",
    border: "none",
    padding: "10px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    fontWeight: 600,
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  headline: {
    fontFamily: "var(--font-serif)",
    fontSize: "2rem",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "4px",
  },
  subText: {
    fontSize: "0.85rem",
    color: "var(--muted)",
    fontWeight: 300,
  },
  modeBadge: {
    color: "var(--gold)",
    fontStyle: "italic",
  },
  addButton: {
    background: "var(--teal)",
    color: "var(--white)",
    textDecoration: "none",
    padding: "10px 20px",
    borderRadius: "7px",
    fontSize: "0.88rem",
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
    marginBottom: "24px",
  },
  filterChip: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "0.78rem",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
    transition: "all 0.2s",
  },
  filterChipActive: {
    background: "var(--teal-glow)",
    borderColor: "rgba(14,124,110,0.3)",
    color: "var(--teal-light)",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "80px 0",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "16px",
  },
  emptyText: {
    color: "var(--muted)",
    fontSize: "1rem",
    fontWeight: 300,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
    transition: "all 0.2s",
  },
  cardImageWrapper: {
    height: "180px",
    backgroundColor: "rgba(255,255,255,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },
  cardImage: {
    maxHeight: "148px",
    maxWidth: "100%",
    objectFit: "contain" as const,
  },
  cardBody: {
    padding: "16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    flex: 1,
  },
  cardCategory: {
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    color: "var(--teal-light)",
  },
  cardTitle: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "var(--white)",
    lineHeight: 1.4,
  },
  cardDescription: {
    fontSize: "0.82rem",
    color: "var(--muted)",
    lineHeight: 1.6,
    fontWeight: 300,
    flex: 1,
  },
  cardPrice: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "var(--gold)",
  },
  viewButton: {
    color: "var(--teal-light)",
    textDecoration: "none",
    fontSize: "0.82rem",
    fontWeight: 600,
    marginTop: "4px",
  },
};
