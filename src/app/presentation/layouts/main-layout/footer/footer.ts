import { Component } from '@angular/core';
import { LucideAngularModule, Github, Linkedin, Mail } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule, LucideAngularModule],
  template: `
    <footer class="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <!-- Brand -->
          <div class="text-center md:text-left">
            <p class="text-lg font-bold text-slate-900 dark:text-white">
              <span class="text-primary">&lt;</span>Lesquel<span class="text-primary">/&gt;</span>
            </p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {{ 'HERO.ROLE' | translate }}
            </p>
          </div>

          <!-- Social Links -->
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/lesquel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              class="flex h-10 w-10 items-center justify-center rounded-full text-slate-500
                     transition-colors hover:bg-slate-100 hover:text-slate-900
                     dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <lucide-icon
                [img]="githubIcon"
                class="h-5 w-5"
              ></lucide-icon>
            </a>
            <a
              href="https://linkedin.com/in/lesquel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="flex h-10 w-10 items-center justify-center rounded-full text-slate-500
                     transition-colors hover:bg-slate-100 hover:text-slate-900
                     dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <lucide-icon
                [img]="linkedinIcon"
                class="h-5 w-5"
              ></lucide-icon>
            </a>
            <a
              href="mailto:lesquel1319@gmail.com"
              aria-label="Email"
              class="flex h-10 w-10 items-center justify-center rounded-full text-slate-500
                     transition-colors hover:bg-slate-100 hover:text-slate-900
                     dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <lucide-icon
                [img]="mailIcon"
                class="h-5 w-5"
              ></lucide-icon>
            </a>
          </div>
        </div>

        <!-- Bottom -->
        <div class="mt-8 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            &copy; {{ currentYear }} Lesquel. {{ 'FOOTER.RIGHTS' | translate }}
          </p>
          <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {{ 'FOOTER.BUILT_WITH' | translate }} Angular, Tailwind CSS & Supabase
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly githubIcon = Github;
  protected readonly linkedinIcon = Linkedin;
  protected readonly mailIcon = Mail;
  protected readonly currentYear = new Date().getFullYear();
}
