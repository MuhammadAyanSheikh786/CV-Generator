import { CVData, CVStorageData } from "./schemas";
import { STORAGE_KEY, EXPIRY_MS } from "./constants";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function saveCVData(data: CVData): void {
  if (!isBrowser()) return;

  const now = Date.now();
  const existing = loadRawStorageData();

  const storageData: CVStorageData = {
    data,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
}

export function loadCVData(): CVData | null {
  const raw = loadRawStorageData();
  if (!raw) return null;

  const age = Date.now() - raw.createdAt;
  if (age > EXPIRY_MS) {
    clearCVData();
    return null;
  }

  return raw.data;
}

function loadRawStorageData(): CVStorageData | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CVStorageData;
  } catch {
    return null;
  }
}

export function clearCVData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getDataAge(): number | null {
  const raw = loadRawStorageData();
  if (!raw) return null;
  return Date.now() - raw.createdAt;
}
