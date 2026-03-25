/**
 * ============================================================
 * File: store.ts
 * Purpose: Redux Toolkit store for Visible.
 * Slices:
 *   - cartSlice: Promotion case builder (assignment 9 cart)
 * ============================================================
 */

import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ── Types ────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  product_name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  checkoutSuccess: boolean;
}

// ── Session Storage Helpers ──────────────────────────────────

function loadCartFromSession(): CartItem[] {
  try {
    const saved = sessionStorage.getItem("visible_cart");
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCartToSession(items: CartItem[]) {
  sessionStorage.setItem("visible_cart", JSON.stringify(items));
}

// ── Cart Slice ───────────────────────────────────────────────

const initialState: CartState = {
  items: loadCartFromSession(),
  checkoutSuccess: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToSession(state.items);
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCartToSession(state.items);
    },

    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      saveCartToSession(state.items);
    },

    clearCart(state) {
      state.items = [];
      state.checkoutSuccess = true;
      sessionStorage.removeItem("visible_cart");
    },

    resetCheckout(state) {
      state.checkoutSuccess = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  resetCheckout,
} = cartSlice.actions;

// ── Store ────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
