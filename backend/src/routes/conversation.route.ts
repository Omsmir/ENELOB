import ConversationController from '@/controllers/conversation.controller';
import { routes } from '@/interfaces/routes.interface';
import DeserializeMiddleware from '@/middlewares/deserializeUser';
import upload from '@/middlewares/multer';
import { validate } from '@/middlewares/validateResource';
import { createConversationSchema, getConversationSchema } from '@/schemas/conversation.schema';
import { json } from 'body-parser';
import { Request, Response, Router } from 'express';

class ConversationRoute implements routes {
    public path = '/conversations';
    public router = Router();
    private deserializerMiddlewares = new DeserializeMiddleware();
    constructor(private conversationController: ConversationController) {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.use(this.deserializerMiddlewares.checkStatus);

        this.router.get(
            `${this.path}/:id`,
            this.deserializerMiddlewares.requireLogin,
            validate(getConversationSchema),
            this.conversationController.getConversation
        );

        this.router.post(
            `${this.path}/:id`,
            upload.none(),
            this.deserializerMiddlewares.requireLogin,
            validate(createConversationSchema),
            this.conversationController.createConversationHandler
        );
    }
}

export default ConversationRoute;
