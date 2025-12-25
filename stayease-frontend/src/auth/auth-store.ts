import type { User } from '@/types/api';

type Session = {
  token: string | null;
  user: User | null;
};

const STORAGE_KEY = 'stayease_auth';

let session: Session = {
  token: null,
  user: null,
};

let unauthorizedHandler: (() => void) | null = null;

const subscribers = new Set<() => void>();

const persist = () => {
  if (typeof window === 'undefined') return;
  if (!session.token) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const authStore = {
  load() {
    if (typeof window === 'undefined') return session;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Session;
        session = parsed;
      } catch {
        // ignore bad payloads
      }
    }
    return session;
  },
  getToken() {
    return session.token;
  },
  getUser() {
    return session.user;
  },
  setSession(payload: Session) {
    session = payload;
    persist();
    subscribers.forEach((fn) => fn());
  },
  clear() {
    session = { token: null, user: null };
    persist();
    subscribers.forEach((fn) => fn());
  },
  subscribe(fn: () => void) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  },
  setUnauthorizedHandler(fn: () => void) {
    unauthorizedHandler = fn;
  },
  notifyUnauthorized() {
    unauthorizedHandler?.();
  },
};
