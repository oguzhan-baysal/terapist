import { Schema, model, models } from 'mongoose';

export interface ITherapist {
  name: string;
  email: string;
  password: string;
  image?: string;
  title?: string;
  rating?: number;
  reviewCount?: number;
  location?: {
    city?: string;
    district?: string;
  };
  specialties: string[];
  experience: number;
  education: {
    degree: string;
    school: string;
    year: number;
  }[];
  contact: {
    phone: string;
    address: string;
    workingHours: {
      day: string;
      hours: string;
    }[];
  };
  insurance: string[];
  pricing: {
    sessionPrice: number;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const therapistSchema = new Schema<ITherapist>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  title: { type: String },
  rating: { type: Number },
  reviewCount: { type: Number },
  location: {
    city: { type: String },
    district: { type: String }
  },
  specialties: [{ type: String, required: true }],
  experience: { type: Number, required: true },
  education: [{
    degree: { type: String, required: true },
    school: { type: String, required: true },
    year: { type: Number, required: true }
  }],
  contact: {
    phone: { type: String, required: true },
    address: { type: String, required: true },
    workingHours: [{
      day: { type: String, required: true },
      hours: { type: String, required: true }
    }]
  },
  insurance: [{ type: String }],
  pricing: {
    sessionPrice: { type: Number, required: true },
    currency: { type: String, required: true, default: 'TRY' }
  }
}, {
  timestamps: true
});

export const Therapist = models.Therapist || model<ITherapist>('Therapist', therapistSchema); 