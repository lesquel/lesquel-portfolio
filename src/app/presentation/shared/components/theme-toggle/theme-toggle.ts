import { Component, inject } from '@angular/core';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';
import { ThemeService, ThemeMode } from '../../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <button
      (click)="theme.toggle()"
      [attr.aria-label]="'Toggle theme'"
      class="relative flex h-10 w-10 items-center justify-center rounded-full
             transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
    >
      <!-- Sun icon (visible in dark mode) -->
      @if (theme.effectiveTheme() === 'dark') {
        <lucide-icon
          [img]="sunIcon"
          class="h-5 w-5 text-yellow-400 transition-transform duration-300"
        ></lucide-icon>
      }
      <!-- Moon icon (visible in light mode) -->
      @if (theme.effectiveTheme() === 'light') {
        <lucide-icon
          [img]="moonIcon"
          class="h-5 w-5 text-slate-700 transition-transform duration-300"
        ></lucide-icon>
      }
    </button>
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly sunIcon = Sun;
  protected readonly moonIcon = Moon;
}


