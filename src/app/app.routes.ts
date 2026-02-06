import { Routes } from '@angular/router';

export const routes: Routes = [
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
  {
    path: '**',
    loadComponent: () =>
      import('./presentation/pages/not-found/not-found').then(
        (m) => m.NotFoundPage,
      ),
  },
];
