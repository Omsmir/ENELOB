import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { verifyJwt } from '../utils/jwt.sign';
import SessionService from '../services/session.service';
import { BaseController } from '@/controllers/base.controller';
import { UserDocument } from '@/models/auth.model';

class DeserializeMiddleware extends BaseController {
    private sessionService: SessionService;
    constructor() {
        super();
        this.sessionService = new SessionService();
    }

    public deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = get(req, 'headers.authorization', '')?.replace(/^Bearer\s/, '');

        const refreshToken = req.cookies['refreshToken'];


        console.log(
            'accessToken present',
            accessToken.slice(accessToken.length - 3, accessToken.length - 1)
        );

        if (!accessToken) {
            return next();
        }
        const { decoded, valid } = await verifyJwt(accessToken, 'accessTokenPublicKey', 'RS256');

        if (decoded) {
            res.locals.user = decoded;
            console.log('passed');
            return next();
        }
        // error should be solved
        console.log('token valid', valid);
        if (!valid && refreshToken) {
            const newAccessToken = await this.sessionService.reIssueAccessToken(refreshToken);

            console.log('and passed here');
            if (newAccessToken) {
                res.setHeader('authorization', newAccessToken); // for redux store to access

                res.cookie('accessToken', newAccessToken, {
                    // for next middleware to access
                    sameSite: 'strict',
                    httpOnly: true,
                    secure: true,
                    maxAge: 900 * 1000,
                });
            }

            const { decoded } = await verifyJwt(
                newAccessToken as string,
                'accessTokenPublicKey',
                'RS256'
            );

            res.locals.user = decoded;

            return next();
        }

        return next();
    };

    public requireLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = res.locals.user as UserDocument;

            if (!user) {
                res.status(403).json({ message: 'Expired session', sessionState: false });
                return;
            }

            res.locals.user = user;
            return next();
        } catch (error) {
            this.handleError(res, error);
        }
    };

    public checkStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = res.locals.user;

            return next();
        } catch (error) {
            this.handleError(res, error);
        }
    };
}

export default DeserializeMiddleware;
