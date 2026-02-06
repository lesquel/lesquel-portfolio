import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-full border border-slate-200
             bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700
             transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
    >
      @if (iconUrl()) {
        <img [src]="iconUrl()" [alt]="name()" class="h-3.5 w-3.5" loading="lazy" />
      }
      {{ name() }}
    </span>
  `,
})
export class TechBadge {
  readonly name = input.required<string>();
  readonly iconUrl = input<string | null>(null);
}
