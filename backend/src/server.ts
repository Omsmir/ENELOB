import { Server } from 'socket.io';
import App from './app';
import { Routes } from './routes';
import socketControllers from './socket/socket.main';

const app = App.createInstance(Routes, socketControllers);

app.listen();

export const io: Server = app.initiator;
