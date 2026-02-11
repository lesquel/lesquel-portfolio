import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateObjPipe } from '../../shared/pipes/translate-obj.pipe';
import { StaggerRevealDirective } from '../../shared/directives/stagger-reveal.directive';
import { HobbyRepository } from '../../../domain/repositories';
import { Hobby } from '../../../domain/models';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-hobby-detail-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, TranslateObjPipe, StaggerRevealDirective, LucideAngularModule],
  template: `
    <div class="min-h-screen pt-24 pb-16">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <!-- Back Link -->
        <a
          routerLink="/hobbies"
          class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500
                 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
        >
          <lucide-icon [img]="arrowLeftIcon" [size]="16" />
          {{ 'HOBBY_DETAIL.BACK' | translate }}
        </a>

        @if (loading()) {
          <!-- Skeleton -->
          <div class="space-y-8">
            <div class="flex items-center gap-6">
              <div class="skeleton h-20 w-20 rounded-2xl"></div>
              <div class="space-y-3">
                <div class="skeleton h-8 w-48"></div>
                <div class="skeleton h-5 w-full max-w-lg"></div>
              </div>
            </div>
            <div class="skeleton aspect-video w-full rounded-2xl"></div>
            <div class="space-y-3">
              <div class="skeleton h-5 w-full"></div>
              <div class="skeleton h-5 w-3/4"></div>
              <div class="skeleton h-5 w-full"></div>
              <div class="skeleton h-5 w-2/3"></div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="skeleton h-48 rounded-xl"></div>
              <div class="skeleton h-48 rounded-xl"></div>
            </div>
          </div>
        } @else if (hobby()) {
          <!-- Hero -->
          <div appStaggerReveal class="mb-8 flex items-center gap-6">
            @if (hobby()!.iconUrl) {
              <img
                [src]="hobby()!.iconUrl"
                [alt]="hobby()!.name | translateObj"
                class="h-20 w-20 rounded-2xl object-contain"
              />
            } @else {
              <div
                class="flex h-20 w-20 items-center justify-center rounded-2xl
                       bg-gradient-to-br from-violet-100 to-purple-100 text-4xl
                       dark:from-violet-900/30 dark:to-purple-900/30"
              >
                ❤️
              </div>
            }
            <div>
              <h1 class="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                {{ hobby()!.name | translateObj }}
              </h1>
              @if (hobby()!.description) {
                <p class="mt-2 text-lg text-slate-500 dark:text-slate-400">
                  {{ hobby()!.description | translateObj }}
                </p>
              }
            </div>
          </div>

          <!-- Cover Image -->
          @if (hobby()!.coverImage) {
            <div appStaggerReveal class="mb-10 overflow-hidden rounded-2xl">
              <img
                [src]="hobby()!.coverImage"
                [alt]="hobby()!.name | translateObj"
                class="h-auto w-full object-cover"
              />
            </div>
          }

          <!-- Content -->
          @if (hobby()!.content) {
            <div appStaggerReveal class="mb-12">
              <h2 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                {{ 'HOBBY_DETAIL.ABOUT' | translate }}
              </h2>
              <div class="prose prose-slate max-w-none dark:prose-invert leading-relaxed text-slate-600 dark:text-slate-400">
                <p>{{ hobby()!.content | translateObj }}</p>
              </div>
            </div>
          }

          <!-- Gallery -->
          @if (hobby()!.galleryUrls.length > 0) {
            <div appStaggerReveal class="mb-12">
              <h2 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                {{ 'HOBBY_DETAIL.GALLERY' | translate }}
              </h2>
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                @for (img of hobby()!.galleryUrls; track img) {
                  <img
                    [src]="img"
                    [alt]="hobby()!.name | translateObj"
                    class="rounded-xl object-cover transition-transform duration-300 hover:scale-[1.02]"
                    loading="lazy"
                  />
                }
              </div>
            </div>
          }
        } @else {
          <!-- Not Found -->
          <div class="py-32 text-center">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ 'HOBBY_DETAIL.NOT_FOUND' | translate }}
            </h2>
            <p class="mt-2 text-slate-500 dark:text-slate-400">
              {{ 'HOBBY_DETAIL.NOT_FOUND_MESSAGE' | translate }}
            </p>
            <a
              routerLink="/"
              class="mt-6 inline-block rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium
                     text-white transition-colors hover:bg-violet-700"
            >
              {{ 'HOBBY_DETAIL.GO_HOME' | translate }}
            </a>
          </div>
        }
      </div>
    </div>
  `,
})
export class HobbyDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly hobbyRepo = inject(HobbyRepository);

  protected readonly arrowLeftIcon = ArrowLeft;
  protected readonly hobby = signal<Hobby | null>(null);
  protected readonly loading = signal(true);

  constructor() {
    this.route.paramMap.subscribe(async (params) => {
      const slug = params.get('slug');
      if (!slug) {
        this.loading.set(false);
        return;
      }
      await this.loadHobby(slug);
    });
  }

  private async loadHobby(slug: string): Promise<void> {
    this.loading.set(true);
    try {
      const hobby = await this.hobbyRepo.getHobbyBySlug(slug);
      this.hobby.set(hobby);
    } catch {
      this.hobby.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
