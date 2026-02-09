import {
  Directive, ElementRef, inject, input, OnDestroy, afterNextRender, PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Adds a 3D tilt + glow spotlight effect on hover using GSAP.
 * Desktop-only — disabled on touch devices.
 *
 * Usage: <div appTilt [tiltMax]="12" [tiltScale]="1.02" [tiltGlare]="true">
 */
@Directive({ selector: '[appTilt]', standalone: true })
export class TiltDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly tiltMax = input(10);
  readonly tiltScale = input(1.03);
  readonly tiltGlare = input(true);

  private glareEl: HTMLDivElement | null = null;
  private rafId: number | null = null;
  private gsapRef: any;
  private active = false;

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;
      // Only on non-touch desktop
      if (window.matchMedia('(pointer: coarse)').matches) return;
      if (window.innerWidth < 768) return;

      this.gsapRef = (await import('gsap')).gsap;
      this.setup();
    });
  }

  private setup(): void {
    const el = this.el.nativeElement as HTMLElement;
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';

    if (this.tiltGlare()) {
      this.glareEl = document.createElement('div');
      Object.assign(this.glareEl.style, {
        position: 'absolute',
        inset: '0',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        opacity: '0',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25), transparent 60%)',
        transition: 'opacity 0.3s ease',
        zIndex: '10',
      });
      el.style.position = el.style.position || 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(this.glareEl);
    }

    el.addEventListener('mouseenter', this.onEnter, { passive: true });
    el.addEventListener('mousemove', this.onMove, { passive: true });
    el.addEventListener('mouseleave', this.onLeave, { passive: true });
    this.active = true;
  }

  private onEnter = (): void => {
    const gsap = this.gsapRef;
    if (!gsap) return;
    gsap.to(this.el.nativeElement, {
      scale: this.tiltScale(),
      duration: 0.3,
      ease: 'power2.out',
    });
    if (this.glareEl) {
      this.glareEl.style.opacity = '1';
    }
  };

  private onMove = (e: MouseEvent): void => {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      const el = this.el.nativeElement as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const max = this.tiltMax();

      const rotateX = (0.5 - y) * max;
      const rotateY = (x - 0.5) * max;

      this.gsapRef?.to(el, {
        rotateX,
        rotateY,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      if (this.glareEl) {
        this.glareEl.style.background =
          `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.2), transparent 60%)`;
      }
    });
  };

  private onLeave = (): void => {
    const gsap = this.gsapRef;
    if (!gsap) return;
    gsap.to(this.el.nativeElement, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
    });
    if (this.glareEl) {
      this.glareEl.style.opacity = '0';
    }
  };

  ngOnDestroy(): void {
    if (!this.active) return;
    const el = this.el.nativeElement as HTMLElement;
    el.removeEventListener('mouseenter', this.onEnter);
    el.removeEventListener('mousemove', this.onMove);
    el.removeEventListener('mouseleave', this.onLeave);
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    if (this.glareEl) this.glareEl.remove();
  }
}
