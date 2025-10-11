
import express from 'express'



abstract class BaseRoute {
    public router: express.Router
    constructor(readonly path:string){
        this.router = express.Router()
    }

    protected abstract initializeRoutes(): void;

}


export default BaseRoute