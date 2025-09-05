import { genders } from '@/utils/constants';
import { z } from 'zod';
const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

const payload = {
    body: z
        .object({
            full_name: z.string({ required_error: 'name is required' }),
            email: z
                .string({ required_error: 'email is required' })
                .email({ message: 'not a vaild email' }),
            password: z.string({ required_error: 'password is required' }),
            passwordConfirm: z.string({ required_error: 'password confirm is required' }),
            gender: z.enum(genders as [string, ...string[]], {
                required_error: 'please select a gender',
            }),
            birthDate: z.string({ required_error: 'please select your birth date' }),
        })
        .refine((data) => data.password === data.passwordConfirm, {
            message: 'passwords must match',
            path: ['passwordConfirm'],
        }),
};

const deletePayload = {
    body: z.object({
        userId: z.string({ required_error: 'user is is required' }),
    }),
};

const updatePayload = {
    file: z.object({
        profileImg: z
            .custom<Express.Multer.File | undefined>(
                (file) => file !== undefined && file !== null,
                {
                    message: 'please select a profile picture',
                }
            )
            .refine(
                (file) => {
                    if (!file) return false;
                    const fileName = file.originalname.toLowerCase();
                    const extension = fileName.split('.').pop();
                    return validImageExtensions.includes(extension || '');
                },
                { message: 'Invalid image extension' }
            ),
    }),
};

const params = {
    params: z.object({
        id: z.string({ required_error: 'user id is required' }),
    }),
};
const friendRequestQuery = {
    query: z.object({
        friendId: z.string({ required_error: 'friendId is required' }),
    }),
};

const friendsPayload = {
    query: z.object({
        friendName: z.string({ required_error: 'friendName is required' }),
    }),
};

const handleFriendsPayload = {
    query: z.object({
        friendId: z.string({ required_error: 'friendId is required' }),
        acception: z.string().optional(),
    }),
};

const multipleQueriesPayload = {
    query: z.object({
        query: z.enum(['friends', 'friendRequests', 'sendRequests'], {
            required_error: 'query param is required',
        }),
        limit: z.string().optional(),
        cursor: z.string().optional(),
    }),
};

const getUsersPayload = {
    query: z.object({
        qeury: z.enum(['friends', 'friendRequests', 'sendRequests'], {
            required_error: 'query param is required',
        }),
    }),
    body: z.object({
        array: z.array(z.string(), { required_error: 'ArrayOfQuery is required' }),
    }),
};

export const createUserSchema = z.object({
    ...payload,
});

export const deleteUserSchema = z.object({
    ...params,
    ...deletePayload,
});

export const updateUserSchema = z.object({
    ...params,
    ...updatePayload,
});
export const SendFriendRequestSchema = z.object({
    ...params,
    ...friendRequestQuery,
});
export const FriendsSchema = z.object({
    ...params,
    ...friendsPayload,
});
export const handleFriendRequestsSchema = z.object({
    ...params,
    ...handleFriendsPayload,
});

export const multipleQueriesSchema = z.object({
    ...params,
    ...multipleQueriesPayload,
});

export const getUserSchema = z.object({
    ...params,
    ...getUsersPayload,
});

export type createUserSchemaInterface = z.infer<typeof createUserSchema>;
export type deleteUserSchemaInterface = z.infer<typeof deleteUserSchema>;
export type updateUserSchemaInterface = z.infer<typeof updateUserSchema>;
export type SendFriendRequestSchemaInterface = z.infer<typeof SendFriendRequestSchema>;
export type FriendsSchemaInterface = z.infer<typeof FriendsSchema>;
export type HandleFriendsSchemaInterface = z.infer<typeof handleFriendRequestsSchema>;
export type MultipleQueriesSchemaInterface = z.infer<typeof multipleQueriesSchema>;
export type getUsersSchemaInterface = z.infer<typeof getUserSchema>;
