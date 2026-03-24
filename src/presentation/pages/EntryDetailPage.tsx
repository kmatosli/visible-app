/**
 * ============================================================
 * File: EntryDetailPage.tsx
 * Purpose: Single entry detail view with delete functionality.
 * Assignment: Product Details Page requirement.
 * Uses useParams to extract ID, fetches from API,
 * handles loading states, errors, and delete with modal.
 * ============================================================
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiService } from "../../infrastructure/repositories/local/apiService";
import type { WorkEntry } from "../../infrastructure/repositories/local/apiService";
import type { CSSProperties } from "react";

export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [entry, setEntry] = useState<WorkEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    if (id) void loadEntry(id);
  }, [id]);

  async function loadEntry(entryId: string) {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getById(entryId);
      setEntry(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load this entry."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    try {
      setIsDeleting(true);
      await apiService.delete(id);
      setDeleteSuccess(true);
      setShowDeleteModal(false);
      setTimeout(() => {
        void navigate("/entries");
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete entry."
      );
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingState}>
          <div style={styles.spinner} />
          <p style={{ color: "var(--muted)", marginTop: "16px" }}>
            Loading entry...
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
            <Link to="/entries" style={styles.backLink}>
              ← Back to Entries
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (deleteSuccess) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.successBox}>
            <p style={styles.successText}>✓ Entry deleted successfully.</p>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              Redirecting to your entries...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!entry) return null;

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* Breadcrumb */}
        <Link to="/entries" style={styles.backLink}>
          ← Back to Entries
        </Link>

        <div style={styles.layout}>

          {/* Image */}
          {entry.image && (
            <div style={styles.imageSection}>
              <img
                src={entry.image}
                alt={entry.title}
                style={styles.entryImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Content */}
          <div style={styles.contentSection}>
            <span style={styles.category}>{entry.category}</span>
            <h1 style={styles.title}>{entry.title}</h1>

            {entry.price > 0 && (
              <p style={styles.price}>${entry.price.toFixed(2)}</p>
            )}

            <p style={styles.description}>{entry.description}</p>

            {/* Visible-specific fields */}
            {entry.businessValue && (
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Business Value</span>
                <span style={styles.fieldValue}>{entry.businessValue}</span>
              </div>
            )}
            {entry.impactStrength && (
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Impact</span>
                <span style={styles.fieldValue}>{entry.impactStrength}</span>
              </div>
            )}
            {entry.revenueConnection && (
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Revenue Connection</span>
                <span style={styles.fieldValue}>{entry.revenueConnection}</span>
              </div>
            )}

            {/* Action buttons */}
            <div style={styles.actions}>
              <Link
                to={`/entries/${entry.id}/edit`}
                style={styles.editButton}
              >
                Edit Entry
              </Link>
              <button
                style={styles.deleteButton}
                onClick={() => { setShowDeleteModal(true); }}
              >
                Delete Entry
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Delete this entry?</h2>
            <p style={styles.modalText}>
              <strong style={{ color: "var(--white)" }}>
                {entry.title}
              </strong>
              <br />
              This action cannot be undone.
            </p>
            <div style={styles.modalActions}>
              <button
                style={styles.modalCancel}
                onClick={() => { setShowDeleteModal(false); }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                style={styles.modalConfirm}
                onClick={() => { void handleDelete(); }}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
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
    maxWidth: "900px",
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
  },
  errorText: {
    color: "var(--error)",
    marginBottom: "16px",
  },
  successBox: {
    background: "var(--success-bg)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "10px",
    padding: "32px",
    textAlign: "center" as const,
  },
  successText: {
    color: "var(--success)",
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: "8px",
  },
  backLink: {
    color: "var(--muted)",
    textDecoration: "none",
    fontSize: "0.85rem",
    display: "inline-block",
    marginBottom: "28px",
    transition: "color 0.2s",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "40px",
    alignItems: "flex-start",
  },
  imageSection: {
    width: "240px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
  },
  entryImage: {
    maxWidth: "200px",
    maxHeight: "200px",
    objectFit: "contain" as const,
  },
  contentSection: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  category: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--teal-light)",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "var(--white)",
    lineHeight: 1.2,
  },
  price: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "var(--gold)",
  },
  description: {
    fontSize: "0.95rem",
    color: "var(--muted)",
    lineHeight: 1.75,
    fontWeight: 300,
  },
  fieldRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid var(--border)",
  },
  fieldLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    width: "140px",
    flexShrink: 0,
  },
  fieldValue: {
    fontSize: "0.88rem",
    color: "var(--white)",
    fontWeight: 400,
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
    flexWrap: "wrap" as const,
  },
  editButton: {
    background: "var(--teal)",
    color: "var(--white)",
    textDecoration: "none",
    padding: "10px 20px",
    borderRadius: "7px",
    fontSize: "0.88rem",
    fontWeight: 600,
  },
  deleteButton: {
    background: "transparent",
    color: "var(--error)",
    border: "1px solid rgba(239,68,68,0.3)",
    padding: "10px 20px",
    borderRadius: "7px",
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
  modalOverlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "var(--ink-mid)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "32px",
    maxWidth: "420px",
    width: "90%",
    boxShadow: "var(--shadow-lg)",
  },
  modalTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "12px",
  },
  modalText: {
    fontSize: "0.92rem",
    color: "var(--muted)",
    lineHeight: 1.65,
    marginBottom: "24px",
    fontWeight: 300,
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  modalCancel: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    padding: "10px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
    fontSize: "0.88rem",
  },
  modalConfirm: {
    background: "var(--error)",
    border: "none",
    color: "var(--white)",
    padding: "10px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    fontWeight: 600,
    fontSize: "0.88rem",
  },
};
