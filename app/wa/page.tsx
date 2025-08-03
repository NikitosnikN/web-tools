'use client';

import React, { useState } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';

export default function WhatsAppLinkGenerator() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except + at the beginning
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Ensure + only appears at the beginning
    const formatted = cleaned.replace(/\+/g, '').replace(/^/, cleaned.startsWith('+') ? '+' : '');
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const generateWhatsAppLink = () => {
    const cleanPhone = phone.replace(/[^\d]/g, ''); // Remove all non-digits for the actual link
    const encodedMessage = encodeURIComponent(message.trim());
    
    if (!cleanPhone) {
      alert('Please enter a phone number');
      return;
    }
    
    // Validate phone number (should have at least 7 digits)
    if (cleanPhone.length < 7) {
      alert('Please enter a valid phone number');
      return;
    }
    
    // Generate WhatsApp link
    let whatsappUrl = `https://wa.me/${cleanPhone}`;
    if (message.trim()) {
      whatsappUrl += `?text=${encodedMessage}`;
    }
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          WhatsApp Link Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Create WhatsApp chat links without saving contacts to your phone
        </p>
      </div>
      
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <i className="fab fa-whatsapp text-green-600 dark:text-green-400 text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Start a WhatsApp Chat
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Enter the phone number and optional message to generate a WhatsApp link
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Phone Number
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                +
              </span>
              <input 
                type="tel" 
                id="phone" 
                value={phone}
                onChange={handlePhoneChange}
                className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 dark:border-gray-600 p-2 border dark:bg-gray-700 dark:text-white" 
                placeholder="123456789"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter the full number with country code (+ and - are allowed)
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Pre-filled Message (optional)
            </label>
            <textarea 
              id="message" 
              rows={3} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white" 
              placeholder="Hello, I'd like to chat with you!"
            />
          </div>
          
          <button 
            onClick={generateWhatsAppLink}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
          >
            <span>Open in WhatsApp</span>
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
          
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center">
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-1">
                <i className="fas fa-info-circle text-primary-600 dark:text-primary-400"></i>
              </div>
              <p className="ml-2 text-xs text-gray-600 dark:text-gray-300">
                This tool creates a direct link to start a WhatsApp conversation without saving the contact first.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </Layout>
  );
}