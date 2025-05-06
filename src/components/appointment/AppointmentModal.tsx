"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfDay, isBefore, isAfter } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert } from "@/components/ui/alert";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  terapistId: string;
  workingHours?: { day: string; hours: string }[];
}

// Kayıt formu şeması
const registerFormSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Telefon numarası 10 haneli olmalıdır"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

// Randevu formu şeması
const appointmentFormSchema = z.object({
  notes: z.string().optional()
});

type RegisterFormData = z.infer<typeof registerFormSchema>;
type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export default function AppointmentModal({ isOpen, onClose, terapistId, workingHours }: AppointmentModalProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Kayıt formu için form hook'u
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    }
  });

  // Randevu formu için form hook'u
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      notes: ""
    }
  });

  // Kullanıcı giriş yapmışsa direkt randevu adımına geç
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setDate(new Date());
      setTime(undefined);
    } else if (status === 'unauthenticated') {
      router.push('/giris');
      onClose();
    }
  }, [status, router, onClose]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    
    // Maksimum 10 karakter kontrolü
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    // Telefon numarası formatlaması (5XX XXX XX XX)
    if (value.length > 0) {
      let formattedValue = value;
      if (value.length > 3) formattedValue = value.slice(0, 3) + ' ' + value.slice(3);
      if (value.length > 6) formattedValue = formattedValue.slice(0, 7) + ' ' + formattedValue.slice(7);
      if (value.length > 8) formattedValue = formattedValue.slice(0, 10) + ' ' + formattedValue.slice(10);
      
      registerForm.setValue("phone", value); // Backend için saf numara
      
      // Input değerini formatlanmış şekilde göster
      e.target.value = formattedValue;
    } else {
      registerForm.setValue("phone", value);
    }
  };

  useEffect(() => {
    if (workingHours) {
      console.log('Çalışma saatleri:', JSON.stringify(workingHours, null, 2));
      
      // Çalışma saatlerini normalize et
      const normalizedWorkingHours = workingHours.map(wh => ({
        ...wh,
        day: wh.day.toLowerCase().trim(),
        hours: wh.hours.trim()
      }));
      
      console.log('Normalize edilmiş çalışma saatleri:', JSON.stringify(normalizedWorkingHours, null, 2));
    } else {
      console.log('Çalışma saatleri tanımlı değil!');
    }
  }, [workingHours]);

  // Gün adını normalize eden yardımcı fonksiyon
  const normalizeDayName = (dayName: string): string => {
    const dayMap: { [key: string]: string } = {
      'pazartesi': 'pazartesi',
      'salı': 'sali',
      'çarşamba': 'carsamba',
      'perşembe': 'persembe',
      'cuma': 'cuma',
      'cumartesi': 'cumartesi',
      'pazar': 'pazar'
    };

    const normalizedDay = dayName.toLowerCase().trim();
    return dayMap[normalizedDay] || normalizedDay;
  };

  const getAvailableHours = (selectedDate: Date | undefined) => {
    if (!selectedDate || !workingHours) return [];

    // Türkçe gün adını al
    const dayName = format(selectedDate, "EEEE", { locale: tr }).toLowerCase();
    const normalizedDayName = normalizeDayName(dayName);
    
    console.log('Saat hesaplama başlıyor:', {
      selectedDate: format(selectedDate, 'yyyy-MM-dd'),
      dayName,
      normalizedDayName,
      workingHours
    });
    
    const workingDay = workingHours.find(wh => {
      const workingDays = wh.day.toLowerCase().trim().split('-');
      
      // Eğer gün aralığı varsa (örn: pazartesi-cuma)
      if (workingDays.length === 2) {
        const weekDays = ['pazartesi', 'sali', 'carsamba', 'persembe', 'cuma'];
        const dayIndex = weekDays.indexOf(normalizedDayName);
        return dayIndex >= 0 && dayIndex < 5;
      }
      
      // Tek gün ise
      return workingDays[0] === normalizedDayName;
    });
    
    if (!workingDay) {
      console.log('Çalışma günü bulunamadı');
      return [];
    }

    try {
      // Çalışma saatlerini parse et
      const [start, end] = workingDay.hours.split("-").map(time => time.trim());
      const [startHour] = start.split(":").map(Number);
      const [endHour] = end.split(":").map(Number);

      console.log('Saat aralığı:', {
        start,
        end,
        startHour,
        endHour
      });

      // Saat aralıklarını oluştur (1 saatlik dilimler)
      const hours: string[] = [];
      for (let hour = startHour; hour < endHour; hour++) {
        hours.push(`${hour.toString().padStart(2, "0")}:00`);
      }

      console.log('Kullanılabilir saatler:', hours);
      return hours;
    } catch (error) {
      console.error('Saat hesaplama hatası:', error);
      return [];
    }
  };

  useEffect(() => {
    // Tarih değiştiğinde seçili saati sıfırla
    setTime(undefined);
  }, [date]);

  const handleDateSelect = (newDate: Date) => {
    try {
      console.log("handleDateSelect çağrıldı:", format(newDate, "yyyy-MM-dd"));
      
      // Tarihi sıfırlanmış saat ile ayarla (sadece gün bilgisi)
      const selectedDate = startOfDay(newDate);
      console.log("İşlenmiş tarih:", format(selectedDate, "yyyy-MM-dd"));
      
      // Türkçe gün adını al
      const dayName = format(selectedDate, "EEEE", { locale: tr }).toLowerCase();
      const normalizedDayName = normalizeDayName(dayName);
      
      console.log("Gün bilgisi:", { dayName, normalizedDayName });
      
      if (!workingHours || workingHours.length === 0) {
        console.error("Çalışma saatleri tanımlı değil!");
        setError("Çalışma saatleri tanımlı değil.");
        return;
      }
      
      const workingDay = workingHours.find(wh => {
        const workingDays = wh.day.toLowerCase().trim().split('-');
        console.log("Kontrol edilen çalışma günü:", workingDays);
        
        // Eğer gün aralığı varsa (örn: pazartesi-cuma)
        if (workingDays.length === 2) {
          const weekDays = ['pazartesi', 'sali', 'carsamba', 'persembe', 'cuma'];
          const dayIndex = weekDays.indexOf(normalizedDayName);
          return dayIndex >= 0 && dayIndex < 5;
        }
        
        // Tek gün ise
        return workingDays[0] === normalizedDayName;
      });

      console.log("Bulunan çalışma günü:", workingDay);

      if (!workingDay) {
        console.log("Çalışma günü bulunamadı");
        setError("Bu gün için randevu alınamaz.");
        return;
      }

      // Geçerli bir çalışma günü seçildi
      console.log("Tarih başarıyla ayarlandı:", format(selectedDate, "yyyy-MM-dd"));
      setDate(selectedDate);
      setTime(undefined);
      setError(null);
    } catch (error) {
      console.error("Tarih seçimi hatası:", error);
      setError("Tarih seçimi sırasında bir hata oluştu.");
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: 'user'
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setDate(new Date());
        setTime(undefined);
      } else {
        setError(responseData.error || 'Kayıt işlemi başarısız oldu.');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSubmit = async (data: AppointmentFormData) => {
    if (!date || !time) {
      setError('Lütfen tarih ve saat seçiniz');
      return;
    }

    if (!session?.user) {
      router.push('/giris');
      onClose();
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          terapistId,
          date,
          time,
          notes: data.notes,
          status: 'pending'
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess('Randevu talebiniz başarıyla gönderildi. Terapist onayı bekleniyor.');
        setTimeout(() => {
          onClose();
          form.reset();
          setDate(undefined);
          setTime(undefined);
        }, 2000);
      } else {
        setError(responseData.error || 'Randevu oluşturma başarısız oldu.');
      }
    } catch (error) {
      console.error('Randevu hatası:', error);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    try {
      // Geçmiş tarihleri kontrol et
      const today = startOfDay(new Date());
      
      // Geçmiş tarihler devre dışı
      if (isBefore(date, today)) {
        console.log(`${format(date, 'yyyy-MM-dd')} tarihi bugünden önce olduğu için devre dışı`);
        return true;
      }

      // 60 gün sonrasını devre dışı bırak
      const sixtyDaysFromNow = addDays(today, 60);
      if (isAfter(date, sixtyDaysFromNow)) {
        console.log(`${format(date, 'yyyy-MM-dd')} tarihi 60 gün sonrasında olduğu için devre dışı`);
        return true;
      }

      // Eğer workingHours tanımlı değilse veya boşsa, tüm tarihleri devre dışı bırak
      if (!workingHours || workingHours.length === 0) {
        console.log('Çalışma saatleri tanımlı değil, tüm tarihler devre dışı');
        return true;
      }

      // Türkçe gün adını al
      const dayName = format(date, "EEEE", { locale: tr }).toLowerCase();
      const normalizedDayName = normalizeDayName(dayName);
      
      const workingDay = workingHours.find(wh => {
        const workingDays = wh.day.toLowerCase().trim().split('-');
        
        // Eğer gün aralığı varsa (örn: pazartesi-cuma)
        if (workingDays.length === 2) {
          const weekDays = ['pazartesi', 'sali', 'carsamba', 'persembe', 'cuma'];
          const dayIndex = weekDays.indexOf(normalizedDayName);
          return dayIndex >= 0 && dayIndex < 5; // Pazartesi-Cuma arası
        }
        
        // Tek gün ise
        return workingDays[0] === normalizedDayName;
      });

      const isDisabled = !workingDay;
      if (isDisabled) {
        console.log(`${format(date, 'yyyy-MM-dd')} (${dayName}) tarihi için çalışma saati yok`);
      } else {
        console.log(`${format(date, 'yyyy-MM-dd')} (${dayName}) tarihi için çalışma saati var: ${workingDay.hours}`);
      }

      return isDisabled;
    } catch (error) {
      console.error('Tarih kontrolü hatası:', error);
      return true;
    }
  };

  if (status === 'loading') {
    return null;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      onClose();
      setError(null);
      setSuccess(null);
      setDate(undefined);
      setTime(undefined);
    }}>
      <DialogContent 
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>
            {date ? 'Randevu Al' : 'Kayıt Ol'}
          </DialogTitle>
          <p id="appointment-description" className="text-sm text-gray-500">
            {date ? 'Lütfen randevu için uygun bir tarih ve saat seçin.' : 'Randevu alabilmek için lütfen kayıt olun.'}
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {date ? (
            <form onSubmit={form.handleSubmit(handleAppointmentSubmit)} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="date">Tarih</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                      id="date"
                      type="button"
                      aria-label="Tarih seçin"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "d MMMM yyyy", { locale: tr }) : "Tarih seçin"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        if (newDate) {
                          console.log("Yeni tarih seçildi:", format(newDate, "yyyy-MM-dd"));
                          handleDateSelect(newDate);
                        }
                      }}
                      disabled={isDateDisabled}
                      className="rounded-md border"
                      locale={tr}
                      fromDate={new Date()}
                      toDate={addDays(new Date(), 60)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {date && (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="time">Saat</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger id="time" aria-label="Randevu saati seçin">
                      <SelectValue placeholder="Saat seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableHours(date).map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
                <Input
                  id="notes"
                  {...form.register("notes")}
                  placeholder="Eklemek istediğiniz notlar..."
                  aria-label="Randevu notları"
                />
              </div>

              {error && (
                <Alert variant="default" className="mt-4 border-red-200 bg-red-50 text-red-900" role="alert">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="default" className="mt-4 bg-green-50 text-green-700 border-green-200" role="status">
                  {success}
                </Alert>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={loading || !date || !time}>
                  {loading ? <LoadingSpinner /> : "Randevu Oluştur"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  {...registerForm.register("name")}
                  aria-invalid={!!registerForm.formState.errors.name}
                  autoComplete="name"
                  aria-label="Ad Soyad"
                />
                {registerForm.formState.errors.name && (
                  <p className="text-sm text-red-500" role="alert">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerForm.register("email")}
                  aria-invalid={!!registerForm.formState.errors.email}
                  autoComplete="email"
                  aria-label="E-posta"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-500" role="alert">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...registerForm.register("phone")}
                  onChange={handlePhoneChange}
                  placeholder="5XX XXX XX XX"
                  aria-invalid={!!registerForm.formState.errors.phone}
                  autoComplete="tel"
                  aria-label="Telefon"
                />
                {registerForm.formState.errors.phone && (
                  <p className="text-sm text-red-500" role="alert">{registerForm.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerForm.register("password")}
                  aria-invalid={!!registerForm.formState.errors.password}
                  autoComplete="new-password"
                  aria-label="Şifre"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-500" role="alert">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              {error && (
                <Alert variant="default" className="mt-4 border-red-200 bg-red-50 text-red-900" role="alert">
                  {error}
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading || registerForm.formState.isSubmitting}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>İşleniyor...</span>
                  </div>
                ) : (
                  'Devam Et'
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 