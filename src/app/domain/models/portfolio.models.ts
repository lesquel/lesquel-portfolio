import { LocalizedString } from './localized-string.model';

export interface Project {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  content: LocalizedString | null;
  coverImage: string;
  galleryUrls: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  displayOrder: number;
  technologies: Skill[];
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  slug: string | null;
  iconUrl: string | null;
  description: LocalizedString | null;
  type: 'frontend' | 'backend' | 'tool' | 'other';
  isFeatured: boolean;
  displayOrder: number;
}

export interface ContactMessage {
  fullName: string;
  email: string;
  content: string;
}

export interface Category {
  id: string;
  name: LocalizedString;
  slug: string;
}

export interface Hobby {
  id: string;
  name: LocalizedString;
  description: LocalizedString | null;
  iconUrl: string | null;
  displayOrder: number;
}

export interface Course {
  id: string;
  name: LocalizedString;
  institution: LocalizedString | null;
  description: LocalizedString | null;
  certificateUrl: string | null;
  completionDate: Date | null;
  displayOrder: number;
}
