import { Component, afterNextRender, inject, PLATFORM_ID, ElementRef, viewChild, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Hero section — immersive glassmorphism hero with character-split name animation.
 * Background layers are now handled by the global ParallaxBackground component.
 */
@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <section
      id="hero"
      #heroSection
      class="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <!-- ═══════ MAIN CONTENT ═══════ -->
      <div #contentBlock class="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <!-- Glass container -->
        <div class="glass-hero mx-auto max-w-3xl rounded-3xl px-8 py-12 sm:px-12 sm:py-16">

          <!-- Badge -->
          <div #badge class="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/60
                            bg-indigo-50/80 px-4 py-1.5 opacity-0 backdrop-blur-sm
                            dark:border-indigo-800/60 dark:bg-indigo-950/50">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            <span class="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              {{ 'HERO.GREETING' | translate }}
            </span>
          </div>

          <!-- Name (character-split animation) -->
          <h1 #heroName
            class="mb-6 text-5xl font-black tracking-tight text-slate-900 opacity-0
                   dark:text-white sm:text-7xl lg:text-8xl">
            <span class="inline-block">{{ 'HERO.NAME' | translate }}</span>
          </h1>

          <!-- Role with gradient text -->
          <div class="mb-8 h-12 sm:h-14">
            <h2 #heroRole
              class="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text
                     text-2xl font-bold text-transparent opacity-0 sm:text-3xl lg:text-4xl">
              {{ 'HERO.ROLE' | translate }}
            </h2>
          </div>

          <!-- Subtitle -->
          <p #subtitle
            class="mx-auto mb-10 max-w-2xl text-lg text-slate-500 opacity-0 dark:text-slate-400 sm:text-xl">
            {{ 'HERO.SUBTITLE' | translate }}
          </p>

          <!-- CTAs -->
          <div #ctaContainer class="flex flex-col items-center gap-4 opacity-0 sm:flex-row sm:justify-center">
            <a href="#projects"
              class="glow-border group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5
                     text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all
                     hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/30">
              {{ 'HERO.CTA_PROJECTS' | translate }}
              <svg class="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a href="#contact"
              class="inline-flex items-center gap-2 rounded-full border border-slate-300/60
                     bg-white/60 px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm
                     backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md
                     dark:border-slate-600/60 dark:bg-slate-800/60 dark:text-slate-200">
              {{ 'HERO.CTA_CONTACT' | translate }}
            </a>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
        <div #scrollIndicator class="flex flex-col items-center gap-2 opacity-0">
          <span class="text-[10px] font-medium uppercase tracking-widest text-slate-400">Scroll</span>
          <div class="flex h-10 w-6 justify-center rounded-full border-2 border-slate-300/60 dark:border-slate-600/60">
            <div class="mt-2 h-2 w-1 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"></div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroSection implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  // Content refs
  private readonly contentBlock = viewChild<ElementRef>('contentBlock');
  private readonly badge = viewChild<ElementRef>('badge');
  private readonly heroName = viewChild<ElementRef>('heroName');
  private readonly heroRole = viewChild<ElementRef>('heroRole');
  private readonly subtitle = viewChild<ElementRef>('subtitle');
  private readonly ctaContainer = viewChild<ElementRef>('ctaContainer');
  private readonly scrollIndicator = viewChild<ElementRef>('scrollIndicator');

  private gsapCtx: any;

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      this.gsapCtx = gsap.context(() => {
        /* ── Character-split name animation ── */
        const nameEl = this.heroName()?.nativeElement;
        if (nameEl) {
          const text = nameEl.querySelector('span');
          if (text) {
            const original = text.textContent || '';
            text.innerHTML = '';
            original.split('').forEach((char: string) => {
              const span = document.createElement('span');
              span.textContent = char === ' ' ? '\u00A0' : char;
              span.style.display = 'inline-block';
              span.style.opacity = '0';
              span.classList.add('hero-char');
              text.appendChild(span);
            });
          }
        }

        /* ── Entrance Timeline ── */
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Fade in badge
        tl.to(this.badge()?.nativeElement, { opacity: 1, y: 0, duration: 0.5 }, 0.3);

        // Character stagger for name
        if (nameEl) {
          nameEl.style.opacity = '1';
          tl.fromTo(
            '.hero-char',
            { opacity: 0, y: 40, rotateX: -90 },
            {
              opacity: 1, y: 0, rotateX: 0,
              duration: 0.6, stagger: 0.03, ease: 'back.out(1.7)',
            },
            0.5,
          );
        }

        // Role
        tl.to(this.heroRole()?.nativeElement, { opacity: 1, y: 0, duration: 0.7 }, 0.9);
        // Subtitle
        tl.to(this.subtitle()?.nativeElement, { opacity: 1, y: 0, duration: 0.7 }, 1.1);
        // CTAs
        tl.to(this.ctaContainer()?.nativeElement, { opacity: 1, y: 0, duration: 0.7 }, 1.3);
        // Scroll indicator
        tl.to(this.scrollIndicator()?.nativeElement, { opacity: 1, duration: 0.5 }, 1.6);

        /* ── Scroll parallax for content (fade-out + lift) ── */
        const mm = gsap.matchMedia();
        mm.add('(min-width: 768px)', () => {
          gsap.to(this.contentBlock()?.nativeElement, {
            y: -60, opacity: 0.2,
            scrollTrigger: {
              trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1,
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
