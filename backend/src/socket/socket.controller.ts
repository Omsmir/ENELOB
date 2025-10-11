import { Socket } from 'socket.io';
import SocketBaseController from './base.controller';
import { logger } from '@/utils/logger';
import { UserDocument } from '@/models/auth.model';
import UserService from '@/services/auth.service';

enum SocketActions {
    JOIN_ACTION = 'SOCKET_JOIN',
    LEAVE_ACTION = 'SOCKET_LEAVE',
}

class SocketMainController extends SocketBaseController {
    protected JoinSocketEvents: Record<SocketActions, string> = {
        [SocketActions.JOIN_ACTION]: `${this.event_name}:${SocketActions.JOIN_ACTION.toUpperCase()}`,
        [SocketActions.LEAVE_ACTION]: `${this.event_name}:${SocketActions.LEAVE_ACTION.toUpperCase()}`,
    };
    public onlineUsers: Map<string, string>;
    constructor(private readonly userService: UserService) {
        super('SOCKET_MAIN');
        this.onlineUsers = new Map<string, string>();
    }
    public initializeEventHandlers(socket: Socket): void {
        socket.on(`${this.JoinSocketEvents.SOCKET_JOIN}`, this.joinSocket(socket));
    }
    public initializeSocketLeave(socket: Socket): void {
        socket.on(`${this.JoinSocketEvents.SOCKET_LEAVE}`, this.leaveSocket(socket));
    }

    private joinSocket = (socket: Socket) => {
        return async (payload: unknown) => {
            const { id } = payload as UserDocument;
            try {
                const user = (await (socket as any).user) as UserDocument;

                const userId = user._id as string;

                if (userId !== String(id)) {
                    throw new Error('unauthorized socket connection');
                }

                const userExisted = await this.userService.findUser({ _id: userId });

                if (!userExisted) {
                    logger.error(`user with id:${userId} is not found`);
                    return;
                }
                socket.join(`${userId}`);

                this.onlineUsers.set(userId, socket.id);

                logger.info(`${userId} is connected with socket: ${socket.id}`);

                const friends = userExisted.friends;

                if (friends && friends.length > 0) {
                    for (const friend of friends) {
                        socket.to(`${friend}`).emit('userOnline', { id: userId });
                    }
                }

                logger.info(`userOnline-${userId}`);
            } catch (error: any) {
                socket.emit(this.events.ERROR, { message: error.message });
            }
        };
    };

    private leaveSocket = (socket: Socket) => {
        return async (payload: unknown) => {
            const { id } = payload as UserDocument;

            try {
                console.log('disconncted');

                const user = this.onlineUsers.get(id);

                socket.leave(id);

                logger.warn(`${id} disconnected from socket ${user}`);

                this.onlineUsers.delete(id);
            } catch (error: any) {
                socket.emit(this.events.ERROR, { message: error.message });
            }
        };
    };
}
export default SocketMainController

