import { logger } from './logger';
import MongoConnection from './MongoConnection';

class GracefulShutdown {
    private listeners: { [event: string]: Function[] };
    constructor(private EVENT: string) {
        this.listeners = {};
    }
    public on(event: string, listener: Function): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    public async emit(event: string, ...args: any[]): Promise<void> {
        //Variadic arguments (spread) – you can pass any number of arguments, and they’ll be forwarded to each listener.
        if (this.listeners[event]) {
            this.listeners[event].forEach(async (listener) => await listener(...args));
        }
    }

    public async shutdown(SIGNAL: string) {
        await this.emit(this.EVENT, SIGNAL);
    }
}
export const gracefulShutdown = new GracefulShutdown('SHUTDOWN');

gracefulShutdown.on('SHUTDOWN', async (signal: string) => {
    logger.error(`Received shutdown signal: ${signal}`);

    await MongoConnection.CloseConnection();
});

// {
//   shutdown: [listener1, listener2],
//   cleanup: [listener3],
// }
