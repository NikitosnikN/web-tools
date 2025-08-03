'use client';

import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

export default function BreathingTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalSeconds = selectedMinutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 440;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsBreathing(false);
            // Play completion sound
            if (audioRef.current) {
              audioRef.current.play().catch(() => {
                // Audio play failed, which is okay
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePresetClick = (minutes: number) => {
    if (!isRunning) {
      setSelectedMinutes(minutes);
      setTimeLeft(minutes * 60);
    }
  };

  const handleTimerClick = () => {
    if (timeLeft === 0) {
      // Reset timer
      setTimeLeft(selectedMinutes * 60);
      setIsRunning(false);
      setIsBreathing(false);
    } else {
      setIsRunning(!isRunning);
      setIsBreathing(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreathing(false);
    setTimeLeft(selectedMinutes * 60);
  };

  const getTimerStatus = () => {
    if (timeLeft === 0) return 'Complete';
    if (isRunning) return 'Breathe';
    return 'Start';
  };

  useEffect(() => {
    // Add styles to head on client-side only
    const style = document.createElement('style');
    style.textContent = `
      @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      @keyframes wave {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
      
      .timer-button.active::before,
      .timer-button.active::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        background: rgba(14, 165, 233, 0.3);
        z-index: -1;
      }
      
      .dark .timer-button.active::before,
      .dark .timer-button.active::after {
        background: rgba(56, 189, 248, 0.3);
      }
      
      .timer-button.active::before {
        animation: wave 4s infinite ease-out;
      }
      
      .timer-button.active::after {
        animation: wave 4s infinite ease-out 2s;
      }
      
      .breathing {
        animation: breathe 4s infinite ease-in-out;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Layout>

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">Breathing Timer</h1>
        <p className="text-gray-600 dark:text-gray-300">Take deep breaths. Focus on the present moment.</p>
      </div>
      
      {/* Timer Presets */}
      <div className="mb-8 flex justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm inline-flex flex-wrap gap-3 justify-center">
          {[5, 10, 15, 20].map((minutes) => (
            <button
              key={minutes}
              onClick={() => handlePresetClick(minutes)}
              disabled={isRunning}
              className={`px-4 py-2 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                selectedMinutes === minutes
                  ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/40'
                  : 'border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {minutes} min
            </button>
          ))}
        </div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-80 h-80 mb-8">
          {/* Timer Ring */}
          <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 160 160">
            <circle 
              cx="80" 
              cy="80" 
              r="70" 
              fill="none" 
              stroke="#e5e7eb" 
              className="dark:stroke-gray-700" 
              strokeWidth="12" 
            />
            <circle 
              className="timer-ring dark:stroke-primary-400" 
              cx="80" 
              cy="80" 
              r="70" 
              fill="none" 
              stroke="#0ea5e9" 
              strokeWidth="12" 
              strokeLinecap="round"
              style={{
                strokeDasharray: 440,
                strokeDashoffset: 440 - progress,
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
                transition: 'stroke-dashoffset 1s linear'
              }}
            />
          </svg>
          
          {/* Timer Button */}
          <button 
            onClick={handleTimerClick}
            className={`timer-button absolute inset-4 rounded-full bg-primary-600 dark:bg-primary-700 text-white flex items-center justify-center shadow-lg hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors ${
              isBreathing ? 'active breathing' : ''
            }`}
          >
            <div className="text-center">
              <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
              <p className="text-sm mt-1 opacity-80">{getTimerStatus()}</p>
            </div>
          </button>
        </div>
        
        <div className="flex space-x-4">
          {(isRunning || timeLeft !== selectedMinutes * 60) && (
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </main>

      <Footer />

      {/* Audio for timer completion */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGUeBDqV2Ozns2QcBTWQ1PbPeSsFJXnK7eGTPQgSYbzs5Z1EEQpJotKwwm4fBTy05vKDSTMBKFzW6eaVPQgPX7LH8NqOOwgPV6fo5aBKEQdGo+j0vGsjBDbE5/K3aAABJnDK7+KUIwgOYrPo6phJEQdIpefyvGojBjy25vK3aAAFMHA86+CNOAYObLnj4JJHFAJDL+HPv24jBjy+5/K5aCsBJ2/E7+CQPAYKY7DG8d+SQAkOV6rl55ZJFgBEo+r2wmwjBjm76eaIOwkOUrDo5aNMEQVLKOPwv29LfABJo/PMKS6CIDm+O/uGAAA=" type="audio/wav" />
      </audio>
    </Layout>
  );
}