import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { LanguageService } from '../i18n/language.service';

interface SeoConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * Manages dynamic meta tags, Open Graph, and JSON-LD for SEO.
 * Works with SSR — tags are set before the HTML is sent to the client.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly lang = inject(LanguageService);

  private readonly defaults: Record<string, SeoConfig> = {
    es: {
      title: 'Lesquel — Desarrollador Full Stack',
      description:
        'Portafolio profesional de Lesquel — Desarrollador Full Stack especializado en Angular, TypeScript y arquitecturas modernas.',
    },
    en: {
      title: 'Lesquel — Full Stack Developer',
      description:
        'Professional portfolio of Lesquel — Full Stack Developer specialized in Angular, TypeScript and modern architectures.',
    },
  };

  /**
   * Update all meta tags. Call on route change or language change.
   */
  update(config?: SeoConfig): void {
    const currentLang = this.lang.currentLang();
    const fallback = this.defaults[currentLang] ?? this.defaults['es']!;
    const title = config?.title ?? fallback.title!;
    const description = config?.description ?? fallback.description!;

    this.titleService.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({
      property: 'og:type',
      content: config?.type ?? 'website',
    });

    if (config?.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }
    if (config?.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    this.meta.updateTag({
      property: 'og:locale',
      content: currentLang === 'es' ? 'es_ES' : 'en_US',
    });
  }

  /**
   * Inject JSON-LD structured data for Google rich results.
   */
  setJsonLd(data: Record<string, unknown>): void {
    // Remove previous JSON-LD if exists
    const existing = this.document.querySelector('script[type="application/ld+json"]');
    if (existing) existing.remove();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  /**
   * Set the default Person schema for the portfolio.
   */
  setPersonSchema(name: string, jobTitle: string, url: string): void {
    this.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name,
      jobTitle,
      url,
      sameAs: [], // Add social links here
    });
  }
}
