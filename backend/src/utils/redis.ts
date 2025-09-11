import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';
import { REDIS_DEV_URI, REDIS_PWD } from '@/config/defaults';

interface addToHashProps {
    HashName: string;
    token: any;
    channel?: string;
    expire: number;
    content: object;
}

interface CreateHashProps {
    HashName: string;
    content: any;
    expire?: number;
}

export class RedisConnection {
    private static instance: RedisConnection;
    private redisClient: RedisClientType;

     constructor() {
        this.redisClient = createClient({ url: REDIS_DEV_URI, password: REDIS_PWD });
        this.initializeConnection();
    }

    public static getInstance(): RedisConnection {
        if (!RedisConnection.instance) {
            RedisConnection.instance = new RedisConnection();
        }
        return RedisConnection.instance;
    }

    private async initializeConnection() {
        try {
            this.redisClient.on('connect', () => logger.info('Redis is connected'));

            this.redisClient.on('error', err => logger.error('error connecting to redis', err));
            await this.redisClient.connect();
        } catch (error) {
            logger.error('Error connecting to Redis:', error);
            throw new Error('Could not connect to Redis');
        }
    }

    public getClient(): RedisClientType {
        return this.redisClient;
    }

    public static async disconnect() {
        if (RedisConnection.instance) {
            await RedisConnection.instance.redisClient.quit();
        }
    }
}

export class RedisServices {
    constructor(private redisClient: RedisClientType) {}

    public addToHash = async ({ HashName, token, expire, content }: addToHashProps) => {
        await this.redisClient.hSet(HashName, token);

        for (const [key, value] of Object.entries(content)) {
            await this.redisClient.hSet(`${HashName}:1`, key, value);
        }
        await this.redisClient.expire(HashName, expire);
    };

    public createHash = async ({ HashName, content, expire }: CreateHashProps) => {
        await this.redisClient.hSet(HashName, content);

        if (expire) {
            await this.redisClient.expire(HashName, expire);
        }
    };
    public checkHash = async (HashName: string, value: string) => {
        return await this.redisClient.hGet(HashName, value);
    };

    public GetHashExpiration = async (HashName: string) => {
        return await this.redisClient.ttl(HashName);
    };

    public DelHash = async (HashName: string, value: string) => {
        return await this.redisClient.hDel(HashName, value);
    };
}

// export const redisBroker = async () => {
//         const connection = new RedisConnection();

// const redis = await connection.listen();

//     const subscriber = redis.duplicate();

//     subscriber.on('error', error => {
//         console.log(error.message);
//     });
//     await subscriber.connect();
//     subscriber.on('connect', () => {
//         logger.info('subscribed to the redis pub/sub');
//     });

//     await subscriber.subscribe('events', message => {
//         console.log(message);
//         initiator.emit('redis-updates', message);
//     });
// };
