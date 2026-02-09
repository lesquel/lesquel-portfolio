import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StaggerRevealDirective } from '../../shared/directives/stagger-reveal.directive';
import { SkillRepository } from '../../../domain/repositories';
import { Skill } from '../../../domain/models';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-technologies-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, StaggerRevealDirective, LucideAngularModule],
  template: `
    <div class="min-h-screen pt-24 pb-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Back -->
        <a
          routerLink="/"
          class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500
                 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
        >
          <lucide-icon [img]="arrowLeftIcon" [size]="16" />
          {{ 'TECHNOLOGIES.BACK' | translate }}
        </a>

        <!-- Header -->
        <div appStaggerReveal class="mb-16 text-center">
          <h1 class="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
            {{ 'TECHNOLOGIES.TITLE' | translate }}
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            {{ 'TECHNOLOGIES.SUBTITLE' | translate }}
          </p>
        </div>

        @if (loading()) {
          <!-- Skeleton -->
          @for (section of [1,2]; track section) {
            <div class="mb-16">
              <div class="mb-6 flex items-center gap-3">
                <div class="skeleton h-8 w-8 rounded-lg"></div>
                <div class="skeleton h-6 w-32"></div>
                <div class="skeleton h-5 w-8 rounded-full"></div>
              </div>
              <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                @for (i of [1,2,3,4]; track i) {
                  <div class="glass-card flex items-center gap-4 rounded-2xl p-4">
                    <div class="skeleton h-10 w-10 rounded-lg"></div>
                    <div class="flex-1 space-y-2">
                      <div class="skeleton h-4 w-24"></div>
                      <div class="skeleton h-3 w-16"></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        } @else {
          <!-- Frontend -->
          @if (frontendSkills().length > 0) {
            <div appStaggerReveal class="mb-16">
              <h2 class="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm dark:bg-blue-900/30">
                  🎨
                </span>
                {{ 'TECHNOLOGIES.FRONTEND' | translate }}
                <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {{ frontendSkills().length }}
                </span>
              </h2>
              <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                @for (skill of frontendSkills(); track skill.id) {
                  <a
                    [routerLink]="skill.slug ? ['/skill', skill.slug] : null"
                    class="glass-card group flex items-center gap-4 rounded-2xl
                           p-4 transition-all duration-300 hover:shadow-lg"
                    [class.cursor-pointer]="skill.slug"
                  >
                    @if (skill.iconUrl) {
                      <img [src]="skill.iconUrl" [alt]="skill.name"
                           class="h-10 w-10 rounded-lg object-contain transition-transform duration-300
                                  group-hover:scale-110" />
                    } @else {
                      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100
                                  text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {{ skill.name.substring(0, 2).toUpperCase() }}
                      </div>
                    }
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-slate-900 dark:text-white truncate">{{ skill.name }}</p>
                      @if (skill.slug) {
                        <p class="text-xs text-violet-500 dark:text-violet-400">{{ 'TECHNOLOGIES.VIEW_DETAIL' | translate }} →</p>
                      }
                    </div>
                  </a>
                }
              </div>
            </div>
          }

          <!-- Backend -->
          @if (backendSkills().length > 0) {
            <div appStaggerReveal class="mb-16">
              <h2 class="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-sm dark:bg-green-900/30">
                  ⚙️
                </span>
                {{ 'TECHNOLOGIES.BACKEND' | translate }}
                <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {{ backendSkills().length }}
                </span>
              </h2>
              <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                @for (skill of backendSkills(); track skill.id) {
                  <a
                    [routerLink]="skill.slug ? ['/skill', skill.slug] : null"
                    class="glass-card group flex items-center gap-4 rounded-2xl
                           p-4 transition-all duration-300 hover:shadow-lg"
                    [class.cursor-pointer]="skill.slug"
                  >
                    @if (skill.iconUrl) {
                      <img [src]="skill.iconUrl" [alt]="skill.name"
                           class="h-10 w-10 rounded-lg object-contain transition-transform duration-300
                                  group-hover:scale-110" />
                    } @else {
                      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100
                                  text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {{ skill.name.substring(0, 2).toUpperCase() }}
                      </div>
                    }
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-slate-900 dark:text-white truncate">{{ skill.name }}</p>
                      @if (skill.slug) {
                        <p class="text-xs text-violet-500 dark:text-violet-400">{{ 'TECHNOLOGIES.VIEW_DETAIL' | translate }} →</p>
                      }
                    </div>
                  </a>
                }
              </div>
            </div>
          }

          <!-- Tools -->
          @if (toolSkills().length > 0) {
            <div appStaggerReveal class="mb-16">
              <h2 class="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm dark:bg-amber-900/30">
                  🛠️
                </span>
                {{ 'TECHNOLOGIES.TOOLS' | translate }}
                <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {{ toolSkills().length }}
                </span>
              </h2>
              <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                @for (skill of toolSkills(); track skill.id) {
                  <a
                    [routerLink]="skill.slug ? ['/skill', skill.slug] : null"
                    class="glass-card group flex items-center gap-4 rounded-2xl
                           p-4 transition-all duration-300 hover:shadow-lg"
                    [class.cursor-pointer]="skill.slug"
                  >
                    @if (skill.iconUrl) {
                      <img [src]="skill.iconUrl" [alt]="skill.name"
                           class="h-10 w-10 rounded-lg object-contain transition-transform duration-300
                                  group-hover:scale-110" />
                    } @else {
                      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100
                                  text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {{ skill.name.substring(0, 2).toUpperCase() }}
                      </div>
                    }
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-slate-900 dark:text-white truncate">{{ skill.name }}</p>
                      @if (skill.slug) {
                        <p class="text-xs text-violet-500 dark:text-violet-400">{{ 'TECHNOLOGIES.VIEW_DETAIL' | translate }} →</p>
                      }
                    </div>
                  </a>
                }
              </div>
            </div>
          }

          <!-- Other -->
          @if (otherSkills().length > 0) {
            <div appStaggerReveal class="mb-16">
              <h2 class="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-sm dark:bg-purple-900/30">
                  💡
                </span>
                {{ 'TECHNOLOGIES.OTHER' | translate }}
                <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {{ otherSkills().length }}
                </span>
              </h2>
              <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                @for (skill of otherSkills(); track skill.id) {
                  <a
                    [routerLink]="skill.slug ? ['/skill', skill.slug] : null"
                    class="glass-card group flex items-center gap-4 rounded-2xl
                           p-4 transition-all duration-300 hover:shadow-lg"
                    [class.cursor-pointer]="skill.slug"
                  >
                    @if (skill.iconUrl) {
                      <img [src]="skill.iconUrl" [alt]="skill.name"
                           class="h-10 w-10 rounded-lg object-contain transition-transform duration-300
                                  group-hover:scale-110" />
                    } @else {
                      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100
                                  text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {{ skill.name.substring(0, 2).toUpperCase() }}
                      </div>
                    }
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-slate-900 dark:text-white truncate">{{ skill.name }}</p>
                      @if (skill.slug) {
                        <p class="text-xs text-violet-500 dark:text-violet-400">{{ 'TECHNOLOGIES.VIEW_DETAIL' | translate }} →</p>
                      }
                    </div>
                  </a>
                }
              </div>
            </div>
          }

          @if (allSkills().length === 0) {
            <div class="py-32 text-center">
              <p class="text-lg text-slate-500 dark:text-slate-400">
                {{ 'TECHNOLOGIES.EMPTY' | translate }}
              </p>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class TechnologiesPage {
  private readonly skillRepo = inject(SkillRepository);

  protected readonly arrowLeftIcon = ArrowLeft;
  protected readonly allSkills = signal<Skill[]>([]);
  protected readonly loading = signal(true);

  protected readonly frontendSkills = computed(() => this.allSkills().filter(s => s.type === 'frontend'));
  protected readonly backendSkills = computed(() => this.allSkills().filter(s => s.type === 'backend'));
  protected readonly toolSkills = computed(() => this.allSkills().filter(s => s.type === 'tool'));
  protected readonly otherSkills = computed(() => this.allSkills().filter(s => s.type === 'other'));

  constructor() {
    this.load();
  }

  private async load(): Promise<void> {
    try {
      this.allSkills.set(await this.skillRepo.getAllSkills());
    } catch {
      this.allSkills.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
