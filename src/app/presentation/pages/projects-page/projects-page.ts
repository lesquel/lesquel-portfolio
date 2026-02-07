import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GsapAnimateDirective } from '../../shared/directives/gsap-animate.directive';
import { TranslateObjPipe } from '../../shared/pipes/translate-obj.pipe';
import { ProjectRepository } from '../../../domain/repositories';
import { Project } from '../../../domain/models';
import { LucideAngularModule, ArrowLeft, ExternalLink } from 'lucide-angular';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, GsapAnimateDirective, TranslateObjPipe, LucideAngularModule],
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
          {{ 'PROJECTS_PAGE.BACK' | translate }}
        </a>

        <!-- Header -->
        <div appGsapAnimate class="mb-16 text-center">
          <h1 class="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
            {{ 'PROJECTS_PAGE.TITLE' | translate }}
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            {{ 'PROJECTS_PAGE.SUBTITLE' | translate }}
          </p>
        </div>

        @if (loading()) {
          <div class="flex items-center justify-center py-32">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent"></div>
          </div>
        } @else if (projects().length > 0) {
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            @for (project of projects(); track project.id; let i = $index) {
              <div
                appGsapAnimate
                [gsapDelay]="i * 0.08"
                class="group overflow-hidden rounded-2xl border border-slate-200 bg-white
                       shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                       dark:border-slate-800 dark:bg-slate-900"
              >
                <!-- Cover Image -->
                @if (project.coverImage) {
                  <div class="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      [src]="project.coverImage"
                      [alt]="project.title | translateObj"
                      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                } @else {
                  <div class="h-48 w-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
                    <span class="text-4xl">🚀</span>
                  </div>
                }

                <!-- Content -->
                <div class="p-6">
                  <!-- Name & Year -->
                  <div class="mb-3 flex items-start justify-between gap-2">
                    <h2 class="flex-1 text-xl font-bold text-slate-900 dark:text-white">
                      {{ project.title | translateObj }}
                    </h2>
                  </div>

                  <!-- Description -->
                  @if (project.description) {
                    <p class="mb-4 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {{ project.description | translateObj }}
                    </p>
                  }

                  <!-- Skills -->
                  @if (project.technologies && project.technologies.length > 0) {
                    <div class="mb-4 flex flex-wrap gap-2">
                      @for (skill of project.technologies.slice(0, 3); track skill.id) {
                        <a
                          [routerLink]="skill.slug ? ['/skill', skill.slug] : null"
                          [class.cursor-pointer]="skill.slug"
                          class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1
                                 text-xs font-medium text-violet-700 transition-colors
                                 hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-300
                                 dark:hover:bg-violet-900/50"
                        >
                          @if (skill.iconUrl) {
                            <img [src]="skill.iconUrl" [alt]="skill.name" class="h-3 w-3 rounded object-contain" />
                          }
                          {{ skill.name }}
                        </a>
                      }
                      @if (project.technologies.length > 3) {
                        <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1
                                    text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          +{{ project.technologies.length - 3 }}
                        </span>
                      }
                    </div>
                  }

                  <!-- Links -->
                  <div class="flex gap-2">
                    <a
                      [routerLink]="project.slug ? ['/project', project.slug] : null"
                      [class.cursor-pointer]="project.slug"
                      class="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-center text-sm font-medium
                             text-white transition-colors hover:bg-violet-700 dark:hover:bg-violet-500"
                    >
                      {{ 'PROJECTS_PAGE.VIEW_DETAIL' | translate }}
                    </a>
                    @if (project.demoUrl) {
                      <a
                        [href]="project.demoUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center justify-center rounded-lg border border-slate-200 bg-white
                               px-4 py-2.5 transition-colors hover:bg-slate-50
                               dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                      >
                        <lucide-icon [img]="externalLinkIcon" [size]="16" />
                      </a>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="py-32 text-center">
            <div class="mb-4 text-6xl">🎨</div>
            <p class="text-lg text-slate-500 dark:text-slate-400">
              {{ 'PROJECTS_PAGE.EMPTY' | translate }}
            </p>
          </div>
        }
      </div>
    </div>
  `,
})
export class ProjectsPage {
  private readonly projectRepo = inject(ProjectRepository);

  protected readonly arrowLeftIcon = ArrowLeft;
  protected readonly externalLinkIcon = ExternalLink;

  protected readonly projects = signal<Project[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.loadProjects();
  }

  private async loadProjects() {
    this.loading.set(true);
    try {
      const data = await this.projectRepo.getPublishedProjects();
      this.projects.set(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
