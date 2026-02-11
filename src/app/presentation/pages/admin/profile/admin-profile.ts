import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService, type ProfileData } from '../../../../core/admin/admin.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-white">Perfil</h1>
        <p class="mt-1 text-sm text-slate-400">Configura tu información personal que se muestra en el portafolio</p>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      } @else {
        <form (ngSubmit)="saveProfile()" class="space-y-6">
          <!-- Avatar & Name Row -->
          <div class="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Información Personal</h2>
            <div class="flex flex-col items-start gap-6 sm:flex-row">
              <!-- Avatar -->
              <div class="flex flex-col items-center gap-3">
                @if (form.avatar_url) {
                  <img [src]="form.avatar_url" alt="Avatar"
                       class="h-24 w-24 rounded-full border-2 border-slate-700 object-cover" />
                } @else {
                  <div class="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-slate-700 bg-slate-800">
                    <svg class="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                    </svg>
                  </div>
                }
                <label class="cursor-pointer rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400
                              transition-colors hover:border-indigo-500 hover:text-indigo-400">
                  <input type="file" accept="image/*" class="hidden" (change)="onAvatarUpload($event)" />
                  Cambiar foto
                </label>
              </div>

              <!-- Name -->
              <div class="flex-1 space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-xs font-medium text-slate-400">Nombre de usuario (Hero)</label>
                    <input
                      type="text"
                      [(ngModel)]="form.username"
                      name="username"
                      placeholder="Lesquel"
                      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                             placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                    <p class="mt-1 text-xs text-slate-500">Este nombre se muestra en el Hero y Footer</p>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-xs font-medium text-slate-400">Nombre completo</label>
                    <input
                      type="text"
                      [(ngModel)]="form.full_name"
                      name="full_name"
                      placeholder="Tu nombre completo"
                      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                             placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-xs font-medium text-slate-400">Email de contacto</label>
                    <input
                      type="email"
                      [(ngModel)]="form.email"
                      name="email"
                      placeholder="tu@email.com"
                      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                             placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                    <p class="mt-1 text-xs text-slate-500">Se muestra en Footer y página de Contacto</p>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-xs font-medium text-slate-400">Avatar URL (alternativa)</label>
                    <input
                      type="text"
                      [(ngModel)]="form.avatar_url"
                      name="avatar_url"
                      placeholder="https://..."
                      class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                             placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Headline (i18n) -->
          <div class="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Titular / Headline</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Español</label>
                <input
                  type="text"
                  [(ngModel)]="form.headline_es"
                  name="headline_es"
                  placeholder="Desarrollador Full Stack"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">English</label>
                <input
                  type="text"
                  [(ngModel)]="form.headline_en"
                  name="headline_en"
                  placeholder="Full Stack Developer"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Bio (i18n) -->
          <div class="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Biografía</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Español</label>
                <textarea
                  [(ngModel)]="form.bio_es"
                  name="bio_es"
                  rows="5"
                  placeholder="Cuéntale al mundo sobre ti..."
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
                ></textarea>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">English</label>
                <textarea
                  [(ngModel)]="form.bio_en"
                  name="bio_en"
                  rows="5"
                  placeholder="Tell the world about you..."
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">CV / Currículum</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">CV (Español) - PDF</label>
                <div class="flex gap-3">
                  <input
                    type="text"
                    [(ngModel)]="form.cv_url"
                    name="cv_url"
                    placeholder="URL del CV en español"
                    class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <label class="cursor-pointer rounded-lg border border-dashed border-slate-600 px-3 py-2.5 text-sm
                                text-slate-400 transition-colors hover:border-indigo-500 hover:text-indigo-400">
                    <input type="file" accept=".pdf" class="hidden" (change)="onCvUpload($event, 'es')" />
                    📁 Subir
                  </label>
                </div>
                @if (form.cv_url) {
                  <a [href]="form.cv_url" target="_blank" class="mt-1 inline-block text-xs text-indigo-400 hover:text-indigo-300">
                    Ver CV actual →
                  </a>
                }
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">CV (English) - PDF</label>
                <div class="flex gap-3">
                  <input
                    type="text"
                    [(ngModel)]="form.cv_url_en"
                    name="cv_url_en"
                    placeholder="URL del CV en inglés"
                    class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <label class="cursor-pointer rounded-lg border border-dashed border-slate-600 px-3 py-2.5 text-sm
                                text-slate-400 transition-colors hover:border-indigo-500 hover:text-indigo-400">
                    <input type="file" accept=".pdf" class="hidden" (change)="onCvUpload($event, 'en')" />
                    📁 Subir
                  </label>
                </div>
                @if (form.cv_url_en) {
                  <a [href]="form.cv_url_en" target="_blank" class="mt-1 inline-block text-xs text-indigo-400 hover:text-indigo-300">
                    Ver CV actual →
                  </a>
                }
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Redes Sociales</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </label>
                <input
                  type="url"
                  [(ngModel)]="form.social_github"
                  name="social_github"
                  placeholder="https://github.com/username"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </label>
                <input
                  type="url"
                  [(ngModel)]="form.social_linkedin"
                  name="social_linkedin"
                  placeholder="https://linkedin.com/in/username"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X (Twitter)
                </label>
                <input
                  type="url"
                  [(ngModel)]="form.social_twitter"
                  name="social_twitter"
                  placeholder="https://x.com/username"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  Website
                </label>
                <input
                  type="url"
                  [(ngModel)]="form.social_website"
                  name="social_website"
                  placeholder="https://midominio.com"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Error / Success -->
          @if (error()) {
            <div class="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-400">
              {{ error() }}
            </div>
          }
          @if (success()) {
            <div class="rounded-lg border border-emerald-800 bg-emerald-900/30 p-3 text-sm text-emerald-400">
              ¡Perfil actualizado correctamente!
            </div>
          }

          <!-- Save Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              [disabled]="saving()"
              class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium
                     text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              @if (saving()) {
                <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              }
              Guardar Perfil
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export class AdminProfile implements OnInit {
  private readonly admin = inject(AdminService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal(false);

  form = this.emptyForm();

  async ngOnInit(): Promise<void> {
    try {
      const profile = await this.admin.getProfile();
      if (profile) {
        this.form = {
          username: profile.username ?? '',
          full_name: profile.full_name ?? '',
          email: profile.email ?? '',
          headline_es: profile.headline?.['es'] ?? '',
          headline_en: profile.headline?.['en'] ?? '',
          bio_es: profile.bio?.['es'] ?? '',
          bio_en: profile.bio?.['en'] ?? '',
          avatar_url: profile.avatar_url ?? '',
          cv_url: profile.cv_url ?? '',
          cv_url_en: profile.cv_url_en ?? '',
          social_github: profile.social_github ?? '',
          social_linkedin: profile.social_linkedin ?? '',
          social_twitter: profile.social_twitter ?? '',
          social_website: profile.social_website ?? '',
        };
      }
    } catch (err) {
      console.error('Load profile error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async onAvatarUpload(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const url = await this.admin.uploadImage(file);
      this.form.avatar_url = url;
    } catch (err) {
      this.error.set('Error al subir imagen');
    }
  }

  async saveProfile(): Promise<void> {
    this.saving.set(true);
    this.error.set(null);
    this.success.set(false);

    const data: ProfileData = {
      username: this.form.username.trim(),
      full_name: this.form.full_name.trim(),
      email: this.form.email.trim(),
      headline: { es: this.form.headline_es, en: this.form.headline_en },
      bio: { es: this.form.bio_es, en: this.form.bio_en },
      avatar_url: this.form.avatar_url || null,
      cv_url: this.form.cv_url || null,
      cv_url_en: this.form.cv_url_en || null,
      social_github: this.form.social_github || null,
      social_linkedin: this.form.social_linkedin || null,
      social_twitter: this.form.social_twitter || null,
      social_website: this.form.social_website || null,
    };

    try {
      await this.admin.upsertProfile(data);
      this.success.set(true);
      setTimeout(() => this.success.set(false), 3000);
    } catch (err: any) {
      this.error.set(err.message ?? 'Error al guardar el perfil');
    } finally {
      this.saving.set(false);
    }
  }

  private emptyForm() {
    return {
      username: '',
      full_name: '',
      email: '',
      headline_es: '',
      headline_en: '',
      bio_es: '',
      bio_en: '',
      avatar_url: '',
      cv_url: '',
      cv_url_en: '',
      social_github: '',
      social_linkedin: '',
      social_twitter: '',
      social_website: '',
    };
  }

  async onCvUpload(event: Event, lang: 'es' | 'en'): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const url = await this.admin.uploadFile(file, 'cvs');
      if (lang === 'es') {
        this.form.cv_url = url;
      } else {
        this.form.cv_url_en = url;
      }
    } catch (err) {
      this.error.set('Error al subir CV');
    }
  }
}
