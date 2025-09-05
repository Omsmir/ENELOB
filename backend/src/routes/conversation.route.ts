import ConversationController from '@/controllers/conversation.controller';
import { routes } from '@/interfaces/routes.interface';
import upload from '@/middlewares/multer';
import { validate } from '@/middlewares/validateResource';
import { createConversationSchema, getConversationSchema } from '@/schemas/conversation.schema';
import { json } from 'body-parser';
import { Request, Response, Router } from 'express';

class ConversationRoute implements routes {
    public path = '/conversations';
    public router = Router();
    constructor(private conversationController: ConversationController) {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.get(
            `${this.path}/:id`,
            validate(getConversationSchema),
            this.conversationController.getConversation
        );

        this.router.post(
            `${this.path}/:id`,
            upload.none(),
            validate(createConversationSchema),
            this.conversationController.createConversationHandler
        );
    }
}

export default ConversationRoute;
