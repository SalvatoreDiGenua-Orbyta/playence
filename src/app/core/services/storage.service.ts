import { Injectable } from '@angular/core';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sc_auth_token',
  CURRENT_USER: 'sc_current_user',
  EVENT_FILTERS: 'sc_event_filters',
  TRAINING_PLANS: 'sc_training_plans',
  THEME: 'sc_theme',
};

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  getSessionItem<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  setSessionItem(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  removeSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearAuth(): void {
    this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    this.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}
