import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  /* ─── Public Portfolio ─── */
  {
    path: '',
    loadComponent: () =>
      import('./presentation/layouts/main-layout/main-layout').then(
        (m) => m.MainLayout,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./presentation/pages/home/home').then((m) => m.HomePage),
      },
    ],
  },

  /* ─── Admin: Login (public) ─── */
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./presentation/pages/admin/login/admin-login').then(
        (m) => m.AdminLoginPage,
      ),
  },

  /* ─── Admin: Dashboard (protected) ─── */
  {
    path: 'admin',
    loadComponent: () =>
      import('./presentation/layouts/admin-layout/admin-layout').then(
        (m) => m.AdminLayout,
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./presentation/pages/admin/dashboard/admin-dashboard').then(
            (m) => m.AdminDashboard,
          ),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./presentation/pages/admin/projects/admin-projects').then(
            (m) => m.AdminProjects,
          ),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./presentation/pages/admin/skills/admin-skills').then(
            (m) => m.AdminSkills,
          ),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./presentation/pages/admin/messages/admin-messages').then(
            (m) => m.AdminMessages,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./presentation/pages/admin/profile/admin-profile').then(
            (m) => m.AdminProfile,
          ),
      },
    ],
  },

  /* ─── 404 ─── */
  {
    path: '**',
    loadComponent: () =>
      import('./presentation/pages/not-found/not-found').then(
        (m) => m.NotFoundPage,
      ),
  },
];
