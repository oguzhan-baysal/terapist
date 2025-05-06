'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get('image') as File;

    // Fotoğrafı yükle
    let imageUrl = '/images/default-terapist.jpg';
    if (imageFile && imageFile.size > 0) {
      try {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Fotoğraf yüklenemedi.');
        }

        const { url } = await uploadResponse.json();
        imageUrl = url;
      } catch (error) {
        console.error('Fotoğraf yükleme hatası:', error);
        // Varsayılan fotoğraf kullanılacak
      }
    }

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      specialties: (formData.get('specialties') as string).split(',').map(s => s.trim()),
      experience: parseInt(formData.get('experience') as string),
      education: [{
        degree: formData.get('degree') as string,
        school: formData.get('school') as string,
        year: parseInt(formData.get('graduationYear') as string)
      }],
      contact: {
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        workingHours: [{
          day: "Pazartesi-Cuma",
          hours: "09:00-17:00"
        }]
      },
      pricing: {
        sessionPrice: parseInt(formData.get('sessionPrice') as string),
        currency: "TRY"
      },
      image: imageUrl
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Kayıt işlemi başarısız oldu.');
      }

      router.push('/giris?success=true');
    } catch (error: any) {
      setError(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Terapist Olarak Kayıt Ol</h2>
        <p className="mt-2 text-sm text-gray-600">
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" className="font-medium text-primary hover:text-primary/90">
            Giriş Yap
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profil fotoğrafı önizleme"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-auto"
          />
          <p className="text-sm text-gray-500">Profil fotoğrafı yükleyin (opsiyonel)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ad Soyad"
            />
          </div>
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="E-posta adresi"
            />
          </div>
          <div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Şifre"
            />
          </div>
          <div>
            <Input
              id="specialties"
              name="specialties"
              type="text"
              required
              placeholder="Uzmanlık Alanları (virgülle ayırın)"
            />
          </div>
          <div>
            <Input
              id="experience"
              name="experience"
              type="number"
              required
              placeholder="Deneyim (yıl)"
            />
          </div>
          <div>
            <Input
              id="degree"
              name="degree"
              type="text"
              required
              placeholder="Eğitim Derecesi (örn: Uzman Klinik Psikolog)"
            />
          </div>
          <div>
            <Input
              id="school"
              name="school"
              type="text"
              required
              placeholder="Okul/Üniversite"
            />
          </div>
          <div>
            <Input
              id="graduationYear"
              name="graduationYear"
              type="number"
              required
              placeholder="Mezuniyet Yılı"
            />
          </div>
          <div>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="Telefon Numarası"
            />
          </div>
          <div>
            <Input
              id="address"
              name="address"
              type="text"
              required
              placeholder="Adres"
            />
          </div>
          <div>
            <Input
              id="sessionPrice"
              name="sessionPrice"
              type="number"
              required
              placeholder="Seans Ücreti (TL)"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
        </Button>
      </form>
    </div>
  );
} 