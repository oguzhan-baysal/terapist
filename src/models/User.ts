import { Schema, model, models } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'therapist';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'therapist'], default: 'user' }
}, {
  timestamps: true
});

export const User = models.User || model<IUser>('User', userSchema);

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'therapist';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  phone?: string; // Opsiyonel alan
} 