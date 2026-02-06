import { Component, afterNextRender, inject, PLATFORM_ID, ElementRef, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Hero section — animated greeting with typewriter effect,
 * parallax background gradient, and CTA buttons.
 */
@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <section
      id="hero"
      class="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <!-- Animated Gradient Background -->
      <div
        class="animated-gradient absolute inset-0 -z-10
               bg-gradient-to-br from-indigo-50 via-white to-cyan-50
               dark:from-slate-950 dark:via-indigo-950/30 dark:to-slate-900"
      ></div>

      <!-- Floating Shapes (decorative) -->
      <div class="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div
          #floatShape1
          class="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl
                 dark:bg-primary/5"
        ></div>
        <div
          #floatShape2
          class="absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl
                 dark:bg-accent/5"
        ></div>
        <div
          #floatShape3
          class="absolute left-1/2 top-10 h-48 w-48 -translate-x-1/2 rounded-full
                 bg-violet-200/30 blur-3xl dark:bg-violet-800/10"
        ></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <!-- Greeting -->
        <p
          #greeting
          class="mb-4 text-lg font-medium text-primary opacity-0 sm:text-xl"
        >
          {{ 'HERO.GREETING' | translate }}
        </p>

        <!-- Name -->
        <h1
          #heroName
          class="mb-6 text-5xl font-black tracking-tight text-slate-900 opacity-0
                 dark:text-white sm:text-7xl lg:text-8xl"
        >
          {{ 'HERO.NAME' | translate }}
        </h1>

        <!-- Role (Typewriter target) -->
        <div class="mb-8 h-12 sm:h-14">
          <h2
            #heroRole
            class="text-2xl font-bold text-slate-600 opacity-0 dark:text-slate-300 sm:text-3xl lg:text-4xl"
          >
            {{ 'HERO.ROLE' | translate }}
          </h2>
        </div>

        <!-- Subtitle -->
        <p
          #subtitle
          class="mx-auto mb-10 max-w-2xl text-lg text-slate-500 opacity-0
                 dark:text-slate-400 sm:text-xl"
        >
          {{ 'HERO.SUBTITLE' | translate }}
        </p>

        <!-- CTAs -->
        <div #ctaContainer class="flex flex-col items-center gap-4 opacity-0 sm:flex-row sm:justify-center">
          <a
            href="#projects"
            class="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5
                   text-sm font-semibold text-white shadow-lg shadow-primary/25
                   transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-xl
                   hover:shadow-primary/30"
          >
            {{ 'HERO.CTA_PROJECTS' | translate }}
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a
            href="#contact"
            class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white
                   px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm
                   transition-all hover:-translate-y-0.5 hover:shadow-md
                   dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            {{ 'HERO.CTA_CONTACT' | translate }}
          </a>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
        <div class="flex h-10 w-6 justify-center rounded-full border-2 border-slate-400/50 dark:border-slate-600/50">
          <div class="mt-2 h-2 w-1 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"></div>
        </div>
      </div>
    </section>
  `,
})
export class HeroSection {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly greeting = viewChild<ElementRef>('greeting');
  private readonly heroName = viewChild<ElementRef>('heroName');
  private readonly heroRole = viewChild<ElementRef>('heroRole');
  private readonly subtitle = viewChild<ElementRef>('subtitle');
  private readonly ctaContainer = viewChild<ElementRef>('ctaContainer');
  private readonly floatShape1 = viewChild<ElementRef>('floatShape1');
  private readonly floatShape2 = viewChild<ElementRef>('floatShape2');

  private gsapCtx: any;

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      this.gsapCtx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Staggered entrance animation
        tl.to(this.greeting()?.nativeElement, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
          .fromTo(
            this.heroName()?.nativeElement,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8 },
            0.4,
          )
          .to(this.heroRole()?.nativeElement, { opacity: 1, y: 0, duration: 0.6 }, 0.7)
          .to(this.subtitle()?.nativeElement, { opacity: 1, y: 0, duration: 0.6 }, 0.9)
          .to(this.ctaContainer()?.nativeElement, { opacity: 1, y: 0, duration: 0.6 }, 1.1);

        // Parallax floating shapes on scroll (desktop only)
        const mm = gsap.matchMedia();
        mm.add('(min-width: 768px)', () => {
          gsap.to(this.floatShape1()?.nativeElement, {
            y: -100,
            scrollTrigger: {
              trigger: '#hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.5,
            },
          });
          gsap.to(this.floatShape2()?.nativeElement, {
            y: -150,
            scrollTrigger: {
              trigger: '#hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.5,
            },
          });
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.gsapCtx?.revert();
  }
}
