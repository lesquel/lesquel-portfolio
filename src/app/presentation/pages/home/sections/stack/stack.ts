import { Component, inject, signal, afterNextRender, PLATFORM_ID, ElementRef, viewChild, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';
import { SkillRepository } from '../../../../../domain/repositories';
import { Skill } from '../../../../../domain/models';

/**
 * Stack section — GSAP-driven scroll-speed marquee with glassmorphism badges.
 * Speed increases as user scrolls past the section.
 */
@Component({
  selector: 'app-stack-section',
  standalone: true,
  imports: [RouterLink, TranslateModule, StaggerRevealDirective],
  template: `
    <section id="stack" class="overflow-hidden py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div appStaggerReveal class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {{ 'STACK.TITLE' | translate }}
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            {{ 'STACK.SUBTITLE' | translate }}
          </p>
          <a routerLink="/technologies"
             class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600
                    transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
            {{ 'STACK.VIEW_ALL' | translate }} →
          </a>
        </div>

        <!-- Marquee -->
        <div class="relative">
          <!-- Gradient Edges -->
          <div
            class="pointer-events-none absolute inset-y-0 left-0 z-10 w-24
                   bg-gradient-to-r from-white/90 dark:from-slate-950/90"
          ></div>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 z-10 w-24
                   bg-gradient-to-l from-white/90 dark:from-slate-950/90"
          ></div>

          <!-- Marquee Track (GSAP-driven) -->
          <div #marqueeTrack class="flex gap-10 py-4 will-change-transform">
            @for (skill of doubledSkills(); track $index) {
              <a
                [routerLink]="skill.slug ? ['/skill', skill.slug] : null"
                class="glass-subtle flex flex-shrink-0 flex-col items-center gap-3 rounded-2xl
                       px-5 py-4 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                [class.cursor-pointer]="skill.slug"
              >
                @if (skill.iconUrl) {
                  <img
                    [src]="skill.iconUrl"
                    [alt]="skill.name"
                    class="h-12 w-12 opacity-60 grayscale transition-all duration-300
                           hover:opacity-100 hover:grayscale-0 sm:h-14 sm:w-14"
                    loading="lazy"
                  />
                } @else {
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-xl
                           bg-violet-100/80 text-xs font-bold text-violet-600
                           dark:bg-violet-900/40 dark:text-violet-300 sm:h-14 sm:w-14"
                  >
                    {{ skill.name.substring(0, 2).toUpperCase() }}
                  </div>
                }
                <span class="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {{ skill.name }}
                </span>
              </a>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class StackSection implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly skillRepo = inject(SkillRepository);

  private readonly marqueeTrack = viewChild<ElementRef>('marqueeTrack');

  protected readonly featuredSkills = signal<Skill[]>([]);
  protected readonly doubledSkills = signal<Skill[]>([]);

  private gsapCtx: any;

  constructor() {
    this.loadSkills();
  }

  private async loadSkills(): Promise<void> {
    try {
      const skills = await this.skillRepo.getFeaturedSkills();
      const data = skills.length > 0 ? skills : this.getPlaceholderSkills();
      this.featuredSkills.set(data);
      // Triple for seamless loop
      this.doubledSkills.set([...data, ...data, ...data]);
      this.initMarquee();
    } catch {
      const data = this.getPlaceholderSkills();
      this.featuredSkills.set(data);
      this.doubledSkills.set([...data, ...data, ...data]);
      this.initMarquee();
    }
  }

  private initMarquee(): void {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const track = this.marqueeTrack()?.nativeElement;
      if (!track) return;

      this.gsapCtx = gsap.context(() => {
        // Calculate total width of one set of skills
        const children = Array.from(track.children) as HTMLElement[];
        const totalItems = this.featuredSkills().length;
        if (totalItems === 0) return;

        // Width of one set (first third of children)
        let oneSetWidth = 0;
        for (let i = 0; i < totalItems; i++) {
          oneSetWidth += children[i]?.offsetWidth ?? 0;
          oneSetWidth += 40; // gap-10 = 2.5rem = 40px
        }

        // Infinite horizontal scroll
        gsap.to(track, {
          x: -oneSetWidth,
          duration: totalItems * 3,
          ease: 'none',
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x: string) => parseFloat(x) % oneSetWidth),
          },
        });

        // Scroll-speed boost: accelerate marquee based on scroll velocity
        ScrollTrigger.create({
          trigger: '#stack',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity());
            const boost = gsap.utils.clamp(1, 4, 1 + velocity / 2000);
            gsap.to(track, { timeScale: boost, duration: 0.3, overwrite: true });
          },
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.gsapCtx?.revert();
  }

  /** Placeholder skills while Supabase is not yet configured */
  private getPlaceholderSkills(): Skill[] {
    const names = [
      'Angular', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL',
      'Node.js', 'GSAP', 'RxJS', 'Git', 'Docker', 'Figma', 'HTML5',
    ];
    return names.map((name, i) => ({
      id: `placeholder-${i}`,
      name,
      slug: null,
      iconUrl: null,
      description: null,
      type: 'frontend' as const,
      isFeatured: true,
      displayOrder: i,
    }));
  }
}
