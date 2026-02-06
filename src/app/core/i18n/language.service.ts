import {
  Injectable,
  signal,
  inject,
  PLATFORM_ID,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLang = 'es' | 'en';

const STORAGE_KEY = 'portfolio-lang';
const DEFAULT_LANG: SupportedLang = 'es';
const SUPPORTED: SupportedLang[] = ['es', 'en'];

/**
 * Manages the active language with Signals.
 *
 * - Integrates with ngx-translate for static texts.
 * - Exposes `currentLang` Signal for the JSONB TranslateObj pipe.
 * - Persists preference in localStorage.
 * - Updates `<html lang="...">` attribute.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);

  /** Currently active language */
  readonly currentLang = signal<SupportedLang>(DEFAULT_LANG);

  constructor() {
    // Configure ngx-translate defaults
    this.translate.addLangs(SUPPORTED);
    this.translate.setDefaultLang(DEFAULT_LANG);

    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      // 1. Saved preference
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLang | null;
      if (saved && SUPPORTED.includes(saved)) {
        this.setLang(saved);
        return;
      }

      // 2. Browser language detection
      const browserLang = navigator.language?.split('-')[0] as SupportedLang;
      if (SUPPORTED.includes(browserLang)) {
        this.setLang(browserLang);
        return;
      }

      // 3. Fallback
      this.setLang(DEFAULT_LANG);
    });

    // Apply default immediately for SSR
    this.translate.use(DEFAULT_LANG);
  }

  setLang(lang: SupportedLang): void {
    this.currentLang.set(lang);
    this.translate.use(lang);

    // Update <html lang>
    this.document.documentElement.setAttribute('lang', lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  /** Toggle between supported languages */
  toggle(): void {
    const idx = SUPPORTED.indexOf(this.currentLang());
    const next = SUPPORTED[(idx + 1) % SUPPORTED.length];
    this.setLang(next);
  }
}
