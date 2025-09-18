"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { debugEnabled } from '../utils/shared';
import { useAuth } from '../providers/AuthContext';
import { signIn, signOut, useSession } from 'next-auth/react';

// Role selection removed

export default function AuthPage(){
  const { status } = useAuth();
  const authSession = useSession();
  const authenticated = (authSession.status === 'authenticated') || status.authenticated;
  const user = (authSession.data?.user as any) || status.user;
  // Role state removed
  // Removed legacy status polling & error state

  // Legacy refreshStatus removed

  function handleGoogle(){
    // Pass role as a callback URL param or in state (next-auth supports callbackUrl)
    signIn('google', { callbackUrl: '/', prompt: 'select_account' });
  }


  // Legacy status refresh removed

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <header className="flex items-center justify-between mb-8">
        <Link href="/" className="link hover:text-blue-600 dark:hover:text-blue-400">← Home</Link>
      </header>
      <h1 className="text-2xl font-semibold mb-4">Authentication</h1>

      {authenticated && user ? (
        <div className="mb-6 p-4 rounded border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30">
          <p className="text-sm">Signed in as <strong>{user.name}</strong> (<span className="opacity-80">{user.email}</span>) role: <code>{user.role}</code></p>
        </div>
      ) : (
        <p className="text-sm mb-6 opacity-80">You are not signed in.</p>
      )}

      <section className="mb-10 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-3">Sign in with Google</h2>
        <button onClick={handleGoogle} className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">Continue with Google</button>
        <p className="text-xs opacity-70 mt-3">You'll be redirected to Google to authorize.</p>
      </section>

      {/* Developer credentials login removed */}

      {/* Debug status panel removed (legacy) */}
    </div>
  );
}
