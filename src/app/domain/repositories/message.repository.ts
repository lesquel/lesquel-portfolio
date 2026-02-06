import { ContactMessage } from '../models';

/**
 * Abstract repository contract for Contact Messages.
 */
export abstract class MessageRepository {
  abstract sendMessage(message: ContactMessage): Promise<void>;
}
