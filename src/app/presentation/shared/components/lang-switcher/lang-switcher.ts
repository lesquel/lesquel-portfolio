import { Component, inject } from '@angular/core';
import { LanguageService, SupportedLang } from '../../../../core/i18n/language.service';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  template: `
    <button
      (click)="lang.toggle()"
      [attr.aria-label]="'Switch language'"
      class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium
             transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
    >
      <span class="text-base">{{ flags[lang.currentLang()] }}</span>
      <span class="hidden sm:inline uppercase tracking-wide">{{ lang.currentLang() }}</span>
    </button>
  `,
})
export class LangSwitcher {
  protected readonly lang = inject(LanguageService);

  protected readonly flags: Record<SupportedLang, string> = {
    es: '🇪🇸',
    en: '🇬🇧',
  };
}
