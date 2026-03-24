/**
 * ============================================================
 * File: EntryFormPage.tsx
 * Purpose: Handles both Add and Edit entry forms.
 * Assignment: Add Product Page + Edit Product Page requirements.
 * When id param is present: Edit mode (pre-fills form, PUT)
 * When no id param: Create mode (empty form, POST)
 * ============================================================
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiService } from "../../infrastructure/repositories/local/apiService";
import type { CSSProperties } from "react";

interface FormState {
  title: string;
  price: string;
  description: string;
  category: string;
  image: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  price: "",
  description: "",
  category: "",
  image: "",
};

export default function EntryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadCategories();
    if (isEditMode && id) void loadEntry(id);
  }, [id, isEditMode]);

  async function loadEntry(entryId: string) {
    try {
      setIsLoading(true);
      const data = await apiService.getById(entryId);
      setForm({
        title: data.title,
        price: String(data.price),
        description: data.description,
        category: data.category,
        image: data.image ?? "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load entry for editing."
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
      // fail silently
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }

  function validate(): boolean {
    if (!form.title.trim()) {
      setError("Title is required.");
      return false;
    }
    if (!form.description.trim()) {
      setError("Description is required.");
      return false;
    }
    if (!form.category.trim()) {
      setError("Category is required.");
      return false;
    }
    if (form.price && isNaN(parseFloat(form.price))) {
      setError("Price must be a number.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price: parseFloat(form.price) || 0,
        image: form.image.trim() || undefined,
      };

      if (isEditMode && id) {
        await apiService.update({ ...payload, id });
        setSuccessMessage(
          "Entry updated successfully. Note: in FakeStore demo mode changes do not persist on refresh."
        );
      } else {
        await apiService.create(payload);
        setSuccessMessage(
          "Entry created successfully. Note: in FakeStore demo mode new entries will not appear in the list on refresh."
        );
        setForm(EMPTY_FORM);
      }

      setTimeout(() => {
        void navigate("/entries");
      }, 2000);

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save entry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
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

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <Link to="/entries" style={styles.backLink}>
          ← Back to Entries
        </Link>

        <div style={styles.formCard}>
          <span style={styles.eyebrow}>
            {isEditMode ? "Edit Entry" : "New Entry"}
          </span>
          <h1 style={styles.headline}>
            {isEditMode
              ? "Update this contribution"
              : "Document a contribution"}
          </h1>
          <p style={styles.subText}>
            {isEditMode
              ? "Update the details below and save."
              : "Add a work entry to your contribution record."}
          </p>

          {successMessage && (
            <div style={styles.successBox}>
              <p style={styles.successText}>✓ {successMessage}</p>
              <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: "4px" }}>
                Redirecting...
              </p>
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>⚠ {error}</p>
            </div>
          )}

          <form onSubmit={(e) => { void handleSubmit(e); }} style={styles.form}>

            {/* Title */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="title">
                Title <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="What did you do? Plain language."
                style={styles.input}
                required
              />
            </div>

            {/* Category */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="category">
                Category <span style={styles.required}>*</span>
              </label>
              {categories.length > 0 ? (
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. operations, analytics, administrative"
                  style={styles.input}
                  required
                />
              )}
            </div>

            {/* Description */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="description">
                Description <span style={styles.required}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what happened, who benefited, and what changed."
                style={{ ...styles.input, ...styles.textarea }}
                rows={5}
                required
              />
            </div>

            {/* Price / Quantified impact */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="price">
                Quantified Impact
                <span style={styles.optionalTag}>(optional)</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Hours saved, dollar value, error rate reduction..."
                style={styles.input}
                min="0"
                step="0.01"
              />
            </div>

            {/* Image URL */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="image">
                Image URL
                <span style={styles.optionalTag}>(optional)</span>
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                style={styles.input}
              />
            </div>

            {/* Submit */}
            <div style={styles.formActions}>
              <Link to="/entries" style={styles.cancelButton}>
                Cancel
              </Link>
              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Save Changes"
                  : "Add Entry"}
              </button>
            </div>

          </form>
        </div>
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
    maxWidth: "640px",
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
  backLink: {
    color: "var(--muted)",
    textDecoration: "none",
    fontSize: "0.85rem",
    display: "inline-block",
    marginBottom: "24px",
  },
  formCard: {
    background: "var(--ink-mid)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "36px",
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
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "8px",
  },
  subText: {
    fontSize: "0.88rem",
    color: "var(--muted)",
    fontWeight: 300,
    marginBottom: "24px",
  },
  successBox: {
    background: "var(--success-bg)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px",
  },
  successText: {
    color: "var(--success)",
    fontWeight: 600,
    fontSize: "0.92rem",
  },
  errorBox: {
    background: "var(--error-bg)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px",
  },
  errorText: {
    color: "var(--error)",
    fontSize: "0.88rem",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.8px",
    textTransform: "uppercase" as const,
    color: "var(--muted)",
  },
  required: {
    color: "var(--error)",
    marginLeft: "2px",
  },
  optionalTag: {
    fontSize: "0.7rem",
    color: "var(--muted)",
    fontWeight: 400,
    textTransform: "none" as const,
    letterSpacing: 0,
    marginLeft: "6px",
  },
  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "7px",
    padding: "12px 14px",
    color: "var(--white)",
    fontSize: "0.92rem",
    fontFamily: "var(--font-sans)",
    fontWeight: 300,
    outline: "none",
    width: "100%",
  },
  textarea: {
    resize: "vertical" as const,
    lineHeight: 1.65,
    minHeight: "120px",
  },
  formActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "8px",
  },
  cancelButton: {
    color: "var(--muted)",
    textDecoration: "none",
    fontSize: "0.88rem",
    fontWeight: 500,
    padding: "10px 20px",
    border: "1px solid var(--border)",
    borderRadius: "7px",
  },
  submitButton: {
    background: "var(--teal)",
    color: "var(--white)",
    border: "none",
    padding: "12px 28px",
    borderRadius: "7px",
    fontSize: "0.92rem",
    fontWeight: 600,
    fontFamily: "var(--font-sans)",
  },
};
