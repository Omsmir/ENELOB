import UserService from '@/services/auth.service';
import SocketMainController from './socket.controller';

const userService = new UserService();

const socketMainController = new SocketMainController(userService);

const socketControllers = [socketMainController];

export default socketControllers;
