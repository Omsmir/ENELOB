import { Socket } from "socket.io";

enum SocketEvents {
    ERROR = 'ERROR',
}

abstract class SocketBaseController {
    protected events: Record<SocketEvents, string>;

    constructor(protected readonly event_name: string) {
        this.events = {
            [SocketEvents.ERROR]: `${this.event_name}:${SocketEvents.ERROR}`,
        };
    }

    public abstract initializeEventHandlers(socket: Socket): void;
}

export default SocketBaseController