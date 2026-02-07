import { Project } from '../models';

/**
 * Abstract repository contract for Project data access.
 * The domain layer defines the contract; the data layer implements it.
 */
export abstract class ProjectRepository {
  abstract getPublishedProjects(): Promise<Project[]>;
  abstract getProjectBySlug(slug: string): Promise<Project | null>;
  abstract getProjectsBySkillId(skillId: string): Promise<Project[]>;
}
