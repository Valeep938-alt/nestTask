import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/services';
import { tokenStore } from '../api/client';
import { User } from '../api/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const USER_KEY = 'user';
const AuthContext = createContext<AuthState | null>(null);

function readUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => (tokenStore.get() ? readUser() : null));
  const [loading, setLoading] = useState<boolean>(() => !!tokenStore.get());

  const clearSession = () => {
    tokenStore.clear();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  // Al abrir la app, verifica que el token guardado siga siendo válido
  useEffect(() => {
    if (!tokenStore.get()) return;
    authApi
      .me()
      .catch(clearSession)
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    tokenStore.set(res.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const register = async (name: string, email: string, password: string) => {
    await authApi.register(name, email, password);
    return login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout: clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
