import { Profile } from '../models';

/**
 * Abstract repository contract for Profile data access.
 * Profile is a singleton entity - only one row exists in the database.
 */
export abstract class ProfileRepository {
  /**
   * Fetches the single profile record from the database.
   * @returns The profile data or null if not found.
   */
  abstract getProfile(): Promise<Profile | null>;

  /**
   * Creates or updates the profile record.
   * @param profile The profile data to upsert.
   */
  abstract upsertProfile(profile: Partial<Profile>): Promise<void>;
}
