'use client';

import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

export default function GoldenRatioVisualization() {
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showNumbers, setShowNumbers] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio ≈ 1.618

  const fibonacci = (n: number): number => {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  };

  const drawGoldenSpiral = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, rotation: number = 0) => {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    // Draw golden rectangles and spiral
    let currentSize = size;
    let x = 0, y = 0;
    let direction = 0; // 0: right, 1: down, 2: left, 3: up

    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;

    for (let i = 0; i < 12; i++) {
      const fib = fibonacci(i + 1);
      const nextFib = fibonacci(i + 2);
      const rectSize = (currentSize * fib) / nextFib;

      // Draw rectangle
      ctx.strokeRect(x, y, rectSize, rectSize);

      if (showNumbers) {
        ctx.fillStyle = '#374151';
        ctx.font = `${Math.max(8, rectSize / 8)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(fib.toString(), x + rectSize / 2, y + rectSize / 2);
      }

      // Draw spiral arc
      ctx.beginPath();
      const arcCenterX = x + (direction % 2 === 0 ? (direction === 0 ? rectSize : 0) : rectSize / 2);
      const arcCenterY = y + (direction % 2 === 1 ? (direction === 1 ? rectSize : 0) : rectSize / 2);
      
      const startAngle = (direction * Math.PI) / 2;
      const endAngle = startAngle + Math.PI / 2;
      
      ctx.arc(arcCenterX, arcCenterY, rectSize, startAngle, endAngle);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Move to next position
      switch (direction) {
        case 0: // right
          x += rectSize;
          y -= rectSize;
          break;
        case 1: // down
          break;
        case 2: // left
          x -= rectSize;
          break;
        case 3: // up
          y -= rectSize;
          break;
      }

      direction = (direction + 1) % 4;
      currentSize = rectSize;
    }

    ctx.restore();
  };

  const drawVisualization = (rotation: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    drawGoldenSpiral(ctx, centerX, centerY, 100, rotation);

    // Draw title and info
    ctx.fillStyle = '#374151';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Golden Ratio Spiral (φ ≈ 1.618)', centerX, 30);
    
    ctx.font = '12px sans-serif';
    ctx.fillText('Based on Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34...', centerX, 50);
  };

  const animate = () => {
    if (!isAnimating) return;

    const time = Date.now() * 0.001 * animationSpeed;
    drawVisualization(time);
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isAnimating) {
      animate();
    } else {
      drawVisualization();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animationSpeed, showNumbers]);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const downloadVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'golden-ratio-spiral.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          Golden Ratio (φ)
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Interactive visualization of the Golden Ratio spiral
        </p>
      </div>
      
      <main className="flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls and Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Controls
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={toggleAnimation}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    isAnimating 
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  {isAnimating ? (
                    <>
                      <i className="fas fa-pause mr-2"></i>
                      Stop Animation
                    </>
                  ) : (
                    <>
                      <i className="fas fa-play mr-2"></i>
                      Start Animation
                    </>
                  )}
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Animation Speed: {animationSpeed.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showNumbers}
                    onChange={(e) => setShowNumbers(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Show Fibonacci Numbers</span>
                </label>

                <button
                  onClick={downloadVisualization}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download PNG
                </button>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
              <h3 className="text-amber-800 dark:text-amber-300 font-semibold mb-2">
                The Golden Ratio
              </h3>
              <p className="text-amber-700 dark:text-amber-300 text-sm mb-2">
                φ = (1 + √5) / 2 ≈ 1.618033988...
              </p>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                This special number appears throughout nature, art, and architecture. 
                It represents the most aesthetically pleasing proportions.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-blue-800 dark:text-blue-300 font-semibold mb-2">
                Fibonacci Connection
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                The ratio of consecutive Fibonacci numbers approaches the Golden Ratio:
              </p>
              <div className="mt-2 space-y-1 text-xs font-mono text-blue-600 dark:text-blue-400">
                <div>21/13 ≈ 1.615</div>
                <div>34/21 ≈ 1.619</div>
                <div>55/34 ≈ 1.618</div>
                <div>89/55 ≈ 1.618</div>
              </div>
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
                    <span className="text-gray-600 dark:text-gray-400">Golden Rectangles</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Golden Spiral</span>
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