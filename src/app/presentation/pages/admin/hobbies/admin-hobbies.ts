import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService, type HobbyFormData } from '../../../../core/admin/admin.service';
import type { HobbyDto } from '../../../../data/models/dtos';

@Component({
  selector: 'app-admin-hobbies',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Hobbies</h1>
          <p class="mt-1 text-sm text-slate-400">Administra tus pasatiempos e intereses personales</p>
        </div>
        <button
          (click)="openCreateForm()"
          class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium
                 text-white transition-colors hover:bg-indigo-700"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Hobby
        </button>
      </div>

      <!-- Hobbies Grid -->
      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      } @else {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (hobby of hobbies(); track hobby.id) {
            <div class="group relative rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all
                        hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/50">
              <!-- Actions -->
              <div class="absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  (click)="openEditForm(hobby)"
                  class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-indigo-400"
                  title="Editar"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                </button>
                <button
                  (click)="confirmDelete(hobby)"
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
                @if (hobby.icon_url) {
                  <img [src]="hobby.icon_url" [alt]="hobby.name['es']"
                       class="h-12 w-12 rounded-lg object-contain" />
                } @else {
                  <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-600/20 text-xl">
                    ❤️
                  </div>
                }
                <div class="flex-1">
                  <p class="text-sm font-semibold text-white">{{ hobby.name['es'] }}</p>
                  <p class="text-xs text-slate-500">{{ hobby.name['en'] }}</p>
                </div>
              </div>
              @if (hobby.description?.['es']) {
                <p class="mt-3 text-xs leading-relaxed text-slate-400">{{ hobby.description?.['es'] }}</p>
              }
            </div>
          } @empty {
            <div class="col-span-full py-12 text-center text-sm text-slate-500">
              No hay hobbies. ¡Añade el primero!
            </div>
          }
        </div>
      }

      <!-- Form Modal -->
      @if (showForm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
             (click)="closeForm()" (keydown.escape)="closeForm()">
          <div class="w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
               (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h2 class="text-lg font-semibold text-white">
                {{ editingId() ? 'Editar Hobby' : 'Nuevo Hobby' }}
              </h2>
              <button (click)="closeForm()" class="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveHobby()" class="space-y-4 p-6">
              <!-- Name ES/EN -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Nombre (Español)</label>
                  <input type="text" [(ngModel)]="form.name_es" name="name_es" placeholder="Fotografía"
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none" required />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Name (English)</label>
                  <input type="text" [(ngModel)]="form.name_en" name="name_en" placeholder="Photography"
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none" required />
                </div>
              </div>

              <!-- Slug -->
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Slug (URL)</label>
                <input type="text" [(ngModel)]="form.slug" name="slug" placeholder="mi-hobby"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                         placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
              </div>

              <!-- Description ES/EN -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Descripción (Español)</label>
                  <textarea [(ngModel)]="form.desc_es" name="desc_es" rows="3" placeholder="Descripción..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"></textarea>
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Description (English)</label>
                  <textarea [(ngModel)]="form.desc_en" name="desc_en" rows="3" placeholder="Description..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"></textarea>
                </div>
              </div>

              <!-- Content ES/EN -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Contenido largo (Español)</label>
                  <textarea [(ngModel)]="form.content_es" name="content_es" rows="4" placeholder="Contenido detallado..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"></textarea>
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-slate-400">Long content (English)</label>
                  <textarea [(ngModel)]="form.content_en" name="content_en" rows="4" placeholder="Detailed content..."
                    class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"></textarea>
                </div>
              </div>

              <!-- Icon URL + Upload -->
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Icono (URL o subir)</label>
                <div class="flex gap-3">
                  <input type="text" [(ngModel)]="form.icon_url" name="icon_url" placeholder="https://..."
                    class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
                  <label class="cursor-pointer rounded-lg border border-dashed border-slate-600 px-3 py-2.5 text-sm
                                text-slate-400 transition-colors hover:border-indigo-500 hover:text-indigo-400">
                    <input type="file" accept="image/*" class="hidden" (change)="onIconUpload($event)" />
                    📁 Subir
                  </label>
                </div>
                @if (form.icon_url) {
                  <img [src]="form.icon_url" alt="Preview" class="mt-2 h-10 w-10 object-contain" />
                }
              </div>

              <!-- Cover Image -->
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Imagen de portada</label>
                <div class="flex gap-3">
                  <input type="text" [(ngModel)]="form.image_url" name="image_url" placeholder="URL de la imagen"
                    class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white
                           placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
                  <label class="cursor-pointer rounded-lg border border-dashed border-slate-600 px-3 py-2.5 text-sm
                                text-slate-400 transition-colors hover:border-indigo-500 hover:text-indigo-400">
                    <input type="file" accept="image/*" class="hidden" (change)="onCoverUpload($event)" />
                    📁 Subir
                  </label>
                </div>
                @if (form.image_url) {
                  <img [src]="form.image_url" alt="Preview" class="mt-2 h-20 w-32 rounded-lg border border-slate-700 object-cover" />
                }
              </div>

              <!-- Gallery -->
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-400">Galería de imágenes</label>
                @if (form.gallery_urls.length > 0) {
                  <div class="mb-3 grid grid-cols-4 gap-2">
                    @for (url of form.gallery_urls; track url; let gi = $index) {
                      <div class="group/gal relative">
                        <img [src]="url" alt="Gallery" class="h-20 w-full rounded-lg border border-slate-700 object-cover" />
                        <button type="button" (click)="removeGalleryImage(gi)"
                          class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full
                                 bg-red-600 text-[10px] text-white opacity-0 transition-opacity group-hover/gal:opacity-100">
                          ✕
                        </button>
                      </div>
                    }
                  </div>
                }
                <label class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-dashed border-slate-600
                              px-3 py-2.5 text-sm text-slate-400 transition-colors hover:border-indigo-500 hover:text-indigo-400">
                  <input type="file" accept="image/*" class="hidden" (change)="onGalleryUpload($event)" multiple />
                  📁 Añadir imágenes
                </label>
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
            <h3 class="text-lg font-semibold text-white">¿Eliminar hobby?</h3>
            <p class="mt-2 text-sm text-slate-400">
              Se eliminará "{{ deletingHobby()?.name?.['es'] ?? '' }}" permanentemente.
            </p>
            <div class="mt-6 flex justify-end gap-3">
              <button (click)="showDeleteConfirm.set(false)"
                class="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                Cancelar
              </button>
              <button (click)="deleteHobby()"
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
export class AdminHobbies implements OnInit {
  private readonly admin = inject(AdminService);

  readonly hobbies = signal<HobbyDto[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  readonly showDeleteConfirm = signal(false);
  readonly deletingHobby = signal<HobbyDto | null>(null);

  form = this.emptyForm();

  async ngOnInit(): Promise<void> {
    await this.loadHobbies();
  }

  private async loadHobbies(): Promise<void> {
    this.loading.set(true);
    try {
      this.hobbies.set(await this.admin.getAllHobbies());
    } catch (err) {
      console.error('Load hobbies error:', err);
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

  openEditForm(hobby: HobbyDto): void {
    this.editingId.set(hobby.id);
    this.formError.set(null);
    this.form = {
      slug: hobby.slug ?? '',
      name_es: hobby.name['es'] ?? '',
      name_en: hobby.name['en'] ?? '',
      desc_es: hobby.description?.['es'] ?? '',
      desc_en: hobby.description?.['en'] ?? '',
      content_es: hobby.content?.['es'] ?? '',
      content_en: hobby.content?.['en'] ?? '',
      icon_url: hobby.icon_url ?? '',
      image_url: hobby.image_url ?? '',
      gallery_urls: hobby.gallery_urls ?? [],
      display_order: hobby.display_order,
    };
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  async onIconUpload(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const url = await this.admin.uploadImage(file);
      this.form.icon_url = url;
    } catch (err) {
      this.formError.set('Error al subir imagen');
    }
  }

  async onCoverUpload(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const url = await this.admin.uploadImage(file);
      this.form.image_url = url;
    } catch {
      this.formError.set('Error al subir imagen');
    }
  }

  async onGalleryUpload(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    for (const file of Array.from(files)) {
      try {
        const url = await this.admin.uploadImage(file);
        this.form.gallery_urls = [...this.form.gallery_urls, url];
      } catch {
        this.formError.set('Error al subir imagen de galería');
      }
    }
  }

  removeGalleryImage(index: number): void {
    this.form.gallery_urls = this.form.gallery_urls.filter((_, i) => i !== index);
  }

  async saveHobby(): Promise<void> {
    this.saving.set(true);
    this.formError.set(null);

    const data: HobbyFormData = {
      slug: this.form.slug.trim() || null,
      name: { es: this.form.name_es.trim(), en: this.form.name_en.trim() },
      description: this.form.desc_es || this.form.desc_en
        ? { es: this.form.desc_es, en: this.form.desc_en }
        : null,
      content: this.form.content_es || this.form.content_en
        ? { es: this.form.content_es, en: this.form.content_en }
        : null,
      icon_url: this.form.icon_url || null,
      image_url: this.form.image_url || null,
      gallery_urls: this.form.gallery_urls,
      display_order: this.form.display_order,
    };

    try {
      if (this.editingId()) {
        await this.admin.updateHobby(this.editingId()!, data);
      } else {
        await this.admin.createHobby(data);
      }
      this.closeForm();
      await this.loadHobbies();
    } catch (err: any) {
      this.formError.set(err.message ?? 'Error al guardar');
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(hobby: HobbyDto): void {
    this.deletingHobby.set(hobby);
    this.showDeleteConfirm.set(true);
  }

  async deleteHobby(): Promise<void> {
    const h = this.deletingHobby();
    if (!h) return;
    try {
      await this.admin.deleteHobby(h.id);
      this.showDeleteConfirm.set(false);
      await this.loadHobbies();
    } catch (err) {
      console.error('Delete hobby error:', err);
    }
  }

  private emptyForm() {
    return {
      slug: '',
      name_es: '',
      name_en: '',
      desc_es: '',
      desc_en: '',
      content_es: '',
      content_en: '',
      icon_url: '',
      image_url: '',
      gallery_urls: [] as string[],
      display_order: 0,
    };
  }
}
