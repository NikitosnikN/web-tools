import React from 'react';
import { Metadata, Viewport } from 'next';
import ThemeProvider from './components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Web Tools Collection',
  description: 'A collection of free, browser-based utilities to help with everyday tasks.',
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
    <html lang="en">
      <head>
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}