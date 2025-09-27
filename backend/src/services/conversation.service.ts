import { FilterQuery, FlattenMaps, QueryOptions, SchemaTypeOptions, UpdateQuery } from 'mongoose';
import { conversationDocument, ConversationModel } from '@/models/conversation.model';
import { omit } from 'lodash';
import { ConversationInput, Message, UserInput } from '@/interfaces/models.interface';
import HttpException from '@/exceptions/httpException';
import UserService from './auth.service';

// SOLID principles interpreted

// All the route Class is a single responsability
class ConversationService {
    // dependency injection: composition over inheritance
    private userService: UserService;
    constructor(private conversationModel = ConversationModel) {
        this.userService = new UserService();
    }

    public createConversation = async (input: ConversationInput) => {
        return await this.conversationModel.create(input);
    };

    public updateConversation = async (
        query: FilterQuery<conversationDocument>,
        update: UpdateQuery<conversationDocument>,
        options?: QueryOptions
    ) => {
        return await this.conversationModel.findOneAndUpdate(query, update, options);
    };

    public getConversation = async (query: FilterQuery<conversationDocument>) => {
        return await this.conversationModel.findOne(query).lean();
    };

    public getAllConversation = async (query: FilterQuery<conversationDocument>) => {
        return await this.conversationModel.find(query).lean();
    };
    public getMessagesWithPagination = async (
        messagesExisted: FlattenMaps<Message>[],
        limit: string,
        cursor?: string,
        direction: 'next' | 'prev' = 'prev'
    ): Promise<{
        nextCursor: string | null;
        prevCursor: string | null;
        messages: FlattenMaps<Message>[];
    }> => {
        let nextCursor = null;
        let prevCursor = null;

        let messages = messagesExisted;
        if (cursor) {
            const cursorIndex = messagesExisted?.findIndex((msg) => String(msg._id) === cursor);
            if (cursorIndex === -1) {
                throw new HttpException(400, 'Invalid cursor');
            }

            if (direction === 'next') {
                messages = messagesExisted = messagesExisted.slice(
                    cursorIndex + 1,
                    cursorIndex + (Number(limit) || 5) + 1
                );
            } else {
                const start = Math.max(0, cursorIndex - Number(limit));

                messages = messagesExisted.slice(start, cursorIndex);
            }
        } else {
            // If no cursor: start from the end (latest messages)
            messages = messages.slice(-Number(limit) || -5);
        }

        prevCursor = messages.length <= 1 ? null : String(messages[0]._id);
        nextCursor =
            direction === 'prev'
                ? null
                : messages.length < 1
                  ? null
                  : String(messages[messages.length - 1]._id);

        return { messages, nextCursor, prevCursor };
    };

    public deleteConversation = async (query: FilterQuery<conversationDocument>) => {
        return await this.conversationModel.findOneAndDelete(query);
    };

    public validateConversation = async (
        recipientId: string,
        userId: string,
        localId: string,
        deleteError: 200 | 404
    ) => {
        if (userId !== localId) {
            throw new HttpException(401, 'unauthorized operation');
        }
        if (userId === recipientId) {
            throw new HttpException(403, 'Dublicate peer error');
        }
        const user = await this.userService.findUser({ _id: userId });

        const recipient = await this.userService.findUser({ _id: recipientId });

        if (!user || !recipient) {
            throw new HttpException(404, 'either the user or the recipient are not found');
        }

        const existedConversation = await this.getConversation({
            peers: { $all: [recipientId, userId] },
            userId,
        });

        if (!existedConversation) {
            throw new HttpException(
                deleteError,
                `there is no active conversation between you and ${recipient.full_name}`
            );
        }
        return { recipient, user, existedConversation };
    };
}

export default ConversationService;
