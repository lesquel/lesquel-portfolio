import { Component, inject, signal, OnDestroy, afterNextRender, PLATFORM_ID, ElementRef, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Github, Linkedin, Twitter, Globe, ArrowLeft, FileDown } from 'lucide-angular';
import { TranslateObjPipe } from '../../shared/pipes/translate-obj.pipe';
import { StaggerRevealDirective } from '../../shared/directives/stagger-reveal.directive';
import { SupabaseService } from '../../../core/supabase/supabase.service';
import { LanguageService } from '../../../core/i18n/language.service';
import { SeoService } from '../../../core/seo/seo.service';
import { LocalizedString } from '../../../domain/models';

interface ProfileData {
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

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, TranslateObjPipe, LucideAngularModule, StaggerRevealDirective],
  template: `
    <section class="min-h-screen py-24">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <!-- Back link -->
        <a routerLink="/"
           class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-violet-600
                  transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
          <lucide-icon [img]="arrowLeftIcon" class="h-4 w-4"></lucide-icon>
          {{ 'PROFILE.BACK' | translate }}
        </a>

        @if (loading()) {
          <!-- Skeleton -->
          <div class="space-y-8">
            <div class="glass-hero rounded-3xl p-8 sm:p-12">
              <div class="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                <div class="skeleton h-32 w-32 flex-shrink-0 rounded-3xl sm:h-40 sm:w-40"></div>
                <div class="flex-1 space-y-4 text-center sm:text-left">
                  <div class="skeleton mx-auto h-10 w-64 sm:mx-0"></div>
                  <div class="skeleton mx-auto h-6 w-48 sm:mx-0"></div>
                  <div class="flex justify-center gap-3 sm:justify-start">
                    @for (i of [1,2,3,4]; track i) {
                      <div class="skeleton h-10 w-10 rounded-xl"></div>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div class="glass-card rounded-2xl p-8">
              <div class="skeleton mb-4 h-4 w-24"></div>
              <div class="space-y-3">
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-3/4"></div>
                <div class="skeleton h-4 w-5/6"></div>
              </div>
            </div>
            <div class="glass-card rounded-2xl p-8">
              <div class="skeleton mb-6 h-4 w-32"></div>
              <div class="flex gap-4">
                <div class="skeleton h-12 w-40 rounded-xl"></div>
                <div class="skeleton h-12 w-40 rounded-xl"></div>
              </div>
            </div>
          </div>
        } @else if (profile(); as p) {
          <div appStaggerReveal class="space-y-8">
            <!-- Hero Card -->
            <div #profileCard class="glass-hero overflow-hidden rounded-3xl p-8 sm:p-12">
              <div class="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                <!-- Avatar -->
                @if (p.avatar_url) {
                  <div class="relative flex-shrink-0">
                    <img [src]="p.avatar_url" [alt]="p.full_name"
                         class="h-32 w-32 rounded-3xl border-2 border-white/20 object-cover shadow-xl
                                sm:h-40 sm:w-40" />
                    <div class="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-violet-500/30
                                to-indigo-500/30 blur-md"></div>
                  </div>
                } @else {
                  <div class="flex h-32 w-32 items-center justify-center rounded-3xl
                              bg-gradient-to-br from-violet-500 to-indigo-600 text-5xl
                              font-bold text-white shadow-xl sm:h-40 sm:w-40">
                    {{ p.full_name.charAt(0) }}
                  </div>
                }

                <!-- Info -->
                <div class="flex-1 text-center sm:text-left">
                  <h1 class="mb-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    {{ p.full_name }}
                  </h1>
                  <p class="mb-4 bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-xl
                            font-semibold text-transparent">
                    {{ p.headline | translateObj }}
                  </p>

                  <!-- Social Links -->
                  <div class="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                    @if (p.social_github) {
                      <a [href]="p.social_github" target="_blank" rel="noopener noreferrer"
                         class="glass-subtle flex h-10 w-10 items-center justify-center rounded-xl
                                transition-all hover:scale-110 hover:shadow-lg">
                        <lucide-icon [img]="githubIcon" class="h-5 w-5 text-slate-700 dark:text-slate-300"></lucide-icon>
                      </a>
                    }
                    @if (p.social_linkedin) {
                      <a [href]="p.social_linkedin" target="_blank" rel="noopener noreferrer"
                         class="glass-subtle flex h-10 w-10 items-center justify-center rounded-xl
                                transition-all hover:scale-110 hover:shadow-lg">
                        <lucide-icon [img]="linkedinIcon" class="h-5 w-5 text-blue-600 dark:text-blue-400"></lucide-icon>
                      </a>
                    }
                    @if (p.social_twitter) {
                      <a [href]="p.social_twitter" target="_blank" rel="noopener noreferrer"
                         class="glass-subtle flex h-10 w-10 items-center justify-center rounded-xl
                                transition-all hover:scale-110 hover:shadow-lg">
                        <lucide-icon [img]="twitterIcon" class="h-5 w-5 text-sky-500 dark:text-sky-400"></lucide-icon>
                      </a>
                    }
                    @if (p.social_website) {
                      <a [href]="p.social_website" target="_blank" rel="noopener noreferrer"
                         class="glass-subtle flex h-10 w-10 items-center justify-center rounded-xl
                                transition-all hover:scale-110 hover:shadow-lg">
                        <lucide-icon [img]="globeIcon" class="h-5 w-5 text-emerald-600 dark:text-emerald-400"></lucide-icon>
                      </a>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Bio Card -->
            @if (p.bio) {
              <div class="glass-card rounded-2xl p-8">
                <h2 class="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                  {{ 'PROFILE.ABOUT' | translate }}
                </h2>
                <p class="whitespace-pre-line text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  {{ p.bio | translateObj }}
                </p>
              </div>
            }

            <!-- CV Downloads -->
            @if (p.cv_url || p.cv_url_en) {
              <div class="glass-card rounded-2xl p-8">
                <h2 class="mb-6 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                  {{ 'PROFILE.DOWNLOAD_CV' | translate }}
                </h2>
                <div class="flex flex-wrap gap-4">
                  @if (p.cv_url) {
                    <a [href]="p.cv_url" target="_blank" rel="noopener noreferrer"
                       class="glow-border inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3
                              text-sm font-semibold text-white shadow-lg shadow-violet-500/25
                              transition-all hover:-translate-y-0.5 hover:bg-violet-500">
                      <lucide-icon [img]="fileDownIcon" class="h-4 w-4"></lucide-icon>
                      {{ 'PROFILE.CV_ES' | translate }}
                    </a>
                  }
                  @if (p.cv_url_en) {
                    <a [href]="p.cv_url_en" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-2 rounded-xl border border-slate-300/60
                              bg-white/60 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm
                              backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md
                              dark:border-slate-600/60 dark:bg-slate-800/60 dark:text-slate-200">
                      <lucide-icon [img]="fileDownIcon" class="h-4 w-4"></lucide-icon>
                      {{ 'PROFILE.CV_EN' | translate }}
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <!-- No profile yet -->
          <div class="glass-card rounded-2xl p-12 text-center">
            <h2 class="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
              {{ 'PROFILE.EMPTY_TITLE' | translate }}
            </h2>
            <p class="text-slate-500 dark:text-slate-400">
              {{ 'PROFILE.EMPTY_MSG' | translate }}
            </p>
          </div>
        }
      </div>
    </section>
  `,
})
export class ProfilePage implements OnDestroy {
  private readonly supabase = inject(SupabaseService);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly arrowLeftIcon = ArrowLeft;
  protected readonly githubIcon = Github;
  protected readonly linkedinIcon = Linkedin;
  protected readonly twitterIcon = Twitter;
  protected readonly globeIcon = Globe;
  protected readonly fileDownIcon = FileDown;

  protected readonly loading = signal(true);
  protected readonly profile = signal<ProfileData | null>(null);

  private readonly profileCard = viewChild<ElementRef>('profileCard');
  private gsapCtx: any;

  constructor() {
    this.seo.update({ title: 'Profile' });
    this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    try {
      const { data } = await this.supabase.client
        .from('profile')
        .select('full_name, headline, bio, avatar_url, cv_url, cv_url_en, social_github, social_linkedin, social_twitter, social_website')
        .limit(1)
        .single();

      this.profile.set(data as ProfileData);
    } catch {
      this.profile.set(null);
    } finally {
      this.loading.set(false);
      this.initAnimations();
    }
  }

  private initAnimations(): void {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const { gsap } = await import('gsap');

      this.gsapCtx = gsap.context(() => {
        const card = this.profileCard()?.nativeElement;
        if (card) {
          gsap.fromTo(card,
            { opacity: 0, y: 30, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
          );
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.gsapCtx?.revert();
  }
}
