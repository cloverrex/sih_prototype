"use client";
import React, { createContext, useContext } from 'react';
import { useSession, signOut } from 'next-auth/react';

export interface AuthContextValue {
  status: AuthStatus;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthUser {
  id?: number | string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

export interface AuthStatus {
  loaded: boolean;
  authenticated: boolean;
  user?: AuthUser | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const authStatus: AuthStatus = {
    loaded: session.status !== 'loading',
    authenticated: session.status === 'authenticated',
    user: session.data?.user as any || null
  };
  const value: AuthContextValue = { status: authStatus, refresh: async () => {}, logout: async () => { await signOut({ callbackUrl: '/' }); } };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
