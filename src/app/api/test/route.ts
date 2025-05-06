import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    const conn = await connectDB();
    return NextResponse.json({ 
      success: true, 
      message: 'Veritabanı bağlantısı başarılı!',
      host: conn.connection.host,
      database: conn.connection.name
    });
  } catch (error: any) {
    console.error('Veritabanı bağlantı hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Veritabanı bağlantısı başarısız!' 
    }, { 
      status: 500 
    });
  }
} 