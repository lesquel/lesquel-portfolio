import { Injectable, inject } from '@angular/core';
import { HobbyRepository } from '../../domain/repositories';
import { Hobby } from '../../domain/models';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { HobbyMapper } from '../mappers/portfolio.mapper';
import { HobbyDto } from '../models/dtos';

@Injectable()
export class SupabaseHobbyRepository extends HobbyRepository {
  private readonly supabase = inject(SupabaseService);

  override async getAllHobbies(): Promise<Hobby[]> {
    const { data, error } = await this.supabase.client
      .from('hobbies')
      .select('*')
      .order('display_order');

    if (error) throw error;
    return (data as HobbyDto[]).map(HobbyMapper.toDomain);
  }
}
