import { UserDocument } from '@/models/auth.model';
import { Omit } from 'lodash';

export interface sendEmailProps {
    to: string;
    link?: string;
    templateName: string;
    appName?: string;
    otp?: string;
    year?: string | number | Date;
    date?: string | number | Date;
    subject: string;
    toPerson: string;
}

type key = 'friends' | 'sendRequests' | 'friendRequests';

export type SafeUser = Omit<UserDocument, 'password'>;


export type MultipleFilteringService = {
    currUserArray: SafeUser;
    friendArray: SafeUser;
    currUserSecondArray?: string[];
    friendSecondArray?: string[];
    userKey: key;
    userKeyTwo?: key;
    friendKey: key;
    friendKeyTwo?: key;
    equal: boolean;
    addition: boolean;
};

export type reqFileProps = {
    profileImg?: Express.Multer.File[];
    coverImg?: Express.Multer.File[];
};
