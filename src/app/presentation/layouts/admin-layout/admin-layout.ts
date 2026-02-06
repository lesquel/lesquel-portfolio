import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/auth/auth.service';


@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <!-- Loading State -->
    @if (auth.isLoading()) {
      <div class="flex min-h-screen items-center justify-center bg-slate-950">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    } @else {
      <div class="flex min-h-screen bg-slate-950">
        <!-- Sidebar -->
        <aside
          class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-slate-900
                 transition-transform duration-300"
          [class.-translate-x-full]="!sidebarOpen() && isMobile()"
          [class.translate-x-0]="sidebarOpen() || !isMobile()"
        >
          <!-- Brand -->
          <div class="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              L
            </div>
            <div>
              <p class="text-sm font-bold text-white">Lesquel</p>
              <p class="text-[10px] uppercase tracking-widest text-slate-500">Admin Panel</p>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 space-y-1 overflow-y-auto p-3">
            <p class="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              General
            </p>

            <a
              routerLink="/admin"
              routerLinkActive="bg-indigo-600/20 text-indigo-400"
              [routerLinkActiveOptions]="{ exact: true }"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400
                     transition-colors hover:bg-slate-800 hover:text-white"
              (click)="closeMobileSidebar()"
            >
              <lucide-icon
                name="home"
                class="h-5 w-5"
              ></lucide-icon>
              Dashboard
            </a>

            <p class="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Contenido
            </p>

            <a
              routerLink="/admin/projects"
              routerLinkActive="bg-indigo-600/20 text-indigo-400"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400
                     transition-colors hover:bg-slate-800 hover:text-white"
              (click)="closeMobileSidebar()"
            >
              <lucide-icon
                name="folder-open"
                class="h-5 w-5"
              ></lucide-icon>
              Proyectos
            </a>

            <a
              routerLink="/admin/skills"
              routerLinkActive="bg-indigo-600/20 text-indigo-400"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400
                     transition-colors hover:bg-slate-800 hover:text-white"
              (click)="closeMobileSidebar()"
            >
              <lucide-icon
                name="bar-chart-3"
                class="h-5 w-5"
              ></lucide-icon>
              Tecnologías
            </a>

            <a
              routerLink="/admin/messages"
              routerLinkActive="bg-indigo-600/20 text-indigo-400"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400
                     transition-colors hover:bg-slate-800 hover:text-white"
              (click)="closeMobileSidebar()"
            >
              <lucide-icon
                name="mail"
                class="h-5 w-5"
              ></lucide-icon>
              Mensajes
            </a>

            <p class="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Configuración
            </p>

            <a
              routerLink="/admin/profile"
              routerLinkActive="bg-indigo-600/20 text-indigo-400"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400
                     transition-colors hover:bg-slate-800 hover:text-white"
              (click)="closeMobileSidebar()"
            >
              <lucide-icon
                name="user"
                class="h-5 w-5"
              ></lucide-icon>
              Perfil
            </a>
          </nav>

          <!-- User Footer -->
          <div class="border-t border-slate-800 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {{ initials() }}
              </div>
              <div class="flex-1 truncate">
                <p class="truncate text-sm font-medium text-white">{{ auth.getDisplayName() }}</p>
                <p class="truncate text-xs text-slate-500">Super Admin</p>
              </div>
              <button
                (click)="auth.signOut()"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500
                       transition-colors hover:bg-slate-800 hover:text-red-400"
                title="Cerrar Sesión"
              >
              <lucide-icon
                name="log-out"
                class="h-4 w-4"
              ></lucide-icon>
              </button>
            </div>
          </div>
        </aside>

        <!-- Overlay for mobile -->
        @if (sidebarOpen() && isMobile()) {
          <div
            class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            (click)="sidebarOpen.set(false)"
          ></div>
        }

        <!-- Main Content -->
        <div class="flex flex-1 flex-col transition-all duration-300"
             [class.ml-0]="isMobile()" [class.ml-64]="!isMobile()">
          <!-- Top Bar -->
          <header class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-lg">
            <!-- Mobile menu toggle -->
            <button
              class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400
                     transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
              (click)="sidebarOpen.set(!sidebarOpen())"
            >
              <lucide-icon
                name="menu"
                class="h-5 w-5"
              ></lucide-icon>
            </button>

            <div class="flex-1"></div>

            <!-- Go to portfolio link -->
            <a
              href="/"
              target="_blank"
              class="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs
                     font-medium text-slate-400 transition-colors hover:border-slate-600 hover:text-white"
            >
              <lucide-icon
                name="external-link"
                class="h-3.5 w-3.5"
              ></lucide-icon>
              Ver Portafolio
            </a>
          </header>

          <!-- Page Content -->
          <main class="flex-1 p-6">
            <router-outlet />
          </main>
        </div>
      </div>
    }
  `,
})
export class AdminLayout {
  protected readonly auth = inject(AuthService);
  protected readonly sidebarOpen = signal(false);
  protected readonly isMobile = signal(false);

  protected readonly initials = computed(() => {
    const name = this.auth.getDisplayName();
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'A';
  });

  constructor() {
    if (typeof window !== 'undefined') {
      this.checkMobile();
      window.addEventListener('resize', () => this.checkMobile());
    }
  }

  private checkMobile(): void {
    this.isMobile.set(window.innerWidth < 1024);
  }

  closeMobileSidebar(): void {
    if (this.isMobile()) {
      this.sidebarOpen.set(false);
    }
  }
}
