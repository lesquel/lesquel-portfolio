import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import type { ProjectDto, SkillDto, CategoryDto, HobbyDto, CourseDto } from '../../data/models/dtos';
import type { LocalizedString } from '../../domain/models/localized-string.model';

/* ──────────────────────────────────────────────
   Admin-specific DTOs (write side)
   ──────────────────────────────────────────── */

export interface ProjectFormData {
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  content: LocalizedString | null;
  image_url: string | null;
  gallery_urls: string[];
  demo_url: string | null;
  repo_url: string | null;
  is_published: boolean;
  display_order: number;
  skill_ids: string[];
}

export interface SkillFormData {
  name: string;
  slug: string | null;
  icon_url: string | null;
  description: LocalizedString | null;
  type: string;
  is_featured: boolean;
  display_order: number;
}

export interface HobbyFormData {
  name: LocalizedString;
  description: LocalizedString | null;
  icon_url: string | null;
  display_order: number;
}

export interface CourseFormData {
  name: LocalizedString;
  institution: LocalizedString | null;
  description: LocalizedString | null;
  certificate_url: string | null;
  completion_date: string | null;
  display_order: number;
}

export interface ProfileData {
  full_name: string;
  headline: LocalizedString;
  bio: LocalizedString;
  avatar_url: string | null;
  cv_url: string | null;
  cv_url_en: string | null;
  social_github: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  social_website: string | null;
}

export interface MessageRow {
  id: string;
  full_name: string;
  email: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalSkills: number;
  totalMessages: number;
  unreadMessages: number;
  totalHobbies: number;
  totalCourses: number;
}

/**
 * Admin-only service — full CRUD for all portfolio content.
 * Uses Supabase client directly (admin bounded context).
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly supabase = inject(SupabaseService);

  /* ───── Dashboard Stats ───── */

  async getDashboardStats(): Promise<DashboardStats> {
    const [projects, skills, messages, hobbies, courses] = await Promise.all([
      this.supabase.client.from('projects').select('id, is_published'),
      this.supabase.client.from('skills').select('id', { count: 'exact', head: true }),
      this.supabase.client.from('messages').select('id, is_read'),
      this.supabase.client.from('hobbies').select('id', { count: 'exact', head: true }),
      this.supabase.client.from('courses').select('id', { count: 'exact', head: true }),
    ]);

    const projectList = (projects.data ?? []) as { id: string; is_published: boolean }[];
    const messageList = (messages.data ?? []) as { id: string; is_read: boolean }[];

    return {
      totalProjects: projectList.length,
      publishedProjects: projectList.filter((p) => p.is_published).length,
      totalSkills: skills.count ?? 0,
      totalMessages: messageList.length,
      unreadMessages: messageList.filter((m) => !m.is_read).length,
      totalHobbies: hobbies.count ?? 0,
      totalCourses: courses.count ?? 0,
    };
  }

  /* ───── Projects CRUD ───── */

  async getAllProjects(): Promise<(ProjectDto & { is_published: boolean })[]> {
    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*, project_skills(skills(*))')
      .order('display_order');

    if (error) throw error;
    return data as (ProjectDto & { is_published: boolean })[];
  }

  async getProjectById(id: string): Promise<ProjectDto | null> {
    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*, project_skills(skill_id, skills(*))')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as ProjectDto;
  }

  async createProject(form: ProjectFormData): Promise<string> {
    const { skill_ids, ...projectData } = form;

    const { data, error } = await this.supabase.client
      .from('projects')
      .insert(projectData)
      .select('id')
      .single();

    if (error) throw error;
    const projectId = data.id;

    if (skill_ids.length > 0) {
      const links = skill_ids.map((sid) => ({ project_id: projectId, skill_id: sid }));
      const { error: linkError } = await this.supabase.client
        .from('project_skills')
        .insert(links);
      if (linkError) throw linkError;
    }

    return projectId;
  }

  async updateProject(id: string, form: ProjectFormData): Promise<void> {
    const { skill_ids, ...projectData } = form;

    const { error } = await this.supabase.client
      .from('projects')
      .update(projectData)
      .eq('id', id);

    if (error) throw error;

    // Replace skill links
    const { error: delErr } = await this.supabase.client
      .from('project_skills')
      .delete()
      .eq('project_id', id);
    if (delErr) throw delErr;

    if (skill_ids.length > 0) {
      const links = skill_ids.map((sid) => ({ project_id: id, skill_id: sid }));
      const { error: linkError } = await this.supabase.client
        .from('project_skills')
        .insert(links);
      if (linkError) throw linkError;
    }
  }

  async deleteProject(id: string): Promise<void> {
    await this.supabase.client.from('project_skills').delete().eq('project_id', id);
    const { error } = await this.supabase.client.from('projects').delete().eq('id', id);
    if (error) throw error;
  }

  async toggleProjectPublished(id: string, published: boolean): Promise<void> {
    const { error } = await this.supabase.client
      .from('projects')
      .update({ is_published: published })
      .eq('id', id);
    if (error) throw error;
  }

  async reorderProjects(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      this.supabase.client.from('projects').update({ display_order: index }).eq('id', id),
    );
    await Promise.all(updates);
  }

  /* ───── Skills CRUD ───── */

  async getAllSkills(): Promise<SkillDto[]> {
    const { data, error } = await this.supabase.client
      .from('skills')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as SkillDto[];
  }

  async getSkillBySlug(slug: string): Promise<SkillDto | null> {
    const { data, error } = await this.supabase.client
      .from('skills')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as SkillDto;
  }

  async createSkill(form: SkillFormData): Promise<string> {
    const { data, error } = await this.supabase.client
      .from('skills')
      .insert(form)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async updateSkill(id: string, form: SkillFormData): Promise<void> {
    const { error } = await this.supabase.client
      .from('skills')
      .update(form)
      .eq('id', id);
    if (error) throw error;
  }

  async deleteSkill(id: string): Promise<void> {
    await this.supabase.client.from('project_skills').delete().eq('skill_id', id);
    const { error } = await this.supabase.client.from('skills').delete().eq('id', id);
    if (error) throw error;
  }

  async toggleSkillFeatured(id: string, featured: boolean): Promise<void> {
    const { error } = await this.supabase.client
      .from('skills')
      .update({ is_featured: featured })
      .eq('id', id);
    if (error) throw error;
  }

  /* ───── Hobbies CRUD ───── */

  async getAllHobbies(): Promise<HobbyDto[]> {
    const { data, error } = await this.supabase.client
      .from('hobbies')
      .select('*')
      .order('display_order');

    if (error) throw error;
    return data as HobbyDto[];
  }

  async createHobby(form: HobbyFormData): Promise<string> {
    const { data, error } = await this.supabase.client
      .from('hobbies')
      .insert(form)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async updateHobby(id: string, form: HobbyFormData): Promise<void> {
    const { error } = await this.supabase.client
      .from('hobbies')
      .update(form)
      .eq('id', id);
    if (error) throw error;
  }

  async deleteHobby(id: string): Promise<void> {
    const { error } = await this.supabase.client.from('hobbies').delete().eq('id', id);
    if (error) throw error;
  }

  /* ───── Courses CRUD ───── */

  async getAllCourses(): Promise<CourseDto[]> {
    const { data, error } = await this.supabase.client
      .from('courses')
      .select('*')
      .order('display_order');

    if (error) throw error;
    return data as CourseDto[];
  }

  async createCourse(form: CourseFormData): Promise<string> {
    const { data, error } = await this.supabase.client
      .from('courses')
      .insert(form)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async updateCourse(id: string, form: CourseFormData): Promise<void> {
    const { error } = await this.supabase.client
      .from('courses')
      .update(form)
      .eq('id', id);
    if (error) throw error;
  }

  async deleteCourse(id: string): Promise<void> {
    const { error } = await this.supabase.client.from('courses').delete().eq('id', id);
    if (error) throw error;
  }

  /* ───── Messages ───── */

  async getAllMessages(): Promise<MessageRow[]> {
    const { data, error } = await this.supabase.client
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as MessageRow[];
  }

  async markMessageRead(id: string, read: boolean): Promise<void> {
    const { error } = await this.supabase.client
      .from('messages')
      .update({ is_read: read })
      .eq('id', id);
    if (error) throw error;
  }

  async deleteMessage(id: string): Promise<void> {
    const { error } = await this.supabase.client.from('messages').delete().eq('id', id);
    if (error) throw error;
  }

  /* ───── Profile ───── */

  async getProfile(): Promise<ProfileData | null> {
    const { data, error } = await this.supabase.client
      .from('profile')
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as ProfileData;
  }

  async upsertProfile(profile: ProfileData): Promise<void> {
    const { error } = await this.supabase.client
      .from('profile')
      .upsert(profile, { onConflict: 'id' });
    if (error) throw error;
  }

  /* ───── Storage (Image / File Upload) ───── */

  async uploadImage(file: File, bucket: string = 'portfolio'): Promise<string> {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `images/${fileName}`;

    const { error } = await this.supabase.client.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data } = this.supabase.client.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async uploadFile(file: File, folder: string = 'files', bucket: string = 'portfolio'): Promise<string> {
    const ext = file.name.split('.').pop() ?? 'pdf';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await this.supabase.client.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data } = this.supabase.client.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async deleteImage(url: string, bucket: string = 'portfolio'): Promise<void> {
    const parts = url.split(`/storage/v1/object/public/${bucket}/`);
    if (parts.length < 2) return;
    const path = parts[1];

    await this.supabase.client.storage.from(bucket).remove([path]);
  }
}
