import { Injectable, inject } from '@angular/core';
import { MessageRepository } from '../../domain/repositories';
import { ContactMessage } from '../../domain/models';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { MessageDto } from '../models/dtos';

@Injectable()
export class SupabaseMessageRepository extends MessageRepository {
  private readonly supabase = inject(SupabaseService);

  override async sendMessage(message: ContactMessage): Promise<void> {
    const dto: MessageDto = {
      full_name: message.fullName,
      email: message.email,
      content: message.content,
    };

    const { error } = await this.supabase.client
      .from('messages')
      .insert(dto);

    if (error) throw error;
  }
}
