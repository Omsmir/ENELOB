import { CommandInvoker } from './classes/behavioral.class';
import UserController from './controllers/auth.controller';
import ConversationController from './controllers/conversation.controller';
import SessionController from './controllers/session.controller';
import DeserializeMiddleware from './middlewares/deserializeUser';
import UserRoute from './routes/auth.route';
import ConversationRoute from './routes/conversation.route';
import IndexRoute from './routes/index.route';
import SessionRoute from './routes/session.route';
import UserService from './services/auth.service';
import ConversationService from './services/conversation.service';
import SessionService from './services/session.service';
import { RedisConnection, RedisServices } from './utils/redis';
import BullWorkers from './utils/workers';

const userService = new UserService();
const conversationService = new ConversationService();
const sessionService = new SessionService();

const BullWorkerService = new BullWorkers();
const commandInvoker = new CommandInvoker();

const redisService = new RedisServices(RedisConnection.getInstance().getClient());

const deserializerMiddlewares = new DeserializeMiddleware(
    redisService,
    BullWorkerService
);

export const Routes = [
    new IndexRoute(),
    new SessionRoute(
        new SessionController(sessionService, userService, redisService),
        deserializerMiddlewares
    ),
    new UserRoute(
        new UserController(userService, commandInvoker, BullWorkerService),
        deserializerMiddlewares
    ),
    new ConversationRoute(
        new ConversationController(conversationService, userService),
        deserializerMiddlewares
    ),
];
