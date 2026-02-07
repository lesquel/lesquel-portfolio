import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { ProjectRepository } from './domain/repositories/project.repository';
import { SkillRepository } from './domain/repositories/skill.repository';
import { MessageRepository } from './domain/repositories/message.repository';
import { SupabaseProjectRepository } from './data/repositories/supabase-project.repository';
import { SupabaseSkillRepository } from './data/repositories/supabase-skill.repository';
import { SupabaseMessageRepository } from './data/repositories/supabase-message.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),

    // i18n — ngx-translate v17 provider API
    provideTranslateService({ defaultLanguage: 'es' }),
    provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),

    // Clean Architecture: bind abstract repos to Supabase implementations
    { provide: ProjectRepository, useClass: SupabaseProjectRepository },
    { provide: SkillRepository, useClass: SupabaseSkillRepository },
    { provide: MessageRepository, useClass: SupabaseMessageRepository },
  ],
};
