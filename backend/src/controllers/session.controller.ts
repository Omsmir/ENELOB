import SessionService from '@/services/session.service';
import { BaseController } from './base.controller';
import HttpException from '@/exceptions/httpException';
import { Request, Response } from 'express';
import UserService from '@/services/auth.service';
import {
    checkActiveSessionSchemaInterface,
    generalParamSchemaInterface,
    LoginSchemaInterface,
    SessionReissueSchemaInterface,
} from '@/schemas/session.schema';
import { signJwt } from '@/utils/jwt.sign';
import { ACCESSTOKENTTL, REFRESHTOKENTTL } from '@/config/defaults';
import {  RedisServices } from '@/utils/redis';
import { io } from '@/server';

class SessionController extends BaseController {
    constructor(
        private readonly sessionService: SessionService,
        private readonly userService: UserService,
        private readonly redisService:RedisServices
    ) {
        super();
    }
    public loginHandler = async (
        req: Request<{}, {}, LoginSchemaInterface['body']>,
        res: Response
    ) => {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const user = await this.userService.validatePassword({ email, password });

            if (!user) {
                throw new HttpException(400, 'invalid email or password');
            }
            const HashName = `userOnline-${user._id as string}`;
            const sessionObj = {
                user: user._id,
            };

            const session = await this.sessionService.createSession(sessionObj);

            const accessToken = await signJwt(
                {
                    ...sessionObj,
                    _id: user._id,
                    verified: user.verified,
                    email: user.email,
                    full_name: user.full_name,
                    profileImg: user.profileImg,
                    coverImg: user.coverImg,
                    friends: user.friends,
                    session,
                },
                'accessTokenPrivateKey',
                'RS256',
                {
                    expiresIn: parseInt(ACCESSTOKENTTL as string),
                }
            );

            const refreshToken = await signJwt(
                {
                    ...sessionObj,
                    email: user.email,
                    _id: user._id,
                    verified: user.verified,
                    full_name: user.full_name,
                    profileImg: user.profileImg,
                    friends: user.friends,
                    session,
                },
                'refreshTokenPrivateKey',
                'RS256',
                {
                    expiresIn: parseInt(REFRESHTOKENTTL as string),
                }
            );

            res.cookie('refreshToken', refreshToken, {
                sameSite: 'strict',
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.cookie('accessToken', accessToken, {
                sameSite: 'strict',
                httpOnly: true,
                secure: true,
                maxAge: 900 * 1000,
            });

            await this.userService.updateUser(
                { _id: user._id },
                { lastSeenAt: new Date() },
                { runValidators: true, new: true }
            );

            await this.redisService.createHash({
                HashName,
                content: { lastSeen: user.lastSeenAt?.toLocaleString() },
                expire: 300,
            });

            const friends = user.friends;

            if (friends && friends.length > 0) {
                for (const friend of friends) {
                    io.to(`${friend}`).emit('userOnline', { id: user._id });
                }
            }

            res.status(200).json({
                message: 'logged in successfully',
                accessToken,
            });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public logoutHandler = async (
        req: Request<generalParamSchemaInterface['params']>,
        res: Response
    ) => {
        try {
            const id = req.params.id;
            const userId = res.locals.user._id as string;

            if (id !== userId) {
                throw new HttpException(401, 'unauthorized operation');
            }

            const user = await this.userService.findUser({ _id: id });

            if (!user) {
                throw new HttpException(403, 'there is no active session');
            }
            const session = await this.sessionService.getSession({ user: id, valid: true });

            if (!session) {
                throw new HttpException(400, 'there is no active session');
            }

            const friends = user.friends;

            if (friends && friends.length > 0) {
                for (const friend of friends) {
                    io.to(`${friend}`).emit('userOffline', { id: user._id });
                }
            }

            const HashName = `user:${user._id}`;

            await this.redisService.DelHash(`${HashName}:online-status`, 'status');

            await this.sessionService.updateSession(
                { user: id, valid: true },
                { valid: false },
                { runValidators: true, new: true }
            );

            await this.userService.updateUser(
                { _id: id },
                { lastSeenAt: new Date() },
                { runValidators: true, new: true }
            );

            res.clearCookie('refreshToken');

            res.clearCookie('accessToken');

            res.status(200).json({ message: 'logged out' });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public checkActiveSession = async (
        req: Request<{}, {}, {}, checkActiveSessionSchemaInterface['query']>,
        res: Response
    ) => {
        try {
            const id = req.query.friendId;

            const user = await this.userService.findUser({ _id: id });

            if (!user) {
                throw new HttpException(404, 'Error getting user session');
            }
            const activeSession = await this.sessionService.getSession({ user: id, valid: true });

            const friends = user.friends;

            const emitEvent = (eventName: 'userOnline' | 'userOffline') => {
                if (friends && friends.length > 0) {
                    for (const friend of friends) {
                        io.to(`${friend}`).emit(eventName, { id: user._id });
                    }
                }
            };

            if (!activeSession) {
                emitEvent('userOffline');
                res.status(200).json({
                    message: `user with id:${id} has no active sessions right now !!`,
                });
                return;
            }

            res.status(200).json({ message: 'session got reactivated' });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public reIssueAccessTokenHandler = async (
        req: Request<SessionReissueSchemaInterface['params']>,
        res: Response
    ) => {
        try {
            const id = req.params.id;
            const userId = res.locals.user._id as string;

            if (id !== userId) {
                throw new HttpException(401, 'unauthorized operation');
            }

            const user = await this.userService.findUser({ _id: id });

            if (!user) {
                throw new HttpException(403, 'there is no active session');
            }

            const activeSession = await this.sessionService.getSession({ user: id, valid: true });

            const refreshToken = req.cookies['refreshToken'];

            if (!refreshToken || !activeSession) {
                res.status(401).json({ message: 'Unauthorized', sessionState: false });
                return;
            }

            const accessToken = await this.sessionService.reIssueAccessToken(refreshToken);

            if (!accessToken) {
                res.status(403).json({ message: 'session has expired' });
                return;
            }

            res.setHeader('Authorization', `${accessToken}`);

            res.cookie('accessToken', accessToken, {
                sameSite: 'strict',
                httpOnly: true,
                secure: true,
                maxAge: 900 * 1000,
            });

            res.status(200).json({ message: 'session state regenerated', sessionState: true });
        } catch (error) {
            this.handleError(res, error);
        }
    };
}

export default SessionController;
