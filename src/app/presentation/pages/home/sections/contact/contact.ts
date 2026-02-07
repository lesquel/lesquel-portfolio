import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Loader } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { GsapAnimateDirective } from '../../../../shared/directives/gsap-animate.directive';
import { MessageRepository } from '../../../../../domain/repositories';

type FormState = 'idle' | 'sending' | 'success' | 'error';

/**
 * Contact section — reactive form with validation, sends message to Supabase.
 */
@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, GsapAnimateDirective, LucideAngularModule],
  template: `
    <section id="contact" class="py-24">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div appGsapAnimate class="mb-12 text-center">
          <h2 class="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {{ 'CONTACT.TITLE' | translate }}
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            {{ 'CONTACT.SUBTITLE' | translate }}
          </p>
        </div>

        <!-- Form -->
        <form
          appGsapAnimate
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm
                 dark:border-slate-700 dark:bg-slate-800/50 sm:p-8"
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
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm
                     text-slate-900 outline-none transition-colors
                     focus:border-primary focus:ring-2 focus:ring-primary/20
                     dark:border-slate-600 dark:bg-slate-900 dark:text-white
                     dark:focus:border-primary"
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
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm
                     text-slate-900 outline-none transition-colors
                     focus:border-primary focus:ring-2 focus:ring-primary/20
                     dark:border-slate-600 dark:bg-slate-900 dark:text-white
                     dark:focus:border-primary"
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
              rows="5"
              [placeholder]="'CONTACT.MESSAGE_PLACEHOLDER' | translate"
              class="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3
                     text-sm text-slate-900 outline-none transition-colors
                     focus:border-primary focus:ring-2 focus:ring-primary/20
                     dark:border-slate-600 dark:bg-slate-900 dark:text-white
                     dark:focus:border-primary"
            ></textarea>
            @if (form.controls.content.touched && form.controls.content.errors) {
              <p class="mt-1.5 text-xs text-red-500">
                {{ 'CONTACT.VALIDATION.REQUIRED' | translate }}
              </p>
            }
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="form.invalid || state() === 'sending'"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5
                   text-sm font-semibold text-white shadow-lg shadow-primary/25
                   transition-all hover:bg-primary-dark disabled:cursor-not-allowed
                   disabled:opacity-50"
          >
            @if (state() === 'sending') {
              <lucide-icon
                [img]="loaderIcon"
                class="h-4 w-4 animate-spin"
              ></lucide-icon>
              {{ 'CONTACT.SENDING' | translate }}
            } @else {
              {{ 'CONTACT.SEND' | translate }}
            }
          </button>

          <!-- Status Messages -->
          @if (state() === 'success') {
            <div class="rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              {{ 'CONTACT.SUCCESS' | translate }}
            </div>
          }
          @if (state() === 'error') {
            <div class="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {{ 'CONTACT.ERROR' | translate }}
            </div>
          }
        </form>
      </div>
    </section>
  `,
})
export class ContactSection {
  private readonly fb = inject(FormBuilder);
  private readonly messageRepo = inject(MessageRepository);

  // Lucide Icons
  protected readonly loaderIcon = Loader;

  protected readonly state = signal<FormState>('idle');

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    content: ['', [Validators.required, Validators.minLength(10)]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state.set('sending');

    try {
      await this.messageRepo.sendMessage({
        fullName: this.form.value.fullName!,
        email: this.form.value.email!,
        content: this.form.value.content!,
      });
      this.state.set('success');
      this.form.reset();

      // Auto-dismiss success after 5s
      setTimeout(() => this.state.set('idle'), 5000);
    } catch {
      this.state.set('error');
      setTimeout(() => this.state.set('idle'), 5000);
    }
  }
}
