import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { LucideAngularModule, Mail, Trash2, Inbox } from 'lucide-angular';
import { AdminService, type MessageRow } from '../../../../core/admin/admin.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Mensajes</h1>
          <p class="mt-1 text-sm text-slate-400">
            {{ unreadCount() > 0 ? unreadCount() + ' sin leer' : 'Todos leídos' }}
            · {{ messages().length }} total
          </p>
        </div>
        <div class="flex gap-2">
          <button
            (click)="filterMode.set('all')"
            [class]="filterMode() === 'all'
              ? 'rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white'
              : 'rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition-colors'"
          >
            Todos
          </button>
          <button
            (click)="filterMode.set('unread')"
            [class]="filterMode() === 'unread'
              ? 'rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white'
              : 'rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition-colors'"
          >
            Sin leer
            @if (unreadCount() > 0) {
              <span class="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black">
                {{ unreadCount() }}
              </span>
            }
          </button>
          <button
            (click)="filterMode.set('read')"
            [class]="filterMode() === 'read'
              ? 'rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white'
              : 'rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition-colors'"
          >
            Leídos
          </button>
        </div>
      </div>

      <!-- Messages List -->
      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      } @else {
        <div class="space-y-3">
          @for (msg of filteredMessages(); track msg.id) {
            <div class="group relative rounded-xl border bg-slate-900 p-5 transition-all hover:shadow-lg hover:shadow-slate-900/50"
                 [class.border-indigo-500/30]="!msg.is_read"
                 [class.border-slate-800]="msg.is_read">
              <!-- Unread indicator -->
              @if (!msg.is_read) {
                <div class="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-indigo-500"></div>
              }

              <div class="flex items-start gap-4">
                <!-- Avatar -->
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                     [class]="msg.is_read ? 'bg-slate-800 text-slate-400' : 'bg-indigo-600 text-white'">
                  {{ msg.full_name[0]?.toUpperCase() }}
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0"
                     (click)="selectedMessage.set(selectedMessage()?.id === msg.id ? null : msg)">
                  <div class="flex items-baseline gap-3">
                    <h3 class="text-sm font-semibold text-white">{{ msg.full_name }}</h3>
                    <span class="text-xs text-slate-500">{{ msg.email }}</span>
                    <span class="ml-auto shrink-0 text-[10px] text-slate-600">
                      {{ formatDate(msg.created_at) }}
                    </span>
                  </div>
                  <p class="mt-1 text-sm leading-relaxed"
                     [class]="selectedMessage()?.id === msg.id ? 'text-slate-300 whitespace-pre-wrap' : 'text-slate-400 truncate'">
                    {{ msg.content }}
                  </p>

                  <!-- Expanded details -->
                  @if (selectedMessage()?.id === msg.id) {
                    <div class="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3">
                      <a [href]="'mailto:' + msg.email"
                         class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs
                                font-medium text-white transition-colors hover:bg-indigo-700">
                        <lucide-icon
                          [img]="mailIcon"
                          class="h-3.5 w-3.5"
                        ></lucide-icon>
                        Responder
                      </a>
                      <span class="text-[10px] text-slate-600">
                        {{ formatDateFull(msg.created_at) }}
                      </span>
                    </div>
                  }
                </div>

                <!-- Actions -->
                <div class="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    (click)="toggleRead(msg); $event.stopPropagation()"
                    class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-indigo-400"
                    [title]="msg.is_read ? 'Marcar como no leído' : 'Marcar como leído'"
                  >
                    @if (msg.is_read) {
                      <lucide-icon
                        [img]="mailIcon"
                        class="h-4 w-4"
                      ></lucide-icon>
                    } @else {
                      <lucide-icon
                        [img]="mailIcon"
                        class="h-4 w-4"
                      ></lucide-icon>
                    }
                  </button>
                  <button
                    (click)="confirmDelete(msg); $event.stopPropagation()"
                    class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
                    title="Eliminar"
                  >
                    <lucide-icon
                      [img]="trash2Icon"
                      class="h-4 w-4"
                    ></lucide-icon>
                  </button>
                </div>
              </div>
            </div>
          } @empty {
            <div class="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center">
              <lucide-icon
                [img]="inboxIcon"
                class="mx-auto h-12 w-12 text-slate-700"
              ></lucide-icon>
              <p class="mt-4 text-sm text-slate-500">
                {{ filterMode() === 'all' ? 'No hay mensajes aún' : 'No hay mensajes en esta categoría' }}
              </p>
            </div>
          }
        </div>
      }

      <!-- Delete Confirmation -->
      @if (showDeleteConfirm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
             (click)="showDeleteConfirm.set(false)">
          <div class="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
               (click)="$event.stopPropagation()">
            <h3 class="text-lg font-semibold text-white">¿Eliminar mensaje?</h3>
            <p class="mt-2 text-sm text-slate-400">
              Se eliminará el mensaje de "{{ deletingMessage()?.full_name }}".
            </p>
            <div class="mt-6 flex justify-end gap-3">
              <button
                (click)="showDeleteConfirm.set(false)"
                class="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                (click)="deleteMessage()"
                class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminMessages implements OnInit {
  private readonly admin = inject(AdminService);

  // Lucide Icons
  protected readonly mailIcon = Mail;
  protected readonly trash2Icon = Trash2;
  protected readonly inboxIcon = Inbox;

  readonly messages = signal<MessageRow[]>([]);
  readonly loading = signal(true);
  readonly filterMode = signal<'all' | 'unread' | 'read'>('all');
  readonly selectedMessage = signal<MessageRow | null>(null);
  readonly showDeleteConfirm = signal(false);
  readonly deletingMessage = signal<MessageRow | null>(null);

  readonly unreadCount = computed(() => this.messages().filter((m) => !m.is_read).length);

  readonly filteredMessages = computed(() => {
    const mode = this.filterMode();
    const msgs = this.messages();
    if (mode === 'unread') return msgs.filter((m) => !m.is_read);
    if (mode === 'read') return msgs.filter((m) => m.is_read);
    return msgs;
  });

  async ngOnInit(): Promise<void> {
    await this.loadMessages();
  }

  private async loadMessages(): Promise<void> {
    this.loading.set(true);
    try {
      this.messages.set(await this.admin.getAllMessages());
    } catch (err) {
      console.error('Load messages error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async toggleRead(msg: MessageRow): Promise<void> {
    try {
      const newVal = !msg.is_read;
      await this.admin.markMessageRead(msg.id, newVal);
      this.messages.update((list) =>
        list.map((m) => (m.id === msg.id ? { ...m, is_read: newVal } : m)),
      );
    } catch (err) {
      console.error('Toggle read error:', err);
    }
  }

  confirmDelete(msg: MessageRow): void {
    this.deletingMessage.set(msg);
    this.showDeleteConfirm.set(true);
  }

  async deleteMessage(): Promise<void> {
    const m = this.deletingMessage();
    if (!m) return;
    try {
      await this.admin.deleteMessage(m.id);
      this.showDeleteConfirm.set(false);
      this.messages.update((list) => list.filter((msg) => msg.id !== m.id));
    } catch (err) {
      console.error('Delete message error:', err);
    }
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 60) return `hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `hace ${days}d`;
    return d.toLocaleDateString('es');
  }

  formatDateFull(iso: string): string {
    return new Date(iso).toLocaleString('es');
  }
}
