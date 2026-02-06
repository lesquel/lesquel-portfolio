import { Project, Skill } from '../../domain/models';
import { ProjectDto } from '../models/dtos';

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
  static toDomain(dto: { id: string; name: string; icon_url: string | null; type: string; is_featured: boolean }): Skill {
    return {
      id: dto.id,
      name: dto.name,
      iconUrl: dto.icon_url,
      type: dto.type as Skill['type'],
      isFeatured: dto.is_featured,
    };
  }
}
