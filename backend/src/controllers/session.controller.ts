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
import { signJwt, verifyJwt } from '@/utils/jwt.sign';
import { ACCESSTOKENTTL, REFRESHTOKENTTL } from '@/config/defaults';
import { get } from 'lodash';
import { UserDocument } from '@/models/auth.model';
import { addHours } from 'date-fns';
import App from '@/app';

class SessionController extends BaseController {
    private sessionService: SessionService;
    private userService: UserService;
    constructor() {
        super();
        this.sessionService = new SessionService();
        this.userService = new UserService();
    }
    public loginHandler = async (
        req: Request<{}, {}, LoginSchemaInterface['body']>,
        res: Response
    ) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const io = App.initiator;

            const user = await this.userService.validatePassword({ email, password });

            if (!user) {
                throw new HttpException(400, 'invalid email or password');
            }
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

            await this.userService.updateUser(
                { _id: user._id },
                { lastSeenAt: new Date() },
                { runValidators: true, new: true }
            );

            const friends = user.friends;

            if (friends && friends.length > 0) {
                for (const friend of friends) {
                    io.to(`${friend}`).emit('userOnline', { id: user._id });
                }
            }

            res.status(200).json({
                message: 'logged in successfully',
                accessToken,
                refreshToken,
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

            const user = await this.userService.findUser({ _id: id });

            if (!user) {
                throw new HttpException(403, 'there is no active session');
            }
            const session = await this.sessionService.getSession({ user: id, valid: true });

            if (!session) {
                throw new HttpException(400, 'there is no active session');
            }

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
            const io = App.initiator;

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

            emitEvent('userOnline');
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

            const user = await this.userService.findUser({ _id: id });

            if (!user) {
                throw new HttpException(403, 'there is no active session');
            }

            const activeSession = await this.sessionService.getSession({ user: id, valid: true });

            
            const refreshToken = get(req, 'headers.x-refresh') as string;

            const accessToken = await this.sessionService.reIssueAccessToken(refreshToken);

            if (!accessToken) {
                res.status(403).json({ message: 'session has expired' });
                return;
            }

            if (accessToken) {
                res.setHeader('Authorization', `${accessToken}`);
            }

            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            this.handleError(res, error);
        }
    };
}

export default SessionController;
