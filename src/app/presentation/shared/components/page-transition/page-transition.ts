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
 * Page Transition Component — parallax icon growth effect.
 * Icon zooms from small to viewport-filling size, then reveals new page.
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
        <!-- Background that fills from center -->
        <div
          #backdrop
          class="absolute inset-0"
          [class]="'bg-gradient-to-br ' + transitionService.transitionConfig().color"
        ></div>

        <!-- Icon that grows with parallax -->
        <div #iconContainer class="relative flex items-center justify-center">
          <lucide-icon
            [img]="transitionService.transitionConfig().icon"
            [size]="64"
            [strokeWidth]="1.5"
            class="text-white/90 drop-shadow-2xl"
          />
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

  private animationTimeline: any;

  constructor() {
    effect(() => {
      const isTransitioning = this.transitionService.isTransitioning();
      if (isTransitioning && isPlatformBrowser(this.platformId)) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => this.animateParallax());
        });
      }
    });
  }

  private async animateParallax(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const { gsap } = await import('gsap');

    const overlayEl = this.overlay()?.nativeElement;
    const backdropEl = this.backdrop()?.nativeElement;
    const iconEl = this.iconContainer()?.nativeElement;

    if (!overlayEl || !iconEl) return;

    this.animationTimeline?.kill();

    const tl = gsap.timeline();
    this.animationTimeline = tl;

    // Phase 1: Backdrop expands as a radial clip-path, icon starts small
    if (backdropEl) {
      tl.fromTo(
        backdropEl,
        { clipPath: 'circle(0% at 50% 50%)', opacity: 1 },
        { clipPath: 'circle(75% at 50% 50%)', duration: 0.35, ease: 'power3.out' },
        0
      );
    }

    // Phase 2: Icon scales up with a parallax‐style overshoot
    tl.fromTo(
      iconEl,
      { scale: 0.2, opacity: 0, y: 40 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'back.out(1.4)',
      },
      0.05
    );

    // Phase 3: Icon continues growing past the screen ("parallax growth")
    tl.to(iconEl, {
      scale: 12,
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in',
    }, 0.35);

    // Phase 4: Backdrop fades out
    if (backdropEl) {
      tl.to(
        backdropEl,
        { opacity: 0, duration: 0.15, ease: 'power2.in' },
        0.5
      );
    }
  }

  ngOnDestroy(): void {
    this.animationTimeline?.kill();
  }
}
