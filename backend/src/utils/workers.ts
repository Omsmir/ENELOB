import { REDIS_DEV_URI, REDIS_PWD } from '@/config/defaults';
import { Queue, Worker } from 'bullmq';
import IoRedis, { Redis } from 'ioredis';
import { logger } from './logger';
import { uploadImageToFirebase } from './getPresignedUrl';
import UserService from '@/services/auth.service';
import { BufferEncoding, getImagesBuffer } from './utils';
import { RedisConnection, RedisServices } from './redis';
import { io } from '@/server';

export type CreateWorkerProps = {
    name: string;
    data?: any;
    connection: Redis;
};

class BullWorkers {
    private static redisConnection: Redis;
    private queues: Map<string, Queue> = new Map();

    constructor() {
        if (!BullWorkers.redisConnection) {
            BullWorkers.redisConnection = new IoRedis(REDIS_DEV_URI as string, {
                maxRetriesPerRequest: null,
                password: REDIS_PWD,
            });
            this.attachConnectionListeners(BullWorkers.redisConnection);
        }
    }

    private attachConnectionListeners(connection: Redis) {
        connection.on('connect', () => logger.info(' BullMQ connected to Redis'));
        connection.on('error', (err) => logger.error(' BullMQ Redis connection error', err));
    }

    /**
     * Get or create a BullMQ queue
     */
    public getQueue(queueName: string): Queue {
        if (!this.queues.has(queueName)) {
            const queue = new Queue(queueName, { connection: BullWorkers.redisConnection });
            this.queues.set(queueName, queue);
        }
        return this.queues.get(queueName)!;
    }

    /**
     * Create a BullMQ worker for a queue
     */
    public createWorker(queueName: string, processor: (job: any) => Promise<any>) {
        const worker = new Worker(queueName, processor, {
            connection: BullWorkers.redisConnection,
        });

        worker.on('completed', (job, result) => {
            switch (result.type) {
                case 'profileUpdate':
                    const userId = result.userId as string;
                    io.to(userId).emit('ImageUpdated', { userId });
                    break;
                case 'check-online-status':
                    break;
                default:
                    logger.error('invalid or unknown bull result type');
                    break;
            }
            logger.info(
                ` Job ${job.id} on queue "${queueName}" completed. Result: ${JSON.stringify(result)}`
            );
        });

        worker.on('failed', (job, err, result) => {
            logger.error(` Job ${job?.id} on queue "${queueName}" failed: ${err.message}`);
        });

        return worker;
    }

    /**
     * Access raw Redis connection if needed
     */
    public getConnection(): Redis {
        return BullWorkers.redisConnection;
    }
}

const worker = new BullWorkers();

worker.createWorker('check-online-status', async (job) => {
    const { userId } = job.data;

    try {
        const userService = new UserService();
        const redisServices = new RedisServices(RedisConnection.getInstance().getClient());

        const user = await userService.findUser({ _id: userId });

        if (!user) return;

        const userActiveFriends = user.friends;

        userActiveFriends.forEach(async (friend) => {
            const HashName = `user:${friend}:online-status`;

            const activeStatus = await redisServices.checkHash(HashName, 'status');

            const friendProfile = await userService.findUser({ _id: friend });

            if (!friendProfile) {
                logger.warn(`friend with id:${friend} is not found`);
                return;
            }
            const friends = friendProfile.friends;

            const emitEvent = async (eventName: 'userOnline' | 'userOffline') => {
                if (friends && friends.length > 0) {
                    for (const peer of friends) {
                        io.to(`${peer}`).emit(eventName, { id: friend });
                    }
                }
            };

            const lastSeenAtHashName = `user:${friend}:lastSeen`;
            const lastRequestHashName = `user:${friend}:lastRequest`;

            const lastSeenAt = await redisServices.checkHash(lastSeenAtHashName, 'lastSeenAt');

            if (!activeStatus) {
                if (!lastSeenAt) {
                    await redisServices.createHash({
                        HashName: lastSeenAtHashName,
                        content: { lastSeenAt: new Date().toLocaleString() },
                    });
                    const lastRequest = await redisServices.checkHash(
                        lastRequestHashName,
                        'lastRequest'
                    );
                    await userService.updateUser(
                        { _id: friend },
                        { lastSeenAt: new Date(lastRequest as string) },
                        { runValidators: true, new: true }
                    );
                }
                await emitEvent('userOffline');
            } else {
                await emitEvent('userOnline');

                if (lastSeenAt) {
                    await redisServices.DelHash(lastSeenAtHashName, 'lastSeenAt');
                }
            }
        });

        return { type: 'check-online-status', sucess: true };
    } catch (error: any) {
        logger.error(error.message);
    }
});

worker.createWorker('upload', async (job) => {
    // Simulate a task by waiting for 2 seconds
    const { profileImg, coverImg, userId } = job.data;

    try {
        const userServices = new UserService();

        let data = null;

        if (profileImg || coverImg) {
            let files: { profileImg?: any; coverImg?: any } = {};
            if (profileImg) files.profileImg = profileImg;
            if (coverImg) files.coverImg = coverImg;

            data = getImagesBuffer({
                files,
                type: BufferEncoding.BUFFER,
            });
        }

        if (!data) {
            logger.error('No images provided for upload');
            return;
        }

        let profileImage = null;
        let coverImage = null;
        if (data.profileImg || data.coverImg) {
            if (data.profileImg) {
                profileImage = await uploadImageToFirebase({
                    image: data.profileImg,
                    path: 'users',
                    userId,
                });
            }
            if (data.coverImg) {
                coverImage = await uploadImageToFirebase({
                    image: data.coverImg,
                    path: 'users/cover',
                    userId,
                });
            }
        }

        await userServices.updateUser(
            { _id: userId },
            {
                ...(profileImage ? { profileImg: profileImage } : {}),
                ...(coverImage ? { coverImg: coverImage } : {}),
            }, // only add fields if not null
            { new: true, runValidators: true }
        );

        logger.info(`Job ${job.id} completed successfully for user ${userId}`);

        return {
            type: 'profileUpdate',
            success: true,
            userId,
            ...(profileImage && profileImage.filename ? { profileImg: profileImage.filename } : {}),
        };
    } catch (err: any) {
        logger.error(`Job ${job.id} failed:`, err);
        return { success: false, error: err.message, userId };
    }
});
export default BullWorkers;
