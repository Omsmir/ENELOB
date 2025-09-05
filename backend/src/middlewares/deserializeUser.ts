import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { verifyJwt } from '../utils/jwt.sign';
import SessionService from '../services/session.service';

class DeserializeMiddleware {
    private static sessionService: SessionService;
    constructor() {
        DeserializeMiddleware.sessionService = new SessionService();
    }

    public static deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = get(req, 'headers.authorization', '')?.replace(/^Bearer\s/, '');

        const refreshToken = get(req, 'headers.x-refresh') as string;
        if (!accessToken) {
            return next();
        }

        const { decoded, valid } = await verifyJwt(accessToken, 'accessTokenPublicKey', 'RS256');

        if (decoded) {
            res.locals.user = decoded;

            return next();
        }

        if (!valid && refreshToken) {
            const newAccessToken = await this.sessionService.reIssueAccessToken(refreshToken);

            if (newAccessToken) {
                res.setHeader('Authorization', `${newAccessToken}`);
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
}

export default DeserializeMiddleware;
