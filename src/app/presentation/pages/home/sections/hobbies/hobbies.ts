import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GsapAnimateDirective } from '../../../../shared/directives/gsap-animate.directive';
import { TranslateObjPipe } from '../../../../shared/pipes/translate-obj.pipe';
import { HobbyRepository } from '../../../../../domain/repositories';
import { Hobby } from '../../../../../domain/models';

@Component({
  selector: 'app-hobbies-section',
  standalone: true,
  imports: [TranslateModule, GsapAnimateDirective, TranslateObjPipe],
  template: `
    <section id="hobbies" class="py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div appGsapAnimate class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {{ 'HOBBIES.TITLE' | translate }}
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            {{ 'HOBBIES.SUBTITLE' | translate }}
          </p>
        </div>

        <!-- Hobbies Grid -->
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (hobby of hobbies(); track hobby.id) {
            <div
              appGsapAnimate
              class="group rounded-2xl border border-slate-200 bg-white p-6 transition-all
                     duration-300 hover:-translate-y-1 hover:shadow-xl
                     dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
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
      </div>
    </section>
  `,
})
export class HobbiesSection {
  private readonly hobbyRepo = inject(HobbyRepository);
  protected readonly hobbies = signal<Hobby[]>([]);

  constructor() {
    this.loadHobbies();
  }

  private async loadHobbies(): Promise<void> {
    try {
      this.hobbies.set(await this.hobbyRepo.getAllHobbies());
    } catch {
      this.hobbies.set([]);
    }
  }
}
