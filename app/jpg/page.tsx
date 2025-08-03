'use client';

import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

declare global {
  interface Window {
    JSZip: any;
    saveAs: any;
  }
}

interface ConvertedFile {
  name: string;
  blob: Blob;
  url: string;
  originalName: string;
}

export default function JpgToPngConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load external libraries
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js';
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'image/jpeg' || file.type === 'image/jpg' || 
      file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const convertFiles = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setConvertedFiles([]);

    try {
      const converted: ConvertedFile[] = [];
      
      for (const file of files) {
        // Create a canvas to convert the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const convertedFile = await new Promise<ConvertedFile>((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Fill with white background
            if (ctx) {
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // Draw the image
              ctx.drawImage(img, 0, 0);
              
              // Convert to PNG blob
              canvas.toBlob((blob) => {
                if (blob) {
                  const newName = file.name.replace(/\.(jpg|jpeg)$/i, '.png');
                  const url = URL.createObjectURL(blob);
                  
                  resolve({
                    name: newName,
                    blob,
                    url,
                    originalName: file.name
                  });
                } else {
                  reject(new Error('Failed to convert image'));
                }
              }, 'image/png');
            } else {
              reject(new Error('Canvas context not available'));
            }
          };
          
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = URL.createObjectURL(file);
        });
        
        converted.push(convertedFile);
      }
      
      setConvertedFiles(converted);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const downloadAll = async () => {
    if (!window.JSZip || !window.saveAs || convertedFiles.length === 0) return;

    const zip = new window.JSZip();
    
    convertedFiles.forEach(file => {
      zip.file(file.name, file.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    window.saveAs(content, `converted-png-images.zip`);
  };

  const resetConverter = () => {
    setFiles([]);
    setConvertedFiles([]);
    setIsConverting(false);
    
    // Clean up object URLs
    convertedFiles.forEach(file => {
      URL.revokeObjectURL(file.url);
    });
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          JPG to PNG Converter
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Convert your JPG/JPEG photos to PNG format easily. Process multiple files at once.
        </p>
      </div>
      
      <main className="flex-grow">
        {/* Upload Section */}
        {files.length === 0 && convertedFiles.length === 0 && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
              <div
                className={`border-2 border-dashed rounded-lg p-12 transition-colors ${
                  dragActive 
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-200">Drag & drop your JPG/JPEG files here</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">or</p>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                  >
                    Browse Files
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".jpg,.jpeg,.JPG,.JPEG,image/jpeg" 
                    multiple 
                    onChange={handleFileSelect}
                    className="hidden" 
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Supports multiple JPG/JPEG files</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && !isConverting && convertedFiles.length === 0 && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Selected Files ({files.length})
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-file-image text-primary-500 mr-3"></i>
                    <span className="text-gray-700 dark:text-gray-200">{file.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={convertFiles}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Convert to PNG
              </button>
              <button
                onClick={() => setFiles([])}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Processing Section */}
        {isConverting && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Converting Files</h2>
            <div className="flex justify-center mt-6">
              <svg className="animate-spin h-8 w-8 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        )}

        {/* Results Section */}
        {convertedFiles.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Converted Images</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={downloadAll}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download All
                </button>
                <button 
                  onClick={resetConverter}
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                >
                  Convert More
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {convertedFiles.map((file, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-2 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">From: {file.originalName}</p>
                  <a
                    href={file.url}
                    download={file.name}
                    className="block bg-primary-500 hover:bg-primary-600 text-white text-center py-2 rounded transition-colors"
                  >
                    <i className="fas fa-download mr-1"></i>Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </Layout>
  );
}