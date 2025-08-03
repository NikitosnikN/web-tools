'use client';

import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

declare global {
  interface Window {
    heicTo: any;
    JSZip: any;
    saveAs: any;
  }
}

interface ConvertedFile {
  name: string;
  blob: Blob;
  url: string;
}

export default function HeicConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg'>('png');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load external libraries
    const script1 = document.createElement('script');
    script1.type = 'module';
    script1.innerHTML = `
      import { heicTo } from 'https://cdn.jsdelivr.net/npm/heic-to@1.1.0/dist/heic-to.min.js';
      window.heicTo = heicTo;
    `;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    document.head.appendChild(script2);

    const script3 = document.createElement('script');
    script3.src = 'https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js';
    document.head.appendChild(script3);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
      document.head.removeChild(script3);
    };
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')
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
    if (!window.heicTo || files.length === 0) return;

    setIsConverting(true);
    setConvertedFiles([]);

    try {
      const converted: ConvertedFile[] = [];
      
      for (const file of files) {
        const result = await window.heicTo({
          blob: file,
          type: outputFormat === 'png' ? 'image/png' : 'image/jpeg',
          quality: outputFormat === 'jpeg' ? 0.9 : undefined
        });

        const newName = file.name.replace(/\.heic$/i, `.${outputFormat}`);
        const url = URL.createObjectURL(result);
        
        converted.push({
          name: newName,
          blob: result,
          url
        });
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
    window.saveAs(content, `converted-images.zip`);
  };

  return (
    <Layout>
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">HEIC Image Converter</h1>
        <p className="text-gray-600 dark:text-gray-300">Convert your iPhone HEIC photos to PNG or JPEG format easily. Upload multiple files, preview them, and download them all at once.</p>
      </div>
      
      <main className="flex-grow">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div
            className={`drop-zone rounded-lg p-8 text-center border-2 border-dashed transition-all ${
              dragActive ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-primary-500'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
          >
            <i className="fas fa-cloud-upload-alt text-4xl text-primary-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Drop HEIC files here or click to select
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Supports multiple file upload. Only HEIC files are accepted.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".heic,image/heic"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Select Files
            </button>
          </div>

          {/* Output Format Selection */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Output Format</h4>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="png"
                  checked={outputFormat === 'png'}
                  onChange={(e) => setOutputFormat(e.target.value as 'png' | 'jpeg')}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-200">PNG (Lossless)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="jpeg"
                  checked={outputFormat === 'jpeg'}
                  onChange={(e) => setOutputFormat(e.target.value as 'png' | 'jpeg')}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-200">JPEG (Smaller size)</span>
              </label>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
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
            <div className="mt-4 flex gap-3">
              <button
                onClick={convertFiles}
                disabled={isConverting}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {isConverting ? 'Converting...' : 'Convert All'}
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

        {/* Converted Files */}
        {convertedFiles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Converted Files ({convertedFiles.length})
              </h3>
              <button
                onClick={downloadAll}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-download mr-2"></i>Download All (ZIP)
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {convertedFiles.map((file, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-2 truncate">{file.name}</p>
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