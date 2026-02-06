import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
      <!-- Animated Background — floating tech icons -->
      <div class="absolute inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <!-- Floating device mockups and icons -->
        @for (icon of floatingIcons; track icon.id) {
          <div
            class="floating-icon absolute text-slate-800/30"
            [style.left.%]="icon.x"
            [style.top.%]="icon.y"
            [style.animation-delay]="icon.delay + 's'"
            [style.animation-duration]="icon.duration + 's'"
            [style.font-size.rem]="icon.size"
          >
            <span [innerHTML]="icon.svg"></span>
          </div>
        }

        <!-- Large glowing orbs -->
        <div class="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]"></div>
        <div class="absolute -right-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px]"></div>
        <div class="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-violet-600/8 blur-[80px]"></div>
      </div>

      <!-- Login Card -->
      <div class="relative z-10 w-full max-w-md px-4">
        <div class="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          <!-- Header -->
          <div class="mb-8 text-center">
            <div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p class="mt-2 text-sm text-slate-400">Acceso restringido — Solo administrador</p>
          </div>

          <!-- Form -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label for="email" class="mb-1.5 block text-sm font-medium text-slate-300">
                Correo electrónico
              </label>
              <input
                id="email"
                formControlName="email"
                type="email"
                autocomplete="email"
                placeholder="admin&#64;email.com"
                class="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm
                       text-white placeholder-slate-500 outline-none transition-colors
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label for="password" class="mb-1.5 block text-sm font-medium text-slate-300">
                Contraseña
              </label>
              <input
                id="password"
                formControlName="password"
                type="password"
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm
                       text-white placeholder-slate-500 outline-none transition-colors
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            @if (errorMsg()) {
              <div class="rounded-lg bg-red-900/30 border border-red-800/50 p-3 text-sm text-red-400">
                {{ errorMsg() }}
              </div>
            }

            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3
                     text-sm font-semibold text-white shadow-lg shadow-indigo-600/25
                     transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              @if (loading()) {
                <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Ingresando...
              } @else {
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
                Iniciar Sesión
              }
            </button>
          </form>

          <!-- Footer -->
          <p class="mt-6 text-center text-xs text-slate-500">
            Panel protegido con Supabase Auth
          </p>
        </div>
      </div>
    </div>
  `,
  styles: `
    @keyframes float-up {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 0.3; }
      90% { opacity: 0.3; }
      100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
    .floating-icon {
      animation: float-up 20s linear infinite;
      pointer-events: none;
    }
  `,
})
export class AdminLoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(false);
  protected readonly errorMsg = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /** Floating background icons — tech devices and code symbols */
  protected readonly floatingIcons = this.generateFloatingIcons();

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMsg.set(null);

    const { error } = await this.auth.signInWithEmail(
      this.form.value.email!,
      this.form.value.password!,
    );

    this.loading.set(false);

    if (error) {
      this.errorMsg.set(error);
    } else {
      this.router.navigate(['/admin']);
    }
  }

  private generateFloatingIcons() {
    const svgs = [
      // Monitor/Desktop
      '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"/></svg>',
      // Phone/Mobile
      '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>',
      // Code brackets
      '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/></svg>',
      // Server
      '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z"/></svg>',
      // Globe/Web
      '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg>',
      // Database
      '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/></svg>',
      // Terminal
      '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/></svg>',
      // Tablet
      '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z"/></svg>',
    ];

    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 20,
      size: 1.5 + Math.random() * 3,
      svg: svgs[i % svgs.length],
    }));
  }
}
