'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-blue-200">Landlord App</Link>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none"
              >
                Menu ▼
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Properties</Link>
                  <Link href="/rent-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Rent Dashboard</Link>
                  <Link href="/bank-upload" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bank Upload</Link>
                </div>
              )}
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  );
}