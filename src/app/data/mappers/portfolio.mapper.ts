import { Project, Skill, Hobby, Course, Profile } from '../../domain/models';
import { ProjectDto, HobbyDto, CourseDto, ProfileDto } from '../models/dtos';

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
      slug: dto.slug ?? null,
      name: dto.name,
      description: dto.description,
      content: dto.content ?? null,
      iconUrl: dto.icon_url,
      coverImage: dto.image_url ?? '',
      galleryUrls: dto.gallery_urls ?? [],
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
      slug: dto.slug ?? null,
      name: dto.name,
      institution: dto.institution,
      description: dto.description,
      certificateUrl: dto.certificate_url,
      completionDate: dto.completion_date ? new Date(dto.completion_date) : null,
      displayOrder: dto.display_order,
    };
  }
}

/**
 * Maps Supabase ProfileDto → Domain Profile entity.
 */
export class ProfileMapper {
  static toDomain(dto: ProfileDto): Profile {
    return {
      id: dto.id,
      userId: dto.user_id,
      username: dto.username ?? '',
      fullName: dto.full_name,
      email: dto.email ?? '',
      headline: dto.headline ?? { es: '', en: '' },
      bio: dto.bio ?? { es: '', en: '' },
      avatarUrl: dto.avatar_url,
      cvUrl: dto.cv_url,
      cvUrlEn: dto.cv_url_en,
      socialGithub: dto.social_github,
      socialLinkedin: dto.social_linkedin,
      socialTwitter: dto.social_twitter,
      socialWebsite: dto.social_website,
      updatedAt: new Date(dto.updated_at),
      createdAt: new Date(dto.created_at),
    };
  }

  static toDto(profile: Partial<Profile>): Partial<ProfileDto> {
    const dto: Partial<ProfileDto> = {};
    if (profile.username !== undefined) dto.username = profile.username;
    if (profile.fullName !== undefined) dto.full_name = profile.fullName;
    if (profile.email !== undefined) dto.email = profile.email;
    if (profile.headline !== undefined) dto.headline = profile.headline;
    if (profile.bio !== undefined) dto.bio = profile.bio;
    if (profile.avatarUrl !== undefined) dto.avatar_url = profile.avatarUrl;
    if (profile.cvUrl !== undefined) dto.cv_url = profile.cvUrl;
    if (profile.cvUrlEn !== undefined) dto.cv_url_en = profile.cvUrlEn;
    if (profile.socialGithub !== undefined) dto.social_github = profile.socialGithub;
    if (profile.socialLinkedin !== undefined) dto.social_linkedin = profile.socialLinkedin;
    if (profile.socialTwitter !== undefined) dto.social_twitter = profile.socialTwitter;
    if (profile.socialWebsite !== undefined) dto.social_website = profile.socialWebsite;
    return dto;
  }
}
