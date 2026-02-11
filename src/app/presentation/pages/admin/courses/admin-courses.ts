import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService, type CourseFormData } from '../../../../core/admin/admin.service';
import type { CourseDto } from '../../../../data/models/dtos';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Cursos y Certificaciones</h1>
          <p class="mt-1 text-sm text-slate-400">Administra tus cursos completados y certificaciones obtenidas</p>
        </div>
        <button
          (click)="openCreateForm()"
          class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium
                 text-white transition-colors hover:bg-indigo-700"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Curso
        </button>
      </div>

      <!-- Courses List -->
      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      } @else {
        <div class="space-y-3">
          @for (course of courses(); track course.id) {
            <div class="group relative rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all
                        hover:border-slate-700">
              <!-- Actions -->
              <div class="absolute right-4 top-4 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  (click)="openEditForm(course)"
                  class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-indigo-400"
                  title="Editar"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                </button>
                <button
                  (click)="confirmDelete(course)"
                  class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
                  title="Eliminar"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>

              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-600/20 text-xl">
                  🎓
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-white">{{ course.name['es'] }}</p>
                  @if (course.institution?.['es']) {
                    <p class="text-xs text-indigo-400">{{ course.institution?.['es'] }}</p>
                  }
                  @if (course.description?.['es']) {
                    <p class="mt-1.5 text-xs leading-relaxed text-slate-400">{{ course.description?.['es'] }}</p>
                  }
                  <div class="mt-2 flex flex-wrap items-center gap-3">
                    @if (course.completion_date) {
                      <span class="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                        {{ course.completion_date }}
                      </span>
                    }
                    @if (course.certificate_url) {
                      <a [href]="course.certificate_url" target="_blank"
                         class="text-[10px] font-medium text-indigo-400 hover:text-indigo-300">
                        Ver certificado →
                      </a>
                    }
                  </div>
                </div>
              </div>
            </div>
          } @empty {
            <div class="py-12 text-center text-sm text-slate-500">
              No hay cursos. ¡Añade el primero!
            </div>
          }
        </div>
      }

      <!-- Form Modal -->
      @if (showForm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
             (click)="closeForm()" (keydown.escape)="closeForm()">
          <div class="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
               (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h2 class="text-lg font-semibold text-white">
                {{ editingId() ? 'Editar Curso' : 'Nuevo Curso' }}
              </h2>
              <button (click)="closeForm()" class="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveCourse()" class="space-y-4 p-6">
              <!-- Slug -->
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Slug (URL)</label>
                <input type="text" [(ngModel)]="form.slug" name="slug" placeholder="angular-avanzado"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
              </div>

              <!-- Name ES/EN -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Nombre (Español)</label>
                  <input type="text" [(ngModel)]="form.name_es" name="name_es" placeholder="Angular Avanzado"
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none" required />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Name (English)</label>
                  <input type="text" [(ngModel)]="form.name_en" name="name_en" placeholder="Advanced Angular"
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none" required />
                </div>
              </div>

              <!-- Institution ES/EN -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Institución (Español)</label>
                  <input type="text" [(ngModel)]="form.institution_es" name="institution_es" placeholder="Udemy, Coursera..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Institution (English)</label>
                  <input type="text" [(ngModel)]="form.institution_en" name="institution_en" placeholder="Udemy, Coursera..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
                </div>
              </div>

              <!-- Description ES/EN -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Descripción (Español)</label>
                  <textarea [(ngModel)]="form.desc_es" name="desc_es" rows="3" placeholder="Descripción del curso..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"></textarea>
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Description (English)</label>
                  <textarea [(ngModel)]="form.desc_en" name="desc_en" rows="3" placeholder="Course description..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"></textarea>
                </div>
              </div>

              <!-- Certificate URL & Date -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Certificado (URL o subir)</label>
                  <div class="flex gap-3">
                    <input type="text" [(ngModel)]="form.certificate_url" name="certificate_url" placeholder="https://..."
                      class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                             placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
                    <label class="cursor-pointer rounded-lg border border-dashed border-slate-600 px-3 py-2.5 text-sm
                                  text-slate-400 transition-colors hover:border-indigo-500 hover:text-indigo-400">
                      <input type="file" accept="image/*,.pdf" class="hidden" (change)="onCertificateUpload($event)" />
                      📁 Subir
                    </label>
                  </div>
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Fecha de Completado</label>
                  <input type="date" [(ngModel)]="form.completion_date" name="completion_date"
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           focus:border-indigo-500 focus:outline-none" />
                </div>
              </div>

              <!-- Order -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-slate-400">Orden:</label>
                <input type="number" [(ngModel)]="form.display_order" name="display_order" min="0"
                  class="w-20 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white
                         focus:border-indigo-500 focus:outline-none" />
              </div>

              @if (formError()) {
                <div class="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-400">
                  {{ formError() }}
                </div>
              }

              <div class="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button type="button" (click)="closeForm()"
                  class="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                  Cancelar
                </button>
                <button type="submit" [disabled]="saving()"
                  class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium
                         text-white hover:bg-indigo-700 disabled:opacity-50">
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
            <h3 class="text-lg font-semibold text-white">¿Eliminar curso?</h3>
            <p class="mt-2 text-sm text-slate-400">
              Se eliminará "{{ deletingCourse()?.name?.['es'] ?? '' }}" permanentemente.
            </p>
            <div class="mt-6 flex justify-end gap-3">
              <button (click)="showDeleteConfirm.set(false)"
                class="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                Cancelar
              </button>
              <button (click)="deleteCourse()"
                class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminCourses implements OnInit {
  private readonly admin = inject(AdminService);

  readonly courses = signal<CourseDto[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  readonly showDeleteConfirm = signal(false);
  readonly deletingCourse = signal<CourseDto | null>(null);

  form = this.emptyForm();

  async ngOnInit(): Promise<void> {
    await this.loadCourses();
  }

  private async loadCourses(): Promise<void> {
    this.loading.set(true);
    try {
      this.courses.set(await this.admin.getAllCourses());
    } catch (err) {
      console.error('Load courses error:', err);
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

  openEditForm(course: CourseDto): void {
    this.editingId.set(course.id);
    this.formError.set(null);
    this.form = {
      slug: course.slug ?? '',
      name_es: course.name['es'] ?? '',
      name_en: course.name['en'] ?? '',
      institution_es: course.institution?.['es'] ?? '',
      institution_en: course.institution?.['en'] ?? '',
      desc_es: course.description?.['es'] ?? '',
      desc_en: course.description?.['en'] ?? '',
      certificate_url: course.certificate_url ?? '',
      completion_date: course.completion_date ?? '',
      display_order: course.display_order,
    };
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  async saveCourse(): Promise<void> {
    this.saving.set(true);
    this.formError.set(null);

    const data: CourseFormData = {
      slug: this.form.slug.trim() || null,
      name: { es: this.form.name_es.trim(), en: this.form.name_en.trim() },
      institution: this.form.institution_es || this.form.institution_en
        ? { es: this.form.institution_es, en: this.form.institution_en }
        : null,
      description: this.form.desc_es || this.form.desc_en
        ? { es: this.form.desc_es, en: this.form.desc_en }
        : null,
      certificate_url: this.form.certificate_url || null,
      completion_date: this.form.completion_date || null,
      display_order: this.form.display_order,
    };

    try {
      if (this.editingId()) {
        await this.admin.updateCourse(this.editingId()!, data);
      } else {
        await this.admin.createCourse(data);
      }
      this.closeForm();
      await this.loadCourses();
    } catch (err: any) {
      this.formError.set(err.message ?? 'Error al guardar');
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(course: CourseDto): void {
    this.deletingCourse.set(course);
    this.showDeleteConfirm.set(true);
  }

  async deleteCourse(): Promise<void> {
    const c = this.deletingCourse();
    if (!c) return;
    try {
      await this.admin.deleteCourse(c.id);
      this.showDeleteConfirm.set(false);
      await this.loadCourses();
    } catch (err) {
      console.error('Delete course error:', err);
    }
  }

  async onCertificateUpload(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const url = await this.admin.uploadFile(file, 'certificates');
      this.form.certificate_url = url;
    } catch {
      this.formError.set('Error al subir certificado');
    }
  }

  private emptyForm() {
    return {
      slug: '',
      name_es: '',
      name_en: '',
      institution_es: '',
      institution_en: '',
      desc_es: '',
      desc_en: '',
      certificate_url: '',
      completion_date: '',
      display_order: 0,
    };
  }
}
