'use client';

import React, { useState } from 'react';
import { useOffline } from './OfflineProvider';

export default function InstallPrompt() {
  const { canInstall, installApp, isInstalled, isHydrated } = useOffline();
  const [dismissed, setDismissed] = useState(false);

  if (!isHydrated || !canInstall || isInstalled || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-2 w-8 h-8 flex items-center justify-center mr-3">
              <i className="fas fa-mobile-alt text-primary-600 dark:text-primary-400 text-sm"></i>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Install Web Tools
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-xs mb-3">
            Install this app for quick access and offline functionality
          </p>
          <div className="flex gap-2">
            <button
              onClick={installApp}
              className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
            >
              Install
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1.5 text-xs"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2"
        >
          <i className="fas fa-times text-xs"></i>
        </button>
      </div>
    </div>
  );
}