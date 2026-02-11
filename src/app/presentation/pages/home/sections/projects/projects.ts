import {
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';
import { TiltDirective } from '../../../../shared/directives/tilt.directive';
import { ProjectCard } from '../../../../shared/components/project-card/project-card';
import { ProjectRepository } from '../../../../../domain/repositories';
import { Project } from '../../../../../domain/models';

/**
 * Projects section — Bento grid of project cards with navigation to detail page.
 */
@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    StaggerRevealDirective,
    TiltDirective,
    ProjectCard,
  ],
  template: `
    <section id="projects" class="py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div appStaggerReveal class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {{ 'PROJECTS.TITLE' | translate }}
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            {{ 'PROJECTS.SUBTITLE' | translate }}
          </p>
          <a routerLink="/projects"
             class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600
                    transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
            {{ 'PROJECTS.VIEW_ALL' | translate }} →
          </a>
        </div>

        <!-- Bento Grid -->
        @if (loading()) {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (i of [1,2,3]; track i) {
              <div class="glass-card overflow-hidden rounded-2xl" [class.sm:col-span-2]="i === 1" [class.lg:col-span-2]="i === 1">
                <div class="skeleton h-40 w-full !rounded-none"></div>
                <div class="space-y-2 p-4">
                  <div class="skeleton h-4 w-3/4"></div>
                  <div class="skeleton h-3 w-full"></div>
                  <div class="skeleton h-3 w-2/3"></div>
                  <div class="flex gap-2">
                    <div class="skeleton h-5 w-14 rounded-full"></div>
                    <div class="skeleton h-5 w-16 rounded-full"></div>
                    <div class="skeleton h-5 w-12 rounded-full"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (projects().length > 0) {
          <div appStaggerReveal staggerFrom="center" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (project of projects(); track project.id; let i = $index) {
              <div
                appTilt
                [class.sm:col-span-2]="i === 0"
                [class.lg:col-span-2]="i === 0"
              >
                <app-project-card [project]="project" />
              </div>
            }
          </div>
        } @else {
          <div class="py-20 text-center">
            <p class="text-lg text-slate-500 dark:text-slate-400">
              {{ 'PROJECTS.NO_PROJECTS' | translate }}
            </p>
          </div>
        }
      </div>
    </section>
  `,
})
export class ProjectsSection {
  private readonly projectRepo = inject(ProjectRepository);

  protected readonly projects = signal<Project[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.loadProjects();
  }

  private async loadProjects(): Promise<void> {
    try {
      const projects = await this.projectRepo.getPublishedProjects();
      this.projects.set(projects);
    } catch {
      this.projects.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
