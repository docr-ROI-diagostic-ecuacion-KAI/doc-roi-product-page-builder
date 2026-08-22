import type { ProductTreatmentState } from "../schemas/productState";

const STORAGE_KEY = "doc-roi-product-treatment-state";

export function loadProjectState(): ProductTreatmentState | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ProductTreatmentState;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveProjectState(state: ProductTreatmentState) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...state, metadata: { ...state.metadata, updatedAt: new Date().toISOString() } }),
  );
}

export function clearProjectState() {
  window.localStorage.removeItem(STORAGE_KEY);
}
