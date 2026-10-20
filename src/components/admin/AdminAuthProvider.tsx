"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginAdminSession,
  refreshAdminSession,
} from "@/lib/admin-auth/adminAuthApi";
import {
  clearStoredTokens,
  getStoredAccessToken,
  setStoredTokens,
} from "@/lib/admin-auth/adminAuthStorage";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  validateToken: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const validateToken = useCallback(async () => {
    const token = getStoredAccessToken();
    const hasToken = Boolean(token);
    setIsAuthenticated(hasToken);
    return hasToken;
  }, []);

  useEffect(() => {
    void validateToken();
    setLoading(false);
  }, [validateToken]);

  const login = useCallback(async (identifier: string, password: string) => {
    setLoading(true);

    try {
      const session = await loginAdminSession(identifier, password);
      setStoredTokens(
        session.accessToken ?? session.token,
        session.refreshToken,
      );
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    clearStoredTokens();
    setIsAuthenticated(false);
  }, []);

  const refreshToken = useCallback(async () => {
    const session = await refreshAdminSession();
    setStoredTokens(session.accessToken ?? session.token, session.refreshToken);
    setIsAuthenticated(true);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        refreshToken,
        validateToken,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }

  return context;
}
