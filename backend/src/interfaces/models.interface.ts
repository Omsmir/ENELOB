import { UserDocument } from '@/models/auth.model';
import mongoose from 'mongoose';

export type ImgMainType = {
    filename: string;
    url: string;
    path: string;
    uploadedAt?: Date;
};

export interface userToCreate {
    full_name: string;
    email: string;
    password: string;
    gender: string;
    birthDate: Date;
}

export interface UserInput {
    full_name: string;
    verified?: boolean;
    email: string;
    password: string;
    gender: string;
    birthDate: Date;
    profileImg?: ImgMainType;
    lastSeenAt?: Date;
    friendRequests: string[];
    friends: string[];
    sendRequests: string[];
}

export interface sessionInput {
    user: UserDocument['_id'];
    valid?: boolean;
}

export type Message = {
    _id?:mongoose.Schema.Types.ObjectId
    content?: string;
    seen?: boolean;
    userId: UserDocument['_id'];
    sentAt?: Date;
    images?: ImgMainType[];
};
export interface ConversationInput {
    peers: string[];
    messages?: Message[];
}
