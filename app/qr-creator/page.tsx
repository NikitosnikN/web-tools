'use client';

import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

declare global {
  interface Window {
    qrcode: any;
  }
}

export default function QRCodeCreator() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('text');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load QR code generation library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const generateQRCode = () => {
    if (!text.trim() || !window.qrcode || !canvasRef.current) return;

    try {
      const qr = window.qrcode(0, 'M');
      qr.addData(text);
      qr.make();

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cellSize = 8;
      const margin = 4;
      const size = qr.getModuleCount();
      const canvasSize = (size + margin * 2) * cellSize;

      canvas.width = canvasSize;
      canvas.height = canvasSize;

      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Draw QR code
      ctx.fillStyle = '#000000';
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect(
              (col + margin) * cellSize,
              (row + margin) * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }

      // Convert to data URL
      const dataURL = canvas.toDataURL('image/png');
      setQrCode(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code. Please try again.');
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCode;
    link.click();
  };

  const copyQRCode = async () => {
    if (!qrCode || !canvasRef.current) return;

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          alert('QR code copied to clipboard!');
        }
      });
    } catch (error) {
      alert('Failed to copy QR code to clipboard');
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setText('');
    setQrCode(null);
  };

  const getPlaceholder = () => {
    switch (selectedType) {
      case 'url': return 'https://example.com';
      case 'email': return 'example@email.com';
      case 'phone': return '+1234567890';
      case 'sms': return '+1234567890';
      case 'wifi': return 'WIFI:T:WPA;S:NetworkName;P:Password;;';
      default: return 'Enter your text here...';
    }
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          QR Code Creator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Generate QR codes for URLs, text, contacts, WiFi and more
        </p>
      </div>
      
      <main className="flex-grow max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Create QR Code
            </h2>
            
            {/* Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QR Code Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'text', label: 'Text', icon: 'fas fa-font' },
                  { value: 'url', label: 'URL', icon: 'fas fa-link' },
                  { value: 'email', label: 'Email', icon: 'fas fa-envelope' },
                  { value: 'phone', label: 'Phone', icon: 'fas fa-phone' },
                  { value: 'sms', label: 'SMS', icon: 'fas fa-sms' },
                  { value: 'wifi', label: 'WiFi', icon: 'fas fa-wifi' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeChange(type.value)}
                    className={`p-3 rounded-lg border-2 transition-colors text-left ${
                      selectedType === type.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <i className={`${type.icon} mr-2`}></i>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={getPlaceholder()}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              {selectedType === 'wifi' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Format: WIFI:T:WPA;S:NetworkName;P:Password;;
                </p>
              )}
            </div>

            <button
              onClick={generateQRCode}
              disabled={!text.trim()}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-colors font-semibold"
            >
              <i className="fas fa-qrcode mr-2"></i>
              Generate QR Code
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Your QR Code
            </h2>
            
            {qrCode ? (
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg mb-4 inline-block">
                  <img src={qrCode} alt="Generated QR Code" className="max-w-full h-auto" />
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={downloadQRCode}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download PNG
                  </button>
                  
                  <button
                    onClick={copyQRCode}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <i className="fas fa-copy mr-2"></i>
                    Copy Image
                  </button>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Content:</strong> {text.length > 50 ? text.substring(0, 50) + '...' : text}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-qrcode text-gray-400 text-3xl"></i>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter content and click "Generate QR Code" to create your QR code
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Hidden canvas for QR code generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </main>

      <Footer />
    </Layout>
  );
}