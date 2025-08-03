'use client';

import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

declare global {
  interface Window {
    Html5QrcodeScanner: any;
    Html5Qrcode: any;
  }
}

export default function QRCodeScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanner, setScanner] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load QR code scanner library
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/html5-qrcode';
    script.onload = () => {
      console.log('QR Scanner library loaded');
    };
    document.head.appendChild(script);

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
      document.head.removeChild(script);
    };
  }, []);

  const startScanning = () => {
    if (!window.Html5QrcodeScanner || !scannerRef.current) return;

    setIsScanning(true);
    setScanResult(null);

    const html5QrcodeScanner = new window.Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    html5QrcodeScanner.render(
      (decodedText: string, decodedResult: any) => {
        setScanResult(decodedText);
        html5QrcodeScanner.clear();
        setIsScanning(false);
      },
      (error: any) => {
        // Handle scan errors silently
      }
    );

    setScanner(html5QrcodeScanner);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear().catch(console.error);
      setScanner(null);
    }
    setIsScanning(false);
  };

  const copyResult = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult).then(() => {
        alert('Copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy to clipboard');
      });
    }
  };

  const openLink = () => {
    if (scanResult && (scanResult.startsWith('http://') || scanResult.startsWith('https://'))) {
      window.open(scanResult, '_blank');
    }
  };

  const isUrl = scanResult && (scanResult.startsWith('http://') || scanResult.startsWith('https://'));

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          QR Code Scanner
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Scan QR codes using your device's camera
        </p>
      </div>
      
      <main className="flex-grow max-w-2xl mx-auto">
        {!isScanning && !scanResult && (
          <div className="text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <i className="fas fa-qrcode text-primary-600 dark:text-primary-400 text-3xl"></i>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Ready to Scan
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Click the button below to start scanning QR codes with your camera.
              </p>
              <button
                onClick={startScanning}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                <i className="fas fa-camera mr-2"></i>
                Start Scanning
              </button>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-blue-600 dark:text-blue-400 mt-1 mr-3"></i>
                <div className="text-left">
                  <h3 className="text-blue-800 dark:text-blue-300 font-semibold mb-2">Privacy Notice</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    This scanner works entirely in your browser. No images or scan results are sent to any server.
                    Your camera data stays completely private on your device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isScanning && (
          <div className="text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Scanning for QR Code
              </h2>
              <div id="qr-reader" ref={scannerRef} className="mb-4"></div>
              <button
                onClick={stopScanning}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Stop Scanning
              </button>
            </div>
          </div>
        )}

        {scanResult && (
          <div className="text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <i className="fas fa-check text-green-600 dark:text-green-400 text-2xl"></i>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                QR Code Scanned!
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scanned Content:
                </label>
                <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-left">
                  <code className="text-gray-800 dark:text-gray-200 break-all text-sm">
                    {scanResult}
                  </code>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={copyResult}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy
                </button>
                
                {isUrl && (
                  <button
                    onClick={openLink}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    Open Link
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setScanResult(null);
                    setIsScanning(false);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Scan Another
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </Layout>
  );
}