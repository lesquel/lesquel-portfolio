import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateObjPipe } from '../../shared/pipes/translate-obj.pipe';
import { GsapAnimateDirective } from '../../shared/directives/gsap-animate.directive';
import { SkillRepository, ProjectRepository } from '../../../domain/repositories';
import { Skill, Project } from '../../../domain/models';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-skill-detail-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, TranslateObjPipe, GsapAnimateDirective, LucideAngularModule],
  template: `
    <div class="min-h-screen pt-24 pb-16">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <!-- Back Link -->
        <a
          routerLink="/"
          fragment="stack"
          class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500
                 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
        >
          <lucide-icon [img]="arrowLeftIcon" [size]="16" />
          {{ 'SKILL_DETAIL.BACK' | translate }}
        </a>

        @if (loading()) {
          <div class="flex items-center justify-center py-32">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent"></div>
          </div>
        } @else if (skill()) {
          <!-- Hero -->
          <div appGsapAnimate class="mb-12 flex items-center gap-6">
            @if (skill()!.iconUrl) {
              <img
                [src]="skill()!.iconUrl"
                [alt]="skill()!.name"
                class="h-20 w-20 rounded-2xl object-contain"
              />
            } @else {
              <div
                class="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100
                       text-2xl font-bold text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
              >
                {{ skill()!.name.substring(0, 2).toUpperCase() }}
              </div>
            }
            <div>
              <h1 class="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                {{ skill()!.name }}
              </h1>
              <span
                class="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium
                       text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              >
                {{ skill()!.type }}
              </span>
            </div>
          </div>

          <!-- Description -->
          @if (skill()!.description) {
            <div appGsapAnimate class="mb-16">
              <h2 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                {{ 'SKILL_DETAIL.ABOUT' | translate }}
              </h2>
              <div class="prose prose-slate max-w-none dark:prose-invert leading-relaxed text-slate-600 dark:text-slate-400">
                {{ skill()!.description | translateObj }}
              </div>
            </div>
          }

          <!-- Related Projects -->
          @if (relatedProjects().length > 0) {
            <div appGsapAnimate>
              <h2 class="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                {{ 'SKILL_DETAIL.RELATED_PROJECTS' | translate }}
              </h2>
              <div class="grid gap-6 sm:grid-cols-2">
                @for (project of relatedProjects(); track project.id) {
                  <div
                    class="group overflow-hidden rounded-2xl border border-slate-200 bg-white
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                           dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                  >
                    @if (project.coverImage) {
                      <div class="aspect-video overflow-hidden">
                        <img
                          [src]="project.coverImage"
                          [alt]="project.title | translateObj"
                          class="h-full w-full object-cover transition-transform duration-500
                                 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    }
                    <div class="p-5">
                      <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                        {{ project.title | translateObj }}
                      </h3>
                      <p class="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">
                        {{ project.description | translateObj }}
                      </p>
                      <div class="mt-4 flex flex-wrap gap-2">
                        @for (tech of project.technologies; track tech.id) {
                          <span
                            class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium
                                   text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          >
                            {{ tech.name }}
                          </span>
                        }
                      </div>
                      <div class="mt-4 flex gap-3">
                        @if (project.demoUrl) {
                          <a
                            [href]="project.demoUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-sm font-medium text-violet-600 hover:text-violet-700
                                   dark:text-violet-400 dark:hover:text-violet-300"
                          >
                            {{ 'SKILL_DETAIL.LIVE_DEMO' | translate }} →
                          </a>
                        }
                        @if (project.repoUrl) {
                          <a
                            [href]="project.repoUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-sm font-medium text-slate-500 hover:text-slate-700
                                   dark:text-slate-400 dark:hover:text-slate-300"
                          >
                            {{ 'SKILL_DETAIL.SOURCE_CODE' | translate }} →
                          </a>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        } @else {
          <!-- Not Found -->
          <div class="py-32 text-center">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ 'SKILL_DETAIL.NOT_FOUND' | translate }}
            </h2>
            <p class="mt-2 text-slate-500 dark:text-slate-400">
              {{ 'SKILL_DETAIL.NOT_FOUND_MESSAGE' | translate }}
            </p>
            <a
              routerLink="/"
              class="mt-6 inline-block rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium
                     text-white transition-colors hover:bg-violet-700"
            >
              {{ 'SKILL_DETAIL.GO_HOME' | translate }}
            </a>
          </div>
        }
      </div>
    </div>
  `,
})
export class SkillDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly skillRepo = inject(SkillRepository);
  private readonly projectRepo = inject(ProjectRepository);

  protected readonly arrowLeftIcon = ArrowLeft;
  protected readonly skill = signal<Skill | null>(null);
  protected readonly relatedProjects = signal<Project[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.route.paramMap.subscribe(async (params) => {
      const slug = params.get('slug');
      if (!slug) {
        this.loading.set(false);
        return;
      }
      await this.loadSkill(slug);
    });
  }

  private async loadSkill(slug: string): Promise<void> {
    this.loading.set(true);
    try {
      const skill = await this.skillRepo.getSkillBySlug(slug);
      this.skill.set(skill);

      if (skill) {
        const projects = await this.projectRepo.getProjectsBySkillId(skill.id);
        this.relatedProjects.set(projects);
      }
    } catch {
      this.skill.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
