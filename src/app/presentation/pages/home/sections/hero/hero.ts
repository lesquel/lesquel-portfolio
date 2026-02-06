import { Component, afterNextRender, inject, PLATFORM_ID, ElementRef, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Hero section — immersive parallax with floating device mockups,
 * animated tech icons, and staggered text entrance.
 */
@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <section
      id="hero"
      #heroSection
      class="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <!-- ═══════ LAYER 0: Animated Gradient Background ═══════ -->
      <div class="absolute inset-0 -z-20"
        style="background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,.15), transparent),
               radial-gradient(ellipse 60% 40% at 80% 100%, rgba(6,182,212,.1), transparent);
      ">
        <div class="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-slate-50
                     dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900"></div>
      </div>

      <!-- ═══════ LAYER 1: Grid Pattern ═══════ -->
      <div class="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]" #gridLayer aria-hidden="true"
           style="background-image:
             linear-gradient(rgba(99,102,241,.5) 1px, transparent 1px),
             linear-gradient(90deg, rgba(99,102,241,.5) 1px, transparent 1px);
           background-size: 60px 60px;"></div>

      <!-- ═══════ LAYER 2: Floating Gradient Orbs (deep parallax) ═══════ -->
      <div class="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div #orb1
          class="absolute -left-32 top-[10%] h-[500px] w-[500px] rounded-full
                 bg-indigo-500/15 blur-[120px] dark:bg-indigo-500/8"></div>
        <div #orb2
          class="absolute -right-32 bottom-[5%] h-[600px] w-[600px] rounded-full
                 bg-cyan-400/12 blur-[150px] dark:bg-cyan-500/6"></div>
        <div #orb3
          class="absolute left-[40%] top-[60%] h-[300px] w-[300px] rounded-full
                 bg-violet-400/10 blur-[100px] dark:bg-violet-500/5"></div>
      </div>

      <!-- ═══════ LAYER 3: Floating Tech Icons ═══════ -->
      <div class="absolute inset-0 -z-[5] overflow-hidden" #iconsLayer aria-hidden="true">
        <!-- Row A — near edges, slow parallax -->
        <div #icon1 class="hero-icon absolute left-[5%] top-[15%] opacity-0">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/50 bg-white/70 shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/70">
            <svg class="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 19.5h20L12 2zm0 4l6.5 11.5h-13L12 6z"/></svg>
          </div>
        </div>
        <div #icon2 class="hero-icon absolute right-[8%] top-[20%] opacity-0">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/50 bg-white/70 shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/70">
            <svg class="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.31 0-.6.045-.876.143C3.472 2.306 2.34 5.148 3.545 9.2c-1.835 1.26-2.97 2.71-2.97 4.08 0 3.08 4.31 5.58 9.625 5.58 5.315 0 9.625-2.5 9.625-5.58 0-1.37-1.135-2.82-2.97-4.08 1.205-4.052.073-6.894-2.637-7.723a2.57 2.57 0 0 0-.876-.143zM7.37 20.53c-.093-.015-.19-.026-.285-.042 1.13.525 2.55.82 4.025.82a13.4 13.4 0 0 0 3.16-.38c-2.39.55-5.09.135-6.9-.398z"/></svg>
          </div>
        </div>
        <div #icon3 class="hero-icon absolute left-[12%] bottom-[25%] opacity-0">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/50 bg-white/70 shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/70">
            <svg class="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.998 2C6.477 2 2 6.477 2 11.998S6.477 22 11.998 22 22 17.52 22 11.998 17.52 2 11.998 2zm6.81 8.123h-3.564c-.21-1.633-.69-3.084-1.37-4.218a8.023 8.023 0 0 1 4.934 4.218zM12 4.032c.936 1.02 1.67 2.552 2.04 4.091H9.96c.37-1.54 1.104-3.07 2.04-4.091zM4.19 13.875c-.15-.6-.222-1.227-.222-1.875s.072-1.275.222-1.875h4.073a16.6 16.6 0 0 0-.137 1.875c0 .639.053 1.264.137 1.875H4.19zm1.001 1.875h3.564c.21 1.633.69 3.084 1.37 4.218a8.023 8.023 0 0 1-4.934-4.218zM8.755 10.125A14.65 14.65 0 0 1 8.887 12c0 .643.058 1.275.136 1.875h5.954A14.65 14.65 0 0 0 15.113 12c0-.643-.058-1.275-.136-1.875H8.755zM12 19.968c-.936-1.02-1.67-2.552-2.04-4.093h4.08c-.37 1.54-1.104 3.073-2.04 4.093zm2.245-5.968c.21-1.633.69-3.084 1.37-4.218a8.023 8.023 0 0 1 4.934 4.218h-3.564z"/></svg>
          </div>
        </div>

        <!-- Row B — mid distance, medium speed -->
        <div #icon4 class="hero-icon absolute left-[22%] top-[8%] opacity-0">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200/50 bg-white/80 shadow-xl backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/80">
            <svg class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/>
            </svg>
          </div>
        </div>
        <div #icon5 class="hero-icon absolute right-[15%] top-[45%] opacity-0">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/50 bg-white/80 shadow-xl backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/80">
            <svg class="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"/>
            </svg>
          </div>
        </div>
        <div #icon6 class="hero-icon absolute right-[25%] bottom-[18%] opacity-0">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/50 bg-white/70 shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/70">
            <svg class="h-6 w-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/>
            </svg>
          </div>
        </div>

        <!-- Row C — closer, faster parallax -->
        <div #icon7 class="hero-icon absolute left-[35%] bottom-[12%] opacity-0">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200/50 bg-white/60 shadow-md backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/60">
            <svg class="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/>
            </svg>
          </div>
        </div>
        <div #icon8 class="hero-icon absolute right-[5%] bottom-[35%] opacity-0">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200/50 bg-white/60 shadow-md backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/60">
            <svg class="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- ═══════ LAYER 4: Device Mockups ═══════ -->
      <div class="absolute inset-0 -z-[3] overflow-hidden" aria-hidden="true">
        <!-- Laptop Mockup (left) -->
        <div #deviceLaptop class="hero-device absolute -left-12 bottom-[15%] opacity-0 md:left-[3%]">
          <div class="relative w-56 md:w-72">
            <!-- Screen -->
            <div class="rounded-t-xl border border-slate-200 bg-slate-100 p-1.5 dark:border-slate-700 dark:bg-slate-800">
              <div class="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600">
                <div class="flex h-full flex-col items-center justify-center gap-1 p-3">
                  <div class="h-1.5 w-12 rounded-full bg-white/40"></div>
                  <div class="h-1 w-20 rounded-full bg-white/25"></div>
                  <div class="mt-1 grid grid-cols-3 gap-1">
                    <div class="h-4 w-6 rounded bg-white/20"></div>
                    <div class="h-4 w-6 rounded bg-white/15"></div>
                    <div class="h-4 w-6 rounded bg-white/20"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Keyboard base -->
            <div class="h-2 rounded-b-xl bg-slate-200 dark:bg-slate-700"></div>
            <div class="mx-auto h-1 w-3/4 rounded-b-lg bg-slate-300 dark:bg-slate-600"></div>
          </div>
        </div>

        <!-- Phone Mockup (right) -->
        <div #devicePhone class="hero-device absolute -right-6 top-[20%] opacity-0 md:right-[5%]">
          <div class="w-28 md:w-36">
            <div class="rounded-[1.5rem] border-2 border-slate-200 bg-slate-100 p-1.5 dark:border-slate-700 dark:bg-slate-800">
              <!-- Notch -->
              <div class="mx-auto mb-1 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div class="aspect-[9/19] overflow-hidden rounded-[1rem] bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-600">
                <div class="flex h-full flex-col items-center justify-center gap-2 p-3">
                  <div class="h-8 w-8 rounded-full bg-white/30"></div>
                  <div class="h-1 w-10 rounded-full bg-white/30"></div>
                  <div class="h-1 w-8 rounded-full bg-white/20"></div>
                  <div class="mt-auto mb-2 flex gap-2">
                    <div class="h-3 w-3 rounded bg-white/25"></div>
                    <div class="h-3 w-3 rounded bg-white/25"></div>
                    <div class="h-3 w-3 rounded bg-white/25"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tablet Mockup (right-bottom) -->
        <div #deviceTablet class="hero-device absolute -right-20 bottom-[8%] hidden opacity-0 lg:block lg:right-[8%]">
          <div class="w-48 rotate-6">
            <div class="rounded-2xl border-2 border-slate-200 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-800">
              <div class="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600">
                <div class="flex h-full flex-col items-center justify-center gap-1.5 p-4">
                  <div class="h-1 w-16 rounded-full bg-white/35"></div>
                  <div class="h-1 w-12 rounded-full bg-white/25"></div>
                  <div class="mt-1 grid grid-cols-2 gap-1.5">
                    <div class="h-6 w-10 rounded bg-white/20"></div>
                    <div class="h-6 w-10 rounded bg-white/15"></div>
                    <div class="h-6 w-10 rounded bg-white/15"></div>
                    <div class="h-6 w-10 rounded bg-white/20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════ LAYER 5: Particle Dots ═══════ -->
      <div class="absolute inset-0 -z-[2] overflow-hidden" #particlesLayer aria-hidden="true">
        @for (p of particles; track p.id) {
          <div class="hero-particle absolute rounded-full"
               [style.left.%]="p.x"
               [style.top.%]="p.y"
               [style.width.px]="p.size"
               [style.height.px]="p.size"
               [class]="p.color"></div>
        }
      </div>

      <!-- ═══════ MAIN CONTENT ═══════ -->
      <div class="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <!-- Badge -->
        <div #badge class="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 opacity-0 dark:border-indigo-800 dark:bg-indigo-950/50">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
          </span>
          <span class="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            {{ 'HERO.GREETING' | translate }}
          </span>
        </div>

        <!-- Name -->
        <h1 #heroName
          class="mb-6 text-5xl font-black tracking-tight text-slate-900 opacity-0
                 dark:text-white sm:text-7xl lg:text-8xl">
          <span class="inline-block">{{ 'HERO.NAME' | translate }}</span>
        </h1>

        <!-- Role with gradient text -->
        <div class="mb-8 h-12 sm:h-14">
          <h2 #heroRole
            class="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text
                   text-2xl font-bold text-transparent opacity-0 sm:text-3xl lg:text-4xl">
            {{ 'HERO.ROLE' | translate }}
          </h2>
        </div>

        <!-- Subtitle -->
        <p #subtitle
          class="mx-auto mb-10 max-w-2xl text-lg text-slate-500 opacity-0 dark:text-slate-400 sm:text-xl">
          {{ 'HERO.SUBTITLE' | translate }}
        </p>

        <!-- CTAs -->
        <div #ctaContainer class="flex flex-col items-center gap-4 opacity-0 sm:flex-row sm:justify-center">
          <a href="#projects"
            class="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5
                   text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all
                   hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/30">
            {{ 'HERO.CTA_PROJECTS' | translate }}
            <svg class="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a href="#contact"
            class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-8 py-3.5
                   text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all
                   hover:-translate-y-0.5 hover:shadow-md dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200">
            {{ 'HERO.CTA_CONTACT' | translate }}
          </a>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
        <div #scrollIndicator class="flex flex-col items-center gap-2 opacity-0">
          <span class="text-[10px] font-medium uppercase tracking-widest text-slate-400">Scroll</span>
          <div class="flex h-10 w-6 justify-center rounded-full border-2 border-slate-300/60 dark:border-slate-600/60">
            <div class="mt-2 h-2 w-1 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-particle {
      opacity: 0.15;
    }
    :host-context(.dark) .hero-particle {
      opacity: 0.1;
    }
  `],
})
export class HeroSection {
  private readonly platformId = inject(PLATFORM_ID);

  // Content refs
  private readonly badge = viewChild<ElementRef>('badge');
  private readonly heroName = viewChild<ElementRef>('heroName');
  private readonly heroRole = viewChild<ElementRef>('heroRole');
  private readonly subtitle = viewChild<ElementRef>('subtitle');
  private readonly ctaContainer = viewChild<ElementRef>('ctaContainer');
  private readonly scrollIndicator = viewChild<ElementRef>('scrollIndicator');

  // Parallax layer refs
  private readonly gridLayer = viewChild<ElementRef>('gridLayer');
  private readonly orb1 = viewChild<ElementRef>('orb1');
  private readonly orb2 = viewChild<ElementRef>('orb2');
  private readonly orb3 = viewChild<ElementRef>('orb3');

  // Tech icon refs
  private readonly icon1 = viewChild<ElementRef>('icon1');
  private readonly icon2 = viewChild<ElementRef>('icon2');
  private readonly icon3 = viewChild<ElementRef>('icon3');
  private readonly icon4 = viewChild<ElementRef>('icon4');
  private readonly icon5 = viewChild<ElementRef>('icon5');
  private readonly icon6 = viewChild<ElementRef>('icon6');
  private readonly icon7 = viewChild<ElementRef>('icon7');
  private readonly icon8 = viewChild<ElementRef>('icon8');

  // Device refs
  private readonly deviceLaptop = viewChild<ElementRef>('deviceLaptop');
  private readonly devicePhone = viewChild<ElementRef>('devicePhone');
  private readonly deviceTablet = viewChild<ElementRef>('deviceTablet');

  private gsapCtx: any;

  // Generate random particles
  readonly particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    color: ['bg-indigo-400', 'bg-violet-400', 'bg-cyan-400', 'bg-emerald-400', 'bg-pink-400'][
      Math.floor(Math.random() * 5)
    ],
  }));

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      this.gsapCtx = gsap.context(() => {
        /* ── Entrance Timeline ── */
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Content stagger
        tl.to(this.badge()?.nativeElement, { opacity: 1, y: 0, duration: 0.5 }, 0.3)
          .fromTo(
            this.heroName()?.nativeElement,
            { opacity: 0, y: 40, scale: 0.92 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power4.out' },
            0.5,
          )
          .to(this.heroRole()?.nativeElement, { opacity: 1, y: 0, duration: 0.7 }, 0.8)
          .to(this.subtitle()?.nativeElement, { opacity: 1, y: 0, duration: 0.7 }, 1.0)
          .to(this.ctaContainer()?.nativeElement, { opacity: 1, y: 0, duration: 0.7 }, 1.2)
          .to(this.scrollIndicator()?.nativeElement, { opacity: 1, duration: 0.5 }, 1.5);

        // Icons pop-in (staggered)
        const iconEls = [
          this.icon1, this.icon2, this.icon3, this.icon4,
          this.icon5, this.icon6, this.icon7, this.icon8,
        ].map((ref) => ref()?.nativeElement).filter(Boolean);

        tl.fromTo(
          iconEls,
          { opacity: 0, scale: 0, rotation: -15 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)' },
          0.7,
        );

        // Devices slide in
        const deviceEls: any[] = [];
        if (this.deviceLaptop()?.nativeElement) deviceEls.push(this.deviceLaptop()?.nativeElement);
        if (this.devicePhone()?.nativeElement) deviceEls.push(this.devicePhone()?.nativeElement);
        if (this.deviceTablet()?.nativeElement) deviceEls.push(this.deviceTablet()?.nativeElement);

        tl.fromTo(
          this.deviceLaptop()?.nativeElement,
          { opacity: 0, x: -80, rotation: -5 },
          { opacity: 0.8, x: 0, rotation: -3, duration: 1.2, ease: 'power2.out' },
          0.6,
        );
        tl.fromTo(
          this.devicePhone()?.nativeElement,
          { opacity: 0, x: 80, rotation: 8 },
          { opacity: 0.8, x: 0, rotation: 3, duration: 1.2, ease: 'power2.out' },
          0.7,
        );
        if (this.deviceTablet()?.nativeElement) {
          tl.fromTo(
            this.deviceTablet()?.nativeElement,
            { opacity: 0, y: 60, rotation: 12 },
            { opacity: 0.7, y: 0, rotation: 6, duration: 1.2, ease: 'power2.out' },
            0.8,
          );
        }

        /* ── Floating animations (continuous) ── */
        iconEls.forEach((el, i) => {
          gsap.to(el, {
            y: `random(-20, 20)`,
            x: `random(-10, 10)`,
            rotation: `random(-8, 8)`,
            duration: 3 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.3,
          });
        });

        // Devices subtle float
        if (this.deviceLaptop()?.nativeElement) {
          gsap.to(this.deviceLaptop()?.nativeElement, {
            y: -15, rotation: -5, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut',
          });
        }
        if (this.devicePhone()?.nativeElement) {
          gsap.to(this.devicePhone()?.nativeElement, {
            y: -20, rotation: 5, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
          });
        }
        if (this.deviceTablet()?.nativeElement) {
          gsap.to(this.deviceTablet()?.nativeElement, {
            y: -12, rotation: 8, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
          });
        }

        // Particles twinkle
        gsap.utils.toArray<HTMLElement>('.hero-particle').forEach((p, i) => {
          gsap.fromTo(p, { opacity: 0.05 }, {
            opacity: 0.25,
            duration: 2 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 3,
          });
        });

        /* ── Scroll Parallax (desktop) ── */
        const mm = gsap.matchMedia();
        mm.add('(min-width: 768px)', () => {
          const scrollConfig = { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true };

          // Grid — very slow
          gsap.to(this.gridLayer()?.nativeElement, {
            y: -30, ...scrollConfig, scrub: 2,
          });

          // Orbs — slow
          gsap.to(this.orb1()?.nativeElement, { y: -80, x: -30, ...scrollConfig, scrub: 1.5 });
          gsap.to(this.orb2()?.nativeElement, { y: -120, x: 40, ...scrollConfig, scrub: 1.5 });
          gsap.to(this.orb3()?.nativeElement, { y: -60, ...scrollConfig, scrub: 2 });

          // Icons — medium speed, spread out
          [
            { ref: this.icon1, y: -60, x: -20 },
            { ref: this.icon2, y: -80, x: 30 },
            { ref: this.icon3, y: -40, x: -15 },
            { ref: this.icon4, y: -100, x: -10 },
            { ref: this.icon5, y: -90, x: 25 },
            { ref: this.icon6, y: -50, x: 15 },
            { ref: this.icon7, y: -30, x: -5 },
            { ref: this.icon8, y: -70, x: 20 },
          ].forEach(({ ref, y, x }) => {
            if (ref()?.nativeElement) {
              gsap.to(ref()?.nativeElement, { y, x, ...scrollConfig, scrub: 1 });
            }
          });

          // Devices — fast parallax (closest layer)
          gsap.to(this.deviceLaptop()?.nativeElement, { y: -150, rotation: -8, ...scrollConfig, scrub: 0.8 });
          gsap.to(this.devicePhone()?.nativeElement, { y: -180, rotation: 8, ...scrollConfig, scrub: 0.8 });
          if (this.deviceTablet()?.nativeElement) {
            gsap.to(this.deviceTablet()?.nativeElement, { y: -130, rotation: 12, ...scrollConfig, scrub: 0.8 });
          }

          // Content — slow fade-out on scroll
          gsap.to('.relative.z-10', {
            y: -50, opacity: 0.3, ...scrollConfig, scrub: 1,
          });
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.gsapCtx?.revert();
  }
}
