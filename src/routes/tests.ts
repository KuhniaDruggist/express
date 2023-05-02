import express, { Router } from 'express';
import { DataBase } from '../types/dataBase';
import { HTTP_STATUSES } from '../types/httpStatuses';

export const getTestsRouter = (dataBase: DataBase): Router => {
    const router = express.Router();

    router.delete('/data', (req, res) => {
        dataBase.courses = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    });

    return router;
};
