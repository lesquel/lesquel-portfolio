import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import {
  Home, FolderOpen, BarChart3, Mail, User, LogOut, ExternalLink, Menu,
  Copy, Archive, Trash2, Inbox, ImageOff, Loader, Star, ArrowUp, ArrowDown,
  Eye, EyeOff, Check, Upload, CheckCircle2, Plus,
  Github, Linkedin, Twitter, Globe, Youtube,
  Sun, Moon, ChevronDown, ChevronUp, ChevronRight,
  Code, Zap, Lightbulb, Brain, Rocket, Terminal, Database, Heart, Circle, X
} from 'lucide-angular';

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

    // Lucide icons provider — global registration for all icons used in the app
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({
        home: Home,
        'folder-open': FolderOpen,
        'bar-chart-3': BarChart3,
        mail: Mail,
        user: User,
        'log-out': LogOut,
        'external-link': ExternalLink,
        menu: Menu,
        copy: Copy,
        archive: Archive,
        'trash-2': Trash2,
        inbox: Inbox,
        'image-off': ImageOff,
        loader: Loader,
        star: Star,
        'arrow-up': ArrowUp,
        'arrow-down': ArrowDown,
        eye: Eye,
        'eye-off': EyeOff,
        check: Check,
        upload: Upload,
        'check-circle-2': CheckCircle2,
        plus: Plus,
        github: Github,
        linkedin: Linkedin,
        twitter: Twitter,
        globe: Globe,
        youtube: Youtube,
        sun: Sun,
        moon: Moon,
        'chevron-down': ChevronDown,
        'chevron-up': ChevronUp,
        'chevron-right': ChevronRight,
        code: Code,
        zap: Zap,
        lightbulb: Lightbulb,
        brain: Brain,
        rocket: Rocket,
        terminal: Terminal,
        database: Database,
        heart: Heart,
        circle: Circle,
        x: X,
      }),
    },

    // Clean Architecture: bind abstract repos to Supabase implementations
    { provide: ProjectRepository, useClass: SupabaseProjectRepository },
    { provide: SkillRepository, useClass: SupabaseSkillRepository },
    { provide: MessageRepository, useClass: SupabaseMessageRepository },
  ],
};
