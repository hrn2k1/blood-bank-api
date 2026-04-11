import { Schema, model, Document } from 'mongoose';
import { randomUUID } from 'crypto';

export interface IDonorRecord {
  donorId: string;
  unitsDonated: number;
  donationDate: Date;
}

export interface IBloodRequest extends Document {
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
    _id: {
      type: String,
      default: () => randomUUID(),
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
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

export const BloodRequest = model<IBloodRequest>('BloodRequest', bloodRequestSchema);
