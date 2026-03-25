/**
 * ============================================================
 * File: firestoreRepository.ts
 * Purpose: Firestore CRUD operations for Visible.
 * Collections:
 *   - products (contribution entries)
 *   - orders (promotion cases / order history)
 *   - users (user profiles)
 * ============================================================
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../auth/firebase";

// ── Types ────────────────────────────────────────────────────

export interface Product {
  id?: string;
  product_name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
}

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  items: Array<{
    id: string;
    product_name: string;
    category: string;
    price: number;
    quantity: number;
  }>;
  totalPrice: number;
  totalItems: number;
  createdAt: Timestamp;
}

// ── Products (Contributions) ─────────────────────────────────

export const productsRepo = {
  // GET all products
  async getAll(): Promise<Product[]> {
    const snap = await getDocs(collection(db, "products"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  },

  // GET by category
  async getByCategory(category: string): Promise<Product[]> {
    const q = query(
      collection(db, "products"),
      where("category", "==", category)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  },

  // GET all categories
  async getCategories(): Promise<string[]> {
    const snap = await getDocs(collection(db, "products"));
    const cats = new Set<string>();
    snap.docs.forEach((d) => {
      const data = d.data() as Product;
      if (data.category) cats.add(data.category);
    });
    return Array.from(cats).sort();
  },

  // GET single product
  async getById(id: string): Promise<Product | null> {
    const snap = await getDoc(doc(db, "products", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Product;
  },

  // CREATE product
  async create(data: Omit<Product, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "products"), data);
    return ref.id;
  },

  // UPDATE product
  async update(id: string, data: Partial<Product>): Promise<void> {
    await updateDoc(doc(db, "products", id), data);
  },

  // DELETE product
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "products", id));
  },

  // SEED initial products from FakeStore API
  async seedFromFakeStore(): Promise<void> {
    const existing = await getDocs(collection(db, "products"));
    if (existing.size > 0) return; // Already seeded

    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json() as Array<{
      id: number;
      title: string;
      price: number;
      category: string;
      description: string;
      image: string;
      rating: { rate: number; count: number };
    }>;

    for (const p of products) {
      await addDoc(collection(db, "products"), {
        product_name: p.title,
        category: p.category,
        price: p.price,
        description: p.description,
        image: p.image,
        rating: p.rating.rate,
      });
    }
  },
};

// ── Orders (Promotion Cases) ─────────────────────────────────

export const ordersRepo = {
  // CREATE order
  async create(
    userId: string,
    userEmail: string,
    items: Order["items"]
  ): Promise<string> {
    const totalPrice = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    const ref = await addDoc(collection(db, "orders"), {
      userId,
      userEmail,
      items,
      totalPrice,
      totalItems,
      createdAt: Timestamp.now(),
    });
    return ref.id;
  },

  // GET orders for a user
  async getByUser(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
  },

  // GET single order
  async getById(id: string): Promise<Order | null> {
    const snap = await getDoc(doc(db, "orders", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Order;
  },
};
