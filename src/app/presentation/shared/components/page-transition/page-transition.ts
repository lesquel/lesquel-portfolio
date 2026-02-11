import {
  Component,
  inject,
  PLATFORM_ID,
  ElementRef,
  viewChild,
  effect,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { PageTransitionService } from '../../../../core/transitions/page-transition.service';

/**
 * Page Transition Component - displays an animated icon overlay during route changes.
 * Uses GSAP for smooth scale/fade animations.
 */
@Component({
  selector: 'app-page-transition',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    @if (transitionService.isTransitioning()) {
      <div
        #overlay
        class="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center"
      >
        <!-- Background blur -->
        <div
          #backdrop
          class="absolute inset-0 bg-white/60 backdrop-blur-sm dark:bg-slate-900/60"
        ></div>

        <!-- Icon container -->
        <div
          #iconContainer
          class="relative flex items-center justify-center"
        >
          <!-- Glow effect -->
          <div
            #glow
            class="absolute h-32 w-32 rounded-full opacity-50 blur-3xl"
            [class]="'bg-gradient-to-r ' + transitionService.transitionConfig().color"
          ></div>

          <!-- Icon -->
          <div
            #iconWrapper
            class="relative flex h-24 w-24 items-center justify-center rounded-3xl
                   bg-gradient-to-br shadow-2xl sm:h-28 sm:w-28"
            [class]="transitionService.transitionConfig().color"
          >
            <lucide-icon
              [img]="transitionService.transitionConfig().icon"
              [size]="48"
              [strokeWidth]="1.5"
              class="text-white"
            />
          </div>
        </div>
      </div>
    }
  `,
})
export class PageTransitionComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly transitionService = inject(PageTransitionService);

  private readonly overlay = viewChild<ElementRef>('overlay');
  private readonly backdrop = viewChild<ElementRef>('backdrop');
  private readonly iconContainer = viewChild<ElementRef>('iconContainer');
  private readonly iconWrapper = viewChild<ElementRef>('iconWrapper');
  private readonly glow = viewChild<ElementRef>('glow');

  private gsapInstance: any;
  private animationTimeline: any;

  constructor() {
    // React to transition state changes
    effect(() => {
      const isTransitioning = this.transitionService.isTransitioning();

      if (isTransitioning && isPlatformBrowser(this.platformId)) {
        // Small delay to ensure DOM is ready
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.animateIn();
          });
        });
      }
    });
  }

  private async animateIn(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const { gsap } = await import('gsap');
    this.gsapInstance = gsap;

    const overlayEl = this.overlay()?.nativeElement;
    const backdropEl = this.backdrop()?.nativeElement;
    const iconContainerEl = this.iconContainer()?.nativeElement;
    const iconWrapperEl = this.iconWrapper()?.nativeElement;
    const glowEl = this.glow()?.nativeElement;

    if (!overlayEl || !iconContainerEl) return;

    // Kill any existing animation
    this.animationTimeline?.kill();

    // Create animation timeline
    this.animationTimeline = gsap.timeline();

    // Backdrop fade in
    if (backdropEl) {
      this.animationTimeline.fromTo(
        backdropEl,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.out' },
        0
      );
    }

    // Icon scale up from center
    if (iconWrapperEl) {
      this.animationTimeline.fromTo(
        iconWrapperEl,
        { scale: 0.3, opacity: 0, rotate: -15 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.4,
          ease: 'back.out(1.7)',
        },
        0.1
      );
    }

    // Glow pulse
    if (glowEl) {
      this.animationTimeline.fromTo(
        glowEl,
        { scale: 0.5, opacity: 0 },
        { scale: 1.2, opacity: 0.6, duration: 0.5, ease: 'power2.out' },
        0.15
      );
    }

    // After a moment, animate out
    this.animationTimeline.to(
      [iconWrapperEl, glowEl],
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      },
      0.45
    );

    if (backdropEl) {
      this.animationTimeline.to(
        backdropEl,
        { opacity: 0, duration: 0.2, ease: 'power2.in' },
        0.5
      );
    }
  }

  ngOnDestroy(): void {
    this.animationTimeline?.kill();
  }
}
