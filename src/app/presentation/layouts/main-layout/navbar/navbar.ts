import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { LangSwitcher } from '../../../shared/components/lang-switcher/lang-switcher';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TranslateModule, ThemeToggle, LangSwitcher],
  template: `
    <!-- Skip Navigation Link (a11y) -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]
             focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
    >
      {{ 'A11Y.SKIP_NAV' | translate }}
    </a>

    <nav
      class="glass fixed left-0 right-0 top-0 z-50 border-b border-slate-200/50
             dark:border-slate-700/50"
    >
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo / Brand -->
        <a routerLink="/" class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          <span class="text-primary">&lt;</span>Lesquel<span class="text-primary">/&gt;</span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden items-center gap-1 md:flex">
          <a
            routerLink="/"
            fragment="hero"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors
                   hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400
                   dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {{ 'NAV.HOME' | translate }}
          </a>
          <a
            routerLink="/"
            fragment="stack"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors
                   hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400
                   dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {{ 'NAV.STACK' | translate }}
          </a>
          <a
            routerLink="/"
            fragment="projects"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors
                   hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400
                   dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {{ 'NAV.PROJECTS' | translate }}
          </a>
          <a
            routerLink="/"
            fragment="hobbies"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors
                   hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400
                   dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {{ 'NAV.HOBBIES' | translate }}
          </a>
          <a
            routerLink="/"
            fragment="courses"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors
                   hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400
                   dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {{ 'NAV.COURSES' | translate }}
          </a>
          <a
            routerLink="/"
            fragment="contact"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors
                   hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400
                   dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {{ 'NAV.CONTACT' | translate }}
          </a>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-1">
          <app-lang-switcher />
          <app-theme-toggle />

          <!-- Mobile Hamburger -->
          <button
            (click)="mobileMenuOpen.set(!mobileMenuOpen())"
            [attr.aria-label]="'Toggle menu'"
            [attr.aria-expanded]="mobileMenuOpen()"
            class="flex h-10 w-10 items-center justify-center rounded-full
                   transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 md:hidden"
          >
            @if (!mobileMenuOpen()) {
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            } @else {
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          </button>
        </div>
      </div>

      <!-- Mobile Menu (slide-in) -->
      @if (mobileMenuOpen()) {
        <div
          class="border-t border-slate-200/50 bg-white/95 backdrop-blur-lg
                 dark:border-slate-700/50 dark:bg-slate-900/95 md:hidden"
        >
          <div class="flex flex-col gap-1 px-4 py-3">
            <a
              (click)="mobileMenuOpen.set(false)"
              routerLink="/"
              fragment="hero"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors
                     hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {{ 'NAV.HOME' | translate }}
            </a>
            <a
              (click)="mobileMenuOpen.set(false)"
              routerLink="/"
              fragment="stack"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors
                     hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {{ 'NAV.STACK' | translate }}
            </a>
            <a
              (click)="mobileMenuOpen.set(false)"
              routerLink="/"
              fragment="projects"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors
                     hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {{ 'NAV.PROJECTS' | translate }}
            </a>
            <a
              (click)="mobileMenuOpen.set(false)"
              routerLink="/"
              fragment="hobbies"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors
                     hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {{ 'NAV.HOBBIES' | translate }}
            </a>
            <a
              (click)="mobileMenuOpen.set(false)"
              routerLink="/"
              fragment="courses"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors
                     hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {{ 'NAV.COURSES' | translate }}
            </a>
            <a
              (click)="mobileMenuOpen.set(false)"
              routerLink="/"
              fragment="contact"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors
                     hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {{ 'NAV.CONTACT' | translate }}
            </a>
          </div>
        </div>
      }
    </nav>
  `,
})
export class Navbar {
  protected readonly mobileMenuOpen = signal(false);
}
