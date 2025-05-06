'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User, Calendar, Settings, LogOut } from 'lucide-react';

const navigation = [
  { name: 'Profilim', href: '/dashboard', icon: User },
  { name: 'Randevularım', href: '/dashboard/randevular', icon: Calendar },
  { name: 'Ayarlar', href: '/dashboard/ayarlar', icon: Settings },
];

export function DashboardNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                Terapist Rehberi
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-b-2 border-primary-600 text-gray-900 dark:border-primary-400 dark:text-white'
                        : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-gray-700 dark:text-gray-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 