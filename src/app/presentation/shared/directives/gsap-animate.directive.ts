import {
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * GSAP scroll-triggered animation directive.
 *
 * Usage:
 *   <div appGsapAnimate [gsapFrom]="{ y: 60, opacity: 0 }" [gsapDuration]="0.8">
 *
 * SSR-safe: animations only initialize in the browser via `afterNextRender`.
 */
@Directive({
  selector: '[appGsapAnimate]',
  standalone: true,
})
export class GsapAnimateDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  /** GSAP `from` properties */
  readonly gsapFrom = input<Record<string, unknown>>({ y: 40, opacity: 0 });

  /** Animation duration in seconds */
  readonly gsapDuration = input(0.8);

  /** Delay in seconds */
  readonly gsapDelay = input(0);

  /** ScrollTrigger start position */
  readonly gsapStart = input('top 85%');

  private ctx: any; // gsap.Context

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      this.ctx = gsap.context(() => {
        gsap.from(this.el.nativeElement, {
          ...this.gsapFrom(),
          duration: this.gsapDuration(),
          delay: this.gsapDelay(),
          ease: 'power3.out',
          scrollTrigger: {
            trigger: this.el.nativeElement,
            start: this.gsapStart(),
            toggleActions: 'play none none reverse',
          },
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
