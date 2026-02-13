import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../../../domain/models';
import { TranslateObjPipe } from '../../pipes/translate-obj.pipe';
import { TechBadge } from '../tech-badge/tech-badge';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateObjPipe, TechBadge],
  template: `
    @if (project().slug) {
      <a
        [routerLink]="['/project', project().slug]"
        class="group block cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white
               shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
               dark:border-slate-700 dark:bg-slate-800/50"
      >
        <ng-container *ngTemplateOutlet="cardContent" />
      </a>
    } @else {
      <article
        class="group overflow-hidden rounded-xl border border-slate-200 bg-white
               shadow-sm dark:border-slate-700 dark:bg-slate-800/50"
      >
        <ng-container *ngTemplateOutlet="cardContent" />
      </article>
    }

    <ng-template #cardContent>
      <!-- Cover Image -->
      @if (project().coverImage) {
        <div class="relative aspect-[5/2] overflow-hidden">
          <img
            [src]="project().coverImage"
            [alt]="project().title | translateObj"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0
                       transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>
      }

      <!-- Content -->
      <div class="p-2.5">
        <h3 class="mb-0.5 text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
          {{ project().title | translateObj }}
        </h3>
        <p class="mb-2 line-clamp-1 text-[11px] text-slate-600 dark:text-slate-400 sm:text-xs">
          {{ project().description | translateObj }}
        </p>

        <!-- Tech Badges (reduced gap) -->
        <div class="flex flex-wrap gap-1">
          @for (tech of project().technologies.slice(0, 4); track tech.id) {
            <app-tech-badge [name]="tech.name" [iconUrl]="tech.iconUrl" />
          }
          @if (project().technologies.length > 4) {
            <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500
                         dark:bg-slate-700 dark:text-slate-400">
              +{{ project().technologies.length - 4 }}
            </span>
          }
        </div>
      </div>
    </ng-template>
  `,
})
export class ProjectCard {
  readonly project = input.required<Project>();
}
