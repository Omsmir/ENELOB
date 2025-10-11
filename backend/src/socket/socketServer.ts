import { Server, Socket } from 'socket.io';
import { Server as httpServerType } from 'http';
import { logger } from '../utils/logger';
import { JwtPayload } from 'jsonwebtoken';
import { verifyJwt } from '../utils/jwt.sign';
import { FRONTEND_DEV_URI } from '@/config/defaults';
import SocketBaseController from './base.controller';

class SocketServer {
    private static instance: SocketServer;
    public readonly io: Server;

    constructor(
        private readonly server: httpServerType,
        private readonly socketControllers: SocketBaseController[]
    ) {
        this.io = new Server(server, {
            cors: {
                origin: FRONTEND_DEV_URI,
                methods: ['GET', 'POST', 'PUT'],
                credentials: true,
            },
        });
    }

    public static getInstance = (
        server: httpServerType,
        socketControllers: SocketBaseController[]
    ): SocketServer => {
        if (!SocketServer.instance) {
            SocketServer.instance = new SocketServer(server, socketControllers);
        }
        return SocketServer.instance;
    };

    public async SocketInitiator(initiator: Server) {
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
                this.socketControllers.forEach((controller:SocketBaseController) => {
                    controller.initializeEventHandlers(socket)
                })

                const userId = (socket as any).user._id;

                socket.on('disconnect', async () => {
                    socket.leave(userId);

                    logger.warn(`${userId} is disconnected from socket`);
                });
            });
        } catch (error) {
            logger.error('Connection error to the socket', error);
        }
    }
}

export default SocketServer;
