import { Injectable, inject, signal, computed } from '@angular/core';
import { ProfileRepository } from '../../domain/repositories';
import { Profile, LocalizedString } from '../../domain/models';
import { LanguageService } from '../i18n/language.service';

/**
 * Global ProfileService - singleton that caches profile data.
 * Used by Hero, Footer, Contact page, and Profile page.
 * Injects ProfileRepository following clean architecture.
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly profileRepo = inject(ProfileRepository);
  private readonly languageService = inject(LanguageService);

  // Reactive state
  private readonly _profile = signal<Profile | null>(null);
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly profile = this._profile.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed convenience getters
  readonly username = computed(() => this._profile()?.username ?? '');
  readonly fullName = computed(() => this._profile()?.fullName ?? '');
  readonly email = computed(() => this._profile()?.email ?? '');
  readonly avatarUrl = computed(() => this._profile()?.avatarUrl ?? null);
  readonly cvUrl = computed(() => this._profile()?.cvUrl ?? null);
  readonly cvUrlEn = computed(() => this._profile()?.cvUrlEn ?? null);
  readonly socialGithub = computed(() => this._profile()?.socialGithub ?? null);
  readonly socialLinkedin = computed(() => this._profile()?.socialLinkedin ?? null);
  readonly socialTwitter = computed(() => this._profile()?.socialTwitter ?? null);
  readonly socialWebsite = computed(() => this._profile()?.socialWebsite ?? null);

  // Localized computed getters (use current language)
  readonly headline = computed(() => {
    const profile = this._profile();
    if (!profile?.headline) return '';
    return this.getLocalizedValue(profile.headline);
  });

  readonly bio = computed(() => {
    const profile = this._profile();
    if (!profile?.bio) return '';
    return this.getLocalizedValue(profile.bio);
  });

  constructor() {
    // Auto-load profile on service creation
    this.loadProfile();
  }

  /**
   * Loads or refreshes profile data from the database.
   */
  async loadProfile(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const profile = await this.profileRepo.getProfile();
      this._profile.set(profile);
    } catch (err) {
      console.error('Failed to load profile:', err);
      this._error.set('Failed to load profile');
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Refreshes profile data (alias for loadProfile).
   */
  async refresh(): Promise<void> {
    return this.loadProfile();
  }

  /**
   * Gets a localized string value based on current language.
   */
  getLocalizedValue(localizedString: LocalizedString): string {
    const lang = this.languageService.currentLang();
    return localizedString[lang] || localizedString['es'] || localizedString['en'] || '';
  }

  /**
   * Gets headline for a specific language.
   */
  getHeadline(lang: string): string {
    const profile = this._profile();
    if (!profile?.headline) return '';
    return profile.headline[lang] || '';
  }

  /**
   * Gets bio for a specific language.
   */
  getBio(lang: string): string {
    const profile = this._profile();
    if (!profile?.bio) return '';
    return profile.bio[lang] || '';
  }

  /**
   * Gets the appropriate CV URL based on language.
   */
  getCvUrl(lang?: string): string | null {
    const profile = this._profile();
    if (!profile) return null;
    const currentLang = lang ?? this.languageService.currentLang();
    return currentLang === 'en' ? profile.cvUrlEn : profile.cvUrl;
  }
}
