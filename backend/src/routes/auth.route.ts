import UserController from '@/controllers/auth.controller';
import { routes } from '@/interfaces/routes.interface';
import DeserializeMiddleware from '@/middlewares/deserializeUser';
import upload from '@/middlewares/multer';
import { validate } from '@/middlewares/validateResource';
import {
    createUserSchema,
    deleteUserSchema,
    FriendsSchema,
    getUserSchema,
    handleFriendRequestsSchema,
    multipleQueriesSchema,
    SendFriendRequestSchema,
    updateUserSchema,
} from '@/schemas/auth.schema';
import { Router } from 'express';

// SOLID principles interpreted

// All the route Class is a single responsability
// interface segregation && liskov substitbution
class UserRoute implements routes {
    public path = '/users';
    public router = Router();
    private deserializerMiddlewares: DeserializeMiddleware;

    // dependency injection: composition over inheritance
    constructor(private userController: UserController) {
        this.deserializerMiddlewares = new DeserializeMiddleware();

        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.use(this.deserializerMiddlewares.checkStatus);
        this.router.post(
            `${this.path}`,
            upload.none(),
            validate(createUserSchema),
            this.userController.createUserHandler
        );

        this.router.put(
            `${this.path}/profile-picture/:id`,
            upload.single('profileImg'),
            this.deserializerMiddlewares.requireLogin,
            validate(updateUserSchema),
            this.userController.UpdateProfilePicture
        );
        this.router.post(
            `${this.path}/send/email`,
            this.deserializerMiddlewares.requireLogin,
            this.userController.sendVerficationEmailToUnverifiedUsers
        );

        this.router.post(
            `${this.path}/send-request/:id`,
            upload.none(),
            this.deserializerMiddlewares.requireLogin,
            validate(SendFriendRequestSchema),
            this.userController.sendFriendRequestHandler
        );

        this.router.get(
            `${this.path}/friends/:id`,
            this.deserializerMiddlewares.requireLogin,
            validate(FriendsSchema),
            this.userController.searchForFriendsHandler
        );
        this.router.put(
            `${this.path}/friends/:id`,
            this.deserializerMiddlewares.requireLogin,

            validate(handleFriendRequestsSchema),
            this.userController.handleFriendRequestsHandler
        );

        this.router.get(
            `${this.path}/queries/:id`,
            this.deserializerMiddlewares.requireLogin,
            validate(multipleQueriesSchema),
            this.userController.multipleQueriesHandler
        );

        this.router.get(
            `${this.path}/:id`,
            this.deserializerMiddlewares.requireLogin,
            validate(getUserSchema),
            this.userController.getUser
        );
    }
}

export default UserRoute;
