'use client';

import React from 'react';
import Link from 'next/link';
import { useOffline } from './OfflineProvider';

interface LayoutProps {
  children: React.ReactNode;
}

function toggleDarkMode() {
  if (typeof window !== 'undefined') {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  }
}

export default function Layout({ children }: LayoutProps) {
  const { canInstall, installApp, isInstalled, isHydrated } = useOffline();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with theme toggle, install button, and back button */}
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Tools</span>
          </Link>
          <div className="flex items-center gap-2">
            {isHydrated && canInstall && !isInstalled && (
              <button 
                onClick={installApp}
                className="p-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 px-3 py-2 text-sm flex items-center gap-2"
              >
                <i className="fas fa-download"></i>
                <span>Install App</span>
              </button>
            )}
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 w-10 h-10 flex items-center justify-center"
            >
              {/* Sun icon for dark mode */}
              <i className="fas fa-sun text-gray-800 dark:hidden text-lg"></i>
              {/* Moon icon for light mode */}
              <i className="fas fa-moon text-white hidden dark:block text-lg"></i>
            </button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}