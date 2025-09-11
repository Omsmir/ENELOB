import ConversationService from '@/services/conversation.service';
import { BaseController } from './base.controller';
import UserService from '@/services/auth.service';
import { Request, Response } from 'express';
import App from '@/app';
import { Server } from 'socket.io';
import {
    createConversationSchemaInterface,
    getConversationSchemaInterface,
    MarkAsSeenSchemaInterface,
} from '@/schemas/conversation.schema';
import HttpException from '@/exceptions/httpException';

class ConversationController extends BaseController {
    private conversationService: ConversationService;
    private userService: UserService;
    private onlineUsers: Map<string, string>;
    constructor() {
        super();
        this.conversationService = new ConversationService();
        this.userService = new UserService();
        this.onlineUsers = new Map<string, string>();
    }

    public getConversation = async (
        req: Request<
            getConversationSchemaInterface['params'],
            {},
            {},
            getConversationSchemaInterface['query']
        >,
        res: Response
    ) => {
        try {
            const userId = req.params.id;
            const recipientId = req.query.recipientId;
            const cursor = req.query.cursor as string;
            const limit = req.query.limit as string;

            const user = await this.userService.findUser({ _id: userId });

            const recipient = await this.userService.findUser({ _id: recipientId });

            if (!user || !recipient) {
                throw new HttpException(404, 'either the user or the recipient are not found');
            }

            const existedConversation = await this.conversationService.getConversation({
                peers: { $all: [recipientId, userId] },
            });

            if (!existedConversation) {
                throw new HttpException(
                    404,
                    `Send a message to start a new conversation with ${recipient.full_name}`
                );
            }
            const messages = existedConversation.messages;

            if (!messages || messages?.length < 1) {
                throw new HttpException(
                    404,
                    `Send a message to start a new conversation with ${recipient.full_name}`
                );
            }
            messages.sort(
                (a: any, b: any) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );

            const {
                messages: updatedMessages,
                nextCursor,
                prevCursor,
            } = await this.conversationService.getMessagesWithPagination(messages, limit, cursor);

            res.status(200).json({
                messages: updatedMessages,
                nextCursor,
                prevCursor,
                count: existedConversation.messages?.length,
            });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public createConversationHandler = async (
        req: Request<
            createConversationSchemaInterface['params'],
            {},
            createConversationSchemaInterface['body'],
            createConversationSchemaInterface['query']
        >,
        res: Response
    ) => {
        try {
            const userId = req.params.id;
            const recipientId = req.query.recipientId;
            const content = req.body.content;
            const io = App.initiator;

            const user = await this.userService.findUser({ _id: userId });

            const recipient = await this.userService.findUser({ _id: recipientId });

            if (!user || !recipient) {
                throw new HttpException(404, 'either the user or the recipient are not found');
            }

            const currUserFriends = user.friends.filter((friend) => friend === recipientId);

            if (!currUserFriends || currUserFriends.length < 1) {
                throw new HttpException(403, 'You Cannot send a message to non friends');
            }

            const existedConversation = await this.conversationService.getConversation({
                peers: { $all: [recipientId, userId] },
            });

            const message = {
                userId,
                content,
                sentAt: new Date(),
            };

            let conversation;
            if (!existedConversation) {
                conversation = await this.conversationService.createConversation({
                    peers: [userId, recipientId],
                    messages: [message],
                });

                if (!conversation) {
                    throw new HttpException(
                        500,
                        'Something went wrong initiating a new conversation.'
                    );
                }
            } else {
                const updatedMessages = [...(existedConversation.messages ?? []), message];
                conversation = await this.conversationService.updateConversation(
                    { peers: { $all: [recipientId, userId] } },
                    { messages: updatedMessages },
                    { runValidators: true, new: true }
                );
            }
            if (!conversation) {
                throw new HttpException(404, 'error finding the created conversation');
            }
            if (conversation.messages && conversation.messages.length > 0) {
                const lastMessage = conversation.messages[conversation.messages.length - 1];

                const userRecipientIds = [recipientId, userId];
                for (const id of userRecipientIds) {
                    io.to(id).emit('receivePrivateMessage', {
                        conversationId: conversation._id,
                        message: lastMessage,
                    });
                }

                res.status(200).json({
                    message: `You have sent '${content}' to:${recipient.full_name} `,
                    count: conversation.messages?.length,
                });
                return;
            }

            res.status(200).json({ count: conversation.messages?.length });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public markAsSeenHandler = async (
        req: Request<
            MarkAsSeenSchemaInterface['params'],
            {},
            {},
            MarkAsSeenSchemaInterface['query']
        >,
        res: Response
    ) => {
        try {
            const userId = req.params.id;
            const recipientId = req.query.recipientId;

            const user = await this.userService.findUser({ _id: userId });

            const recipient = await this.userService.findUser({ _id: recipientId });

            if (!user || !recipient) {
                throw new HttpException(404, 'either the user or the recipient are not found');
            }

            const existedConversation = await this.conversationService.getConversation({
                peers: { $all: [recipientId, userId] },
            });

            if (!existedConversation) {
                throw new HttpException(
                    404,
                    `there is no existing conversation with ${recipient.full_name}`
                );
            }
            const messages = existedConversation.messages?.filter(
                (message) => String(message.userId) === recipientId
            );

            if (!messages || messages?.length < 1) {
                throw new HttpException(
                    404,
                    `there is no existing conversation with ${recipient.full_name}`
                );
            }

            for (const msg of messages) {
                await this.conversationService.updateConversation(
                    { peers: { $all: [recipientId, userId] } },
                    { messages: {} }
                );
            }
        } catch (error) {
            this.handleError(res, error);
        }
    };
}

export default ConversationController;
