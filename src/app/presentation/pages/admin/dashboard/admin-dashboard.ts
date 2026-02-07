import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, FolderOpen, BarChart3, Mail, CheckCircle2, ImageOff, Plus } from 'lucide-angular';
import { AdminService, type DashboardStats, type MessageRow } from '../../../../core/admin/admin.service';
import type { ProjectDto } from '../../../../data/models/dtos';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-400">Resumen general de tu portafolio</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Projects -->
        <div class="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5
                    transition-colors hover:border-indigo-500/50">
          <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-indigo-600/10 transition-transform
                      group-hover:scale-125"></div>
          <div class="relative">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
              <lucide-icon
                [img]="folderOpenIcon"
                class="h-5 w-5"
              ></lucide-icon>
            </div>
            <p class="mt-3 text-2xl font-bold text-white">{{ stats()?.totalProjects ?? '—' }}</p>
            <p class="text-xs text-slate-400">
              Proyectos <span class="text-indigo-400">({{ stats()?.publishedProjects ?? 0 }} publicados)</span>
            </p>
          </div>
        </div>

        <!-- Skills -->
        <div class="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5
                    transition-colors hover:border-emerald-500/50">
          <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-600/10 transition-transform
                      group-hover:scale-125"></div>
          <div class="relative">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
              <lucide-icon
                [img]="barChartIcon"
                class="h-5 w-5"
              ></lucide-icon>
            </div>
            <p class="mt-3 text-2xl font-bold text-white">{{ stats()?.totalSkills ?? '—' }}</p>
            <p class="text-xs text-slate-400">Tecnologías</p>
          </div>
        </div>

        <!-- Messages -->
        <div class="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5
                    transition-colors hover:border-amber-500/50">
          <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-600/10 transition-transform
                      group-hover:scale-125"></div>
          <div class="relative">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/20 text-amber-400">
              <lucide-icon
                [img]="mailIcon"
                class="h-5 w-5"
              ></lucide-icon>
            </div>
            <p class="mt-3 text-2xl font-bold text-white">{{ stats()?.totalMessages ?? '—' }}</p>
            <p class="text-xs text-slate-400">
              Mensajes
              @if ((stats()?.unreadMessages ?? 0) > 0) {
                <span class="ml-1 inline-flex h-5 items-center rounded-full bg-amber-600 px-1.5 text-[10px] font-bold text-white">
                  {{ stats()?.unreadMessages }} nuevos
                </span>
              }
            </p>
          </div>
        </div>

        <!-- Status -->
        <div class="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5
                    transition-colors hover:border-violet-500/50">
          <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-violet-600/10 transition-transform
                      group-hover:scale-125"></div>
          <div class="relative">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
              <lucide-icon
                [img]="checkCircleIcon"
                class="h-5 w-5"
              ></lucide-icon>
            </div>
            <p class="mt-3 text-2xl font-bold text-emerald-400">Online</p>
            <p class="text-xs text-slate-400">Estado del portafolio</p>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Recent Projects -->
        <div class="rounded-xl border border-slate-800 bg-slate-900">
          <div class="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <h2 class="font-semibold text-white">Proyectos Recientes</h2>
            <a routerLink="/admin/projects"
               class="text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300">
              Ver todos →
            </a>
          </div>
          <div class="divide-y divide-slate-800">
            @for (project of recentProjects(); track project.id) {
              <div class="flex items-center gap-4 px-5 py-3">
                @if (project.image_url) {
                  <img [src]="project.image_url" [alt]="project.title['es']"
                       class="h-10 w-10 rounded-lg border border-slate-700 object-cover" />
                } @else {
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800">
                    <lucide-icon
                      [img]="imageOffIcon"
                      class="h-5 w-5 text-slate-600"
                    ></lucide-icon>
                  </div>
                }
                <div class="flex-1">
                  <p class="text-sm font-medium text-white">{{ project.title['es'] }}</p>
                  <p class="text-xs text-slate-500">{{ project.slug }}</p>
                </div>
                <span [class]="project.is_published
                  ? 'rounded-full bg-emerald-600/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400'
                  : 'rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] font-medium text-slate-400'">
                  {{ project.is_published ? 'Publicado' : 'Borrador' }}
                </span>
              </div>
            } @empty {
              <div class="px-5 py-8 text-center text-sm text-slate-500">
                No hay proyectos aún
              </div>
            }
          </div>
        </div>

        <!-- Recent Messages -->
        <div class="rounded-xl border border-slate-800 bg-slate-900">
          <div class="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <h2 class="font-semibold text-white">Mensajes Recientes</h2>
            <a routerLink="/admin/messages"
               class="text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300">
              Ver todos →
            </a>
          </div>
          <div class="divide-y divide-slate-800">
            @for (msg of recentMessages(); track msg.id) {
              <div class="flex items-start gap-3 px-5 py-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                     [class]="msg.is_read ? 'bg-slate-800 text-slate-400' : 'bg-indigo-600 text-white'">
                  {{ msg.full_name[0]?.toUpperCase() }}
                </div>
                <div class="flex-1 truncate">
                  <p class="text-sm font-medium text-white">{{ msg.full_name }}</p>
                  <p class="truncate text-xs text-slate-500">{{ msg.content }}</p>
                </div>
                <span class="shrink-0 text-[10px] text-slate-600">
                  {{ formatDate(msg.created_at) }}
                </span>
              </div>
            } @empty {
              <div class="px-5 py-8 text-center text-sm text-slate-500">
                No hay mensajes aún
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 class="mb-4 font-semibold text-white">Acciones Rápidas</h2>
        <div class="flex flex-wrap gap-3">
          <a routerLink="/admin/projects" [queryParams]="{ action: 'new' }"
             class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium
                    text-white transition-colors hover:bg-indigo-700">
            <lucide-icon
              [img]="plusIcon"
              class="h-4 w-4"
            ></lucide-icon>
            Nuevo Proyecto
          </a>
          <a routerLink="/admin/skills"
             class="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm
                    font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white">
            <lucide-icon
              [img]="plusIcon"
              class="h-4 w-4"
            ></lucide-icon>
            Nueva Tecnología
          </a>
          <a routerLink="/admin/messages"
             class="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm
                    font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white">
            <lucide-icon
              [img]="mailIcon"
              class="h-4 w-4"
            ></lucide-icon>
            Ver Mensajes
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboard implements OnInit {
  private readonly admin = inject(AdminService);

  // Lucide Icons
  protected readonly folderOpenIcon = FolderOpen;
  protected readonly barChartIcon = BarChart3;
  protected readonly mailIcon = Mail;
  protected readonly checkCircleIcon = CheckCircle2;
  protected readonly imageOffIcon = ImageOff;
  protected readonly plusIcon = Plus;

  readonly stats = signal<DashboardStats | null>(null);
  readonly recentProjects = signal<(ProjectDto & { is_published: boolean })[]>([]);
  readonly recentMessages = signal<MessageRow[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      const [statsData, projects, messages] = await Promise.all([
        this.admin.getDashboardStats(),
        this.admin.getAllProjects(),
        this.admin.getAllMessages(),
      ]);
      this.stats.set(statsData);
      this.recentProjects.set(projects.slice(0, 5));
      this.recentMessages.set(messages.slice(0, 5));
    } catch (err) {
      console.error('AdminDashboard load error:', err);
    }
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString('es');
  }
}
