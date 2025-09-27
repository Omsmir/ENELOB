import UserService from '@/services/auth.service';
import { BaseController } from './base.controller';
import HttpException from '@/exceptions/httpException';
import { Request, Response } from 'express';
import {
    createUserSchemaInterface,
    FriendsSchemaInterface,
    getUserSchemaInterface,
    HandleFriendsSchemaInterface,
    MultipleQueriesSchemaInterface,
    SendFriendRequestSchemaInterface,
    updateUserSchemaInterface,
} from '@/schemas/auth.schema';
import { CommandInvoker } from '@/classes/behavioral.class';
import { BufferEncoding, getImagesBuffer, grouping } from '@/utils/utils';
import { FRONTEND_URI, PROJECT_NAME } from '@/config/defaults';
import { EmailSubjects, SendEmail } from '@/utils/send.email';
import { reqFileProps } from '@/interfaces/global.interface';
import BullWorkers from '@/utils/workers';

class UserController extends BaseController {
    private userService: UserService;
    private invoker: CommandInvoker;
    private queue: BullWorkers;
    constructor() {
        super();
        this.userService = new UserService();
        this.invoker = new CommandInvoker(); // command behavoiral pattern invoker
        this.queue = new BullWorkers();
    }

    public createUserHandler = async (
        req: Request<{}, {}, createUserSchemaInterface['body']>,
        res: Response
    ) => {
        try {
            const existedUser = await this.userService.findUser({ email: req.body.email });

            if (existedUser) {
                throw new HttpException(
                    403,
                    `user with email:${existedUser.email} is already exist`
                );
            }

            const createdUser = await this.userService.createUser({
                ...req.body,
                birthDate: new Date(req.body.birthDate),
            });

            if (!createdUser) {
                throw new HttpException(400, 'error creaing user');
            }

            this.invoker.addCommand(
                new SendEmail({
                    to: createdUser.email,
                    toPerson: createdUser.full_name,
                    templateName: 'emailVerification.hbs',
                    link: `${FRONTEND_URI}/verify/`, // change it to real verification email link value
                    appName: PROJECT_NAME,
                    year: new Date().getFullYear(),
                    subject: EmailSubjects.EMAIL_VERIFICATION,
                })
            );

            this.invoker.run();
            res.status(201).json({ message: 'user created successfully', createdUser });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public UpdateProfilePicture = async (
        req: Request<updateUserSchemaInterface['params']>,
        res: Response
    ) => {
        try {
            const userId = res.locals.user._id as string;
            const id = req.params.id;
            const files = req.files as reqFileProps;
            const uploadQueue = this.queue.getQueue('upload');

            if (id !== userId) {
                throw new HttpException(401, 'unauthorized operation');
            }

            const existingUser = await this.userService.findUser({ _id: id });

            if (!existingUser) {
                throw new HttpException(404, 'user not found');
            }

            const { profileImg, coverImg } = getImagesBuffer({
                images: files,
                type: BufferEncoding.BASE64,
            });

            await uploadQueue.add('uploadToFirebase', {
                profileImg: profileImg ?? undefined,
                coverImg: coverImg ?? undefined,
                userId: existingUser._id as string,
            });

            res.status(200).json({
                message: 'you will be notified once the upload successfully complete',
            });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public getUser = async (
        req: Request<getUserSchemaInterface['params'], {}, {}, getUserSchemaInterface['query']>,
        res: Response
    ) => {
        try {
            const userId = res.locals.user._id as string;
            const id = req.params.id;
            const friendId = req.query?.friendId;
            if (id !== userId) {
                throw new HttpException(401, 'unauthorized operation');
            }

            const existingUser = await this.userService.findUser({ _id: id });

            if (!existingUser) {
                throw new HttpException(404, 'user not found');
            }

            if (friendId) {
                const friend = await this.userService.findUser({ _id: friendId });

                if (!friend) {
                    throw new HttpException(404, `friend doesn't exist`);
                }

                const updatedFriend = grouping({ user: friend, id });

                res.status(200).json({ user: updatedFriend });

                return;
            }

            res.status(200).json({ user: existingUser });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public multipleQueriesHandler = async (
        req: Request<
            MultipleQueriesSchemaInterface['params'],
            {},
            {},
            MultipleQueriesSchemaInterface['query']
        >,
        res: Response
    ) => {
        try {
            const userId = res.locals.user._id as string;
            const id = req.params.id;

            const query = req.query.query;
            const limit = req.query.limit;
            const cursor = req.query.cursor;

            if (id !== userId) {
                throw new HttpException(401, 'unauthorized operation');
            }

            const existingUser = await this.userService.findUser({ _id: id });

            if (!existingUser) {
                throw new HttpException(404, 'user not found');
            }

            const excludeIds = [id];
            if (query === 'friends') {
                const friends = existingUser.friends;

                const { users, nextCursor } = await this.userService.getUsersWithPagination(
                    {
                        _id: { $in: friends },
                    },
                    limit as string,
                    cursor
                );

                if (!users || users.length < 1) {
                    throw new HttpException(404, 'No friends');
                }
                res.status(200).json({ users, nextCursor });
                return;
            } else if (query === 'friendRequests') {
                const friendRequests = existingUser.friendRequests;

                const { users, nextCursor } = await this.userService.getUsersWithPagination(
                    {
                        _id: { $in: friendRequests, $nin: excludeIds },
                    },
                    limit as string,
                    cursor
                );

                if (!users || users.length < 1) {
                    throw new HttpException(404, 'No friend Requests');
                }
                res.status(200).json({ users, nextCursor });
                return;
            } else if (query === 'sendRequests') {
                const sendRequests = existingUser.sendRequests;

                const { users, nextCursor } = await this.userService.getUsersWithPagination(
                    {
                        _id: { $in: sendRequests },
                    },
                    limit as string,
                    cursor
                );

                if (!users || users.length < 1) {
                    throw new HttpException(404, 'No sent Requests');
                }
                res.status(200).json({ users, nextCursor });
                return;
            }
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public searchForFriendsHandler = async (
        req: Request<FriendsSchemaInterface['params'], {}, {}, FriendsSchemaInterface['query']>,
        res: Response
    ) => {
        try {
            const userId = res.locals.user._id as string;
            const id = req.params.id;

            if (id !== userId) {
                throw new HttpException(401, 'unauthorized operation');
            }
            const friendName = req.query.friendName;
            const gender = req.query.gender;
            const olderThan = req.query.olderThan ? new Date(req.query.olderThan) : undefined;

            const existingUser = await this.userService.findUser({ _id: id });

            const filters: { full_name: any; _id: {}; gender?: string; birthdate?: { $lt: Date } } =
                {
                    full_name: { $regex: `^${friendName}`, $options: 'i' },
                    _id: { $nin: [id] },
                };

            if (gender) {
                filters.gender = gender;
            }

            if (olderThan) {
                filters.birthdate = { $lt: olderThan }; // example if you want age filter
            }

            const users = await this.userService.getAllUsers(filters, 10);

            if (!existingUser) {
                throw new HttpException(404, 'user not found');
            }

            if (!users || users.length < 1) {
                res.status(404).json({ message: `no users with name ${friendName}` });
                return;
            }

            const filteredUsers = grouping({ users, id });
            res.status(200).json(filteredUsers);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public sendFriendRequestHandler = async (
        req: Request<
            SendFriendRequestSchemaInterface['params'],
            {},
            {},
            SendFriendRequestSchemaInterface['query']
        >,
        res: Response
    ) => {
        try {
            const userId = res.locals.user._id as string;
            const id = req.params.id;
            const friendRequest = req.query.friendId;

            if (id !== userId) {
                throw new HttpException(401, 'unauthorized operation');
            }
            const existingUser = await this.userService.findUser({ _id: id });
            const existingFriend = await this.userService.findUser({ _id: friendRequest });
            if (friendRequest === id) {
                throw new HttpException(403, 'error send friend request ');
            }
            if (!existingUser) {
                throw new HttpException(404, 'user not found');
            }
            if (!existingFriend) {
                throw new HttpException(404, `friend with name: ${friendRequest} is not found `);
            }

            const existingSentFriendRequests = existingFriend.friendRequests.filter(
                (request) => request === id
            );

            const currUserFriendRequests = existingUser.friendRequests.filter(
                (request) => request === friendRequest
            );

            const otherUserSentRequests = existingFriend.sendRequests.filter(
                (request) => request === id
            );

            const currUserSentRequests = existingUser.sendRequests.filter(
                (request) => request === friendRequest
            );

            const currFriends = existingUser.friends.filter((request) => request === friendRequest);

            if (currFriends && currFriends.length > 0) {
                const updatedListsOfFriends = await this.userService.updateUserSpecificList({
                    userKey: 'friends',
                    friendKey: 'friends',
                    equal: false,
                    addition: false,
                    currUserArray: existingUser,
                    friendArray: existingFriend,
                });

                if (!updatedListsOfFriends) {
                    throw new HttpException(400, 'An Error Occurred While Handling Friends Lists');
                }

                res.status(201).json({ message: 'friendship has been canceled' });
                return;
            }

            if (
                otherUserSentRequests &&
                otherUserSentRequests.length > 0 &&
                currUserFriendRequests &&
                currUserFriendRequests.length > 0
            ) {
                const updatedCurrUserFriendList = [...(existingUser.friends || []), friendRequest];
                const updatedOtherUserFriendList = [...(existingFriend.friends || []), id];

                const updateOfMultipleLists = await this.userService.updateUserSpecificList({
                    userKey: 'friendRequests',
                    friendKey: 'sendRequests',
                    userKeyTwo: 'friends',
                    friendKeyTwo: 'friends',
                    friendSecondArray: updatedOtherUserFriendList,
                    currUserSecondArray: updatedCurrUserFriendList,
                    equal: false,
                    addition: false,
                    currUserArray: existingUser,
                    friendArray: existingFriend,
                });

                if (!updateOfMultipleLists) {
                    throw new HttpException(
                        400,
                        'An Error Occurred While Accepting friend requests of both'
                    );
                }

                res.status(201).json({ message: 'Now you are friends' });
                return;
            }

            if (existingSentFriendRequests && existingSentFriendRequests.length > 0) {
                const updatedListsOfRequests = await this.userService.updateUserSpecificList({
                    userKey: 'sendRequests',
                    friendKey: 'friendRequests',
                    equal: false,
                    addition: false,
                    currUserArray: existingUser,
                    friendArray: existingFriend,
                });

                if (!updatedListsOfRequests) {
                    throw new HttpException(
                        400,
                        'An Error Occurred While Updating the SendRequests Of the User and FriendRequests Of The Friend'
                    );
                }

                res.status(201).json({ message: 'friend request has removed' });
                return;
            }
            const updatedFriendRequests = [...(existingFriend.friendRequests || []), id];

            const updatedCurrUserSentRequests = [
                ...(existingUser.sendRequests || []),
                friendRequest,
            ];

            console.log(updatedCurrUserSentRequests);

            await this.userService.updateUser(
                { _id: existingUser._id },
                { sendRequests: updatedCurrUserSentRequests },
                { new: true, runValidators: true }
            );
            const SentfriendRequest = await this.userService.updateUser(
                { _id: existingFriend._id },
                { friendRequests: updatedFriendRequests },
                { new: true, runValidators: true }
            );

            if (!SentfriendRequest) {
                throw new HttpException(400, 'error occurred  while sending friend request');
            }
            res.status(201).json({
                message: `you have send friend request to: ${SentfriendRequest.full_name}`,
            });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public handleFriendRequestsHandler = async (
        req: Request<
            HandleFriendsSchemaInterface['params'],
            {},
            {},
            HandleFriendsSchemaInterface['query']
        >,
        res: Response
    ) => {
        try {
            const userId = res.locals.user._id as string;
            const id = req.params.id;

            const friendId = req.query.friendId;
            const acception = req.query.acception;

            if (id !== userId) {
                throw new HttpException(401, 'unauthorized operation');
            }
            const existingUser = await this.userService.findUser({ _id: id });
            const existingFriend = await this.userService.findUser({ _id: friendId });

            if (!existingUser) {
                throw new HttpException(404, 'user not found');
            }
            if (!existingFriend) {
                throw new HttpException(404, `friend with id: ${friendId} is not found `);
            }
            const friendRequests = existingUser.friendRequests;
            const userSentRequests = existingFriend.sendRequests;

            const existedFriendRequest = existingUser.friendRequests.filter(
                (request) => request === friendId
            );

            if (!existedFriendRequest || existedFriendRequest.length < 1) {
                throw new HttpException(403, 'no requests to accept');
            }
            const friends = existingUser.friends;
            const updatedUserSentRequests = userSentRequests.filter((request) => request !== id);

            await this.userService.updateUser(
                { _id: friendId },
                { sendRequests: updatedUserSentRequests },
                { new: true, runValidators: true }
            );
            if (acception) {
                const userFriends = existingFriend.friends;

                const filteredRequests = friendRequests.filter((request) => request !== friendId);

                const updatedFriends = [...(friends || []), friendId];
                const updatedUserFriends = [...(userFriends || []), id];

                await this.userService.updateUser(
                    { _id: id },
                    { friends: updatedFriends, friendRequests: filteredRequests },
                    { new: true, runValidators: true }
                );
                await this.userService.updateUser(
                    { _id: friendId },
                    { friends: updatedUserFriends },
                    { new: true, runValidators: true }
                );
                res.status(201).json({ message: 'friend accepted' });
                return;
            }
            const filteredRequests = friendRequests.filter((request) => request !== friendId);

            await this.userService.updateUser(
                { _id: id },
                { friendRequests: filteredRequests },
                { new: true, runValidators: true }
            );
            res.status(201).json({ message: 'friend request removed' });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    public sendVerficationEmailToUnverifiedUsers = async (req: Request, res: Response) => {
        try {
            const unverifiedUsers = await this.userService.getAllUsers({ verified: false });

            if (!unverifiedUsers) {
                throw new HttpException(404, 'no unverified users found');
            }

            for (const user of unverifiedUsers) {
                this.invoker.addCommand(
                    // command behavoiral pattern
                    new SendEmail({
                        to: user.email,
                        toPerson: user.full_name,
                        templateName: 'emailVerificationAlert.hbs',
                        link: 'http://localhost:8090/api', // change it to real verification email link value
                        appName: PROJECT_NAME,
                        year: new Date().getFullYear(),
                        subject: EmailSubjects.EMAIL_VERIFICATION_ALERT,
                    })
                );
            }

            this.invoker.run();

            res.status(200).json({
                message: 'email verifications have been sent to unverified users',
            });
        } catch (error) {
            this.handleError(res, error);
        }
    };
}

export default UserController;
