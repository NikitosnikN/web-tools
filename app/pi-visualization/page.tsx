'use client';

import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

export default function PiVisualization() {
  const [radius, setRadius] = useState(100);
  const [showCalculation, setShowCalculation] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw diameter line
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw circumference visualization
    const circumference = 2 * Math.PI * radius;
    const straightLineY = centerY + radius + 50;

    // Draw the "unrolled" circumference as a straight line
    ctx.beginPath();
    ctx.moveTo(centerX - circumference / 2, straightLineY);
    ctx.lineTo(centerX + circumference / 2, straightLineY);
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Mark diameter lengths along the circumference
    const diameterLength = 2 * radius;
    for (let i = 0; i < Math.PI; i += 1) {
      const x = centerX - circumference / 2 + (i * diameterLength);
      if (x < centerX + circumference / 2) {
        ctx.beginPath();
        ctx.moveTo(x, straightLineY - 10);
        ctx.lineTo(x, straightLineY + 10);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Add labels
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';

    // Circle label
    ctx.fillText('Circle', centerX, centerY - radius - 20);
    
    // Diameter label
    ctx.fillText(`Diameter: ${(2 * radius).toFixed(0)}px`, centerX, centerY + 20);
    
    // Circumference label
    ctx.fillText('Circumference "unrolled"', centerX, straightLineY - 25);
    ctx.fillText(`≈ ${circumference.toFixed(1)}px`, centerX, straightLineY + 25);

    // Pi relationship
    ctx.font = '12px sans-serif';
    ctx.fillText('π ≈ Circumference ÷ Diameter', centerX, straightLineY + 45);
  };

  useEffect(() => {
    drawVisualization();
  }, [radius]);

  const calculatePi = () => {
    const diameter = 2 * radius;
    const circumference = 2 * Math.PI * radius;
    return circumference / diameter;
  };

  const downloadVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'pi-visualization.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          Pi (π) Visualization
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Explore the relationship between a circle's circumference and diameter
        </p>
      </div>
      
      <main className="flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls and Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Circle Properties
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Radius: {radius}px
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Diameter:</span>
                    <span className="font-mono">{(2 * radius).toFixed(0)}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Circumference:</span>
                    <span className="font-mono">{(2 * Math.PI * radius).toFixed(1)}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">π (calculated):</span>
                    <span className="font-mono">{calculatePi().toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">π (actual):</span>
                    <span className="font-mono">3.141593</span>
                  </div>
                </div>

                <button
                  onClick={downloadVisualization}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download PNG
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-blue-800 dark:text-blue-300 font-semibold mb-2">
                What is π (Pi)?
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                Pi (π) is the ratio of a circle's circumference to its diameter. 
                No matter how big or small the circle, this ratio is always the same!
              </p>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                π ≈ 3.14159... (it goes on forever!)
              </p>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border border-gray-200 dark:border-gray-600 rounded-lg"
                  style={{ backgroundColor: 'white' }}
                />
              </div>
              
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Circle & Circumference</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Diameter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </Layout>
  );
}