import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { ProjectRepository } from './domain/repositories/project.repository';
import { SkillRepository } from './domain/repositories/skill.repository';
import { MessageRepository } from './domain/repositories/message.repository';
import { SupabaseProjectRepository } from './data/repositories/supabase-project.repository';
import { SupabaseSkillRepository } from './data/repositories/supabase-skill.repository';
import { SupabaseMessageRepository } from './data/repositories/supabase-message.repository';

function httpTranslateLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),

    // i18n — ngx-translate
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }).providers!,

    // Clean Architecture: bind abstract repos to Supabase implementations
    { provide: ProjectRepository, useClass: SupabaseProjectRepository },
    { provide: SkillRepository, useClass: SupabaseSkillRepository },
    { provide: MessageRepository, useClass: SupabaseMessageRepository },
  ],
};
