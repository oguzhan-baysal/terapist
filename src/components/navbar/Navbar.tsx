'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Navbar: FC = () => {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-700" role="navigation" aria-label="Ana menü">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2"
            aria-label="Ana sayfaya git"
            tabIndex={0}
          >
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Terapist Rehberi
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4" role="menubar">
            <Link 
              href="/auth/login" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              role="menuitem"
              tabIndex={0}
              aria-label="Terapist bul sayfasına git"
            >
              Terapist Bul
            </Link>
            <Link 
              href="/hakkimizda" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              role="menuitem"
              tabIndex={0}
              aria-label="Hakkımızda sayfasına git"
            >
              Hakkımızda
            </Link>
            <Link 
              href="/iletisim" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              role="menuitem"
              tabIndex={0}
              aria-label="İletişim sayfasına git"
            >
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 