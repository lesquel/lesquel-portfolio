import { Component, inject, signal, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GsapAnimateDirective } from '../../../../shared/directives/gsap-animate.directive';
import { SkillRepository } from '../../../../../domain/repositories';
import { Skill } from '../../../../../domain/models';

/**
 * Stack section — infinite marquee carousel of technology logos.
 * Pauses on hover, lights up the hovered icon.
 */
@Component({
  selector: 'app-stack-section',
  standalone: true,
  imports: [RouterLink, TranslateModule, GsapAnimateDirective],
  template: `
    <section id="stack" class="overflow-hidden py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div appGsapAnimate class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {{ 'STACK.TITLE' | translate }}
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            {{ 'STACK.SUBTITLE' | translate }}
          </p>
          <a routerLink="/technologies"
             class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600
                    transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
            {{ 'STACK.VIEW_ALL' | translate }} →
          </a>
        </div>

        <!-- Marquee -->
        <div class="relative">
          <!-- Gradient Edges -->
          <div
            class="pointer-events-none absolute inset-y-0 left-0 z-10 w-24
                   bg-gradient-to-r from-white dark:from-slate-900"
          ></div>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 z-10 w-24
                   bg-gradient-to-l from-white dark:from-slate-900"
          ></div>

          <!-- Marquee Track -->
          <div class="flex animate-marquee gap-12 py-4">
            <!-- Original Set -->
            @for (skill of featuredSkills(); track skill.id) {
              <a
                [routerLink]="skill.slug ? ['/skill', skill.slug] : null"
                class="flex flex-shrink-0 flex-col items-center gap-3 px-4
                       transition-all duration-300 hover:scale-110"
                [class.cursor-pointer]="skill.slug"
              >
                @if (skill.iconUrl) {
                  <img
                    [src]="skill.iconUrl"
                    [alt]="skill.name"
                    class="h-12 w-12 opacity-50 grayscale transition-all duration-300
                           hover:opacity-100 hover:grayscale-0 sm:h-16 sm:w-16"
                    loading="lazy"
                  />
                } @else {
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-xl
                           bg-slate-100 text-xs font-bold text-slate-500
                           transition-colors dark:bg-slate-800 dark:text-slate-400
                           sm:h-16 sm:w-16"
                  >
                    {{ skill.name.substring(0, 2).toUpperCase() }}
                  </div>
                }
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {{ skill.name }}
                </span>
              </a>
            }
            <!-- Duplicate Set (for seamless loop) -->
            @for (skill of featuredSkills(); track skill.id + '-dup') {
              <a
                [routerLink]="skill.slug ? ['/skill', skill.slug] : null"
                class="flex flex-shrink-0 flex-col items-center gap-3 px-4
                       transition-all duration-300 hover:scale-110"
                [class.cursor-pointer]="skill.slug"
              >
                @if (skill.iconUrl) {
                  <img
                    [src]="skill.iconUrl"
                    [alt]="skill.name"
                    class="h-12 w-12 opacity-50 grayscale transition-all duration-300
                           hover:opacity-100 hover:grayscale-0 sm:h-16 sm:w-16"
                    loading="lazy"
                  />
                } @else {
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-xl
                           bg-slate-100 text-xs font-bold text-slate-500
                           transition-colors dark:bg-slate-800 dark:text-slate-400
                           sm:h-16 sm:w-16"
                  >
                    {{ skill.name.substring(0, 2).toUpperCase() }}
                  </div>
                }
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {{ skill.name }}
                </span>
              </a>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class StackSection {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly skillRepo = inject(SkillRepository);

  protected readonly featuredSkills = signal<Skill[]>([]);

  constructor() {
    // Load skills from Supabase
    this.loadSkills();
  }

  private async loadSkills(): Promise<void> {
    try {
      const skills = await this.skillRepo.getFeaturedSkills();
      this.featuredSkills.set(
        skills.length > 0
          ? skills
          : this.getPlaceholderSkills(),
      );
    } catch {
      // Fallback: show placeholder skills if Supabase is not configured
      this.featuredSkills.set(this.getPlaceholderSkills());
    }
  }

  /** Placeholder skills while Supabase is not yet configured */
  private getPlaceholderSkills(): Skill[] {
    const names = [
      'Angular', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL',
      'Node.js', 'GSAP', 'RxJS', 'Git', 'Docker', 'Figma', 'HTML5',
    ];
    return names.map((name, i) => ({
      id: `placeholder-${i}`,
      name,
      slug: null,
      iconUrl: null,
      description: null,
      type: 'frontend' as const,
      isFeatured: true,
      displayOrder: i,
    }));
  }
}
