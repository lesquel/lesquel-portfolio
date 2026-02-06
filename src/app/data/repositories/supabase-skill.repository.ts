import { Injectable, inject } from '@angular/core';
import { SkillRepository } from '../../domain/repositories';
import { Skill } from '../../domain/models';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { SkillMapper } from '../mappers/portfolio.mapper';
import { SkillDto } from '../models/dtos';

@Injectable()
export class SupabaseSkillRepository extends SkillRepository {
  private readonly supabase = inject(SupabaseService);

  override async getAllSkills(): Promise<Skill[]> {
    const { data, error } = await this.supabase.client
      .from('skills')
      .select('*')
      .order('name');

    if (error) throw error;
    return (data as SkillDto[]).map(SkillMapper.toDomain);
  }

  override async getFeaturedSkills(): Promise<Skill[]> {
    const { data, error } = await this.supabase.client
      .from('skills')
      .select('*')
      .eq('is_featured', true)
      .order('name');

    if (error) throw error;
    return (data as SkillDto[]).map(SkillMapper.toDomain);
  }
}
