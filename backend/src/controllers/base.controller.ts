import { Response } from 'express';
import HttpException from '@/exceptions/httpException';
import { logger } from '@/utils/logger';
import { NODE_ENV } from '@/config/defaults';
import mongoose from 'mongoose';

export abstract class BaseController {
    // abstract name:string // should be implemented in non abstract classes && abstract methods can only be appear in abstract classes
    protected handleError(res: Response, error: any) {
        if (error instanceof HttpException) {
            return res.status(error.status).json({ message: error.message });
        }

        if (error.errors && Array.isArray(error.errors)) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.errors,
            });
        }

        if (error instanceof mongoose.Error) {
            return res.status(400).json({
                message: error.message,
            });
        }

        logger.error('Unhandled Error:', error); // For dev debugging

        return res.status(500).json({
            message: 'Internal Server Error',
            ...(NODE_ENV === 'development' && { stack: error.stack }),
        });
    }
    
}

// Reusability and Consistency: By centralizing error-handling logic in the BaseController,
// this approach ensures that all controllers extending it can handle errors in a consistent manner
// Subclasses do not need to reimplement this logic, reducing code duplication and improving maintainability.
