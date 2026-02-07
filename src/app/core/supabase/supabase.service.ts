import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

/**
 * Custom localStorage adapter for browser environments
 * Prevents errors in SSR context
 */
class BrowserLocalStorage {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage?.getItem(key) ?? null;
  }
  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage?.setItem(key, value);
  }
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage?.removeItem(key);
  }
}

/**
 * Singleton Supabase client wrapper.
 * Isomorphic — works on both server and browser.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        storage: new BrowserLocalStorage(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
}
