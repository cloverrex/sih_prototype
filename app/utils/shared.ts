// Utility functions and hooks adapted from alumni-platform's shared.js for Next.js

'use client';
import { useState, useEffect, useCallback } from 'react';

// Basic types
declare global {
  interface Window {
    API_BASE?: string;
  }
}
export interface AuthUser {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface AuthStatus {
  authenticated: boolean;
  user: AuthUser | null;
}

// API base URL logic
export function getApiBase() {
  if (typeof window !== 'undefined') {
    if (window.API_BASE) return window.API_BASE;
    const host = window.location && window.location.host;
    const isLocal = /localhost|127\.0\.0\.1|\[::1\]/.test(host || '');
    return isLocal ? 'http://localhost:5000' : '';
  }
  return '';
}

export const APP_BASE = '/app';

// Theme management as a React hook
export function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  return [theme, toggleTheme];
}

// (Legacy auth hooks removed in favor of AuthContext provider)

// Generic fetch helpers
export async function fetchJSON(url: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = { credentials: 'include', ...options } as RequestInit;
  const res = await fetch(url, defaultOptions);
  const ct = res.headers.get('content-type') || '';
  const body = ct.includes('application/json') ? await res.json() : await res.text();
  return { status: res.status, body };
}

export async function getJSON(path: string) {
  return fetchJSON(getApiBase() + path, { method: 'GET' });
}
export async function postJSON(path: string, data: any = {}) {
  return fetchJSON(getApiBase() + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}
export async function putJSON(path: string, data: any = {}) {
  return fetchJSON(getApiBase() + path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}
export async function delJSON(path: string) {
  return fetchJSON(getApiBase() + path, { method: 'DELETE' });
}

export async function me(): Promise<AuthUser | null> {
  try {
    const { status, body } = await getJSON('/api/auth/me');
    if (status === 200 && body && body.user) return body.user as AuthUser;
  } catch {}
  return null;
}

export function debugEnabled(){
  return process.env.NEXT_PUBLIC_DEBUG_PANELS === '1';
}
