import ConversationController from '@/controllers/conversation.controller';
import DeserializeMiddleware from '@/middlewares/deserializeUser';
import upload from '@/middlewares/multer';
import { validate } from '@/middlewares/validateResource';
import {
    createConversationSchema,
    deleteConversationSchema,
    getConversationSchema,
    MarkAsSeenSchema,
} from '@/schemas/conversation.schema';
import BaseRoute from './base.route';

class ConversationRoute extends BaseRoute {
    constructor(
        private readonly conversationController: ConversationController,
        private readonly deserializerMiddlewares: DeserializeMiddleware
    ) {
        super('/conversations');
        this.initializeRoutes();
    }

    public initializeRoutes() {
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

        this.router.put(
            `${this.path}/update/:id`,
            this.deserializerMiddlewares.requireLogin,
            validate(MarkAsSeenSchema),
            this.conversationController.markAsSeenHandler
        );
        this.router.delete(
            `${this.path}/:id`,
            this.deserializerMiddlewares.requireLogin,
            validate(deleteConversationSchema),
            this.conversationController.deleteConversation
        );
    }
}

export default ConversationRoute;
