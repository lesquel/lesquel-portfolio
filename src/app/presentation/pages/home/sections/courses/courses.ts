import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';
import { TranslateObjPipe } from '../../../../shared/pipes/translate-obj.pipe';
import { CourseRepository } from '../../../../../domain/repositories';
import { Course } from '../../../../../domain/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-courses-section',
  standalone: true,
  imports: [RouterLink, TranslateModule, StaggerRevealDirective, TranslateObjPipe, DatePipe],
  template: `
    <section id="courses" class="py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div appStaggerReveal class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {{ 'COURSES.TITLE' | translate }}
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            {{ 'COURSES.SUBTITLE' | translate }}
          </p>
          <a routerLink="/courses"
             class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600
                    transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
            {{ 'COURSES.VIEW_ALL' | translate }} →
          </a>
        </div>

        <!-- Courses List -->
        @if (loading()) {
          <div class="mx-auto max-w-4xl space-y-6">
            @for (i of [1,2,3]; track i) {
              <div class="glass-card rounded-2xl p-6">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div class="flex-1 space-y-3">
                    <div class="skeleton h-5 w-48"></div>
                    <div class="skeleton h-4 w-32"></div>
                    <div class="skeleton h-3 w-full"></div>
                    <div class="skeleton h-3 w-3/4"></div>
                  </div>
                  <div class="skeleton h-7 w-24 rounded-full"></div>
                </div>
              </div>
            }
          </div>
        } @else {
        <div appStaggerReveal animationType="fade-left" class="mx-auto max-w-4xl space-y-6">
          @for (course of courses(); track course.id) {
            <div
              class="glass-card group rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                    {{ course.name | translateObj }}
                  </h3>
                  @if (course.institution) {
                    <p class="mt-1 text-sm font-medium text-violet-600 dark:text-violet-400">
                      {{ course.institution | translateObj }}
                    </p>
                  }
                  @if (course.description) {
                    <p class="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {{ course.description | translateObj }}
                    </p>
                  }
                </div>
                <div class="flex flex-shrink-0 items-center gap-3">
                  @if (course.completionDate) {
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium
                                 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {{ course.completionDate | date: 'MMM yyyy' }}
                    </span>
                  }
                  @if (course.slug) {
                    <a [routerLink]="['/course', course.slug]"
                       class="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1
                              text-xs font-medium text-violet-700 transition-colors hover:bg-violet-200
                              dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50">
                      {{ 'COURSES.VIEW_DETAIL' | translate }}
                    </a>
                  }
                  @if (course.certificateUrl) {
                    <a [href]="course.certificateUrl" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1
                              text-xs font-medium text-violet-700 transition-colors hover:bg-violet-200
                              dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50">
                      {{ 'COURSES.VIEW_CERTIFICATE' | translate }}
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  }
                </div>
              </div>
            </div>
          }
        </div>
        }
      </div>
    </section>
  `,
})
export class CoursesSection {
  private readonly courseRepo = inject(CourseRepository);
  protected readonly courses = signal<Course[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.loadCourses();
  }

  private async loadCourses(): Promise<void> {
    try {
      this.courses.set(await this.courseRepo.getAllCourses());
    } catch {
      this.courses.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
