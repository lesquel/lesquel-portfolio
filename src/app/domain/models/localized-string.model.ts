/**
 * Represents a string localized in multiple languages.
 * Keys are ISO 639-1 language codes (e.g., 'es', 'en').
 */
export interface LocalizedString {
  [langCode: string]: string;
}
