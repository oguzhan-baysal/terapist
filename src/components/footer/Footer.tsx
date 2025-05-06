'use client';

import { FC } from 'react';
import Link from 'next/link';

export const Footer: FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hakkımızda
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Terapist Rehberi, size en uygun terapisti bulmanızı sağlayan güvenilir bir platformdur.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hızlı Linkler
            </h3>
            <ul className="space-y-2" role="list">
              <li>
                <Link 
                  href="/terapistler" 
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  tabIndex={0}
                  aria-label="Terapist bul sayfasına git"
                >
                  Terapist Bul
                </Link>
              </li>
              <li>
                <Link 
                  href="/hakkimizda" 
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  tabIndex={0}
                  aria-label="Hakkımızda sayfasına git"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link 
                  href="/iletisim" 
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  tabIndex={0}
                  aria-label="İletişim sayfasına git"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              İletişim
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400" role="list">
              <li>
                <a href="mailto:info@terapistrehberi.com" aria-label="E-posta gönder" tabIndex={0}>
                  Email: info@terapistrehberi.com
                </a>
              </li>
              <li>
                <a href="tel:+90XXXXXXXXXX" aria-label="Telefon et" tabIndex={0}>
                  Tel: +90 (XXX) XXX XX XX
                </a>
              </li>
              <li>Adres: İstanbul, Türkiye</li>
            </ul>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Bizi Takip Edin
            </h3>
            <div className="flex space-x-4" role="list">
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="Instagram sayfamızı ziyaret et"
                tabIndex={0}
              >
                Instagram
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="Twitter sayfamızı ziyaret et"
                tabIndex={0}
              >
                Twitter
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="LinkedIn sayfamızı ziyaret et"
                tabIndex={0}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Terapist Rehberi. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
} 