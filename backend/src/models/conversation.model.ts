import { ConversationInput, ImgMainType, Message } from '@/interfaces/models.interface';
import mongoose, { Document } from 'mongoose';

export interface conversationDocument extends ConversationInput, Document {
    createdAt: Date;
    updatedAt: Date;
}

// Image schema
const ImageSchema = new mongoose.Schema<ImgMainType>(
    {
        filename: { type: String, required: true },
        url: { type: String, required: true },
        path: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

// Message schema
const MessageSchema = new mongoose.Schema<Message>(
    {
        content: { type: String,default:""},
        seen: { type: Boolean, default: false },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        sentAt: { type: Date, default: Date.now() },
        images: { type: [ImageSchema], default: [] },
    },
    { _id: true, timestamps: false } // each message gets its own _id
);

const ConversationSchema = new mongoose.Schema<conversationDocument>(
    {
        peers: [{ type:String, ref: 'User', required: true }], // one-to-one chat (2 participants)
        messages: { type: [MessageSchema], default: [] },
    },
    { timestamps: true }
);

export const ConversationModel = mongoose.model<conversationDocument>('Conversations', ConversationSchema);
