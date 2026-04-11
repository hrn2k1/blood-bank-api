import { Schema, model, Document } from 'mongoose';
import { randomUUID } from 'crypto';

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
    name: string;
    contactNumber: string;
    email: string;
    password: string;
    type: 'user' | 'bank';
    divisionId?: number;
    districtId?: number;
    thanaId?: number | null;
    areaId?: number;
    registrationDate: Date;
    props: IUserProps;
    createdAt: Date;
    updatedAt?: Date;
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
}, { strict: false, _id: false });

const userSchema = new Schema<IUser>(
    {
        _id: {
            type: String,
            default: () => randomUUID(),
        },
        name: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
            unique: true,
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
            required: false,
        },
        districtId: {
            type: Number,
            required: false,
        },
        thanaId: {
            type: Number,
            default: null,
        },
        areaId: {
            type: Number,
            required: false,
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

export const User = model<IUser>('User', userSchema);
