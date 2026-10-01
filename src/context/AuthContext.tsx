import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { AuthUserDTO, EmployeeProfileDTO } from '@ems/types';
import { authApi } from '../lib/authApi';
import { setAccessToken } from '../lib/authToken';

interface AuthState {
  user: AuthUserDTO | null;
  profile: EmployeeProfileDTO | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthCtx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserDTO | null>(null);
  const [profile, setProfile] = useState<EmployeeProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const me = await authApi.me();
    setUser(me.user);
    setProfile(me.profile);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await authApi.refresh();
        setAccessToken(r.accessToken);
        await loadMe();
      } catch {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [loadMe]);

  const login = useCallback(
    async (email: string, password: string) => {
      const r = await authApi.login(email, password);
      setAccessToken(r.accessToken);
      await loadMe();
    },
    [loadMe],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    setAccessToken(null);
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, profile, loading, login, logout }}>{children}</AuthCtx.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
