import { CourseType } from '../types/course';
import { CourseViewModel } from '../models/CourseViewModel';

export const getCourseViewModel = (course: CourseType): CourseViewModel => {
    return {
        id: course.id,
        title: course.title,
    }
};
