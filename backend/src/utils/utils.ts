import { reqFileProps, SafeUser } from '@/interfaces/global.interface';
import { UserDocument } from '@/models/auth.model';

export type currArrayType = {
    currArray: string[];
    value: string;
    equal: boolean;
    addition: boolean;
};

export const filterStringsArray = ({ currArray, value, equal, addition }: currArrayType) => {
    let filteredArray: string[] = [];

    if (!currArray) return;
    if (equal && !addition) {
        const filteredValues = currArray.filter((element) => element === value.toString());
        filteredArray.push(...filteredValues);
    } else if (equal && addition) {
        const filteredValues = currArray.filter((element) => element === value.toString());
        filteredArray.push(...filteredValues, value);
    } else if (!equal && !addition) {
        const filteredValues = currArray.filter((element) => element !== value.toString());
        filteredArray.push(...filteredValues);
    } else if (!equal && addition) {
        const filteredValues = currArray.filter((element) => element !== value.toString());
        filteredArray.push(...filteredValues, value);
    }
    return filteredArray;
};

type GroupingProps = {
    id: string;
    users?: SafeUser[];
    user?: SafeUser;
};

type group = {
    userId: string | null;
    sendRequestId: string | null;
    friendRequest: string | null;
    user: SafeUser;
};
export const grouping = ({ id, users, user }: GroupingProps) => {
    let group: group[] = [];
    let singleGroup: group = {
        userId: null,
        sendRequestId: null,
        friendRequest: null,
        user: {} as SafeUser,
    };
    let current = null;

    const assignRequests = (user: SafeUser, id: string, current: any, type: 'users' | 'user') => {
        switch (type) {
            case 'users':
                if (user.friendRequests.includes(id)) {
                    current = { userId: null, friendRequest: null, sendRequestId: id, user };
                    group.push(current);
                } else if (user.friends.includes(id)) {
                    current = { userId: id, sendRequestId: null, friendRequest: null, user };
                    group.push(current);
                } else if (user.sendRequests.includes(id)) {
                    current = { userId: null, sendRequestId: null, friendRequest: id, user };
                    group.push(current);
                } else {
                    current = { userId: null, sendRequestId: null, friendRequest: null, user };
                    group.push(current);
                }
                break;
            case 'user':
                if (user.friendRequests.includes(id)) {
                    singleGroup = { userId: null, sendRequestId: id, friendRequest: null, user };
                } else if (user.friends.includes(id)) {
                    singleGroup = { userId: id, sendRequestId: null, friendRequest: null, user };
                } else if (user.sendRequests.includes(id)) {
                    singleGroup = { userId: null, sendRequestId: null, friendRequest: id, user };
                } else {
                    singleGroup = { userId: null, sendRequestId: null, friendRequest: null, user };
                }
                break;
            default:
                throw new Error('specifiy type please');
        }
    };
    if (users) {
        for (const user of users) {
            assignRequests(user, id, current, 'users');
        }
        return group;
    } else if (user) {
        assignRequests(user, id, current, 'user');
        return singleGroup;
    }
};

export enum BufferEncoding {
    BASE64 = 'base64',
    BUFFER = 'buffer',
}

type ImagesBufferProps = {
    images?: reqFileProps;
    files?: {
        profileImg?: { buffer: any; originalname: string; mimetype: string };
        coverImg?: { buffer: any; originalname: string; mimetype: string };
    };
    type: BufferEncoding;
};

export const getImagesBuffer = ({ images, type, files }: ImagesBufferProps) => {
    let imagesBuffer: Record<string, { buffer: any; originalname: string; mimetype: string }> = {};

    switch (type) {
        case BufferEncoding.BASE64:
            if (images) {
                Object.entries(images).forEach(([key, value]) => {
                    if (value && value.length > 0) {
                        imagesBuffer[key] = {
                            buffer: value[0].buffer.toString('base64') as string,
                            originalname: value[0].originalname,
                            mimetype: value[0].mimetype,
                        };
                    }
                });
            }
            break;
        case BufferEncoding.BUFFER:
            if (files) {
                Object.entries(files).forEach(([key, value]) => {
                    imagesBuffer[key] = {
                        buffer: Buffer.from(value.buffer as string, 'base64'),
                        originalname: value.originalname,
                        mimetype: value.mimetype,
                    };
                });
            }
            break;
        default:
            throw new Error('Invalid buffer encoding type');
    }

    return imagesBuffer;
};
