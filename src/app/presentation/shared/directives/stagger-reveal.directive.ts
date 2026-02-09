import {
  Directive, ElementRef, inject, input, OnDestroy, afterNextRender, PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Applies staggered scroll-triggered animations to all direct children of the host element.
 * Much more powerful than animating each child individually.
 *
 * Usage:
 *   <div appStaggerReveal [staggerDelay]="0.12" [animationType]="'fade-up'">
 *     <div>child 1</div>
 *     <div>child 2</div>
 *   </div>
 */
@Directive({ selector: '[appStaggerReveal]', standalone: true })
export class StaggerRevealDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly staggerDelay = input(0.12);
  readonly staggerFrom = input<'start' | 'center' | 'edges'>('start');
  readonly animationType = input<'fade-up' | 'fade-left' | 'scale-in' | 'fade-right'>('fade-up');
  readonly staggerStart = input('top 88%');

  private ctx: any;

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const children = Array.from(
        (this.el.nativeElement as HTMLElement).children,
      ) as HTMLElement[];
      if (children.length === 0) return;

      const fromVars = this.getFromVars();

      this.ctx = gsap.context(() => {
        gsap.fromTo(children, fromVars, {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: 0.7,
          stagger: {
            each: this.staggerDelay(),
            from: this.staggerFrom(),
          },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: this.el.nativeElement,
            start: this.staggerStart(),
            toggleActions: 'play none none reverse',
          },
        });
      });
    });
  }

  private getFromVars(): Record<string, unknown> {
    switch (this.animationType()) {
      case 'fade-up':
        return { opacity: 0, y: 50 };
      case 'fade-left':
        return { opacity: 0, x: -60 };
      case 'fade-right':
        return { opacity: 0, x: 60 };
      case 'scale-in':
        return { opacity: 0, scale: 0.8 };
      default:
        return { opacity: 0, y: 50 };
    }
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
