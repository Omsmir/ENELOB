import SessionController from '@/controllers/session.controller';
import { routes } from '@/interfaces/routes.interface';
import upload from '@/middlewares/multer';
import { validate } from '@/middlewares/validateResource';
import {
    checkActiveSessionSchema,
    generalParamSchema,
    loginSchema,
    SessionReissueSchema,
} from '@/schemas/session.schema';
import { Router } from 'express';

// SOLID principles interpreted

// All the route Class is a single responsability
// interface segregation && liskov substitbution
class SessionRoute implements routes {
    public path = '/auth';
    public router = Router();
    // dependency injection: composition over inheritance
    constructor(private sessionController: SessionController) {
        this.initializeRoute();
    }

    private initializeRoute() {
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
        this.router.put(
            `${this.path}/session`,
            validate(checkActiveSessionSchema),
            this.sessionController.checkActiveSession
        );

        this.router.get(
            `${this.path}/reIssue/:id`,
            validate(SessionReissueSchema),
            this.sessionController.reIssueAccessTokenHandler
        );
    }
}

export default SessionRoute;
