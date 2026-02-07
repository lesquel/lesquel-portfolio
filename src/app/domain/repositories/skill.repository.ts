import { Skill } from '../models';

/**
 * Abstract repository contract for Skill data access.
 */
export abstract class SkillRepository {
  abstract getAllSkills(): Promise<Skill[]>;
  abstract getFeaturedSkills(): Promise<Skill[]>;
  abstract getSkillBySlug(slug: string): Promise<Skill | null>;
}
