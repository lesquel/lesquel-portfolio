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
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { GsapAnimateDirective } from '../../../../shared/directives/gsap-animate.directive';
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
    TranslateModule,
    TranslateObjPipe,
    GsapAnimateDirective,
    ProjectCard,
    TechBadge,
    DialogModule,
  ],
  template: `
    <section id="projects" class="py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div appGsapAnimate class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {{ 'PROJECTS.TITLE' | translate }}
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            {{ 'PROJECTS.SUBTITLE' | translate }}
          </p>
        </div>

        <!-- Bento Grid -->
        @if (projects().length > 0) {
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (project of projects(); track project.id; let i = $index) {
              <div
                appGsapAnimate
                [gsapDelay]="i * 0.1"
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
          class="relative mx-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl
                 bg-white p-6 shadow-2xl dark:bg-slate-800 sm:p-8"
        >
          <!-- Close Button -->
          <button
            (click)="closeDetail()"
            class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full
                   bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200
                   dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
            [attr.aria-label]="'Close'"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
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
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
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
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
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
