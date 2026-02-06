import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { LocalizedString } from '../../../domain/models';

/**
 * Translates a JSONB LocalizedString object using the current language.
 *
 * Usage:
 *   {{ project.title | translateObj }}
 *
 * Pure: false — reacts to language signal changes.
 * Falls back to English, then first available key.
 */
@Pipe({
  name: 'translateObj',
  standalone: true,
  pure: false,
})
export class TranslateObjPipe implements PipeTransform {
  private readonly langService = inject(LanguageService);

  transform(value: LocalizedString | null | undefined): string {
    if (!value) return '';

    const lang = this.langService.currentLang();

    // Try current language → English fallback → first available value
    return value[lang] ?? value['en'] ?? Object.values(value)[0] ?? '';
  }
}
