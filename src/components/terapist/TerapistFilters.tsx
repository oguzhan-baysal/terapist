'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const uzmanlikAlanlari = [
  "Depresyon",
  "Anksiyete",
  "Travma",
  "İlişki Problemleri",
  "Aile Terapisi",
  "EMDR",
  "Çift Terapisi",
  "Bireysel Terapi",
];

const sehirler = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
];

export default function TerapistFilters() {
  const [priceRange, setPriceRange] = useState([300, 1500]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6 sticky top-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filtreler
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Arama</Label>
          <Input
            id="search"
            type="text"
            placeholder="Terapist adı veya uzmanlık alanı..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Şehir</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Şehir seçin" />
            </SelectTrigger>
            <SelectContent>
              {sehirler.map((sehir) => (
                <SelectItem key={sehir} value={sehir.toLowerCase()}>
                  {sehir}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialty">Uzmanlık Alanı</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Uzmanlık alanı seçin" />
            </SelectTrigger>
            <SelectContent>
              {uzmanlikAlanlari.map((alan) => (
                <SelectItem key={alan} value={alan.toLowerCase()}>
                  {alan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Seans Ücreti Aralığı</Label>
          <div className="pt-2">
            <Slider
              defaultValue={[300, 1500]}
              max={2000}
              min={0}
              step={100}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ₺{priceRange[0]}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ₺{priceRange[1]}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full">
            Filtreleri Uygula
          </Button>
        </div>
      </div>
    </div>
  );
} 