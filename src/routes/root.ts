import express, { Router } from 'express';

export const getRootRouter = (): Router => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.send('Welcome to learning backend!');
    });

    return router;
};
