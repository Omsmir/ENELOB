import { BODYSIZELIMIT, FRONTEND_DEV_URI, LOG_FORMAT, NODE_ENV, PORT } from './config/defaults';
import express from 'express';
import MongoConnection from './utils/MongoConnection';
import morgan from 'morgan';
import { logger, stream } from './utils/logger';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ErrorHandler } from './middlewares/error.middleware';
import http from 'http';
import { sanitizeRequest } from './middlewares/xss';
import { DeserializeUser } from './middlewares/deserializeUser';
import { developedBy, ENELOB, SIGNALS } from './utils/constants';
import { gracefulShutdown } from './utils/gracefulEvents';
import SocketServer from './socket/socketServer';
import { Server } from 'socket.io';
import { RedisConnection } from './utils/redis';
import BaseRoute from './routes/base.route';
import SessionService from './services/session.service';
import SocketBaseController from './socket/base.controller';

class App {
    public PORT: string | number;
    public env: string;
    public app: express.Application;
    public server: http.Server;
    public mongoConnection: MongoConnection;
    public initiator: Server;
    public redisConnection: RedisConnection;
    private socketServer: SocketServer;
    private deserializeUser: DeserializeUser;
    constructor(
        private readonly routes: BaseRoute[],
        private readonly socketControllers: SocketBaseController[]
    ) {
        this.PORT = PORT || 8090;
        this.env = NODE_ENV || 'development';
        this.app = express();
        this.server = http.createServer(this.app);
        this.mongoConnection = MongoConnection.getInstance();
        this.redisConnection = RedisConnection.getInstance();
        this.socketServer = SocketServer.getInstance(this.server, this.socketControllers);
        this.initiator = this.socketServer.io;
        this.deserializeUser = new DeserializeUser(new SessionService());

        this.socketInitialize();

        this.initializeMiddlewares();
        this.initializeDeserializers();
        this.initializeRoutes(routes);
        this.initializeErrorMiddlewares();
        this.setupGracefulShutdown();
    }

    public listen() {
        this.server.listen(this.PORT, async () => {
            logger.info(`\n${ENELOB}\n${developedBy}`);
            logger.info(`===== http://localhost:${this.PORT} =====`);
            logger.info(`===========${this.env}===========`);
            logger.info(`===========port:${this.PORT}=============`);
            logger.info(`=================================`);
        });
    }

    private async socketInitialize() {
        this.socketServer.SocketInitiator(this.initiator);
    }

    private initializeRoutes(routes: BaseRoute[]) {
        routes.forEach((route: BaseRoute) => {
            this.app.use('/api', route.router);
        });
    }

    private async initializeMiddlewares() {
        this.app.use(morgan(LOG_FORMAT || 'dev', { stream }));
        this.app.use(
            cors({
                origin: FRONTEND_DEV_URI,
                credentials: true,
                exposedHeaders: ['Authorization'],
            })
        );
        this.app.use(hpp({ checkBody: true }));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json({ limit: BODYSIZELIMIT }));
        this.app.use(express.urlencoded({ extended: true, limit: BODYSIZELIMIT }));
        this.app.use(cookieParser());
        this.app.use(sanitizeRequest);
    }

    private async initializeDeserializers() {
        this.app.use(this.deserializeUser.deserializeUser);
    }
    private initializeErrorMiddlewares() {
        this.app.use(ErrorHandler);
    }

    static createInstance(routes: BaseRoute[], socketControllers: SocketBaseController[]): App {
        return new App(routes, socketControllers);
    }

    public getServer() {
        // specfic for testing
        return this.app;
    }

    private async setupGracefulShutdown() {
        for (const signal of SIGNALS) {
            process.on(signal, async () => await gracefulShutdown.shutdown(signal));
        }
    }
}

export default App;
