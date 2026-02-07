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

    <!-- Stack Marquee — lazy loads when entering viewport -->
    @defer (on viewport) {
      <app-stack-section />
    } @placeholder {
      <div class="py-24"></div>
    }

    <!-- Projects Grid — lazy loads when entering viewport -->
    @defer (on viewport) {
      <app-projects-section />
    } @placeholder {
      <div class="py-24"></div>
    }

    <!-- Hobbies — lazy loads when entering viewport -->
    @defer (on viewport) {
      <app-hobbies-section />
    } @placeholder {
      <div class="py-24"></div>
    }

    <!-- Courses & Certifications — lazy loads when entering viewport -->
    @defer (on viewport) {
      <app-courses-section />
    } @placeholder {
      <div class="py-24"></div>
    }

    <!-- Contact Form — lazy loads when entering viewport -->
    @defer (on viewport) {
      <app-contact-section />
    } @placeholder {
      <div class="py-24"></div>
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
