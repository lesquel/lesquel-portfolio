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
  iconUrl: string | null;
  type: 'frontend' | 'backend' | 'tool' | 'other';
  isFeatured: boolean;
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
