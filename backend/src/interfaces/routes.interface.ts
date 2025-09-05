import { Router } from 'express';

export interface routes {
    path?: string;
    router: Router;
}
