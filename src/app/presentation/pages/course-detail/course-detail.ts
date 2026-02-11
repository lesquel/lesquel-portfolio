import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateObjPipe } from '../../shared/pipes/translate-obj.pipe';
import { StaggerRevealDirective } from '../../shared/directives/stagger-reveal.directive';
import { CourseRepository } from '../../../domain/repositories';
import { Course } from '../../../domain/models';
import { LucideAngularModule, ArrowLeft, ExternalLink, GraduationCap, Calendar } from 'lucide-angular';

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe, TranslateModule, TranslateObjPipe, StaggerRevealDirective, LucideAngularModule],
  template: `
    <div class="min-h-screen pt-24 pb-16">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <!-- Back Link -->
        <a
          routerLink="/courses"
          class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500
                 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
        >
          <lucide-icon [img]="arrowLeftIcon" [size]="16" />
          {{ 'COURSE_DETAIL.BACK' | translate }}
        </a>

        @if (loading()) {
          <!-- Skeleton -->
          <div class="space-y-8">
            <div class="flex items-center gap-6">
              <div class="skeleton h-20 w-20 rounded-2xl"></div>
              <div class="space-y-3 flex-1">
                <div class="skeleton h-8 w-2/3"></div>
                <div class="skeleton h-5 w-1/3"></div>
              </div>
            </div>
            <div class="skeleton h-7 w-32 rounded-full"></div>
            <div class="space-y-3">
              <div class="skeleton h-5 w-full"></div>
              <div class="skeleton h-5 w-3/4"></div>
              <div class="skeleton h-5 w-full"></div>
              <div class="skeleton h-5 w-2/3"></div>
            </div>
            <div class="skeleton h-12 w-48 rounded-full"></div>
          </div>
        } @else if (course()) {
          <!-- Hero -->
          <div appStaggerReveal class="mb-8">
            <div class="flex items-center gap-6">
              <div
                class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl
                       bg-gradient-to-br from-violet-100 to-purple-100 text-4xl
                       dark:from-violet-900/30 dark:to-purple-900/30"
              >
                🎓
              </div>
              <div>
                <h1 class="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                  {{ course()!.name | translateObj }}
                </h1>
                @if (course()!.institution) {
                  <p class="mt-2 flex items-center gap-2 text-lg font-medium text-violet-600 dark:text-violet-400">
                    <lucide-icon [img]="graduationCapIcon" [size]="18" />
                    {{ course()!.institution | translateObj }}
                  </p>
                }
              </div>
            </div>
          </div>

          <!-- Date -->
          @if (course()!.completionDate) {
            <div appStaggerReveal class="mb-8">
              <span class="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm
                           font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                <lucide-icon [img]="calendarIcon" [size]="14" />
                {{ course()!.completionDate | date: 'MMMM yyyy' }}
              </span>
            </div>
          }

          <!-- Description -->
          @if (course()!.description) {
            <div appStaggerReveal class="mb-12">
              <h2 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                {{ 'COURSE_DETAIL.ABOUT' | translate }}
              </h2>
              <div class="prose prose-slate max-w-none dark:prose-invert leading-relaxed text-slate-600 dark:text-slate-400">
                <p>{{ course()!.description | translateObj }}</p>
              </div>
            </div>
          }

          <!-- Certificate -->
          @if (course()!.certificateUrl) {
            <div appStaggerReveal>
              <a
                [href]="course()!.certificateUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3
                       text-sm font-semibold text-white transition-all hover:bg-violet-700
                       hover:shadow-lg hover:shadow-violet-600/25"
              >
                {{ 'COURSE_DETAIL.VIEW_CERTIFICATE' | translate }}
                <lucide-icon [img]="externalLinkIcon" [size]="16" />
              </a>
            </div>
          }
        } @else {
          <!-- Not Found -->
          <div class="py-32 text-center">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ 'COURSE_DETAIL.NOT_FOUND' | translate }}
            </h2>
            <p class="mt-2 text-slate-500 dark:text-slate-400">
              {{ 'COURSE_DETAIL.NOT_FOUND_MESSAGE' | translate }}
            </p>
            <a
              routerLink="/"
              class="mt-6 inline-block rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium
                     text-white transition-colors hover:bg-violet-700"
            >
              {{ 'COURSE_DETAIL.GO_HOME' | translate }}
            </a>
          </div>
        }
      </div>
    </div>
  `,
})
export class CourseDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly courseRepo = inject(CourseRepository);

  protected readonly arrowLeftIcon = ArrowLeft;
  protected readonly externalLinkIcon = ExternalLink;
  protected readonly graduationCapIcon = GraduationCap;
  protected readonly calendarIcon = Calendar;
  protected readonly course = signal<Course | null>(null);
  protected readonly loading = signal(true);

  constructor() {
    this.route.paramMap.subscribe(async (params) => {
      const slug = params.get('slug');
      if (!slug) {
        this.loading.set(false);
        return;
      }
      await this.loadCourse(slug);
    });
  }

  private async loadCourse(slug: string): Promise<void> {
    this.loading.set(true);
    try {
      const course = await this.courseRepo.getCourseBySlug(slug);
      this.course.set(course);
    } catch {
      this.course.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
