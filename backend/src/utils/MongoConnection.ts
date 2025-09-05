import { MONGO_DB, MONGO_DB_PASSWD, MONGO_DB_URI, MONGO_DB_USER } from '../config/defaults';
import { logger } from './logger';
import mongoose from 'mongoose';

// Singleton Design Pattern
class MongoConnection {
    private static MONGO_DB_URI: string;
    private static MONGO_DB_NAME: string;
    private static instance: MongoConnection;

    private constructor() {
        MongoConnection.MONGO_DB_URI =
            MONGO_DB_URI || 'mongodb+srv://cluster0.y7dljqp.mongodb.net/';
        MongoConnection.MONGO_DB_NAME = MONGO_DB || 'test';

        this.initializeConnection();
    }

    static getInstance(): MongoConnection {
        if (!MongoConnection.instance) {
            MongoConnection.instance = new MongoConnection();
        }
        return MongoConnection.instance;
    }

    static async CloseConnection() {
        if (MongoConnection.instance) {
            await mongoose.connection
                .close()
                .then(() => logger.info('Mongodb connection closed successfully'))
                .catch((error: any) =>
                    logger.error(`Error closing MongoDB connection: ${error.message}`)
                );
        }
        logger.warn('mongo connection is not initialized');
    }
    private async initializeConnection() {
        try {
            await mongoose
                .connect(MongoConnection.MONGO_DB_URI, {
                    user: MONGO_DB_USER,
                    pass: MONGO_DB_PASSWD,
                    dbName: MongoConnection.MONGO_DB_NAME,
                })
                .then((conn) =>
                    logger.info(`Mongodb is connected to database:${conn.connection.name}`)
                )
                .catch((error: any) => {
                    logger.error(`Error connecting to MongoDB: ${error.message}`);
                });
        } catch (error: any) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }
}

export default MongoConnection;
