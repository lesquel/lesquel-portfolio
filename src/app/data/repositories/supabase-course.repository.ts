import { Injectable, inject } from '@angular/core';
import { CourseRepository } from '../../domain/repositories';
import { Course } from '../../domain/models';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { CourseMapper } from '../mappers/portfolio.mapper';
import { CourseDto } from '../models/dtos';

@Injectable()
export class SupabaseCourseRepository extends CourseRepository {
  private readonly supabase = inject(SupabaseService);

  override async getAllCourses(): Promise<Course[]> {
    const { data, error } = await this.supabase.client
      .from('courses')
      .select('*')
      .order('display_order');

    if (error) throw error;
    return (data as CourseDto[]).map(CourseMapper.toDomain);
  }

  override async getCourseBySlug(slug: string): Promise<Course | null> {
    const { data, error } = await this.supabase.client
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return CourseMapper.toDomain(data as CourseDto);
  }
}
