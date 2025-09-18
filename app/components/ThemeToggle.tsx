"use client";
import { useTheme } from '../utils/shared';
import { useEffect, useState } from 'react';

export default function ThemeToggle(){
  const themeHook = useTheme();
  const theme = themeHook[0];
  const toggle = themeHook[1] as () => void;
  const [mounted,setMounted]=useState(false);
  useEffect(()=>{ setMounted(true); },[]);
  if(!mounted) return null;
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      title={isDark? 'Switch to light':'Switch to dark'}
    >
      {isDark ? (
        <span className="text-yellow-300">☀️</span>
      ) : (
        <span className="text-indigo-600">🌙</span>
      )}
    </button>
  );
}
