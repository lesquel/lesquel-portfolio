import { Course } from '../models';

/**
 * Abstract repository contract for Course data access.
 */
export abstract class CourseRepository {
  abstract getAllCourses(): Promise<Course[]>;
  abstract getCourseBySlug(slug: string): Promise<Course | null>;
}
