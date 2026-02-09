import {
  Component, inject, afterNextRender, OnDestroy, PLATFORM_ID, effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MouseTrackService } from '../../../../core/mouse/mouse-track.service';
import { ThemeService } from '../../../../core/theme/theme.service';
import { PARALLAX_ELEMENTS, type ParallaxElement } from '../../utils/parallax-svgs';

const COLOR_MAP: Record<string, { light: string; dark: string }> = {
  primary:  { light: '#6366f1', dark: '#818cf8' },
  accent:   { light: '#06b6d4', dark: '#22d3ee' },
  violet:   { light: '#8b5cf6', dark: '#a78bfa' },
  emerald:  { light: '#10b981', dark: '#34d399' },
  pink:     { light: '#ec4899', dark: '#f472b6' },
};

/**
 * Full-page parallax background with floating neon SVG elements.
 * Three depth layers move at different scroll speeds + react to mouse.
 * Fixed position, covers the entire viewport. Rendered behind all content.
 */
@Component({
  selector: 'app-parallax-bg',
  standalone: true,
  template: `
    <!-- Deep gradient orbs -->
    <div class="parallax-orb parallax-orb--1" aria-hidden="true"></div>
    <div class="parallax-orb parallax-orb--2" aria-hidden="true"></div>
    <div class="parallax-orb parallax-orb--3" aria-hidden="true"></div>

    <!-- Grid overlay -->
    <div class="parallax-grid" aria-hidden="true"></div>

    <!-- SVG floating elements (rendered in ngOnInit via DOM) -->
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      overflow: hidden;
      view-transition-name: parallax-bg;
    }

    .parallax-orb {
      position: absolute;
      border-radius: 50%;
      will-change: transform;
    }

    .parallax-orb--1 {
      width: 600px; height: 600px;
      left: -10%; top: 5%;
      background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
      filter: blur(80px);
    }
    :host-context(.dark) .parallax-orb--1 {
      background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
    }

    .parallax-orb--2 {
      width: 500px; height: 500px;
      right: -8%; bottom: 20%;
      background: radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%);
      filter: blur(100px);
    }
    :host-context(.dark) .parallax-orb--2 {
      background: radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%);
    }

    .parallax-orb--3 {
      width: 400px; height: 400px;
      left: 40%; top: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
      filter: blur(90px);
    }
    :host-context(.dark) .parallax-orb--3 {
      background: radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%);
    }

    .parallax-grid {
      position: absolute; inset: 0;
      opacity: 0.025;
      background-image:
        linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px);
      background-size: 80px 80px;
    }
    :host-context(.dark) .parallax-grid {
      opacity: 0.04;
    }

    .parallax-el {
      position: absolute;
      will-change: transform;
      transition: color 0.3s ease;
    }

    @media (prefers-reduced-motion: reduce) {
      :host { display: none; }
    }
  `],
})
export class ParallaxBackground implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly mouse = inject(MouseTrackService);
  private readonly theme = inject(ThemeService);

  private gsapCtx: any;
  private elements: { el: HTMLElement; data: ParallaxElement }[] = [];

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const host = (this as any).__proto__.constructor;
      // We need to access host element — use ElementRef approach
      await this.buildElements(gsap, ScrollTrigger);
    });

    // React to theme changes for SVG colors
    effect(() => {
      const isDark = this.theme.effectiveTheme() === 'dark';
      this.elements.forEach(({ el, data }) => {
        const colors = COLOR_MAP[data.colorClass] ?? COLOR_MAP['primary'];
        el.style.color = isDark ? colors.dark : colors.light;
      });
    });
  }

  private async buildElements(gsap: any, ScrollTrigger: any): Promise<void> {
    // Get host element
    const hostEl = document.querySelector('app-parallax-bg') as HTMLElement;
    if (!hostEl) return;

    const isDark = this.theme.effectiveTheme() === 'dark';

    // Create SVG floating elements
    // NOTE: styles set inline because Angular view encapsulation won't apply
    // component-scoped CSS to dynamically created DOM elements.
    PARALLAX_ELEMENTS.forEach((data) => {
      const el = document.createElement('div');
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = data.svg;

      const colors = COLOR_MAP[data.colorClass] ?? COLOR_MAP['primary'];
      el.style.position = 'absolute';
      el.style.willChange = 'transform';
      el.style.color = isDark ? colors.dark : colors.light;
      el.style.width = `${data.size}px`;
      el.style.height = `${data.size}px`;
      el.style.left = `${data.x}%`;
      el.style.top = `${data.y}%`;
      el.style.opacity = `${0.15 + (1 - data.depth) * 0.15}`;
      el.style.transform = `rotate(${data.rotation}deg)`;

      hostEl.appendChild(el);
      this.elements.push({ el, data });
    });

    this.gsapCtx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        // Orb parallax
        const orbs = hostEl.querySelectorAll('.parallax-orb');
        if (orbs[0]) {
          gsap.to(orbs[0], {
            y: -150, x: -40,
            scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 2 },
          });
        }
        if (orbs[1]) {
          gsap.to(orbs[1], {
            y: -200, x: 60,
            scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 2.5 },
          });
        }
        if (orbs[2]) {
          gsap.to(orbs[2], {
            y: -100,
            scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 3 },
          });
        }

        // SVG element parallax — each moves based on its depth
        this.elements.forEach(({ el, data }) => {
          const scrollDistance = data.depth * -800;
          const xShift = (Math.random() - 0.5) * 200 * data.depth;

          // Scroll parallax
          gsap.to(el, {
            y: scrollDistance,
            x: xShift,
            rotation: data.rotation + (Math.random() - 0.5) * 40,
            ease: 'none',
            scrollTrigger: {
              trigger: document.body,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1 + (1 - data.depth) * 2,
            },
          });

          // Continuous floating
          gsap.to(el, {
            y: `+=${8 + data.depth * 15}`,
            x: `+=${4 + data.depth * 8}`,
            rotation: `+=${3 + data.depth * 5}`,
            duration: 4 + (1 - data.depth) * 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 3,
          });

          // Fade in/out based on scroll position
          gsap.fromTo(el,
            { opacity: 0 },
            {
              opacity: 0.15 + (1 - data.depth) * 0.15,
              duration: 1,
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'top 70%',
                scrub: true,
              },
            },
          );
        });

        // Mouse parallax — use CSS translate (separate from GSAP transform) to avoid conflicts
        const updateMouse = () => {
          const mx = this.mouse.mouseX();
          const my = this.mouse.mouseY();
          this.elements.forEach(({ el, data }) => {
            const factor = data.depth * 20;
            el.style.translate = `${mx * factor}px ${my * factor}px`;
          });
        };

        gsap.ticker.add(updateMouse);

        return () => {
          gsap.ticker.remove(updateMouse);
        };
      });

      // Mobile: simpler — just floating, no scroll parallax
      mm.add('(max-width: 767px)', () => {
        this.elements.forEach(({ el, data }) => {
          el.style.opacity = `${0.08 + (1 - data.depth) * 0.07}`;
          gsap.to(el, {
            y: `+=${5 + data.depth * 8}`,
            duration: 5 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2,
          });
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.gsapCtx?.revert();
    this.elements.forEach(({ el }) => el.remove());
    this.elements = [];
  }
}
