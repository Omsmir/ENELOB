import ConversationService from '@/services/conversation.service';
import { BaseController } from './base.controller';
import UserService from '@/services/auth.service';
import { Request, Response } from 'express';
import App from '@/app';
import {
    createConversationSchemaInterface,
    deleteConversationSchemaInterface,
    getConversationSchemaInterface,
    MarkAsSeenSchemaInterface,
} from '@/schemas/conversation.schema';
import HttpException from '@/exceptions/httpException';
import { conversationDocument, ConversationModel } from '@/models/conversation.model';
import { UserDocument } from '@/models/auth.model';
import { Server } from 'socket.io';
import { Message } from '@/interfaces/models.interface';

class ConversationController extends BaseController {
    private conversationService: ConversationService;
    private userService: UserService;
    constructor() {
        super();
        this.conversationService = new ConversationService();
        this.userService = new UserService();
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
            const localUser = res.locals.user as UserDocument;
            const userId = localUser._id as string;

            const recipientId = req.query.recipientId;

            const cursor = req.query.cursor as string;
            const limit = req.query.limit as string;

            const { recipient, existedConversation } =
                await this.conversationService.validateConversation(
                    recipientId,
                    userId,
                    String(localUser._id),
                    404
                );
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
            const localUser = res.locals.user as UserDocument;
            const userId = req.params.id;
            const recipientId = req.query.recipientId;
            const content = req.body.content;

            const io = App.initiator;

            const peers = [userId, recipientId];

            if (userId !== String(localUser._id)) {
                throw new HttpException(401, 'unauthorized operation');
            }

            const user = await this.userService.findUser({ _id: userId });

            const recipient = await this.userService.findUser({ _id: recipientId });

            if (!user || !recipient) {
                throw new HttpException(404, 'either the user or the recipient are not found');
            }

            const currUserFriends = user.friends.filter((friend) => friend === recipientId);

            if (!currUserFriends || currUserFriends.length < 1) {
                throw new HttpException(403, 'You Cannot send a message to non friends');
            }

            const message = {
                userId,
                content,
                sentAt: new Date(),
            };

            // Checking if there is any existing copies of the conversation including the two peers
            const existedConversation = await this.conversationService.getConversation({
                peers: { $all: peers },
            });

            // if there are no existing converstions
            if (!existedConversation) {
                peers.forEach(async (peer) => {
                    const conversation = await this.conversationService.createConversation({
                        peers,
                        messages: [message],
                        userId: peer,
                    });

                    if (!conversation) {
                        throw new HttpException(
                            500,
                            'Something went wrong initiating a new conversation.'
                        );
                    }

                    if (conversation.messages && conversation.messages.length > 0) {
                        const lastMessage = conversation.messages[conversation.messages.length - 1];

                        io.to(peer).emit('receivePrivateMessage', {
                            recipientId,
                            message: lastMessage,
                        });
                    }
                });

                res.status(200).json({ count: 1 });
                return;
            }

            for (const userId of peers) {
                // getting each peer individual conversation
                let singleExistedConversation = await this.conversationService.getConversation({
                    peers: { $all: peers },
                    userId,
                });

                let updatedMessages: Message[] | null = null;
                // checking if there's an existing conversation maybe one or two
                // if the sender has an existing conversation it will use this condition
                // if both peers have conversations this condition also will be used
                if (singleExistedConversation && singleExistedConversation.messages) {
                    for (const user of peers) {
                        const conversation = await this.conversationService.getConversation({
                            peers: { $all: peers },
                            userId: user,
                        });
                        // if the recipient doesn't have a conversation
                        if (!conversation || !conversation.messages) {
                            await this.conversationService.createConversation({
                                peers,
                                userId: user,
                                messages: [message],
                            });
                        } else {
                            // normal updating of the sender conversation  # which is the current logged in user
                            updatedMessages = [...conversation.messages, message];

                            await this.conversationService.updateConversation(
                                { peers: { $all: peers }, userId: user },
                                { messages: updatedMessages },
                                { runValidators: true, new: true }
                            );
                        }
                        io.to(user).emit('receivePrivateMessage', {
                            recipientId,
                            message,
                        });
                    }

                    res.status(200).json({
                        message: `You have sent '${content}' to:${recipient.full_name} `,
                        count: updatedMessages?.length,
                    });
                    return;
                } else {
                    // if the sender has no existing conversation
                    // creating a new conversation for the sender if there is no existing conversation for him # which is the current logged in user
                    const newConversation = await this.conversationService.createConversation({
                        peers,
                        userId,
                        messages: [message],
                    });

                    const otherExistedConversation = await this.conversationService.getConversation(
                        {
                            peers: { $all: peers },
                            userId: { $nin: [String(newConversation.userId)] },
                        }
                    );
                    // For the other peer, append the new message normally
                    if (otherExistedConversation && otherExistedConversation.messages) {
                        await this.conversationService.updateConversation(
                            { peers: { $all: peers }, userId: otherExistedConversation.userId },
                            { messages: [...otherExistedConversation.messages, message] },
                            { runValidators: true, new: true }
                        );
                    }

                    peers.forEach((id) => {
                        io.to(id).emit('receivePrivateMessage', {
                            recipientId,
                            message,
                        });
                    });

                    res.status(200).json({
                        count: 1,
                        message: `You have sent '${content}' to:${recipient.full_name} `,
                    });
                    return;
                }
            }
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
            const localUser = res.locals.user as UserDocument;
            const userId = localUser._id as string;
            const recipientId = req.query.recipientId;
            const io = App.initiator;

            const peers = [userId, recipientId];
            const { recipient } = await this.conversationService.validateConversation(
                recipientId,
                userId,
                String(localUser._id),
                200
            );
            for (const peer of peers) {
                const existedConversation = await this.conversationService.getConversation({
                    peers: { $all: [userId, recipientId] },
                    userId: peer,
                });

                if (!existedConversation || !existedConversation.messages) continue;
                const messages = existedConversation.messages?.map((msg) =>
                    String(msg.userId) === recipientId ? { ...msg, seen: true } : msg
                );

                if (!messages || messages?.length < 1) {
                    res.status(200).json({
                        message: `there is no existing conversation with ${recipient.full_name}`,
                    });
                    return;
                }

                await this.conversationService.updateConversation(
                    { peers: { $all: peers }, userId: peer },
                    { messages },
                    { runValidators: true, new: true }
                );
            }

            io.to(`${recipientId}`).emit('markAsSeen', { recipientId });

            res.status(201).json({ message: 'messages has been marked as seen ' });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public deleteConversation = async (
        req: Request<
            deleteConversationSchemaInterface['params'],
            {},
            {},
            deleteConversationSchemaInterface['query']
        >,
        res: Response
    ) => {
        try {
            const localUser = res.locals.user as UserDocument;

            const userId = req.params.id;

            const recipientId = req.query.recipientId;

            await this.conversationService.validateConversation(
                recipientId,
                userId,
                String(localUser._id),
                404
            );

            await this.conversationService.deleteConversation({
                peers: { $all: [recipientId, userId], $size: 2 },
                userId,
            });

            res.status(201).json({ message: 'conversation deleted' });
        } catch (error) {
            this.handleError(res, error);
        }
    };
}

export default ConversationController;
