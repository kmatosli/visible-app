/**
 * ============================================================
 * File: apiService.ts
 * Purpose: Unified API service layer for Visible.
 *
 * TWO MODES controlled by VITE_API_MODE env variable:
 *
 *   VITE_API_MODE=fakestore
 *   Uses FakeStoreAPI as the data source.
 *   Satisfies the React Module Project assignment requirements.
 *   Products map to WorkEntry shape for consistent UI.
 *
 *   VITE_API_MODE=visible  (default)
 *   Uses the real Visible backend when available.
 *   Falls back to localStorage for offline/dev use.
 *
 * No component ever calls an API directly.
 * All components call this service.
 * Swap VITE_API_MODE and the entire app switches data sources.
 * ============================================================
 */

import axios from "axios";

const API_MODE = import.meta.env.VITE_API_MODE ?? "fakestore";
const FAKESTORE_BASE = "https://fakestoreapi.com";

// ============================================================
// SHARED ENTRY TYPE
// Used throughout the app regardless of API mode.
// FakeStore products are mapped to this shape on receipt.
// ============================================================

export interface WorkEntry {
  id: number | string;
  title: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  // Visible-specific fields (populated in Visible mode)
  businessValue?: string;
  impactStrength?: string;
  contributionType?: string;
  revenueConnection?: string;
  createdAt?: string;
}

export interface CreateEntryInput {
  title: string;
  description: string;
  category: string;
  price: number;
  image?: string;
}

export interface UpdateEntryInput extends CreateEntryInput {
  id: number | string;
}

// ============================================================
// FAKESTORE API FUNCTIONS
// ============================================================

async function fakestore_getAll(): Promise<WorkEntry[]> {
  const response = await axios.get<WorkEntry[]>(
    `${FAKESTORE_BASE}/products`
  );
  return response.data;
}

async function fakestore_getById(id: number | string): Promise<WorkEntry> {
  const response = await axios.get<WorkEntry>(
    `${FAKESTORE_BASE}/products/${id}`
  );
  return response.data;
}

async function fakestore_create(input: CreateEntryInput): Promise<WorkEntry> {
  const response = await axios.post<WorkEntry>(
    `${FAKESTORE_BASE}/products`,
    input
  );
  return response.data;
}

async function fakestore_update(input: UpdateEntryInput): Promise<WorkEntry> {
  const response = await axios.put<WorkEntry>(
    `${FAKESTORE_BASE}/products/${input.id}`,
    input
  );
  return response.data;
}

async function fakestore_delete(id: number | string): Promise<void> {
  await axios.delete(`${FAKESTORE_BASE}/products/${id}`);
}

async function fakestore_getCategories(): Promise<string[]> {
  const response = await axios.get<string[]>(
    `${FAKESTORE_BASE}/products/categories`
  );
  return response.data;
}

// ============================================================
// VISIBLE API FUNCTIONS
// localStorage-backed for now. Real backend replaces this.
// ============================================================

const STORAGE_KEY = "visible_entries";

function visible_getStored(): WorkEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WorkEntry[]) : [];
  } catch {
    return [];
  }
}

function visible_saveStored(entries: WorkEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

async function visible_getAll(): Promise<WorkEntry[]> {
  return Promise.resolve(visible_getStored());
}

async function visible_getById(id: number | string): Promise<WorkEntry> {
  const entries = visible_getStored();
  const found = entries.find((e) => String(e.id) === String(id));
  if (!found) throw new Error(`Entry ${id} not found`);
  return Promise.resolve(found);
}

async function visible_create(input: CreateEntryInput): Promise<WorkEntry> {
  const entries = visible_getStored();
  const newEntry: WorkEntry = {
    ...input,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  visible_saveStored([...entries, newEntry]);
  return Promise.resolve(newEntry);
}

async function visible_update(input: UpdateEntryInput): Promise<WorkEntry> {
  const entries = visible_getStored();
  const updated = entries.map((e) =>
    String(e.id) === String(input.id) ? { ...e, ...input } : e
  );
  visible_saveStored(updated);
  const found = updated.find((e) => String(e.id) === String(input.id));
  if (!found) throw new Error(`Entry ${input.id} not found`);
  return Promise.resolve(found);
}

async function visible_delete(id: number | string): Promise<void> {
  const entries = visible_getStored();
  visible_saveStored(entries.filter((e) => String(e.id) !== String(id)));
  return Promise.resolve();
}

async function visible_getCategories(): Promise<string[]> {
  return Promise.resolve([
    "administrative",
    "operations",
    "finance_analyst",
    "quant_research",
    "data_engineering",
    "project_management",
    "technology",
    "other",
  ]);
}

// ============================================================
// UNIFIED API SERVICE
// All components import and use this object only.
// ============================================================

export const apiService = {
  getAll: API_MODE === "fakestore" ? fakestore_getAll : visible_getAll,
  getById: API_MODE === "fakestore" ? fakestore_getById : visible_getById,
  create: API_MODE === "fakestore" ? fakestore_create : visible_create,
  update: API_MODE === "fakestore" ? fakestore_update : visible_update,
  delete: API_MODE === "fakestore" ? fakestore_delete : visible_delete,
  getCategories:
    API_MODE === "fakestore"
      ? fakestore_getCategories
      : visible_getCategories,
  mode: API_MODE,
};
