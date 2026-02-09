import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';
import { TiltDirective } from '../../../../shared/directives/tilt.directive';
import { TranslateObjPipe } from '../../../../shared/pipes/translate-obj.pipe';
import { HobbyRepository } from '../../../../../domain/repositories';
import { Hobby } from '../../../../../domain/models';

@Component({
  selector: 'app-hobbies-section',
  standalone: true,
  imports: [RouterLink, TranslateModule, StaggerRevealDirective, TiltDirective, TranslateObjPipe],
  template: `
    <section id="hobbies" class="py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div appStaggerReveal class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {{ 'HOBBIES.TITLE' | translate }}
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            {{ 'HOBBIES.SUBTITLE' | translate }}
          </p>
          <a routerLink="/hobbies"
             class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600
                    transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
            {{ 'HOBBIES.VIEW_ALL' | translate }} →
          </a>
        </div>

        <!-- Hobbies Grid -->
        @if (loading()) {
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (i of [1,2,3]; track i) {
              <div class="glass-card rounded-2xl p-6">
                <div class="flex items-center gap-4">
                  <div class="skeleton h-12 w-12 rounded-xl"></div>
                  <div class="skeleton h-5 w-32"></div>
                </div>
                <div class="mt-4 space-y-2">
                  <div class="skeleton h-3 w-full"></div>
                  <div class="skeleton h-3 w-4/5"></div>
                </div>
              </div>
            }
          </div>
        } @else {
        <div appStaggerReveal staggerFrom="edges" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (hobby of hobbies(); track hobby.id) {
            <div
              appTilt
              class="glass-card group rounded-2xl p-6 transition-all duration-300"
            >
              <div class="flex items-center gap-4">
                @if (hobby.iconUrl) {
                  <img [src]="hobby.iconUrl" [alt]="hobby.name | translateObj"
                       class="h-12 w-12 rounded-xl object-contain" />
                } @else {
                  <div class="flex h-12 w-12 items-center justify-center rounded-xl
                              bg-violet-100 text-2xl dark:bg-violet-900/30">
                    ❤️
                  </div>
                }
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                  {{ hobby.name | translateObj }}
                </h3>
              </div>
              @if (hobby.description) {
                <p class="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {{ hobby.description | translateObj }}
                </p>
              }
            </div>
          }
        </div>
        }
      </div>
    </section>
  `,
})
export class HobbiesSection {
  private readonly hobbyRepo = inject(HobbyRepository);
  protected readonly hobbies = signal<Hobby[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.loadHobbies();
  }

  private async loadHobbies(): Promise<void> {
    try {
      this.hobbies.set(await this.hobbyRepo.getAllHobbies());
    } catch {
      this.hobbies.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
