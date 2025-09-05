import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';
import xss from 'xss';

function sanitizeInput(obj: any): any {
    if (typeof obj === 'string') {
        logger.info(`xss log: value (${obj}) is of type: ${typeof obj}`);
        const santizedValue = xss(obj);
        return santizedValue;
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            obj[key] = sanitizeInput(obj[key]);
        }
    }

    return obj;
}

export function sanitizeRequest(req: Request, res: Response, next: NextFunction) {
    // req.body = sanitizeInput(req.body);
    req.query = sanitizeInput(req.query);
    req.params = sanitizeInput(req.params);
    next();
}
