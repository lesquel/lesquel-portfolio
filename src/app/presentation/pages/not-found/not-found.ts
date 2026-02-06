import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 class="mb-4 text-8xl font-black text-primary">404</h1>
      <p class="mb-8 text-xl text-slate-600 dark:text-slate-400">
        Page not found
      </p>
      <a
        routerLink="/"
        class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3
               text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ 'NAV.HOME' | translate }}
      </a>
    </div>
  `,
})
export class NotFoundPage {}
