import { Schema, model, Document } from 'mongoose';

export interface ILocation extends Document {
  id: number;
  parentId?: number | null;
  type: 'division' | 'district' | 'thana' | 'area';
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    parentId: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      enum: ['division', 'district', 'thana', 'area'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Location = model<ILocation>('Location', locationSchema);
