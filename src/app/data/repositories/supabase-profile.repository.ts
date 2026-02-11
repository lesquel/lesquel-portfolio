import { Injectable, inject } from '@angular/core';
import { ProfileRepository } from '../../domain/repositories';
import { Profile } from '../../domain/models';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { ProfileMapper } from '../mappers/portfolio.mapper';
import { ProfileDto } from '../models/dtos';

@Injectable()
export class SupabaseProfileRepository extends ProfileRepository {
  private readonly supabase = inject(SupabaseService);

  override async getProfile(): Promise<Profile | null> {
    const { data, error } = await this.supabase.client
      .from('profile')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      // PGRST116 = no rows returned
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return ProfileMapper.toDomain(data as ProfileDto);
  }

  override async upsertProfile(profile: Partial<Profile>): Promise<void> {
    const dto = ProfileMapper.toDto(profile);

    // First, try to get existing profile
    const { data: existing } = await this.supabase.client
      .from('profile')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      // Update existing
      const { error } = await this.supabase.client
        .from('profile')
        .update({ ...dto, updated_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Insert new
      const { error } = await this.supabase.client
        .from('profile')
        .insert(dto);

      if (error) throw error;
    }
  }
}
