import UserController from '@/controllers/auth.controller';
import { routes } from '@/interfaces/routes.interface';
import upload from '@/middlewares/multer';
import { validate } from '@/middlewares/validateResource';
import {
    createUserSchema,
    deleteUserSchema,
    FriendsSchema,
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
    // dependency injection: composition over inheritance
    constructor(private userController: UserController) {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.post(
            `${this.path}`,
            upload.none(),
            validate(createUserSchema),
            this.userController.createUserHandler
        );

        this.router.put(
            `${this.path}/profile-picture/:id`,
            upload.single("profileImg"),
            validate(updateUserSchema),
            this.userController.UpdateProfilePicture
        );
        this.router.post(
            `${this.path}/send/email`,
            this.userController.sendVerficationEmailToUnverifiedUsers
        );

        this.router.post(
            `${this.path}/send-request/:id`,
            upload.none(),
            validate(SendFriendRequestSchema),
            this.userController.sendFriendRequestHandler
        );

        this.router.get(
            `${this.path}/friends/:id`,
            validate(FriendsSchema),
            this.userController.searchForFriendsHandler
        );
        this.router.put(
            `${this.path}/friends/:id`,
            validate(handleFriendRequestsSchema),
            this.userController.handleFriendRequestsHandler
        );

        this.router.get(
            `${this.path}/queries/:id`,
            validate(multipleQueriesSchema),
            this.userController.multipleQueriesHandler
        );
    }
}

export default UserRoute;
