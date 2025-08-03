import React from 'react';
import { Metadata, Viewport } from 'next';
import ThemeProvider from './components/ThemeProvider';
import OfflineProvider from './components/OfflineProvider';

export const metadata: Metadata = {
  title: 'Web Tools Collection',
  description: 'A collection of free, browser-based utilities to help with everyday tasks.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Web Tools Collection',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                  darkMode: 'class',
                  theme: {
                      extend: {
                          colors: {
                              primary: {
                                  50: '#f0f9ff',
                                  100: '#e0f2fe',
                                  200: '#bae6fd',
                                  300: '#7dd3fc',
                                  400: '#38bdf8',
                                  500: '#0ea5e9',
                                  600: '#0284c7',
                                  700: '#0369a1',
                                  800: '#075985',
                                  900: '#0c4a6e',
                              }
                          }
                      }
                  }
              }
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <ThemeProvider>
          <OfflineProvider>
            {children}
          </OfflineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}