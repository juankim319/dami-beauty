"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  loading: boolean;
  configError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    let unsub = () => {};
    try {
      const auth = getFirebaseAuth();
      unsub = onAuthStateChanged(auth, async (u) => {
        setUser(u);
        if (u) {
          const t = await u.getIdToken();
          setToken(t);
          const result = await u.getIdTokenResult();
          setIsAdmin(result.claims.role === "admin");
        } else {
          setToken(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });
    } catch (err) {
      setConfigError(err instanceof Error ? err.message : "Firebase başlatılamadı. Lütfen sayfayı yenileyin.");
      setLoading(false);
    }
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(getFirebaseAuth());
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, loading, configError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
