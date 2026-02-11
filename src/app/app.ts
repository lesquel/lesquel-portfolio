import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageTransitionComponent } from './presentation/shared/components/page-transition/page-transition';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageTransitionComponent],
  template: `
    <router-outlet />
    <app-page-transition />
  `,
})
export class App {}
