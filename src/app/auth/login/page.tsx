'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API entegrasyonu yapılacak
    console.log('Giriş yapılıyor:', formData);
    // Şimdilik direkt yönlendirme yapıyoruz
    router.push('/terapistler');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Giriş Yap</CardTitle>
          <CardDescription>
            Terapist Rehberi'ne hoş geldiniz. Lütfen giriş yapın.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@email.com"
                required
                value={formData.email}
                onChange={handleChange}
                aria-label="E-posta adresiniz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                aria-label="Şifreniz"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Giriş Yap
            </Button>
            <p className="text-sm text-center text-gray-600">
              Hesabınız yok mu?{' '}
              <Link 
                href="/auth/register" 
                className="text-primary hover:underline"
                aria-label="Kayıt ol sayfasına git"
              >
                Kayıt Ol
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 