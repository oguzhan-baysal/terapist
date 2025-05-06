import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { UserInput } from '@/models/User';

const DATABASE_NAME = 'test';
const USERS_COLLECTION = 'users';

export async function POST(request: Request) {
  try {
    const body: UserInput = await request.json();

    // Validate input
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: 'Lütfen tüm alanları doldurun' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);

    // Check if user already exists
    const existingUser = await db.collection(USERS_COLLECTION).findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kayıtlı' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Create user with default role and phone
    const user = await db.collection(USERS_COLLECTION).insertOne({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      phone: body.phone || '', // Eğer phone gönderilmezse boş string olarak kaydet
      role: 'user', // Varsayılan olarak user rolü ver
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { 
        message: 'Kullanıcı başarıyla oluşturuldu', 
        userId: user.insertedId,
        role: 'user'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 