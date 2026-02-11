import { Hobby } from '../models';

/**
 * Abstract repository contract for Hobby data access.
 */
export abstract class HobbyRepository {
  abstract getAllHobbies(): Promise<Hobby[]>;
  abstract getHobbyBySlug(slug: string): Promise<Hobby | null>;
}
