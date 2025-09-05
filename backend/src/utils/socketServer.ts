import { Server, Socket } from 'socket.io';
import { Server as httpServerType } from 'http';
import { logger } from './logger';
import { CREDENTIALS, ORIGIN } from '@/config/defaults';
import { JwtPayload } from 'jsonwebtoken';
import { verifyJwt } from './jwt.sign';
import { UserDocument } from '@/models/auth.model';
import UserService from '@/services/auth.service';

const onlineUsers = new Map<string, string>();

class SocketServer {
    static userService = new UserService();
    public static io(server: httpServerType) {
        return new Server(server, {
            cors: {
                origin: ORIGIN,
                methods: ['GET', 'POST', 'PUT'],
                credentials: CREDENTIALS,
            },
        });
    }

    public static SocketInitiator(initiator: Server) {
        try {
            initiator.use(async (socket, next) => {
                const token =
                    socket.handshake.auth?.token ||
                    socket.handshake.headers.authorization?.split(' ')[1];

                // console.table("token" + token)
                if (!token) return next(new Error('Authentication required'));

                try {
                    const { valid, decoded } = (await verifyJwt(
                        token,
                        'accessTokenPublicKey',
                        'RS256'
                    )) as JwtPayload;

                    if (valid) {
                        (socket as any).user = decoded;
                        next();
                    }
                } catch (err) {
                    return next(new Error('Invalid token'));
                }
            });

            initiator.on('connection', async (socket: Socket) => {
                const user = (await (socket as any).user) as UserDocument;

                const userId = user._id as string;

                const userExisted = await SocketServer.userService.findUser({ _id: userId });

                if (!userExisted) {
                    logger.error(`user with id:${userId} is not found`);
                    return;
                }
                socket.join(`${userId}`);

                logger.info(`✅ ${userId} connected with socket ${socket.id}`);

                onlineUsers.set(userId, socket.id);

                const friends = userExisted.friends;

                if (friends && friends.length > 0) {
                    for (const friend of friends) {
                        initiator.to(`${friend}`).emit('userOnline', { id: userId });
                    }
                }

                logger.info(`userOnline-${userId}`);

                socket.on('disconnect', async () => {
                    logger.error(`${userId} is disconncted from socket server`);

                    if (friends && friends.length > 0) {
                        for (const friend of friends) {
                            initiator.to(`${friend}`).emit('userOffline', { id: userId });
                        }
                    }

                    onlineUsers.delete(userId);
                });
            });
        } catch (error) {
            logger.error('Connection error to the socket', error);
        }
    }
}

class SocketServices {
    constructor(initiator: Server) {}

    public static emitMessage = async () => {
        try {
        } catch (error) {
            logger.error('Connection error to the socket', error);
        }
    };
}

export default SocketServer;
