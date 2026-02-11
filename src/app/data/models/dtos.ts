import { LocalizedString } from '../../domain/models';

/**
 * Data Transfer Object — exact shape from Supabase `projects` table.
 */
export interface ProjectDto {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  content: LocalizedString | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  demo_url: string | null;
  repo_url: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  project_skills?: { skills: SkillDto }[];
}

/**
 * DTO for `skills` table.
 */
export interface SkillDto {
  id: string;
  name: string;
  slug: string | null;
  icon_url: string | null;
  description: LocalizedString | null;
  type: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

/**
 * DTO for `messages` table (insert only).
 */
export interface MessageDto {
  full_name: string;
  email: string;
  content: string;
}

/**
 * DTO for `categories` table.
 */
export interface CategoryDto {
  id: string;
  name: LocalizedString;
  slug: string;
  created_at: string;
}

/**
 * DTO for `hobbies` table.
 */
export interface HobbyDto {
  id: string;
  slug: string | null;
  name: LocalizedString;
  description: LocalizedString | null;
  content: LocalizedString | null;
  icon_url: string | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  display_order: number;
  created_at: string;
}

/**
 * DTO for `courses` table.
 */
export interface CourseDto {
  id: string;
  slug: string | null;
  name: LocalizedString;
  institution: LocalizedString | null;
  description: LocalizedString | null;
  certificate_url: string | null;
  completion_date: string | null;
  display_order: number;
  created_at: string;
}
