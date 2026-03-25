/**
 * ============================================================
 * File: ProfilePage.tsx
 * Purpose: User profile — read, update, delete via Firestore.
 * Assignment 10: User Management CRUD
 * ============================================================
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../infrastructure/auth/AuthContext";
import type { CSSProperties } from "react";

export default function ProfilePage() {
  const { profile, updateProfile, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name ?? "");
  const [jobTitle, setJobTitle] = useState(profile?.jobTitle ?? "");
  const [company, setCompany] = useState(profile?.company ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateProfile({ name, jobTitle, company, address });
      setEditing(false);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      void logout();
      navigate("/login");
    } catch {
      setError("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Your Profile</h1>
      <p style={styles.subtitle}>
        Your career identity on the Visible platform.
      </p>

      <div style={styles.card}>
        {/* Avatar */}
        <div style={styles.avatarRow}>
          <div style={styles.avatar}>
            {(profile?.name ?? "V").charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={styles.profileName}>{profile?.name ?? "—"}</p>
            <p style={styles.profileEmail}>{profile?.email ?? "—"}</p>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Fields */}
        {editing ? (
          <div style={styles.fieldList}>
            <Field label="Full Name">
              <input
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Job Title">
              <input
                style={styles.input}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </Field>
            <Field label="Company">
              <input
                style={styles.input}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </Field>
            <Field label="Location">
              <input
                style={styles.input}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Field>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.buttonRow}>
              <button
                style={styles.primaryButton}
                onClick={() => void handleSave()}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                style={styles.ghostButton}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.fieldList}>
            <ReadField label="Full Name" value={profile?.name} />
            <ReadField label="Job Title" value={profile?.jobTitle} />
            <ReadField label="Company" value={profile?.company} />
            <ReadField label="Location" value={profile?.address} />
            <ReadField label="Member Since" value={
              profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : undefined
            } />

            <button
              style={styles.primaryButton}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div style={styles.dangerCard}>
        <h2 style={styles.dangerTitle}>Danger Zone</h2>
        <p style={styles.dangerBody}>
          Permanently delete your account and all associated data.
          This cannot be undone.
        </p>

        {!confirmDelete ? (
          <button
            style={styles.dangerButton}
            onClick={() => setConfirmDelete(true)}
          >
            Delete Account
          </button>
        ) : (
          <div style={styles.buttonRow}>
            <button
              style={styles.dangerButton}
              onClick={() => void handleDelete()}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>
            <button
              style={styles.ghostButton}
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{
          display: "block",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ReadField({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "4px",
        }}
      >
        {label}
      </p>
      <p style={{ color: value ? "var(--white)" : "var(--muted)", fontSize: "0.95rem" }}>
        {value || "Not set"}
      </p>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: "640px",
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
  card: {
    background: "var(--ink-mid)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "32px",
    marginBottom: "24px",
  },
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "rgba(18,165,146,0.15)",
    border: "2px solid var(--teal)",
    color: "var(--teal-light)",
    fontSize: "1.4rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  profileName: {
    color: "var(--white)",
    fontWeight: 700,
    fontSize: "1rem",
    marginBottom: "2px",
  },
  profileEmail: {
    color: "var(--muted)",
    fontSize: "0.85rem",
  },
  divider: {
    borderTop: "1px solid var(--border)",
    marginBottom: "24px",
  },
  fieldList: {
    display: "flex",
    flexDirection: "column" as const,
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--ink)",
    color: "var(--white)",
    fontSize: "0.95rem",
    fontFamily: "var(--font-sans)",
    boxSizing: "border-box" as const,
    outline: "none",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  primaryButton: {
    padding: "11px 20px",
    borderRadius: "8px",
    border: "none",
    background: "var(--teal)",
    color: "var(--white)",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.9rem",
    fontFamily: "var(--font-sans)",
  },
  ghostButton: {
    padding: "11px 20px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontFamily: "var(--font-sans)",
  },
  dangerCard: {
    background: "var(--ink-mid)",
    border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: "16px",
    padding: "32px",
  },
  dangerTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#f87171",
    marginBottom: "8px",
  },
  dangerBody: {
    color: "var(--muted)",
    fontSize: "0.9rem",
    lineHeight: 1.6,
    marginBottom: "20px",
  },
  dangerButton: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid rgba(248,113,113,0.5)",
    background: "rgba(248,113,113,0.08)",
    color: "#f87171",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.9rem",
    fontFamily: "var(--font-sans)",
  },
  error: {
    color: "#f87171",
    fontSize: "0.85rem",
    marginTop: "12px",
  },
};
