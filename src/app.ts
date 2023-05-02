import express from 'express';
import { getRootRouter } from './routes/root';
import { getCoursesRouter } from './routes/courses';
import { getTestsRouter } from './routes/tests';
import { dataBase } from './data/dataBase';

export const app = express();

export const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/', getRootRouter());
app.use('/courses', getCoursesRouter(dataBase));
app.use('/__test__', getTestsRouter(dataBase));
