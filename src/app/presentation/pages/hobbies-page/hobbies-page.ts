import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StaggerRevealDirective } from '../../shared/directives/stagger-reveal.directive';
import { TiltDirective } from '../../shared/directives/tilt.directive';
import { TranslateObjPipe } from '../../shared/pipes/translate-obj.pipe';
import { HobbyRepository } from '../../../domain/repositories';
import { Hobby } from '../../../domain/models';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-hobbies-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, StaggerRevealDirective, TiltDirective, TranslateObjPipe, LucideAngularModule],
  template: `
    <div class="min-h-screen pt-24 pb-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Back -->
        <a
          routerLink="/"
          class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500
                 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
        >
          <lucide-icon [img]="arrowLeftIcon" [size]="16" />
          {{ 'HOBBIES_PAGE.BACK' | translate }}
        </a>

        <!-- Header -->
        <div appStaggerReveal class="mb-16 text-center">
          <h1 class="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
            {{ 'HOBBIES_PAGE.TITLE' | translate }}
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            {{ 'HOBBIES_PAGE.SUBTITLE' | translate }}
          </p>
        </div>

        @if (loading()) {
          <!-- Skeleton -->
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="glass-card overflow-hidden rounded-3xl p-8">
                <div class="mb-6">
                  <div class="skeleton h-16 w-16 rounded-2xl"></div>
                </div>
                <div class="skeleton mb-3 h-6 w-40"></div>
                <div class="space-y-2">
                  <div class="skeleton h-3 w-full"></div>
                  <div class="skeleton h-3 w-4/5"></div>
                  <div class="skeleton h-3 w-3/5"></div>
                </div>
              </div>
            }
          </div>
        } @else if (hobbies().length > 0) {
          <div appStaggerReveal staggerFrom="edges" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            @for (hobby of hobbies(); track hobby.id; let i = $index) {
              <div
                appTilt
                class="glass-card group relative overflow-hidden rounded-3xl
                       p-8 transition-all duration-500 hover:shadow-2xl"
              >
                <!-- Gradient top accent -->
                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500
                            opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                <!-- Icon -->
                <div class="mb-6">
                  @if (hobby.iconUrl) {
                    <img [src]="hobby.iconUrl" [alt]="hobby.name | translateObj"
                         class="h-16 w-16 rounded-2xl object-contain transition-transform duration-500
                                group-hover:scale-110 group-hover:rotate-3" />
                  } @else {
                    <div class="flex h-16 w-16 items-center justify-center rounded-2xl
                                bg-gradient-to-br from-violet-100 to-purple-100 text-3xl
                                transition-transform duration-500 group-hover:scale-110
                                dark:from-violet-900/30 dark:to-purple-900/30">
                      ❤️
                    </div>
                  }
                </div>

                <!-- Name -->
                <h2 class="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                  {{ hobby.name | translateObj }}
                </h2>

                <!-- Description -->
                @if (hobby.description) {
                  <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {{ hobby.description | translateObj }}
                  </p>
                }

                <!-- Detail Link -->
                @if (hobby.slug) {
                  <a [routerLink]="['/hobby', hobby.slug]"
                     class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600
                            transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
                    {{ 'HOBBIES_PAGE.VIEW_DETAIL' | translate }} →
                  </a>
                }
              </div>
            }
          </div>
        } @else {
          <div class="py-32 text-center">
            <div class="mb-4 text-6xl">🎯</div>
            <p class="text-lg text-slate-500 dark:text-slate-400">
              {{ 'HOBBIES_PAGE.EMPTY' | translate }}
            </p>
          </div>
        }
      </div>
    </div>
  `,
})
export class HobbiesPage {
  private readonly hobbyRepo = inject(HobbyRepository);

  protected readonly arrowLeftIcon = ArrowLeft;
  protected readonly hobbies = signal<Hobby[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.load();
  }

  private async load(): Promise<void> {
    try {
      this.hobbies.set(await this.hobbyRepo.getAllHobbies());
    } catch {
      this.hobbies.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
