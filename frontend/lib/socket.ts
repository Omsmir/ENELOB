import { UserAuth } from "@/types";
import { Socket } from "socket.io-client";

enum SocketEvents {
  ERROR = "ERROR",
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

export default SocketBaseController;

enum SocketActions {
  JOIN_ACTION = "SOCKET_JOIN",
  LEAVE_ACTION = "SOCKET_LEAVE",
}

export class JoinSocketController extends SocketBaseController {
  protected JoinSocketEvents: Record<SocketActions, string> = {
    [SocketActions.JOIN_ACTION]: `${
      this.event_name
    }:${SocketActions.JOIN_ACTION.toUpperCase()}`,
    [SocketActions.LEAVE_ACTION]: `${
      this.event_name
    }:${SocketActions.LEAVE_ACTION.toUpperCase()}`,
  };
  constructor(private readonly session: UserAuth) {
    super("SOCKET_MAIN");
  }

  public initializeEventHandlers(socket: Socket): void {
    socket.emit(`${this.JoinSocketEvents.SOCKET_JOIN}`, this.joinSocket());
  }
  public leaveSocketHandler(socket: Socket): void {
    socket.emit(`${this.JoinSocketEvents.SOCKET_LEAVE}`, this.leaveSocket());
  }

  private joinSocket = () => {
    return { id: this.session._id };
  };
  private leaveSocket = () => {
    return { id: this.session._id };
  };
}
