import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StaggerRevealDirective } from '../../shared/directives/stagger-reveal.directive';
import { TranslateObjPipe } from '../../shared/pipes/translate-obj.pipe';
import { CourseRepository } from '../../../domain/repositories';
import { Course } from '../../../domain/models';
import { LucideAngularModule, ArrowLeft, ExternalLink, GraduationCap } from 'lucide-angular';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [RouterLink, DatePipe, TranslateModule, StaggerRevealDirective, TranslateObjPipe, LucideAngularModule],
  template: `
    <div class="min-h-screen pt-24 pb-16">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <!-- Back -->
        <a
          routerLink="/"
          class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500
                 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
        >
          <lucide-icon [img]="arrowLeftIcon" [size]="16" />
          {{ 'COURSES_PAGE.BACK' | translate }}
        </a>

        <!-- Header -->
        <div appStaggerReveal class="mb-16 text-center">
          <h1 class="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
            {{ 'COURSES_PAGE.TITLE' | translate }}
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            {{ 'COURSES_PAGE.SUBTITLE' | translate }}
          </p>
        </div>

        @if (loading()) {
          <!-- Skeleton timeline -->
          <div class="relative">
            <div class="absolute left-8 top-0 hidden h-full w-px bg-slate-200 dark:bg-slate-700 sm:block"></div>
            <div class="space-y-8">
              @for (i of [1,2,3,4]; track i) {
                <div class="relative sm:pl-20">
                  <div class="absolute left-6 top-8 hidden h-5 w-5 items-center justify-center sm:flex">
                    <div class="skeleton h-3 w-3 rounded-full"></div>
                  </div>
                  <div class="glass-card rounded-2xl p-6 sm:p-8">
                    <div class="skeleton mb-3 h-6 w-28 rounded-full"></div>
                    <div class="skeleton mb-2 h-6 w-56"></div>
                    <div class="skeleton mb-4 h-4 w-36"></div>
                    <div class="space-y-2">
                      <div class="skeleton h-3 w-full"></div>
                      <div class="skeleton h-3 w-4/5"></div>
                    </div>
                    <div class="skeleton mt-5 h-9 w-40 rounded-full"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        } @else if (courses().length > 0) {
          <!-- Timeline -->
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-violet-500 via-purple-500 to-transparent sm:block"></div>

            <div class="space-y-8">
              @for (course of courses(); track course.id; let i = $index) {
                <div
                  appStaggerReveal
                  class="group relative sm:pl-20"
                >
                  <!-- Timeline dot -->
                  <div class="absolute left-6 top-8 hidden h-5 w-5 items-center justify-center sm:flex">
                    <div class="h-3 w-3 rounded-full bg-violet-500 ring-4 ring-violet-100 transition-all
                                duration-300 group-hover:h-4 group-hover:w-4 dark:ring-violet-900/50"></div>
                  </div>

                  <div class="glass-card overflow-hidden rounded-2xl
                              transition-all duration-300 hover:shadow-xl">
                    <div class="p-6 sm:p-8">
                      <!-- Date badge -->
                      @if (course.completionDate) {
                        <span class="mb-3 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold
                                     text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                          {{ course.completionDate | date: 'MMMM yyyy' }}
                        </span>
                      }

                      <!-- Title & Institution -->
                      <h2 class="text-xl font-bold text-slate-900 dark:text-white">
                        {{ course.name | translateObj }}
                      </h2>
                      @if (course.institution) {
                        <p class="mt-1 flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
                          <lucide-icon [img]="graduationCapIcon" [size]="14" />
                          {{ course.institution | translateObj }}
                        </p>
                      }

                      <!-- Description -->
                      @if (course.description) {
                        <p class="mt-4 leading-relaxed text-slate-500 dark:text-slate-400">
                          {{ course.description | translateObj }}
                        </p>
                      }

                      <!-- Certificate link -->
                      @if (course.certificateUrl) {
                        <a
                          [href]="course.certificateUrl"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="mt-5 inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2
                                 text-sm font-semibold text-white transition-all hover:bg-violet-700
                                 hover:shadow-lg hover:shadow-violet-600/25"
                        >
                          {{ 'COURSES_PAGE.VIEW_CERTIFICATE' | translate }}
                          <lucide-icon [img]="externalLinkIcon" [size]="14" />
                        </a>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="py-32 text-center">
            <div class="mb-4 text-6xl">🎓</div>
            <p class="text-lg text-slate-500 dark:text-slate-400">
              {{ 'COURSES_PAGE.EMPTY' | translate }}
            </p>
          </div>
        }
      </div>
    </div>
  `,
})
export class CoursesPage {
  private readonly courseRepo = inject(CourseRepository);

  protected readonly arrowLeftIcon = ArrowLeft;
  protected readonly externalLinkIcon = ExternalLink;
  protected readonly graduationCapIcon = GraduationCap;
  protected readonly courses = signal<Course[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.load();
  }

  private async load(): Promise<void> {
    try {
      this.courses.set(await this.courseRepo.getAllCourses());
    } catch {
      this.courses.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
