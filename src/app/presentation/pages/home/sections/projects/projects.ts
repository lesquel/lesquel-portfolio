import {
  Component,
  inject,
  signal,
  afterNextRender,
  PLATFORM_ID,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { LucideAngularModule, X, ExternalLink, Github } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';
import { TiltDirective } from '../../../../shared/directives/tilt.directive';
import { TranslateObjPipe } from '../../../../shared/pipes/translate-obj.pipe';
import { ProjectCard } from '../../../../shared/components/project-card/project-card';
import { TechBadge } from '../../../../shared/components/tech-badge/tech-badge';
import { ProjectRepository } from '../../../../../domain/repositories';
import { Project, LocalizedString } from '../../../../../domain/models';

/**
 * Projects section — Bento grid of project cards with modal detail view.
 */
@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    TranslateObjPipe,
    StaggerRevealDirective,
    TiltDirective,
    ProjectCard,
    TechBadge,
    DialogModule,
    LucideAngularModule,
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
        @if (projects().length > 0) {
          <div appStaggerReveal staggerFrom="center" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (project of projects(); track project.id; let i = $index) {
              <div
                appTilt
                [class.sm:col-span-2]="i === 0"
                [class.lg:col-span-2]="i === 0"
              >
                <app-project-card
                  [project]="project"
                  (cardClick)="openDetail(project)"
                />
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

    <!-- Project Detail Modal Template -->
    <ng-template #projectModal>
      @if (selectedProject(); as project) {
        <div
          class="glass-card relative mx-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl
                 p-6 shadow-2xl sm:p-8"
        >
          <!-- Close Button -->
          <button
            (click)="closeDetail()"
            class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full
                   bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200
                   dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
            [attr.aria-label]="'Close'"
          >
            <lucide-icon
              [img]="xIcon"
              class="h-4 w-4"
            ></lucide-icon>
          </button>

          <!-- Cover Image -->
          @if (project.coverImage) {
            <div class="mb-6 overflow-hidden rounded-xl">
              <img
                [src]="project.coverImage"
                [alt]="project.title | translateObj"
                class="h-auto w-full object-cover"
              />
            </div>
          }

          <!-- Title -->
          <h3 class="mb-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            {{ project.title | translateObj }}
          </h3>

          <!-- Description -->
          <p class="mb-6 text-slate-600 dark:text-slate-400">
            {{ project.description | translateObj }}
          </p>

          <!-- Long Content (if available) -->
          @if (project.content) {
            <div class="prose mb-6 max-w-none dark:prose-invert">
              <p>{{ project.content | translateObj }}</p>
            </div>
          }

          <!-- Tech Stack -->
          @if (project.technologies.length) {
            <div class="mb-6">
              <h4 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {{ 'PROJECTS.TECHNOLOGIES' | translate }}
              </h4>
              <div class="flex flex-wrap gap-2">
                @for (tech of project.technologies; track tech.id) {
                  <app-tech-badge [name]="tech.name" [iconUrl]="tech.iconUrl" />
                }
              </div>
            </div>
          }

          <!-- Gallery -->
          @if (project.galleryUrls.length) {
            <div class="mb-6 grid gap-3 sm:grid-cols-2">
              @for (img of project.galleryUrls; track img) {
                <img
                  [src]="img"
                  [alt]="project.title | translateObj"
                  class="rounded-lg object-cover"
                  loading="lazy"
                />
              }
            </div>
          }

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3">
            @if (project.demoUrl) {
              <a
                [href]="project.demoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5
                       text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {{ 'PROJECTS.LIVE_DEMO' | translate }}
                <lucide-icon
                  [img]="externalLinkIcon"
                  class="h-4 w-4"
                ></lucide-icon>
              </a>
            }
            @if (project.repoUrl) {
              <a
                [href]="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white
                       px-6 py-2.5 text-sm font-semibold text-slate-700
                       transition-colors hover:bg-slate-50
                       dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200
                       dark:hover:bg-slate-600"
              >
                {{ 'PROJECTS.VIEW_CODE' | translate }}
                <lucide-icon
                  [img]="githubIcon"
                  class="h-4 w-4"
                ></lucide-icon>
              </a>
            }
          </div>
        </div>
      }
    </ng-template>
  `,
})
export class ProjectsSection {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly projectRepo = inject(ProjectRepository);
  private readonly dialog = inject(Dialog);

  // Lucide Icons
  protected readonly xIcon = X;
  protected readonly externalLinkIcon = ExternalLink;
  protected readonly githubIcon = Github;

  private readonly projectModal = viewChild<TemplateRef<unknown>>('projectModal');

  protected readonly projects = signal<Project[]>([]);
  protected readonly selectedProject = signal<Project | null>(null);

  private dialogRef: any;

  constructor() {
    this.loadProjects();
  }

  private async loadProjects(): Promise<void> {
    try {
      const projects = await this.projectRepo.getPublishedProjects();
      this.projects.set(projects);
    } catch {
      // Supabase not configured yet — show empty state
      this.projects.set([]);
    }
  }

  openDetail(project: Project): void {
    this.selectedProject.set(project);
    const tpl = this.projectModal();
    if (tpl) {
      this.dialogRef = this.dialog.open(tpl, {
        panelClass: 'fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4',
        hasBackdrop: false,
      });
    }
  }

  closeDetail(): void {
    this.dialogRef?.close();
    this.selectedProject.set(null);
  }
}
