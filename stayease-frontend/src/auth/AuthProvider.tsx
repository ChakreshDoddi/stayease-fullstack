import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authStore } from './auth-store';
import type { JwtResponse, User } from '@/types/api';
import { getCurrentUser } from '@/api/auth';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
  login: (payload: JwtResponse) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const stored = authStore.load();
  const [user, setUser] = useState<User | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      const current = authStore.load();
      setToken(current.token);
      setUser(current.user);
    });
    authStore.setUnauthorizedHandler(() => {
      setUser(null);
      setToken(null);
      authStore.clear();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    });
    if (stored.token && !stored.user) {
      void refreshUser();
    }
    return () => {
      unsubscribe();
      authStore.setUnauthorizedHandler(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (payload: JwtResponse) => {
    authStore.setSession({ token: payload.accessToken, user: payload.user });
    setToken(payload.accessToken);
    setUser(payload.user);
  };

  const logout = () => {
    authStore.clear();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const profile = await getCurrentUser();
      authStore.setSession({ token, user: profile });
      setUser(profile);
    } catch (error) {
      // fail silently; interceptor will handle unauthorized
      console.error('Failed to refresh user', error);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      isOwner: user?.role === 'OWNER',
      login,
      logout,
      refreshUser,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
