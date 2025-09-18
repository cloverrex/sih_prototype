"use client";
import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

export interface ToastItem { id: string; message: string; type?: 'info'|'success'|'error'; ttl?: number; }
interface ToastContextValue { push: (message: string, type?: ToastItem['type'], ttl?: number) => void; }
const ToastContext = createContext<ToastContextValue|undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, type: ToastItem['type']='info', ttl=3500) => {
    const id = Math.random().toString(36).slice(2);
    setItems(list => [...list, { id, message, type, ttl }]);
    setTimeout(() => setItems(list => list.filter(t => t.id !== id)), ttl);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {items.map(t => (
          <div key={t.id} className={`px-4 py-2 rounded shadow text-sm text-white animate-fade-in-up ${t.type==='success'?'bg-green-600': t.type==='error'?'bg-red-600':'bg-gray-800'}`}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(){
  const ctx = useContext(ToastContext);
  if(!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
