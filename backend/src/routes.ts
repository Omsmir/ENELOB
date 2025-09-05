import UserController from './controllers/auth.controller';
import ConversationController from './controllers/conversation.controller';
import SessionController from './controllers/session.controller';
import UserRoute from './routes/auth.route';
import ConversationRoute from './routes/conversation.route';
import IndexRoute from './routes/index.route';
import SessionRoute from './routes/session.route';

export const Routes = [
    new IndexRoute(),
    new SessionRoute(new SessionController()),
    new UserRoute(new UserController()),
    new ConversationRoute(new ConversationController())
];
