import { Component, inject } from '@angular/core';
import { ThemeService, ThemeMode } from '../../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      (click)="theme.toggle()"
      [attr.aria-label]="'Toggle theme'"
      class="relative flex h-10 w-10 items-center justify-center rounded-full
             transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
    >
      <!-- Sun icon (visible in dark mode) -->
      @if (theme.effectiveTheme() === 'dark') {
        <svg
          class="h-5 w-5 text-yellow-400 transition-transform duration-300"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      }
      <!-- Moon icon (visible in light mode) -->
      @if (theme.effectiveTheme() === 'light') {
        <svg
          class="h-5 w-5 text-slate-700 transition-transform duration-300"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      }
    </button>
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
}
