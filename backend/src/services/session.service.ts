import { sessionInput } from '@/interfaces/models.interface';
import { sessionDocument, SessionModel } from '@/models/session.model';
import { signJwt, verifyJwt } from '@/utils/jwt.sign';
import { get } from 'lodash';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import UserService from './auth.service';
import { ACCESSTOKENTTL } from '@/config/defaults';
// SOLID principles interpreted

// All the route Class is a single responsability
class SessionService {
    private userService: UserService;
    constructor(private sessionModel = SessionModel) {
        // dependency injection: composition over inheritance

        this.userService = new UserService();
    }

    public createSession = async (input: sessionInput) => {
        return await this.sessionModel.create(input);
    };

    public getSession = async (query: FilterQuery<sessionDocument>) => {
        return await this.sessionModel.findOne(query);
    };

    public updateSession = async (
        query: FilterQuery<sessionDocument>,
        update: UpdateQuery<sessionDocument>,
        options?: QueryOptions
    ) => {
        return await this.sessionModel.findOneAndUpdate(query, update, options);
    };

    public deleteSession = async (query: FilterQuery<sessionDocument>) => {
        return await this.sessionModel.findOneAndDelete(query);
    };

    public reIssueAccessToken = async (refreshToken: string) => {
        const { decoded } = await verifyJwt(refreshToken, 'refreshTokenPublicKey', 'RS256');

        if (!decoded || !get(decoded, 'session')) return false;

        const session = await this.sessionModel.findById(get(decoded, 'session'));

        if (!session || !session.valid) return false;

        const user = await this.userService.findUser({ _id: session.user });

        if (!user) return false;

        const accessToken = await signJwt(
            {
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

        return accessToken;
    };
}

export default SessionService;
