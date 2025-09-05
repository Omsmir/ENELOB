import { sessionInput } from '@/interfaces/models.interface';
import mongoose, { Document } from 'mongoose';

export interface sessionDocument extends sessionInput, Document {
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new mongoose.Schema<sessionDocument>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        valid: { type: Boolean, default: true },
    },

    { timestamps: true }
);

export const SessionModel = mongoose.model('sessions', sessionSchema);
