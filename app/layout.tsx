import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from 'react';
import { AuthProvider } from './providers/AuthContext';
import SessionProviderWrapper from './providers/SessionProvider';
import NavBar from './components/NavBar';
import { ToastProvider } from './components/Toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alumni Platform",
  description: "Alumni engagement platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50 text-gray-900`}>
        <SessionProviderWrapper>
          <AuthProvider>
            <ToastProvider>
              <NavBar />
              <main className="flex-1">{children}</main>
              <footer className="text-center text-xs text-gray-500 py-6">© {new Date().getFullYear()} Alumni Platform</footer>
            </ToastProvider>
          </AuthProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

