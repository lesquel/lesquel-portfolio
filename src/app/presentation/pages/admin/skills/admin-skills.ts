import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService, type SkillFormData } from '../../../../core/admin/admin.service';
import type { SkillDto } from '../../../../data/models/dtos';

@Component({
  selector: 'app-admin-skills',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Tecnologías</h1>
          <p class="mt-1 text-sm text-slate-400">Administra las tecnologías y herramientas de tu stack</p>
        </div>
        <button
          (click)="openCreateForm()"
          class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium
                 text-white transition-colors hover:bg-indigo-700"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva Tecnología
        </button>
      </div>

      <!-- Filter by type -->
      <div class="flex flex-wrap gap-2">
        @for (t of typeFilters; track t.value) {
          <button
            (click)="activeFilter.set(t.value)"
            [class]="activeFilter() === t.value
              ? 'rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white'
              : 'rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition-colors'"
          >
            {{ t.label }}
          </button>
        }
      </div>

      <!-- Skills Grid -->
      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      } @else {
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          @for (skill of filteredSkills(); track skill.id) {
            <div class="group relative rounded-xl border border-slate-800 bg-slate-900 p-4 transition-all
                        hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/50">
              <!-- Actions -->
              <div class="absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  (click)="openEditForm(skill)"
                  class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-indigo-400"
                  title="Editar"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                </button>
                <button
                  (click)="confirmDelete(skill)"
                  class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
                  title="Eliminar"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>

              <div class="flex items-center gap-3">
                <!-- Icon -->
                @if (skill.icon_url) {
                  <img [src]="skill.icon_url" [alt]="skill.name"
                       class="h-10 w-10 rounded-lg object-contain" />
                } @else {
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-lg">
                    {{ skill.name[0]?.toUpperCase() }}
                  </div>
                }
                <div class="flex-1">
                  <p class="text-sm font-semibold text-white">{{ skill.name }}</p>
                  <div class="mt-0.5 flex items-center gap-2">
                    <span class="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400"
                          [class.bg-blue-600/20]="skill.type === 'frontend'"
                          [class.text-blue-400]="skill.type === 'frontend'"
                          [class.bg-emerald-600/20]="skill.type === 'backend'"
                          [class.text-emerald-400]="skill.type === 'backend'"
                          [class.bg-amber-600/20]="skill.type === 'tool'"
                          [class.text-amber-400]="skill.type === 'tool'"
                    >
                      {{ skill.type }}
                    </span>
                    @if (skill.is_featured) {
                      <span class="text-[10px] text-amber-400">★ Featured</span>
                    }
                  </div>
                </div>
              </div>

              <!-- Featured toggle -->
              <button
                (click)="toggleFeatured(skill)"
                class="mt-3 w-full rounded-lg py-1.5 text-xs font-medium transition-colors"
                [class]="skill.is_featured
                  ? 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30'
                  : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'"
              >
                {{ skill.is_featured ? '★ Destacado' : '☆ Marcar como destacado' }}
              </button>
            </div>
          } @empty {
            <div class="col-span-full py-12 text-center text-sm text-slate-500">
              No hay tecnologías{{ activeFilter() !== 'all' ? ' de tipo "' + activeFilter() + '"' : '' }}
            </div>
          }
        </div>
      }

      <!-- Form Modal -->
      @if (showForm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
             (click)="closeForm()" (keydown.escape)="closeForm()">
          <div class="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
               (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h2 class="text-lg font-semibold text-white">
                {{ editingId() ? 'Editar Tecnología' : 'Nueva Tecnología' }}
              </h2>
              <button (click)="closeForm()" class="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveSkill()" class="space-y-4 p-6">
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Nombre</label>
                <input
                  type="text"
                  [(ngModel)]="form.name"
                  name="name"
                  placeholder="Angular, React, Node.js..."
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Icon URL</label>
                <input
                  type="text"
                  [(ngModel)]="form.icon_url"
                  name="icon_url"
                  placeholder="https://cdn.simpleicons.org/angular"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                @if (form.icon_url) {
                  <div class="mt-2 flex items-center gap-2">
                    <img [src]="form.icon_url" alt="Preview" class="h-8 w-8 object-contain" />
                    <span class="text-xs text-slate-500">Preview</span>
                  </div>
                }
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Tipo</label>
                <select
                  [(ngModel)]="form.type"
                  name="type"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         focus:border-indigo-500 focus:outline-none"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="tool">Tool</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <label class="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  [(ngModel)]="form.is_featured"
                  name="is_featured"
                  class="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-600"
                />
                Destacado en el portafolio
              </label>

              @if (formError()) {
                <div class="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-400">
                  {{ formError() }}
                </div>
              }

              <div class="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  (click)="closeForm()"
                  class="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  [disabled]="saving()"
                  class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium
                         text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  @if (saving()) {
                    <div class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  }
                  {{ editingId() ? 'Actualizar' : 'Crear' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Delete Confirmation -->
      @if (showDeleteConfirm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
             (click)="showDeleteConfirm.set(false)">
          <div class="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
               (click)="$event.stopPropagation()">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/20 text-red-400">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-semibold text-white">¿Eliminar tecnología?</h3>
            <p class="mt-2 text-sm text-slate-400">
              Se eliminará "{{ deletingSkill()?.name }}" y se desvinculará de todos los proyectos.
            </p>
            <div class="mt-6 flex justify-end gap-3">
              <button
                (click)="showDeleteConfirm.set(false)"
                class="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                (click)="deleteSkill()"
                class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminSkills implements OnInit {
  private readonly admin = inject(AdminService);

  readonly skills = signal<SkillDto[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  readonly showDeleteConfirm = signal(false);
  readonly deletingSkill = signal<SkillDto | null>(null);
  readonly activeFilter = signal<string>('all');

  form = this.emptyForm();

  readonly typeFilters = [
    { value: 'all', label: 'Todos' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'tool', label: 'Tools' },
    { value: 'other', label: 'Otros' },
  ];

  filteredSkills = () => {
    const filter = this.activeFilter();
    if (filter === 'all') return this.skills();
    return this.skills().filter((s) => s.type === filter);
  };

  async ngOnInit(): Promise<void> {
    await this.loadSkills();
  }

  private async loadSkills(): Promise<void> {
    this.loading.set(true);
    try {
      this.skills.set(await this.admin.getAllSkills());
    } catch (err) {
      console.error('Load skills error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  openCreateForm(): void {
    this.form = this.emptyForm();
    this.editingId.set(null);
    this.formError.set(null);
    this.showForm.set(true);
  }

  openEditForm(skill: SkillDto): void {
    this.editingId.set(skill.id);
    this.formError.set(null);
    this.form = {
      name: skill.name,
      icon_url: skill.icon_url ?? '',
      type: skill.type,
      is_featured: skill.is_featured,
    };
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  async saveSkill(): Promise<void> {
    this.saving.set(true);
    this.formError.set(null);

    const data: SkillFormData = {
      name: this.form.name.trim(),
      icon_url: this.form.icon_url || null,
      type: this.form.type,
      is_featured: this.form.is_featured,
    };

    try {
      if (this.editingId()) {
        await this.admin.updateSkill(this.editingId()!, data);
      } else {
        await this.admin.createSkill(data);
      }
      this.closeForm();
      await this.loadSkills();
    } catch (err: any) {
      this.formError.set(err.message ?? 'Error al guardar');
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(skill: SkillDto): void {
    this.deletingSkill.set(skill);
    this.showDeleteConfirm.set(true);
  }

  async deleteSkill(): Promise<void> {
    const s = this.deletingSkill();
    if (!s) return;
    try {
      await this.admin.deleteSkill(s.id);
      this.showDeleteConfirm.set(false);
      await this.loadSkills();
    } catch (err) {
      console.error('Delete skill error:', err);
    }
  }

  async toggleFeatured(skill: SkillDto): Promise<void> {
    try {
      const newVal = !skill.is_featured;
      await this.admin.toggleSkillFeatured(skill.id, newVal);
      this.skills.update((list) =>
        list.map((s) => (s.id === skill.id ? { ...s, is_featured: newVal } : s)),
      );
    } catch (err) {
      console.error('Toggle featured error:', err);
    }
  }

  private emptyForm() {
    return {
      name: '',
      icon_url: '',
      type: 'frontend' as string,
      is_featured: false,
    };
  }
}
