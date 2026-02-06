import { Injectable, inject } from '@angular/core';
import { ProjectRepository } from '../../domain/repositories';
import { Project } from '../../domain/models';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { ProjectMapper } from '../mappers/portfolio.mapper';
import { ProjectDto } from '../models/dtos';

@Injectable()
export class SupabaseProjectRepository extends ProjectRepository {
  private readonly supabase = inject(SupabaseService);

  override async getPublishedProjects(): Promise<Project[]> {
    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*, project_skills(skills(*))')
      .eq('is_published', true)
      .order('display_order');

    if (error) throw error;
    return (data as ProjectDto[]).map(ProjectMapper.toDomain);
  }

  override async getProjectBySlug(slug: string): Promise<Project | null> {
    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*, project_skills(skills(*))')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return ProjectMapper.toDomain(data as ProjectDto);
  }
}
