import { Component, inject, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeroSection } from './sections/hero/hero';
import { StackSection } from './sections/stack/stack';
import { ProjectsSection } from './sections/projects/projects';
import { HobbiesSection } from './sections/hobbies/hobbies';
import { CoursesSection } from './sections/courses/courses';
import { ContactSection } from './sections/contact/contact';
import { SeoService } from '../../../core/seo/seo.service';

/**
 * Home page — orchestrates all sections with @defer for below-the-fold optimization.
 * Hero loads immediately; remaining sections load on viewport entry.
 */
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeroSection, StackSection, ProjectsSection, HobbiesSection, CoursesSection, ContactSection],
  template: `
    <!-- Hero — above the fold, loads immediately -->
    <app-hero-section />

    <!-- Stack Marquee -->
    @defer (on viewport) {
      <app-stack-section />
    } @placeholder {
      <div class="overflow-hidden py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-16 flex flex-col items-center gap-3">
            <div class="skeleton mx-auto h-8 w-56"></div>
            <div class="skeleton mx-auto h-5 w-72"></div>
          </div>
          <div class="flex gap-10 py-4">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="flex flex-shrink-0 flex-col items-center gap-3 rounded-2xl px-5 py-4">
                <div class="skeleton h-14 w-14 rounded-xl"></div>
                <div class="skeleton h-3 w-16"></div>
              </div>
            }
          </div>
        </div>
      </div>
    }

    <!-- Projects Grid -->
    @defer (on viewport) {
      <app-projects-section />
    } @placeholder {
      <div class="py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-16 flex flex-col items-center gap-3">
            <div class="skeleton mx-auto h-8 w-48"></div>
            <div class="skeleton mx-auto h-5 w-64"></div>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (i of [1,2,3]; track i) {
              <div class="glass-card overflow-hidden rounded-2xl" [class.sm:col-span-2]="i === 1" [class.lg:col-span-2]="i === 1">
                <div class="skeleton h-48 w-full !rounded-none"></div>
                <div class="space-y-3 p-6">
                  <div class="skeleton h-5 w-3/4"></div>
                  <div class="skeleton h-4 w-full"></div>
                  <div class="flex gap-2">
                    <div class="skeleton h-6 w-16 rounded-full"></div>
                    <div class="skeleton h-6 w-20 rounded-full"></div>
                    <div class="skeleton h-6 w-14 rounded-full"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }

    <!-- Hobbies -->
    @defer (on viewport) {
      <app-hobbies-section />
    } @placeholder {
      <div class="py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-16 flex flex-col items-center gap-3">
            <div class="skeleton mx-auto h-8 w-44"></div>
            <div class="skeleton mx-auto h-5 w-60"></div>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (i of [1,2,3]; track i) {
              <div class="glass-card rounded-2xl p-6">
                <div class="flex items-center gap-4">
                  <div class="skeleton h-12 w-12 rounded-xl"></div>
                  <div class="skeleton h-5 w-32"></div>
                </div>
                <div class="mt-4 space-y-2">
                  <div class="skeleton h-3 w-full"></div>
                  <div class="skeleton h-3 w-4/5"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }

    <!-- Courses & Certifications -->
    @defer (on viewport) {
      <app-courses-section />
    } @placeholder {
      <div class="py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-16 flex flex-col items-center gap-3">
            <div class="skeleton mx-auto h-8 w-52"></div>
            <div class="skeleton mx-auto h-5 w-64"></div>
          </div>
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
        </div>
      </div>
    }

    <!-- Contact Form -->
    @defer (on viewport) {
      <app-contact-section />
    } @placeholder {
      <div class="py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-16 flex flex-col items-center gap-3">
            <div class="skeleton mx-auto h-8 w-40"></div>
            <div class="skeleton mx-auto h-5 w-56"></div>
          </div>
          <div class="mx-auto max-w-2xl glass-card rounded-2xl p-8">
            <div class="space-y-5">
              <div class="skeleton h-12 w-full rounded-lg"></div>
              <div class="skeleton h-12 w-full rounded-lg"></div>
              <div class="skeleton h-32 w-full rounded-lg"></div>
              <div class="skeleton h-12 w-40 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class HomePage {
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    // Set SEO defaults for the home page
    this.seo.update();
    this.seo.setPersonSchema(
      'Lesquel',
      'Full Stack Developer',
      typeof window !== 'undefined' ? window.location.origin : 'https://lesquel.dev',
    );
  }
}
