import { Project, Skill, Hobby, Course } from '../../domain/models';
import { ProjectDto, HobbyDto, CourseDto } from '../models/dtos';

/**
 * Maps Supabase ProjectDto → Domain Project entity.
 */
export class ProjectMapper {
  static toDomain(dto: ProjectDto): Project {
    return {
      id: dto.id,
      slug: dto.slug,
      title: dto.title,
      description: dto.description,
      content: dto.content,
      coverImage: dto.image_url ?? '',
      galleryUrls: dto.gallery_urls ?? [],
      demoUrl: dto.demo_url,
      repoUrl: dto.repo_url,
      displayOrder: dto.display_order,
      technologies: dto.project_skills
        ? dto.project_skills.map((ps) => SkillMapper.toDomain(ps.skills))
        : [],
      createdAt: new Date(dto.created_at),
    };
  }
}

/**
 * Maps Supabase SkillDto → Domain Skill entity.
 */
export class SkillMapper {
  static toDomain(dto: {
    id: string;
    name: string;
    slug?: string | null;
    icon_url: string | null;
    description?: any;
    type: string;
    is_featured: boolean;
    display_order?: number;
  }): Skill {
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug ?? null,
      iconUrl: dto.icon_url,
      description: dto.description ?? null,
      type: dto.type as Skill['type'],
      isFeatured: dto.is_featured,
      displayOrder: dto.display_order ?? 0,
    };
  }
}

/**
 * Maps Supabase HobbyDto → Domain Hobby entity.
 */
export class HobbyMapper {
  static toDomain(dto: HobbyDto): Hobby {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      iconUrl: dto.icon_url,
      displayOrder: dto.display_order,
    };
  }
}

/**
 * Maps Supabase CourseDto → Domain Course entity.
 */
export class CourseMapper {
  static toDomain(dto: CourseDto): Course {
    return {
      id: dto.id,
      name: dto.name,
      institution: dto.institution,
      description: dto.description,
      certificateUrl: dto.certificate_url,
      completionDate: dto.completion_date ? new Date(dto.completion_date) : null,
      displayOrder: dto.display_order,
    };
  }
}
