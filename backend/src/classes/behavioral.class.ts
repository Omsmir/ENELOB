
export interface Command {
    execute(): void;
}


export class CommandInvoker {
    private queue: Command[];
    constructor() {
        this.queue = [];
    }

    public addCommand(cmd: Command) {
        this.queue.push(cmd);
    }

    public getCommands() {
        return this.queue
    }

    public run() {
        for (const cmd of this.queue) {
            cmd.execute();
        }
        this.queue = [];
    }
}
