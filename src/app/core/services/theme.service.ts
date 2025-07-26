import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>('light');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
    this.watchSystemTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const theme = savedTheme || 'light';
    this.setTheme(theme);
  }

  private watchSystemTheme(): void {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Initial check
      this.updateThemeBasedOnSystem();

      // Listen for changes
      mediaQuery.addEventListener('change', () => {
        this.updateThemeBasedOnSystem();
      });
    }
  }

  private updateThemeBasedOnSystem(): void {
    if (this.currentThemeSubject.value === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark);
    }
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem('theme', theme);

    switch (theme) {
      case 'light':
        this.applyTheme(false);
        break;
      case 'dark':
        this.applyTheme(true);
        break;
      case 'auto':
        this.updateThemeBasedOnSystem();
        break;
    }
  }

  private applyTheme(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);

    const body = document.body;

    if (isDark) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#121212' : '#1976d2');
    }
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  toggleTheme(): void {
    const current = this.getCurrentTheme();
    const newTheme: Theme = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Get CSS custom property value for current theme
   */
  getThemeColor(property: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${property}`)
      .trim();
  }

  /**
   * Set CSS custom property for current theme
   */
  setThemeColor(property: string, value: string): void {
    document.documentElement.style.setProperty(`--${property}`, value);
  }

  /**
   * Get the appropriate logo path based on current theme
   */
  getLogoPath(): string {
    return this.isDarkMode() ? 'assets/logo-dark-theme.png' : 'assets/logo.png';
  }
}
