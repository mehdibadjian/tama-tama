// Tiny localStorage-backed store so React can *subscribe* to a key rather than
// polling it inside an effect. Cached snapshots keep useSyncExternalStore happy
// (it re-renders only when the stored value actually changed).

type Listener = () => void;

interface CacheEntry {
  raw: string | null;
  value: unknown;
}

const caches = new Map<string, CacheEntry>();
const listeners = new Map<string, Set<Listener>>();
let crossTabWired = false;

function parse<T>(raw: string | null, read: (parsed: unknown) => T, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return read(JSON.parse(raw));
  } catch {
    return fallback;
  }
}

/** Read a key, reusing the cached object when nothing changed. */
export function readStore<T>(key: string, read: (parsed: unknown) => T, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  const hit = caches.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  const value = parse(raw, read, fallback);
  caches.set(key, { raw, value });
  return value;
}

export function writeStore<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
  caches.delete(key); // next read re-parses and gets a fresh snapshot
  listeners.get(key)?.forEach(l => l());
}

export function subscribeStore(key: string, listener: Listener): () => void {
  if (typeof window === 'undefined') return () => {};

  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);

  // Same-tab writes notify directly; other tabs arrive as "storage" events.
  if (!crossTabWired) {
    crossTabWired = true;
    window.addEventListener('storage', e => {
      if (!e.key) return;
      caches.delete(e.key);
      listeners.get(e.key)?.forEach(l => l());
    });
  }

  return () => {
    listeners.get(key)?.delete(listener);
  };
}
