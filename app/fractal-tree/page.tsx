'use client';

import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

export default function FractalTreeGenerator() {
  const [depth, setDepth] = useState(8);
  const [angle, setAngle] = useState(25);
  const [branchRatio, setBranchRatio] = useState(0.67);
  const [color, setColor] = useState('#0ea5e9');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawTree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Starting position
    const startX = canvas.width / 2;
    const startY = canvas.height - 50;

    // Draw the fractal tree
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    const drawBranch = (x: number, y: number, length: number, angle: number, depth: number) => {
      if (depth === 0) return;

      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      const newLength = length * branchRatio;
      const angleRadians = (angle * Math.PI) / 180;

      // Draw left branch
      drawBranch(endX, endY, newLength, angle - angleRadians, depth - 1);
      // Draw right branch
      drawBranch(endX, endY, newLength, angle + angleRadians, depth - 1);
    };

    // Start drawing from the bottom, going up
    drawBranch(startX, startY, 120, -Math.PI / 2, depth);
  };

  useEffect(() => {
    drawTree();
  }, [depth, angle, branchRatio, color]);

  const downloadTree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'fractal-tree.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          Fractal Tree Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Create beautiful fractal trees with customizable parameters
        </p>
      </div>
      
      <main className="flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Tree Parameters
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Depth: {depth}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={depth}
                    onChange={(e) => setDepth(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>3</span>
                    <span>12</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch Angle: {angle}°
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>10°</span>
                    <span>45°</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch Ratio: {branchRatio.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.8"
                    step="0.01"
                    value={branchRatio}
                    onChange={(e) => setBranchRatio(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>0.5</span>
                    <span>0.8</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tree Color
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>

                <button
                  onClick={downloadTree}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download PNG
                </button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border border-gray-200 dark:border-gray-600 rounded-lg"
                  style={{ backgroundColor: 'white' }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </Layout>
  );
}