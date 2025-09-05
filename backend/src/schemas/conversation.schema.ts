import { z } from 'zod';

const createConversationPayload = {
    body: z.object({
        content: z
            .string({ message: 'message body is required' })
            .min(1, { message: 'message body is required' }),
    }),
};

const params = {
    params: z.object({
        id: z.string({ required_error: 'user id is required' }),
    }),
};

const querys = {
    query: z.object({
        recipientId: z.string({ message: 'recipent id is required' }),
    }),
};

const getConversationPayload = {
    query: z.object({
        recipientId: z.string({ message: 'select a chat to start a conversation' }),
        limit: z.string().optional(),
        cursor: z.string().optional(),
    }),
};

export const createConversationSchema = z.object({
    ...createConversationPayload,
    ...params,
    ...querys,
});

export const getConversationSchema = z.object({
    ...params,
    ...getConversationPayload,
});

export type createConversationSchemaInterface = z.infer<typeof createConversationSchema>;
export type getConversationSchemaInterface = z.infer<typeof getConversationSchema>;
