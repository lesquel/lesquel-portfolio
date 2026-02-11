import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateObjPipe } from '../../shared/pipes/translate-obj.pipe';
import { StaggerRevealDirective } from '../../shared/directives/stagger-reveal.directive';
import { TechBadge } from '../../shared/components/tech-badge/tech-badge';
import { ProjectRepository } from '../../../domain/repositories';
import { Project } from '../../../domain/models';
import { LucideAngularModule, ArrowLeft, ExternalLink, Github } from 'lucide-angular';

@Component({
  selector: 'app-project-detail-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, TranslateObjPipe, StaggerRevealDirective, TechBadge, LucideAngularModule],
  template: `
    <div class="min-h-screen pt-24 pb-16">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <!-- Back Link -->
        <a
          routerLink="/projects"
          class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500
                 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
        >
          <lucide-icon [img]="arrowLeftIcon" [size]="16" />
          {{ 'PROJECT_DETAIL.BACK' | translate }}
        </a>

        @if (loading()) {
          <!-- Skeleton -->
          <div class="space-y-8">
            <div class="skeleton aspect-video w-full rounded-2xl"></div>
            <div class="space-y-4">
              <div class="skeleton h-10 w-2/3"></div>
              <div class="skeleton h-5 w-full"></div>
              <div class="skeleton h-5 w-3/4"></div>
            </div>
            <div class="flex gap-2">
              <div class="skeleton h-8 w-20 rounded-full"></div>
              <div class="skeleton h-8 w-24 rounded-full"></div>
              <div class="skeleton h-8 w-16 rounded-full"></div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="skeleton h-48 rounded-xl"></div>
              <div class="skeleton h-48 rounded-xl"></div>
            </div>
          </div>
        } @else if (project()) {
          <!-- Hero Image -->
          @if (project()!.coverImage) {
            <div appStaggerReveal class="mb-8 overflow-hidden rounded-2xl">
              <img
                [src]="project()!.coverImage"
                [alt]="project()!.title | translateObj"
                class="h-auto w-full object-cover"
              />
            </div>
          }

          <!-- Title -->
          <div appStaggerReveal class="mb-6">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              {{ project()!.title | translateObj }}
            </h1>
          </div>

          <!-- Description -->
          <div appStaggerReveal class="mb-8">
            <p class="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              {{ project()!.description | translateObj }}
            </p>
          </div>

          <!-- Tech Stack -->
          @if (project()!.technologies.length > 0) {
            <div appStaggerReveal class="mb-8">
              <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {{ 'PROJECT_DETAIL.TECHNOLOGIES' | translate }}
              </h2>
              <div class="flex flex-wrap gap-2">
                @for (tech of project()!.technologies; track tech.id) {
                  <a
                    [routerLink]="tech.slug ? ['/skill', tech.slug] : null"
                    [class.cursor-pointer]="tech.slug"
                  >
                    <app-tech-badge [name]="tech.name" [iconUrl]="tech.iconUrl" />
                  </a>
                }
              </div>
            </div>
          }

          <!-- Action Buttons -->
          <div appStaggerReveal class="mb-12 flex flex-wrap gap-3">
            @if (project()!.demoUrl) {
              <a
                [href]="project()!.demoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2.5
                       text-sm font-semibold text-white transition-colors hover:bg-violet-700"
              >
                {{ 'PROJECT_DETAIL.LIVE_DEMO' | translate }}
                <lucide-icon [img]="externalLinkIcon" [size]="16" />
              </a>
            }
            @if (project()!.repoUrl) {
              <a
                [href]="project()!.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white
                       px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50
                       dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {{ 'PROJECT_DETAIL.SOURCE_CODE' | translate }}
                <lucide-icon [img]="githubIcon" [size]="16" />
              </a>
            }
          </div>

          <!-- Long Content -->
          @if (project()!.content) {
            <div appStaggerReveal class="mb-12">
              <h2 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                {{ 'PROJECT_DETAIL.ABOUT' | translate }}
              </h2>
              <div class="prose prose-slate max-w-none dark:prose-invert leading-relaxed text-slate-600 dark:text-slate-400">
                <p>{{ project()!.content | translateObj }}</p>
              </div>
            </div>
          }

          <!-- Gallery -->
          @if (project()!.galleryUrls.length > 0) {
            <div appStaggerReveal class="mb-12">
              <h2 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                {{ 'PROJECT_DETAIL.GALLERY' | translate }}
              </h2>
              <div class="grid gap-4 sm:grid-cols-2">
                @for (img of project()!.galleryUrls; track img) {
                  <img
                    [src]="img"
                    [alt]="project()!.title | translateObj"
                    class="rounded-xl object-cover transition-transform duration-300 hover:scale-[1.02]"
                    loading="lazy"
                  />
                }
              </div>
            </div>
          }
        } @else {
          <!-- Not Found -->
          <div class="py-32 text-center">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ 'PROJECT_DETAIL.NOT_FOUND' | translate }}
            </h2>
            <p class="mt-2 text-slate-500 dark:text-slate-400">
              {{ 'PROJECT_DETAIL.NOT_FOUND_MESSAGE' | translate }}
            </p>
            <a
              routerLink="/"
              class="mt-6 inline-block rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium
                     text-white transition-colors hover:bg-violet-700"
            >
              {{ 'PROJECT_DETAIL.GO_HOME' | translate }}
            </a>
          </div>
        }
      </div>
    </div>
  `,
})
export class ProjectDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly projectRepo = inject(ProjectRepository);

  protected readonly arrowLeftIcon = ArrowLeft;
  protected readonly externalLinkIcon = ExternalLink;
  protected readonly githubIcon = Github;
  protected readonly project = signal<Project | null>(null);
  protected readonly loading = signal(true);

  constructor() {
    this.route.paramMap.subscribe(async (params) => {
      const slug = params.get('slug');
      if (!slug) {
        this.loading.set(false);
        return;
      }
      await this.loadProject(slug);
    });
  }

  private async loadProject(slug: string): Promise<void> {
    this.loading.set(true);
    try {
      const project = await this.projectRepo.getProjectBySlug(slug);
      this.project.set(project);
    } catch {
      this.project.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
