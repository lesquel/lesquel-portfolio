import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService, type ProjectFormData } from '../../../../core/admin/admin.service';
import type { ProjectDto, SkillDto } from '../../../../data/models/dtos';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Proyectos</h1>
          <p class="mt-1 text-sm text-slate-400">Administra tus proyectos del portafolio</p>
        </div>
        <button
          (click)="openCreateForm()"
          class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium
                 text-white transition-colors hover:bg-indigo-700"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Proyecto
        </button>
      </div>

      <!-- Projects Table -->
      <div class="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        @if (loading()) {
          <div class="flex items-center justify-center py-12">
            <div class="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-slate-800 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  <th class="px-5 py-3">Orden</th>
                  <th class="px-5 py-3">Proyecto</th>
                  <th class="px-5 py-3">Slug</th>
                  <th class="px-5 py-3">Estado</th>
                  <th class="px-5 py-3">Tecnologías</th>
                  <th class="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                @for (project of projects(); track project.id; let i = $index) {
                  <tr class="transition-colors hover:bg-slate-800/50">
                    <td class="px-5 py-3">
                      <div class="flex items-center gap-1">
                        <button
                          (click)="moveProject(i, -1)"
                          [disabled]="i === 0"
                          class="rounded p-1 text-slate-500 transition-colors hover:bg-slate-700 hover:text-white
                                 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                        >
                          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <span class="text-xs text-slate-500">{{ i + 1 }}</span>
                        <button
                          (click)="moveProject(i, 1)"
                          [disabled]="i === projects().length - 1"
                          class="rounded p-1 text-slate-500 transition-colors hover:bg-slate-700 hover:text-white
                                 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                        >
                          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td class="px-5 py-3">
                      <div class="flex items-center gap-3">
                        @if (project.image_url) {
                          <img [src]="project.image_url" [alt]="project.title['es'] || ''"
                               class="h-10 w-14 rounded-lg border border-slate-700 object-cover" />
                        } @else {
                          <div class="flex h-10 w-14 items-center justify-center rounded-lg border border-slate-700 bg-slate-800">
                            <svg class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                            </svg>
                          </div>
                        }
                        <div>
                          <p class="text-sm font-medium text-white">{{ project.title['es'] }}</p>
                          <p class="text-xs text-slate-500">{{ project.title['en'] }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-5 py-3">
                      <code class="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{{ project.slug }}</code>
                    </td>
                    <td class="px-5 py-3">
                      <button
                        (click)="togglePublished(project)"
                        [class]="project.is_published
                          ? 'rounded-full bg-emerald-600/20 px-2.5 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-600/30'
                          : 'rounded-full bg-slate-700/50 px-2.5 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-700'"
                      >
                        {{ project.is_published ? '● Publicado' : '○ Borrador' }}
                      </button>
                    </td>
                    <td class="px-5 py-3">
                      <div class="flex flex-wrap gap-1">
                        @for (ps of (project.project_skills ?? []).slice(0, 3); track ps.skills.id) {
                          <span class="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                            {{ ps.skills.name }}
                          </span>
                        }
                        @if ((project.project_skills ?? []).length > 3) {
                          <span class="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                            +{{ (project.project_skills ?? []).length - 3 }}
                          </span>
                        }
                      </div>
                    </td>
                    <td class="px-5 py-3 text-right">
                      <div class="flex items-center justify-end gap-1">
                        <button
                          (click)="openEditForm(project)"
                          class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-indigo-400"
                          title="Editar"
                        >
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          (click)="confirmDelete(project)"
                          class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
                          title="Eliminar"
                        >
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="px-5 py-12 text-center text-sm text-slate-500">
                      No hay proyectos. ¡Crea el primero!
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Modal (Create / Edit) -->
      @if (showForm()) {
        <div class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
             (click)="closeForm()"
             (keydown.escape)="closeForm()">
          <div class="my-8 w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
               (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h2 class="text-lg font-semibold text-white">
                {{ editingId() ? 'Editar Proyecto' : 'Nuevo Proyecto' }}
              </h2>
              <button (click)="closeForm()" class="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form (ngSubmit)="saveProject()" class="space-y-5 p-6">
              <!-- Slug -->
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Slug (URL)</label>
                <input
                  type="text"
                  [(ngModel)]="form.slug"
                  name="slug"
                  placeholder="mi-proyecto"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <!-- Title ES / EN -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Título (Español)</label>
                  <input
                    type="text"
                    [(ngModel)]="form.title_es"
                    name="title_es"
                    placeholder="Mi Proyecto"
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Título (English)</label>
                  <input
                    type="text"
                    [(ngModel)]="form.title_en"
                    name="title_en"
                    placeholder="My Project"
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <!-- Description ES / EN -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Descripción (Español)</label>
                  <textarea
                    [(ngModel)]="form.desc_es"
                    name="desc_es"
                    rows="3"
                    placeholder="Describe tu proyecto..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none resize-none"
                    required
                  ></textarea>
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Description (English)</label>
                  <textarea
                    [(ngModel)]="form.desc_en"
                    name="desc_en"
                    rows="3"
                    placeholder="Describe your project..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              <!-- Content ES / EN -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Contenido largo (Español) - opcional</label>
                  <textarea
                    [(ngModel)]="form.content_es"
                    name="content_es"
                    rows="4"
                    placeholder="Contenido detallado..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none resize-none"
                  ></textarea>
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Long content (English) - optional</label>
                  <textarea
                    [(ngModel)]="form.content_en"
                    name="content_en"
                    rows="4"
                    placeholder="Detailed content..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <!-- Image URL -->
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Imagen de portada</label>
                <div class="flex gap-3">
                  <input
                    type="text"
                    [(ngModel)]="form.image_url"
                    name="image_url"
                    placeholder="URL de la imagen o sube un archivo"
                    class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                  />
                  <label class="cursor-pointer rounded-lg border border-dashed border-slate-600 px-3 py-2.5 text-sm
                                text-slate-400 transition-colors hover:border-indigo-500 hover:text-indigo-400">
                    <input type="file" accept="image/*" class="hidden" (change)="onImageUpload($event)" />
                    📁 Subir
                  </label>
                </div>
                @if (form.image_url) {
                  <img [src]="form.image_url" alt="Preview"
                       class="mt-2 h-20 w-32 rounded-lg border border-slate-700 object-cover" />
                }
              </div>

              <!-- URLs -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Demo URL</label>
                  <input
                    type="url"
                    [(ngModel)]="form.demo_url"
                    name="demo_url"
                    placeholder="https://mi-proyecto.com"
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Repositorio URL</label>
                  <input
                    type="url"
                    [(ngModel)]="form.repo_url"
                    name="repo_url"
                    placeholder="https://github.com/..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <!-- Technologies -->
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Tecnologías</label>
                <div class="flex flex-wrap gap-2 rounded-lg border border-slate-700 bg-slate-800 p-3">
                  @for (skill of availableSkills(); track skill.id) {
                    <button
                      type="button"
                      (click)="toggleSkillSelection(skill.id)"
                      [class]="form.skill_ids.includes(skill.id)
                        ? 'rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition-colors'
                        : 'rounded-full border border-slate-600 px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:border-indigo-500 hover:text-indigo-400'"
                    >
                      {{ skill.name }}
                    </button>
                  } @empty {
                    <p class="text-xs text-slate-500">No hay tecnologías. Crea algunas primero.</p>
                  }
                </div>
              </div>

              <!-- Published + Order -->
              <div class="flex items-center gap-6">
                <label class="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    [(ngModel)]="form.is_published"
                    name="is_published"
                    class="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                  />
                  Publicado
                </label>
                <div class="flex items-center gap-2">
                  <label class="text-sm text-slate-400">Orden:</label>
                  <input
                    type="number"
                    [(ngModel)]="form.display_order"
                    name="display_order"
                    min="0"
                    class="w-20 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white
                           focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <!-- Error -->
              @if (formError()) {
                <div class="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-400">
                  {{ formError() }}
                </div>
              }

              <!-- Actions -->
              <div class="flex justify-end gap-3 border-t border-slate-800 pt-5">
                <button
                  type="button"
                  (click)="closeForm()"
                  class="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300
                         transition-colors hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  [disabled]="saving()"
                  class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium
                         text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  @if (saving()) {
                    <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
            <h3 class="mt-4 text-lg font-semibold text-white">¿Eliminar proyecto?</h3>
            <p class="mt-2 text-sm text-slate-400">
              Esta acción no se puede deshacer. Se eliminará "{{ deletingProject()?.title?.['es'] ?? '' }}" permanentemente.
            </p>
            <div class="mt-6 flex justify-end gap-3">
              <button
                (click)="showDeleteConfirm.set(false)"
                class="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                (click)="deleteProject()"
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
export class AdminProjects implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly route = inject(ActivatedRoute);

  readonly projects = signal<(ProjectDto & { is_published: boolean })[]>([]);
  readonly availableSkills = signal<SkillDto[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  readonly showDeleteConfirm = signal(false);
  readonly deletingProject = signal<ProjectDto | null>(null);

  form = this.emptyForm();

  async ngOnInit(): Promise<void> {
    await this.loadData();

    // auto-open new form if query param
    this.route.queryParams.subscribe((p) => {
      if (p['action'] === 'new') this.openCreateForm();
    });
  }

  private async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      const [projects, skills] = await Promise.all([
        this.admin.getAllProjects(),
        this.admin.getAllSkills(),
      ]);
      this.projects.set(projects);
      this.availableSkills.set(skills);
    } catch (err) {
      console.error('Load projects error:', err);
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

  openEditForm(project: ProjectDto & { is_published: boolean }): void {
    this.editingId.set(project.id);
    this.formError.set(null);
    this.form = {
      slug: project.slug,
      title_es: project.title?.['es'] ?? '',
      title_en: project.title?.['en'] ?? '',
      desc_es: project.description?.['es'] ?? '',
      desc_en: project.description?.['en'] ?? '',
      content_es: project.content?.['es'] ?? '',
      content_en: project.content?.['en'] ?? '',
      image_url: project.image_url ?? '',
      demo_url: project.demo_url ?? '',
      repo_url: project.repo_url ?? '',
      is_published: project.is_published,
      display_order: project.display_order,
      skill_ids: project.project_skills?.map((ps) => ps.skills.id) ?? [],
    };
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  toggleSkillSelection(id: string): void {
    const idx = this.form.skill_ids.indexOf(id);
    if (idx === -1) {
      this.form.skill_ids = [...this.form.skill_ids, id];
    } else {
      this.form.skill_ids = this.form.skill_ids.filter((s) => s !== id);
    }
  }

  async onImageUpload(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const url = await this.admin.uploadImage(file);
      this.form.image_url = url;
    } catch (err) {
      this.formError.set('Error al subir imagen');
    }
  }

  async saveProject(): Promise<void> {
    this.saving.set(true);
    this.formError.set(null);

    const formData: ProjectFormData = {
      slug: this.form.slug.trim(),
      title: { es: this.form.title_es, en: this.form.title_en },
      description: { es: this.form.desc_es, en: this.form.desc_en },
      content: this.form.content_es || this.form.content_en
        ? { es: this.form.content_es, en: this.form.content_en }
        : null,
      image_url: this.form.image_url || null,
      gallery_urls: [],
      demo_url: this.form.demo_url || null,
      repo_url: this.form.repo_url || null,
      is_published: this.form.is_published,
      display_order: this.form.display_order,
      skill_ids: this.form.skill_ids,
    };

    try {
      if (this.editingId()) {
        await this.admin.updateProject(this.editingId()!, formData);
      } else {
        await this.admin.createProject(formData);
      }
      this.closeForm();
      await this.loadData();
    } catch (err: any) {
      this.formError.set(err.message ?? 'Error al guardar el proyecto');
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(project: ProjectDto): void {
    this.deletingProject.set(project);
    this.showDeleteConfirm.set(true);
  }

  async deleteProject(): Promise<void> {
    const p = this.deletingProject();
    if (!p) return;

    try {
      await this.admin.deleteProject(p.id);
      this.showDeleteConfirm.set(false);
      await this.loadData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  }

  async togglePublished(project: ProjectDto & { is_published: boolean }): Promise<void> {
    try {
      const newVal = !project.is_published;
      await this.admin.toggleProjectPublished(project.id, newVal);
      this.projects.update((list) =>
        list.map((p) => (p.id === project.id ? { ...p, is_published: newVal } : p)),
      );
    } catch (err) {
      console.error('Toggle published error:', err);
    }
  }

  async moveProject(index: number, direction: -1 | 1): Promise<void> {
    const list = [...this.projects()];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= list.length) return;

    [list[index], list[newIndex]] = [list[newIndex], list[index]];
    this.projects.set(list);

    try {
      await this.admin.reorderProjects(list.map((p) => p.id));
    } catch (err) {
      console.error('Reorder error:', err);
    }
  }

  private emptyForm() {
    return {
      slug: '',
      title_es: '',
      title_en: '',
      desc_es: '',
      desc_en: '',
      content_es: '',
      content_en: '',
      image_url: '',
      demo_url: '',
      repo_url: '',
      is_published: false,
      display_order: 0,
      skill_ids: [] as string[],
    };
  }
}
