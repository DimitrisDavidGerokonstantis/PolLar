import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  get window(): Window | null {
    if (typeof window !== 'undefined') return window;
    return null;
  }

  setLocalStorage(property: string, value: string) {
    if (this.window) {
      this.window.localStorage.setItem(property, value);
    }
  }

  getLocalStorage(property: string) {
    if (this.window) {
      return this.window.localStorage.getItem(property);
    }
    return null;
  }

  clearLocalStorage() {
    if (this.window) this.window.localStorage.clear();
  }
}
