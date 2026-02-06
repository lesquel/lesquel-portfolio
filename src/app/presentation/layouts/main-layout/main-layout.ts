import { Component, afterNextRender, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';

/**
 * Main layout — navbar + scroll progress + content + footer.
 * Initializes Lenis smooth scroll and connects it with GSAP.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <!-- Scroll Progress Bar -->
    <div
      class="scroll-progress"
      [style.transform]="'scaleX(' + scrollProgress() + ')'"
    ></div>

    <app-navbar />

    <main id="main-content" class="pt-16">
      <router-outlet />
    </main>

    <app-footer />
  `,
})
export class MainLayout implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly scrollProgress = signal(0);

  private lenis: any;
  private gsapCtx: any;

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      // Initialize Lenis smooth scroll
      this.lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
      });

      // Connect Lenis with GSAP ScrollTrigger
      this.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time: number) => {
        this.lenis?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // Track scroll progress for the progress bar
      this.lenis.on('scroll', (e: any) => {
        const progress = e.progress ?? 0;
        this.scrollProgress.set(progress);
      });
    });
  }

  ngOnDestroy(): void {
    this.lenis?.destroy();
    this.gsapCtx?.revert();
  }
}
