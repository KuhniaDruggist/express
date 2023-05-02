import express, { Response, Router } from 'express';
import { getCourseViewModel } from '../utils/getCourseViewModel';
import {
    RequestWithBody,
    RequestWithQueryParams,
    RequestWithURIParams,
    RequestWithURIParamsAndBody,
} from '../types/requests';
import { CourseGetQueryModel } from '../models/CourseGetQueryModel';
import { CourseViewModel } from '../models/CourseViewModel';
import { CourseGetURIModel } from '../models/CourseGetURIModel';
import { CourseCreateModel } from '../models/CourseCreateModel';
import { CourseDeleteURIModel } from '../models/CourseDeleteURIModel';
import { CourseUpdateURIModel } from '../models/CourseUpdateURIModel';
import { CourseUpdateModel } from '../models/CourseUpdateModel';
import { CourseType } from '../types/course';
import { DataBase } from '../types/dataBase';
import { HTTP_STATUSES } from '../types/httpStatuses';

export const getCoursesRouter = (dataBase: DataBase): Router => {
    const router = express.Router();

    router.get('/', (req: RequestWithQueryParams<CourseGetQueryModel>,
                                   res: Response<Array<CourseViewModel>>) => {
        let resultCourses = dataBase.courses;

        if (req.query.title) {
            resultCourses = resultCourses.filter(c => c.title.indexOf(req.query.title as string) > -1);
        }

        res.json(resultCourses.map(getCourseViewModel));
    });

    router.get('/:id', (req: RequestWithURIParams<CourseGetURIModel>,
                                       res: Response<CourseViewModel>) => {
        const foundCourse = dataBase.courses.find(course => course.id === +req.params.id);

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(getCourseViewModel(foundCourse));
    });

    router.post('/', (req: RequestWithBody<CourseCreateModel>,
                                    res: Response<CourseViewModel>) => {
        if (!(req.body.title as string).trim()) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const createdCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            students: 0,
        };

        dataBase.courses.push(createdCourse);
        res.status(HTTP_STATUSES.CREATED_201).json(getCourseViewModel(createdCourse));
    });

    router.delete('/:id', (req: RequestWithURIParams<CourseDeleteURIModel>, res) => {
        const startCoursesLength = dataBase.courses.length;
        dataBase.courses = dataBase.courses.filter(course => course.id !== +req.params.id);

        if (startCoursesLength === dataBase.courses.length) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    router.put('/:id', (req: RequestWithURIParamsAndBody<CourseUpdateURIModel, CourseUpdateModel>, res) => {
        if (!(req.body.title as string).trim()) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const foundCourse = dataBase.courses.find(course => course.id === +req.params.id);

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        foundCourse.title = req.body.title;

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    })

    return router;
};
