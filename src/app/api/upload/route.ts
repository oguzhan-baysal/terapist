import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Fotoğraf bulunamadı' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya adını oluştur
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `terapist-${uniqueSuffix}.${file.name.split('.').pop()}`;

    // Dosyayı public/uploads klasörüne kaydet
    const uploadDir = join(process.cwd(), 'public/uploads');
    const filePath = join(uploadDir, filename);
    
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      url: `/uploads/${filename}`,
      message: 'Fotoğraf başarıyla yüklendi' 
    });
  } catch (error) {
    console.error('Fotoğraf yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Fotoğraf yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 