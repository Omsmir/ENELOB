import SessionController from '@/controllers/session.controller';
import DeserializeMiddleware from '@/middlewares/deserializeUser';
import upload from '@/middlewares/multer';
import { validate } from '@/middlewares/validateResource';
import {
    checkActiveSessionSchema,
    generalParamSchema,
    loginSchema,
    SessionReissueSchema,
} from '@/schemas/session.schema';
import BaseRoute from './base.route';

class SessionRoute extends BaseRoute {
    constructor(
        private readonly sessionController: SessionController,
        private readonly deserializerMiddlewares: DeserializeMiddleware
    ) {
        super('/auth');
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(
            `${this.path}/login`,
            upload.none(),
            validate(loginSchema),
            this.sessionController.loginHandler
        );
        this.router.post(
            `${this.path}/logout/:id`,
            validate(generalParamSchema),
            this.sessionController.logoutHandler
        );
        this.router.use(this.deserializerMiddlewares.checkStatus);
        this.router.put(
            `${this.path}/session`,
            this.deserializerMiddlewares.requireLogin,
            validate(checkActiveSessionSchema),
            this.sessionController.checkActiveSession
        );

        this.router.put(
            `${this.path}/reIssue/:id`,
            this.deserializerMiddlewares.requireLogin,
            validate(SessionReissueSchema),
            this.sessionController.reIssueAccessTokenHandler
        );
    }
}

export default SessionRoute;
