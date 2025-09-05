// base class to use in initializeClasses method in app.ts to witness results in console logs

import { logger } from '@/utils/logger';

// note: use the getInstance method for getting instance of the class or just use any pattern class in any server dependent code files
export class BehavioralClassesPattern {
    private static instance: BehavioralClassesPattern;
    constructor() {
        this.initializeBehavioral();
    }
    private initializeBehavioral() {
        // this log is marked warn to not use in production
        logger.warn('Behavioral patterns folder has been started');
    }

    static getInstance() {
        if (!BehavioralClassesPattern.instance) {
            BehavioralClassesPattern.instance = new BehavioralClassesPattern();
        }
        return BehavioralClassesPattern.instance;
    }
}

// - Theory: Strategy, Observer, Command, State
// - Code: LoginStrategy, DocumentState, EventObserver

// Behavioral Design Patterns

// Theory
// Behavioral patterns are about communication between objects and delegation of responsibilities. You’ll learn how to:

// Make objects interact cleanly and flexibly
// Encapsulate behavior
// Decouple logic from execution

// Observer Pattern
// Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.

// now we want to use the observer pattern in a real world application
// e.g for usage, we will use it in the car.controller.ts and auth.controller.ts

interface Subscriber {
    update(message: string): void;
}

export class EventBus {
    private subscribers: Subscriber[];

    constructor() {
        this.subscribers = [];
    }

    subcribe(sub: Subscriber) {
        this.subscribers.push(sub);
    }
    notify(message: string) {
        this.subscribers.forEach((s) => s.update(message));
    }
}

export class LoggerSubscriber implements Subscriber {
    update(message: string): void {
        console.log(`log: ${message}`);
    }
}

const subStation = new EventBus();

// now we should use the LoggerSubscriber of type Subscriber in the subStation.subscribe method

// subStation.subcribe(new LoggerSubscriber()); // subcribed to a station successfully
// subStation.subcribe(new LoggerSubscriber()); // will return the output again , note another subscriber
subStation.notify('user with id:124 has created a new appointment'); // now we want to notify all the subscribers with the message you want to use

// Command Pattern
// Encapsulate a request as an object, thereby allowing for parameterizing clients and queuing, logging, or undoing operations.

// Use Case: Task Queue for asynchronous jobs (e.g. sending email, processing reports)
export interface Command {
    execute(): void;
}

class SendEmailCommand implements Command {
    constructor(private recipent: string) {}

    execute(): void {
        console.log(`email sent to: ${this.recipent}`);
    }
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

const invoker = new CommandInvoker();

// invoker.addCommand(new SendEmailCommand('omarsamir232'));

// invoker.addCommand(new SendEmailCommand('omarsamir23'));

invoker.run(); // Executes all queued commands

// Strategy Pattern
// Use Case: Dynamic payment or authentication method (e.g. login with password or OTP)

interface LoginStrategy {
    authenticate(secret: string, username?: string): Promise<boolean>;
}

export class PasswordStrategy implements LoginStrategy {
    async authenticate(password: string, username: string): Promise<boolean> {
        return username === 'admin' && password === '123456';
    }
}

export class OtpStrategy implements LoginStrategy {
    async authenticate(otp: string): Promise<boolean> {
        return otp === '000999'; // Just mock for now
    }
}

const passwordConfiguration = new PasswordStrategy();

// console.log(passwordConfiguration.authenticate('123456', 'admin')); // usage output:[promise:{true}]

// State Pattern
// Use Case: User Session or Document Status (e.g. DRAFT → SUBMITTED → APPROVED)

interface State {
    handle(): string;
}

class SubmittedState implements State {
    handle(): string {
        return 'Document has been submitted.';
    }
}
class DraftState implements State {
    handle(): string {
        return 'Document is in draft mode.';
    }
}

class DocumentContext {
    constructor(private state: State) {}

    setState(state: State) {
        this.state = state;
    }

    render() {
        return this.state.handle();
    }
}

const doc = new DocumentContext(new DraftState());
// doc.setState(new SubmittedState()) // method overriding

// console.log(doc.render()); // "Document is in draft mode."
doc.setState(new SubmittedState());
// console.log(doc.render()); // "Document has been submitted."
