/**
 * ============================================================
 * File: CatalogPage.tsx
 * Purpose: Product catalog with category filter.
 * Uses React Query for data fetching (FakeStore API + Firestore).
 * Uses Redux for cart state management.
 * Assignment 9: Product Listing, Category Navigation, Add to Cart
 * Assignment 10: Reads from Firestore products collection
 * ============================================================
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../application/store";
import { productsRepo } from "../../infrastructure/repositories/firestoreRepository";
import type { RootState } from "../../application/store";
import type { CSSProperties } from "react";

const PLACEHOLDER = "https://via.placeholder.com/300x300?text=Visible";

export default function CatalogPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addedId, setAddedId] = useState<string | null>(null);

  // Fetch all categories from Firestore
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productsRepo.getCategories(),
  });

  // Fetch products — all or by category
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () =>
      selectedCategory === "all"
        ? productsRepo.getAll()
        : productsRepo.getByCategory(selectedCategory),
  });

  const handleAddToCart = (product: typeof products[0]) => {
    dispatch(
      addToCart({
        id: product.id!,
        product_name: product.product_name,
        category: product.category,
        price: product.price,
        description: product.description,
        image: product.image,
      })
    );
    setAddedId(product.id!);
    setTimeout(() => setAddedId(null), 1500);
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <main style={styles.page}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Contribution Catalog</h1>
          <p style={styles.subtitle}>
            Browse and add contributions to your promotion case
          </p>
        </div>
        <div style={styles.cartBadge}>
          🗂 {cartCount} in case
        </div>
      </div>

      {/* Category Filter */}
      <div style={styles.filterRow}>
        <select
          style={styles.select}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <span style={styles.resultCount}>
          {products.length} contribution{products.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p style={{ color: "var(--muted)", marginTop: "16px" }}>
            Loading contributions...
          </p>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && (
        <div style={styles.grid}>
          {products.map((product) => {
            const inCart = cartItems.find((i) => i.id === product.id);
            const justAdded = addedId === product.id;

            return (
              <div key={product.id} style={styles.card}>
                {/* Image */}
                <div style={styles.imageWrap}>
                  <img
                    src={product.image || PLACEHOLDER}
                    alt={product.product_name}
                    style={styles.image}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER;
                    }}
                  />
                </div>

                {/* Content */}
                <div style={styles.content}>
                  <span style={styles.category}>{product.category}</span>
                  <h3 style={styles.productName}>{product.product_name}</h3>
                  <p style={styles.description}>
                    {product.description.length > 100
                      ? product.description.slice(0, 100) + "..."
                      : product.description}
                  </p>

                  {/* Footer */}
                  <div style={styles.cardFooter}>
                    <span style={styles.price}>
                      {product.price.toFixed(1)} / 100
                    </span>
                    <button
                      style={{
                        ...styles.addButton,
                        ...(justAdded ? styles.addButtonSuccess : {}),
                      }}
                      onClick={() => handleAddToCart(product)}
                    >
                      {justAdded
                        ? "✓ Added"
                        : inCart
                        ? `In Case (${inCart.quantity})`
                        : "+ Add to Case"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && products.length === 0 && (
        <div style={styles.empty}>
          <p style={{ color: "var(--muted)" }}>
            No contributions found in this category.
          </p>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
    fontFamily: "var(--font-sans)",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "var(--white)",
    marginBottom: "4px",
  },
  subtitle: {
    color: "var(--muted)",
    fontSize: "0.95rem",
  },
  cartBadge: {
    background: "rgba(18,165,146,0.12)",
    border: "1px solid var(--teal)",
    color: "var(--teal-light)",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap" as const,
  },
  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--ink-mid)",
    color: "var(--white)",
    fontSize: "0.95rem",
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    minWidth: "200px",
  },
  resultCount: {
    color: "var(--muted)",
    fontSize: "0.9rem",
  },
  loading: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "var(--ink-mid)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
    transition: "border-color 0.2s",
  },
  imageWrap: {
    height: "200px",
    background: "var(--ink)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },
  image: {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain" as const,
  },
  content: {
    padding: "16px",
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
  },
  category: {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--teal-light)",
    marginBottom: "8px",
  },
  productName: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "var(--white)",
    marginBottom: "8px",
    lineHeight: 1.4,
  },
  description: {
    fontSize: "0.83rem",
    color: "var(--muted)",
    lineHeight: 1.6,
    flex: 1,
    marginBottom: "16px",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  price: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "var(--gold)",
  },
  addButton: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    background: "var(--teal)",
    color: "var(--white)",
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    transition: "background 0.2s",
  },
  addButtonSuccess: {
    background: "#16a34a",
  },
  empty: {
    textAlign: "center" as const,
    padding: "80px 0",
  },
};
