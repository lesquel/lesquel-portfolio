import { Injectable, signal, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { afterNextRender } from '@angular/core';

/**
 * Singleton service that tracks mouse position across the viewport.
 * Exposes normalized coordinates (-1 to 1, relative to center).
 * Uses requestAnimationFrame for optimal performance.
 */
@Injectable({ providedIn: 'root' })
export class MouseTrackService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  /** Normalized mouse X (-1 = left edge, 0 = center, 1 = right edge) */
  readonly mouseX = signal(0);
  /** Normalized mouse Y (-1 = top edge, 0 = center, 1 = bottom edge) */
  readonly mouseY = signal(0);
  /** Raw pixel coordinates */
  readonly rawX = signal(0);
  readonly rawY = signal(0);

  private rafId: number | null = null;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private bound = false;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.init();
    });
  }

  private init(): void {
    if (this.bound) return;
    this.bound = true;

    document.addEventListener('mousemove', this.onMouseMove, { passive: true });
    this.tick();
  }

  private onMouseMove = (e: MouseEvent): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.targetX = (e.clientX / w) * 2 - 1;
    this.targetY = (e.clientY / h) * 2 - 1;
    this.rawX.set(e.clientX);
    this.rawY.set(e.clientY);
  };

  /** Smooth interpolation loop at 60fps */
  private tick = (): void => {
    const lerp = 0.08;
    this.currentX += (this.targetX - this.currentX) * lerp;
    this.currentY += (this.targetY - this.currentY) * lerp;

    this.mouseX.set(this.currentX);
    this.mouseY.set(this.currentY);

    this.rafId = requestAnimationFrame(this.tick);
  };

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.bound) {
      document.removeEventListener('mousemove', this.onMouseMove);
    }
  }
}
