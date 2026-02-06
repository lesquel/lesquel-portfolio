import { Component, input, output } from '@angular/core';
import { Project } from '../../../../domain/models';
import { TranslateObjPipe } from '../../pipes/translate-obj.pipe';
import { TechBadge } from '../tech-badge/tech-badge';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [TranslateObjPipe, TechBadge],
  template: `
    <article
      (click)="cardClick.emit(project())"
      (keydown.enter)="cardClick.emit(project())"
      tabindex="0"
      role="button"
      class="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white
             shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
             dark:border-slate-700 dark:bg-slate-800/50"
    >
      <!-- Cover Image -->
      @if (project().coverImage) {
        <div class="relative aspect-video overflow-hidden">
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
      <div class="p-5">
        <h3 class="mb-2 text-lg font-bold text-slate-900 dark:text-white">
          {{ project().title | translateObj }}
        </h3>
        <p class="mb-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {{ project().description | translateObj }}
        </p>

        <!-- Tech Badges -->
        <div class="flex flex-wrap gap-1.5">
          @for (tech of project().technologies; track tech.id) {
            <app-tech-badge [name]="tech.name" [iconUrl]="tech.iconUrl" />
          }
        </div>
      </div>
    </article>
  `,
})
export class ProjectCard {
  readonly project = input.required<Project>();
  readonly cardClick = output<Project>();
}
