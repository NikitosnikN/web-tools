'use client';

import React from 'react';
import Footer from './components/Footer';
import InstallPrompt from './components/InstallPrompt';
import { useOffline } from './components/OfflineProvider';

interface Tool {
  href: string;
  icon: string;
  title: string;
  description: string;
  external?: boolean;
}

const tools: Tool[] = [
  {
    href: '/heic',
    icon: 'fas fa-image',
    title: 'HEIC Converter',
    description: 'Convert iPhone HEIC photos to PNG or JPEG format with ease.'
  },
  {
    href: '/wa',
    icon: 'fab fa-whatsapp',
    title: 'WhatsApp Link Generator',
    description: 'Create WhatsApp chat links without saving contacts to your phone.'
  },
  {
    href: '/timer',
    icon: 'fas fa-clock',
    title: 'Breathing Timer',
    description: 'Take a break with a breathing exercise timer. Choose from multiple durations.'
  },
  {
    href: '/fractal-tree',
    icon: 'fas fa-tree',
    title: 'Fractal Tree Generator',
    description: 'Create beautiful fractal trees with customizable parameters.'
  },
  {
    href: '/pi-visualization',
    icon: 'fas fa-circle',
    title: 'Pi (π) Visualization',
    description: 'Explore the relationship between a circle\'s circumference and diameter.'
  },
  {
    href: '/golden-ratio',
    icon: 'fas fa-infinity',
    title: 'Golden Ratio (φ)',
    description: 'Experience an interactive 3D visualization of the Golden Ratio spiral.'
  },
  {
    href: '/qr',
    icon: 'fas fa-qrcode',
    title: 'QR Code Scanner',
    description: 'Scan QR codes using your device\'s camera without leaving your browser.'
  },
  {
    href: '/qr-creator',
    icon: 'fas fa-qrcode',
    title: 'QR Code Creator',
    description: 'Generate QR codes for URLs, text, contacts, WiFi and more. Download or share instantly.'
  },
  {
    href: '/jpg',
    icon: 'fas fa-image',
    title: 'JPG to PNG Converter',
    description: 'Convert your JPG/JPEG photos to PNG format easily. Process multiple files at once.'
  },
  {
    href: 'https://whoami.belikewater.xyz/',
    icon: 'fas fa-user-secret',
    title: 'Who Am I?',
    description: 'View detailed information and metadata about your browser and request.',
    external: true
  }
];

function toggleDarkMode() {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  } else {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  }
}

export default function Home() {
  const { isOnline, canInstall, installApp, isInstalled, isHydrated } = useOffline();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header with theme toggle and install button */}
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Web Tools</h1>
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
            id="theme-toggle" 
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

      {/* Welcome section */}
      <section className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">Welcome to Web Tools</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
          A collection of free, browser-based utilities to help with everyday tasks.
          All tools work entirely in your browser - no data is sent to any server.
          {isHydrated && !isOnline && (
            <span className="block mt-2 text-amber-600 dark:text-amber-400 font-medium">
              <i className="fas fa-info-circle mr-1"></i>
              You're currently offline, but most tools will still work!
            </span>
          )}
          This project is{' '}
          <a 
            href="https://github.com/NikitosnikN/web-tools" 
            className="text-primary-600 dark:text-primary-400 hover:underline" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            open-source on GitHub
          </a>
          {' '}and welcomes contributions.
        </p>
      </section>

      {/* Tools grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tools.map((tool, index) => (
          <a 
            key={index}
            href={tool.href} 
            className="group"
            {...(tool.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 h-full flex flex-col">
              <div className="rounded-full bg-primary-100 dark:bg-primary-900/30 p-3 w-14 h-14 flex items-center justify-center mb-4">
                <i className={`${tool.icon} text-primary-600 dark:text-primary-400 text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                {tool.description}
              </p>
              <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                <span>Try it now</span>
                <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* Footer */}
      <div className="pt-8">
        <Footer />
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
          <a 
            href="https://github.com/NikitosnikN/web-tools" 
            className="text-blue-600 dark:text-blue-400 hover:underline" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <i className="fab fa-github mr-1"></i>Open Source on GitHub
          </a>
        </p>
      </div>

      <InstallPrompt />
    </div>
  );
}