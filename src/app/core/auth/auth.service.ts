import {
  Injectable,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase/supabase.service';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Authentication service using Supabase Auth.
 * Only the super-admin (you) can log in — protected by Supabase RLS + email check.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  /** Current authenticated user (null if not logged in) */
  readonly user = signal<User | null>(null);
  readonly session = signal<Session | null>(null);
  readonly isAuthenticated = computed(() => !!this.user());
  readonly isLoading = signal(true);

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) {
        this.isLoading.set(false);
        return;
      }

      try {
        // Get initial session from localStorage/cookies
        const { data } = await this.supabase.client.auth.getSession();
        if (data.session) {
          this.session.set(data.session);
          this.user.set(data.session.user);
        } else {
          this.session.set(null);
          this.user.set(null);
        }
      } catch (error) {
        console.error('❌ Error getting initial session:', error);
        this.session.set(null);
        this.user.set(null);
      } finally {
        this.isLoading.set(false);
      }

      // Listen for auth state changes (login/logout/token refresh)
      try {
        this.supabase.client.auth.onAuthStateChange((_event, session) => {
          this.session.set(session);
          this.user.set(session?.user ?? null);
        });
      } catch (error) {
        console.error('❌ Error setting up auth state listener:', error);
      }
    });
  }

  async signInWithEmail(email: string, password: string): Promise<{ error: string | null }> {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    this.session.set(data.session);
    this.user.set(data.user);
    return { error: null };
  }

  async signOut(): Promise<void> {
    await this.supabase.client.auth.signOut();
    this.session.set(null);
    this.user.set(null);
    this.router.navigate(['/admin/login']);
  }

  /** Get user display name or email */
  getDisplayName(): string {
    const u = this.user();
    if (!u) return '';
    return u.user_metadata?.['full_name'] ?? u.email ?? 'Admin';
  }
}
