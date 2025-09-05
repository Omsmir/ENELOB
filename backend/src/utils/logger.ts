import { LOG_DIR } from '../config/defaults';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import winston_daily from 'winston-daily-rotate-file';

const logDir = join(__dirname, LOG_DIR || '../logs');

if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
}

const loggerFormat = winston.format.printf(
    ({ timestamp, level, message }) => `${timestamp}::${level}::${message}`
);

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY:MM:DD :: HH:mm:ss' }),
        loggerFormat
    ),
    transports: [
        new winston_daily({
            level: 'debug',
            dirname: logDir + '/debug',
            filename: join(logDir, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: 30,
        }),
        new winston_daily({
            level: 'error',
            maxFiles: 30,
            filename: join(logDir, 'error-%DATE%.log'),
            dirname: logDir + '/errors',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
        }),
    ],
});

logger.exceptions.handle(
    new winston.transports.File({ filename: join(logDir, 'exceptions-%DATE%.log') })
);
logger.rejections.handle(
    new winston.transports.File({ filename: join(logDir, 'rejections-%DATE%.log') })
);

logger.add(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.splat(),
            winston.format.colorize({ all: true })
        ),
    })
);

const stream = {
    write: (message: string) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    },
};

export { stream, logger };
