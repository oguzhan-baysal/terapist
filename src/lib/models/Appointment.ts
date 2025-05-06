import { Schema, model, models } from 'mongoose';

const appointmentSchema = new Schema({
  terapistId: {
    type: Schema.Types.ObjectId,
    ref: 'Therapist',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Appointment = models.Appointment || model('Appointment', appointmentSchema); 