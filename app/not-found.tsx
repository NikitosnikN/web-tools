import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found - Web Tools',
};

export default function NotFound() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link 
          href="/" 
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}