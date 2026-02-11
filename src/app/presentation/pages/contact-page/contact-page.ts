import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, ArrowLeft, Mail, Github, Linkedin, Twitter, ExternalLink, Loader, Globe } from 'lucide-angular';
import { StaggerRevealDirective } from '../../shared/directives/stagger-reveal.directive';
import { MessageRepository } from '../../../domain/repositories';
import { ProfileService } from '../../../core/profile/profile.service';

type FormState = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, LucideAngularModule, StaggerRevealDirective],
  template: `
    <div class="min-h-screen pt-24 pb-16">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <!-- Back -->
        <a
          routerLink="/"
          class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500
                 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
        >
          <lucide-icon [img]="arrowLeftIcon" [size]="16" />
          {{ 'CONTACT_PAGE.BACK' | translate }}
        </a>

        <!-- Header -->
        <div appStaggerReveal class="mb-16 text-center">
          <h1 class="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
            {{ 'CONTACT_PAGE.TITLE' | translate }}
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            {{ 'CONTACT_PAGE.SUBTITLE' | translate }}
          </p>
        </div>

        <!-- Two Column Layout -->
        <div class="grid gap-12 lg:grid-cols-3">
          <!-- Form -->
          <div class="lg:col-span-2">
            <form
              appStaggerReveal
              [formGroup]="form"
              (ngSubmit)="onSubmit()"
              class="glass-card space-y-6 rounded-2xl p-8 shadow-sm"
            >
              <!-- Name -->
              <div>
                <label for="fullName" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {{ 'CONTACT.NAME_LABEL' | translate }}
                </label>
                <input
                  id="fullName"
                  formControlName="fullName"
                  type="text"
                  [placeholder]="'CONTACT.NAME_PLACEHOLDER' | translate"
                  class="input-glow w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm
                         text-slate-900 outline-none transition-colors
                         focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                         dark:border-slate-600 dark:bg-slate-900 dark:text-white
                         dark:focus:border-violet-500"
                />
                @if (form.controls.fullName.touched && form.controls.fullName.errors) {
                  <p class="mt-1.5 text-xs text-red-500">
                    {{ 'CONTACT.VALIDATION.REQUIRED' | translate }}
                  </p>
                }
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {{ 'CONTACT.EMAIL_LABEL' | translate }}
                </label>
                <input
                  id="email"
                  formControlName="email"
                  type="email"
                  [placeholder]="'CONTACT.EMAIL_PLACEHOLDER' | translate"
                  class="input-glow w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm
                         text-slate-900 outline-none transition-colors
                         focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                         dark:border-slate-600 dark:bg-slate-900 dark:text-white
                         dark:focus:border-violet-500"
                />
                @if (form.controls.email.touched && form.controls.email.errors?.['required']) {
                  <p class="mt-1.5 text-xs text-red-500">
                    {{ 'CONTACT.VALIDATION.REQUIRED' | translate }}
                  </p>
                }
                @if (form.controls.email.touched && form.controls.email.errors?.['email']) {
                  <p class="mt-1.5 text-xs text-red-500">
                    {{ 'CONTACT.VALIDATION.EMAIL' | translate }}
                  </p>
                }
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {{ 'CONTACT.MESSAGE_LABEL' | translate }}
                </label>
                <textarea
                  id="message"
                  formControlName="content"
                  rows="6"
                  [placeholder]="'CONTACT.MESSAGE_PLACEHOLDER' | translate"
                  class="input-glow w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3
                         text-sm text-slate-900 outline-none transition-colors
                         focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                         dark:border-slate-600 dark:bg-slate-900 dark:text-white
                         dark:focus:border-violet-500"
                ></textarea>
                @if (form.controls.content.touched && form.controls.content.errors?.['required']) {
                  <p class="mt-1.5 text-xs text-red-500">
                    {{ 'CONTACT.VALIDATION.REQUIRED' | translate }}
                  </p>
                }
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                [disabled]="form.invalid || formState() !== 'idle'"
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3
                       font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50
                       disabled:cursor-not-allowed dark:hover:bg-violet-500"
              >
                @if (formState() === 'sending') {
                  <lucide-icon [img]="loaderIcon" [size]="16" class="animate-spin" />
                  {{ 'CONTACT.SENDING' | translate }}
                } @else if (formState() === 'success') {
                  ✅ {{ 'CONTACT.SENT' | translate }}
                } @else if (formState() === 'error') {
                  ❌ {{ 'CONTACT.ERROR' | translate }}
                } @else {
                  {{ 'CONTACT.SEND' | translate }}
                }
              </button>
            </form>
          </div>

          <!-- Contact Info -->
          <div appStaggerReveal class="space-y-8">
            <!-- Direct Contact -->
            <div class="glass-card rounded-2xl p-8">
              <h2 class="mb-6 text-lg font-bold text-slate-900 dark:text-white">
                {{ 'CONTACT_PAGE.DIRECT' | translate }}
              </h2>

              <div class="space-y-4">
                <!-- Email (dynamic from profile) -->
                @if (profileService.email()) {
                  <a
                    [href]="'mailto:' + profileService.email()"
                    class="flex items-center gap-4 rounded-lg p-3 transition-colors
                           hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                      <lucide-icon [img]="mailIcon" [size]="20" class="text-red-600 dark:text-red-400" />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-slate-900 dark:text-white">Email</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ profileService.email() }}</p>
                    </div>
                  </a>
                }
              </div>
            </div>

            <!-- Social Links (dynamic from profile) -->
            <div class="glass-card rounded-2xl p-8">
              <h2 class="mb-6 text-lg font-bold text-slate-900 dark:text-white">
                {{ 'CONTACT_PAGE.SOCIALS' | translate }}
              </h2>

              <div class="space-y-3">
                <!-- GitHub -->
                @if (profileService.socialGithub()) {
                  <a
                    [href]="profileService.socialGithub()"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 rounded-lg p-3 transition-colors
                           hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <lucide-icon [img]="githubIcon" [size]="20" class="text-slate-600 dark:text-slate-400" />
                    <span class="text-sm font-medium text-slate-900 dark:text-white">GitHub</span>
                    <lucide-icon [img]="externalLinkIcon" [size]="16" class="ml-auto text-slate-400" />
                  </a>
                }

                <!-- LinkedIn -->
                @if (profileService.socialLinkedin()) {
                  <a
                    [href]="profileService.socialLinkedin()"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 rounded-lg p-3 transition-colors
                           hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <lucide-icon [img]="linkedinIcon" [size]="20" class="text-blue-600 dark:text-blue-400" />
                    <span class="text-sm font-medium text-slate-900 dark:text-white">LinkedIn</span>
                    <lucide-icon [img]="externalLinkIcon" [size]="16" class="ml-auto text-slate-400" />
                  </a>
                }

                <!-- Twitter -->
                @if (profileService.socialTwitter()) {
                  <a
                    [href]="profileService.socialTwitter()"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 rounded-lg p-3 transition-colors
                           hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <lucide-icon [img]="twitterIcon" [size]="20" class="text-sky-500 dark:text-sky-400" />
                    <span class="text-sm font-medium text-slate-900 dark:text-white">Twitter</span>
                    <lucide-icon [img]="externalLinkIcon" [size]="16" class="ml-auto text-slate-400" />
                  </a>
                }

                <!-- Website -->
                @if (profileService.socialWebsite()) {
                  <a
                    [href]="profileService.socialWebsite()"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 rounded-lg p-3 transition-colors
                           hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <lucide-icon [img]="globeIcon" [size]="20" class="text-green-500 dark:text-green-400" />
                    <span class="text-sm font-medium text-slate-900 dark:text-white">Website</span>
                    <lucide-icon [img]="externalLinkIcon" [size]="16" class="ml-auto text-slate-400" />
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ContactPage {
  private readonly fb = inject(FormBuilder);
  private readonly messageRepo = inject(MessageRepository);
  readonly profileService = inject(ProfileService);

  protected readonly form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    content: ['', Validators.required],
  });

  protected readonly formState = signal<FormState>('idle');

  protected readonly arrowLeftIcon = ArrowLeft;
  protected readonly mailIcon = Mail;
  protected readonly githubIcon = Github;
  protected readonly linkedinIcon = Linkedin;
  protected readonly twitterIcon = Twitter;
  protected readonly externalLinkIcon = ExternalLink;
  protected readonly loaderIcon = Loader;
  protected readonly globeIcon = Globe;

  async onSubmit() {
    if (this.form.invalid) return;

    this.formState.set('sending');

    try {
      await this.messageRepo.sendMessage({
        fullName: this.form.value.fullName || '',
        email: this.form.value.email || '',
        content: this.form.value.content || '',
      });

      this.formState.set('success');
      this.form.reset();

      setTimeout(() => {
        this.formState.set('idle');
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      this.formState.set('error');

      setTimeout(() => {
        this.formState.set('idle');
      }, 3000);
    }
  }
}
