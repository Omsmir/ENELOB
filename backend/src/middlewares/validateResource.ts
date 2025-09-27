import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate =
    (Schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            let files: any = undefined;

            if (Array.isArray(req.files)) {
                files = req.files.map((f: Express.Multer.File) => f);
            } else if (req.file) {
                files = req.file;
            } else if (req.files && typeof req.files === 'object') {
                files = Object.fromEntries(
                    Object.entries(req.files).map(([field, arr]) => [
                        field,
                        Array.isArray(arr) && arr.length > 0 ? arr[0] : undefined, // pick first file per field
                    ])
                );
            }

            Schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
                file: files,
            });

            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((ele) => ele.message);
                const responseMessage =
                    errorMessages.length > 1 ? 'More than one field is required' : errorMessages[0];

                res.status(400).json({ message: responseMessage, errorMessages });
            } else {
                res.status(500).json({ message: 'Internal validation error' });
            }
        }
    };
