import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  Monitor,
  GraduationCap,
  Gamepad2,
  Mail,
  User,
  Code2,
  Home,
  FolderOpen,
  type LucideIconData,
} from 'lucide-angular';

export interface PageTransitionConfig {
  icon: LucideIconData;
  color: string; // Tailwind gradient classes
}

/**
 * Page Transition Service - manages route-based icon animations.
 * Maps routes to Lucide icons and triggers transition animations.
 */
@Injectable({ providedIn: 'root' })
export class PageTransitionService {
  private readonly router = inject(Router);

  // Route to icon mapping
  private readonly routeConfig: Record<string, PageTransitionConfig> = {
    '/': { icon: Home, color: 'from-indigo-500 to-violet-500' },
    '/projects': { icon: FolderOpen, color: 'from-blue-500 to-cyan-500' },
    '/project': { icon: Monitor, color: 'from-blue-500 to-cyan-500' },
    '/courses': { icon: GraduationCap, color: 'from-emerald-500 to-teal-500' },
    '/course': { icon: GraduationCap, color: 'from-emerald-500 to-teal-500' },
    '/hobbies': { icon: Gamepad2, color: 'from-pink-500 to-rose-500' },
    '/hobby': { icon: Gamepad2, color: 'from-pink-500 to-rose-500' },
    '/contact': { icon: Mail, color: 'from-amber-500 to-orange-500' },
    '/profile': { icon: User, color: 'from-violet-500 to-purple-500' },
    '/technologies': { icon: Code2, color: 'from-cyan-500 to-blue-500' },
    '/skill': { icon: Code2, color: 'from-cyan-500 to-blue-500' },
  };

  // Default config for unknown routes
  private readonly defaultConfig: PageTransitionConfig = {
    icon: Home,
    color: 'from-slate-500 to-slate-600',
  };

  // Reactive state
  private readonly _isTransitioning = signal(false);
  private readonly _currentRoute = signal('/');
  private readonly _targetRoute = signal('/');

  // Public readonly signals
  readonly isTransitioning = this._isTransitioning.asReadonly();
  readonly currentRoute = this._currentRoute.asReadonly();
  readonly targetRoute = this._targetRoute.asReadonly();

  // Computed config based on target route
  readonly transitionConfig = computed(() => {
    const route = this._targetRoute();
    return this.getConfigForRoute(route);
  });

  constructor() {
    this.setupRouterListeners();
  }

  private setupRouterListeners(): void {
    // Navigation start - begin transition
    this.router.events
      .pipe(filter((e): e is NavigationStart => e instanceof NavigationStart))
      .subscribe((event) => {
        this._targetRoute.set(event.url);
        this._isTransitioning.set(true);
      });

    // Navigation end - complete transition
    this.router.events
      .pipe(
        filter(
          (e): e is NavigationEnd | NavigationCancel | NavigationError =>
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError
        )
      )
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this._currentRoute.set(event.urlAfterRedirects);
        }
        // Delay hiding to allow animation to complete
        setTimeout(() => {
          this._isTransitioning.set(false);
        }, 700);
      });
  }

  /**
   * Gets the configuration for a given route.
   * Matches exact routes first, then prefix matches.
   */
  private getConfigForRoute(route: string): PageTransitionConfig {
    // Exact match
    if (this.routeConfig[route]) {
      return this.routeConfig[route];
    }

    // Prefix match (e.g., /project/my-slug matches /project)
    for (const [prefix, config] of Object.entries(this.routeConfig)) {
      if (prefix !== '/' && route.startsWith(prefix)) {
        return config;
      }
    }

    return this.defaultConfig;
  }

  /**
   * Manually trigger a transition (useful for programmatic navigation).
   */
  triggerTransition(targetRoute: string): void {
    this._targetRoute.set(targetRoute);
    this._isTransitioning.set(true);
  }

  /**
   * Complete transition manually.
   */
  completeTransition(): void {
    this._isTransitioning.set(false);
  }
}
