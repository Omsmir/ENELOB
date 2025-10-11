import UserController from '@/controllers/auth.controller';
import DeserializeMiddleware from '@/middlewares/deserializeUser';
import upload from '@/middlewares/multer';
import { validate } from '@/middlewares/validateResource';
import {
    changeUserInfoSchema,
    createUserSchema,
    FriendsSchema,
    getUserSchema,
    handleFriendRequestsSchema,
    multipleQueriesSchema,
    SendFriendRequestSchema,
    updateUserSchema,
} from '@/schemas/auth.schema';
import BaseRoute from './base.route';

class UserRoute extends BaseRoute {
    constructor(
        private readonly userController: UserController,
        private readonly deserializerMiddlewares: DeserializeMiddleware
    ) {
        super('/users');
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.use(this.deserializerMiddlewares.checkStatus);
        this.router.post(
            `${this.path}`,
            upload.none(),
            validate(createUserSchema),
            this.userController.createUserHandler
        );

        this.router.put(
            `${this.path}/profile-picture/:id`,
            upload.fields([
                { name: 'profileImg', maxCount: 1 },
                { name: 'coverImg', maxCount: 1 },
            ]),
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
        this.router.put(
            `${this.path}/:id/change`,
            this.deserializerMiddlewares.requireLogin,
            upload.none(),
            validate(changeUserInfoSchema),
            this.userController.changeUserInfoHandler
        );
    }
}

export default UserRoute;
