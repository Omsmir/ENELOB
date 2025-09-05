import { NextFunction, Request, Response } from 'express';
import z, { AnyZodObject, ZodError } from 'zod';

export const validate =
    (Schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            Schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
                file: req.file ? { profileImg: req.file } : undefined,
            });
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((ele) => ele.message);

                const responseMessage =
                    errorMessages.length > 1 ? 'More than one field is required' : errorMessages[0];

                res.status(400).json({ message: responseMessage, errorMessages });
            }
        }
    };
