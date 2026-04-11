import { Schema, model, Document } from 'mongoose';

export interface IDonorRecord {
  donorId: string;
  unitsDonated: number;
  donationDate: Date;
}

export interface IBloodRequest extends Document {
  id: string;
  requesterId: string;
  bankId: string;
  bloodGroup: string;
  unitsRequired: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  donors: IDonorRecord[];
  requestDate: Date;
  address: string;
  reason: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donorRecordSchema = new Schema<IDonorRecord>(
  {
    donorId: {
      type: String,
      required: true,
    },
    unitsDonated: {
      type: Number,
      required: true,
    },
    donationDate: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const bloodRequestSchema = new Schema<IBloodRequest>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    requesterId: {
      type: String,
      required: true,
    },
    bankId: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    },
    unitsRequired: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'completed', 'rejected'],
      default: 'pending',
    },
    donors: [donorRecordSchema],
    requestDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    comment: String,
  },
  { timestamps: true }
);

export const BloodRequest = model<IBloodRequest>('BloodRequest', bloodRequestSchema);
