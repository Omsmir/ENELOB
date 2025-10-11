import { Request, Response } from 'express';
import BaseRoute from './base.route';

class IndexRoute extends BaseRoute {

    constructor() {
        super('/')
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, (req: Request, res: Response) => {
            const ip = req.headers['x-real-ip'];
            const headers = req.headers
            res.status(200).json({ message: 'server is responding', ip ,headers,msg:"hello"});
        });
    }
}

export default IndexRoute;
