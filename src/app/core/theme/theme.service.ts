import {
  Injectable,
  signal,
  computed,
  effect,
  PLATFORM_ID,
  inject,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'portfolio-theme';

/**
 * Manages dark/light/system theme with Signals.
 *
 * - Persists user preference in localStorage.
 * - Applies `.dark` class on `<html>` for Tailwind v4 `@custom-variant`.
 * - Listens to OS preference changes when mode is 'system'.
 * - SSR-safe: DOM access only happens inside `afterNextRender`.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  /** User's chosen mode */
  readonly mode = signal<ThemeMode>('system');

  /** Resolved effective theme (never 'system') */
  readonly effectiveTheme = computed<'light' | 'dark'>(() => {
    const m = this.mode();
    if (m !== 'system') return m;
    return this._osDark() ? 'dark' : 'light';
  });

  /** Tracks OS prefers-color-scheme */
  private readonly _osDark = signal(false);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      // Read OS preference
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      this._osDark.set(mql.matches);
      mql.addEventListener('change', (e) => this._osDark.set(e.matches));

      // Restore saved preference
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        this.mode.set(saved);
      }
    });

    // Apply class reactively whenever effectiveTheme changes
    effect(() => {
      const theme = this.effectiveTheme();
      if (isPlatformBrowser(this.platformId)) {
        const html = this.document.documentElement;
        html.classList.toggle('dark', theme === 'dark');
      }
    });
  }

  /** Toggle between light → dark → system → light */
  toggle(): void {
    const order: ThemeMode[] = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(this.mode()) + 1) % order.length];
    this.setMode(next);
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }
}
