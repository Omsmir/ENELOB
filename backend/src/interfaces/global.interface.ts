import { UserDocument } from '@/models/auth.model';

export interface sendEmailProps {
    to: string;
    link?: string;
    templateName: string;
    appName?: string;
    otp?: string;
    year?: string | number | Date;
    date?: string | number | Date;
    subject: string;
    toPerson:string
}

type key = 'friends' | 'sendRequests' | 'friendRequests';

export type MultipleFilteringService = {
    currUserArray: UserDocument;
    friendArray: UserDocument;
    currUserSecondArray?: string[];
    friendSecondArray?: string[];
    userKey: key;
    userKeyTwo?: key;
    friendKey: key;
    friendKeyTwo?: key;
    equal: boolean;
    addition: boolean;
};
