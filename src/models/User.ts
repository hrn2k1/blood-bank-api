import { Schema, model, Document } from 'mongoose';

export interface IUserProps {
  address?: string;
  photo?: string;
  birthDate?: string;
  gender?: string;
  bloodGroup?: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
  [key: string]: any;
}

export interface IUser extends Document {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  password: string;
  type: 'user' | 'bank';
  divisionId: number;
  districtId: number;
  thanaId?: number | null;
  areaId: number;
  registrationDate: Date;
  props: IUserProps;
  createdAt: Date;
  updatedAt: Date;
}

const userPropsSchema = new Schema({
  address: String,
  photo: String,
  birthDate: String,
  gender: String,
  bloodGroup: String,
  geolocation: {
    latitude: Number,
    longitude: Number,
  },
}, { strict: false });

const userSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['user', 'bank'],
      required: true,
    },
    divisionId: {
      type: Number,
      required: true,
    },
    districtId: {
      type: Number,
      required: true,
    },
    thanaId: {
      type: Number,
      default: null,
    },
    areaId: {
      type: Number,
      required: true,
    },
    registrationDate: {
      type: Date,
      required: true,
    },
    props: {
      type: userPropsSchema,
      default: {},
    },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
