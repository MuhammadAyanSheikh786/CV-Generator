import { RateLimitState } from "./schemas";
import { RATE_LIMIT_KEY, MAX_GENERATIONS_PER_DAY, RATE_LIMIT_WINDOW_MS } from "./constants";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function loadRateLimitState(): RateLimitState | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RateLimitState;
  } catch {
    return null;
  }
}

function saveRateLimitState(state: RateLimitState): void {
  if (!isBrowser()) return;
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
}

function getOrCreateState(): RateLimitState {
  const existing = loadRateLimitState();
  const now = Date.now();

  if (!existing || now > existing.resetTimestamp) {
    const fresh: RateLimitState = {
      count: 0,
      resetTimestamp: now + RATE_LIMIT_WINDOW_MS,
    };
    saveRateLimitState(fresh);
    return fresh;
  }

  return existing;
}

export function canGenerateCV(): boolean {
  const state = getOrCreateState();
  return state.count < MAX_GENERATIONS_PER_DAY;
}

export function getRemainingGenerations(): number {
  const state = getOrCreateState();
  return Math.max(0, MAX_GENERATIONS_PER_DAY - state.count);
}

export function getRateLimitResetTime(): number | null {
  const state = loadRateLimitState();
  return state?.resetTimestamp ?? null;
}

export function incrementGenerationCount(): boolean {
  const state = getOrCreateState();
  if (state.count >= MAX_GENERATIONS_PER_DAY) return false;

  state.count += 1;
  saveRateLimitState(state);
  return true;
}

export function resetRateLimit(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(RATE_LIMIT_KEY);
}
