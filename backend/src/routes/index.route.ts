import { routes } from '@/interfaces/routes.interface';
import { json } from 'body-parser';
import { Request, Response, Router } from 'express';

class IndexRoute implements routes {
    public path = '/';
    public router = Router();
    constructor() {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.get(this.path, (req: Request, res: Response) => {
            const ip = req.headers['x-real-ip'];
            const headers = req.headers
            res.status(200).json({ message: 'server is responding', ip ,headers,msg:"hello"});
        });
    }
}

export default IndexRoute;
