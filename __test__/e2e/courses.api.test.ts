import request from 'supertest';
import { CourseCreateModel } from '../../src/models/CourseCreateModel';
import { CourseViewModel } from '../../src/models/CourseViewModel';
import { CourseUpdateModel } from '../../src/models/CourseUpdateModel';
import { CourseDeleteURIModel } from '../../src/models/CourseDeleteURIModel';
import {CourseGetURIModel} from '../../src/models/CourseGetURIModel';
import { app } from '../../src/app';
import { HTTP_STATUSES } from '../../src/types/httpStatuses';

describe('/course', () => {

    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return 200 and empty array of courses', async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for not existing course', async () => {
        const URIParams: CourseGetURIModel = { id: '-100' }
        await request(app)
            .get('/courses/' + URIParams.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't create course with incorrect data`, async () => {
        const data: CourseCreateModel = { title: '' };
        await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdCourse_1: CourseViewModel;
    it('should create course with correct data', async () => {
        const data: CourseCreateModel = { title: 'SQL' };
        const createResponse = await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);

        createdCourse_1 = createResponse.body;
        expect(createdCourse_1).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse_1])
    })

    let createdCourse_2: CourseViewModel;
    it(`should create one more course`, async () => {
        const data: CourseCreateModel = { title: 'Mongo' };
        const createResponse = await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);

        createdCourse_2 = createResponse.body;
        expect(createdCourse_2).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse_1, createdCourse_2])
    })

    it(`shouldn't update course with incorrect data`, async () => {
        const data: CourseUpdateModel = { title: '' };
        await request(app)
            .put('/courses/' + createdCourse_1.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);

        await request(app)
            .get('/courses/' + createdCourse_1.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse_1)
    })

    it(`shouldn't update course that not exist`, async () => {
        const data: CourseUpdateModel = { title: 'SQL2.0' };
        await request(app)
            .put('/courses/' + -100)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    })

    it(`should update course with correct data`, async () => {
        const data: CourseUpdateModel = { title: 'SQL2.0' };
        await request(app)
            .put('/courses/' + createdCourse_1.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get('/courses/' + createdCourse_1.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse_1,
                title: data.title
            })
    })

    it(`should update only course by correct id`, async () => {
        const data: CourseUpdateModel = { title: 'SQL3.0' };
        await request(app)
            .put('/courses/' + createdCourse_1.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get('/courses/' + createdCourse_1.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse_1,
                title: data.title
            })

        await request(app)
            .get('/courses/' + createdCourse_2.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse_2)
    })

    it(`shouldn't delete course with incorrect id`, async () => {
        const URIParams: CourseDeleteURIModel = { id: '3' }
        await request(app)
            .delete('/courses/' + URIParams.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    })

    it(`should delete both courses`, async () => {
        await request(app)
            .delete('/courses/' + createdCourse_1.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get('/courses/' + createdCourse_1.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [ createdCourse_2 ])

        await request(app)
            .delete('/courses/' + createdCourse_2.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get('/courses/' + createdCourse_2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

})
