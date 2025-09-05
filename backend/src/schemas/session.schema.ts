import { z } from 'zod';

const payload = {
    body: z.object({
        email: z
            .string({ required_error: 'please write down your email' })
            .email({ message: 'not a vaild email' }),
        password: z.string({ required_error: 'please write down your password' }),
    }),
};

const params = {
    params: z.object({
        id: z.string({ required_error: 'user id is required' }),
    }),
};
const querys = {
    query: z.object({
        friendId: z.string({ message: 'friend id is required' }),
    }),
};
export const loginSchema = z.object({
    ...payload,
});

export const generalParamSchema = z.object({
    ...params,
});
export const SessionReissueSchema = z.object({
    ...params,
});

export const checkActiveSessionSchema = z.object({
    ...querys
})

export type LoginSchemaInterface = z.infer<typeof loginSchema>;
export type SessionReissueSchemaInterface = z.infer<typeof SessionReissueSchema>;
export type generalParamSchemaInterface = z.infer<typeof generalParamSchema>;

export type checkActiveSessionSchemaInterface = z.infer<typeof checkActiveSessionSchema>;
