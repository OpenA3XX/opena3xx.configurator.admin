import { Injectable, signal, computed, effect } from '@angular/core';
import { Observable, switchMap, catchError, of } from 'rxjs';
import { AppSettings, SettingsCategory, SettingsBackup, SettingsValidation } from '../services/settings.service';
import { SettingsService } from '../services/settings.service';

export interface SettingsState {
  settings: AppSettings[];
  categories: SettingsCategory[];
  backups: SettingsBackup[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  validation: SettingsValidation | null;
}

export interface SettingsFilters {
  searchTerm: string;
  category: string | null;
  type: string | null;
  isReadOnly: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsStore {
  // State signals
  private _state = signal<SettingsState>({
    settings: [],
    categories: [],
    backups: [],
    loading: false,
    error: null,
    lastUpdated: null,
    validation: null
  });

  private _filters = signal<SettingsFilters>({
    searchTerm: '',
    category: null,
    type: null,
    isReadOnly: null
  });

  // Public state signals
  readonly state = this._state.asReadonly();
  readonly filters = this._filters.asReadonly();

  // Computed selectors
  readonly settings = computed(() => this.state().settings);
  readonly categories = computed(() => this.state().categories);
  readonly backups = computed(() => this.state().backups);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly lastUpdated = computed(() => this.state().lastUpdated);
  readonly validation = computed(() => this.state().validation);

  // Filtered data
  readonly filteredSettings = computed(() => {
    const settings = this.settings();
    const filters = this.filters();

    return settings.filter(setting => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!setting.key.toLowerCase().includes(searchLower) &&
            !setting.description?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.category && setting.category !== filters.category) {
        return false;
      }

      if (filters.type && setting.type !== filters.type) {
        return false;
      }

      if (filters.isReadOnly !== null && setting.isReadOnly !== filters.isReadOnly) {
        return false;
      }

      return true;
    });
  });

  // Grouped settings
  readonly settingsByCategory = computed(() => {
    const settings = this.settings();
    const grouped = new Map<string, AppSettings[]>();

    settings.forEach(setting => {
      const category = setting.category;
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(setting);
    });

    return grouped;
  });

  readonly settingsByType = computed(() => {
    const settings = this.settings();
    const grouped = new Map<string, AppSettings[]>();

    settings.forEach(setting => {
      const type = setting.type;
      if (!grouped.has(type)) {
        grouped.set(type, []);
      }
      grouped.get(type)!.push(setting);
    });

    return grouped;
  });

  // Statistics
  readonly stats = computed(() => {
    const settings = this.settings();
    const categories = this.categories();
    const backups = this.backups();

    return {
      totalSettings: settings.length,
      totalCategories: categories.length,
      totalBackups: backups.length,
      readOnlySettings: settings.filter(s => s.isReadOnly).length,
      writableSettings: settings.filter(s => !s.isReadOnly).length,
      settingsByType: new Map(
        Object.entries(
          settings.reduce((acc, setting) => {
            acc[setting.type] = (acc[setting.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        )
      )
    };
  });

  constructor(private settingsService: SettingsService) {
    // Set up effects for automatic data refresh
    this.setupEffects();
  }

  // Actions
  setLoading(loading: boolean): void {
    this._state.update(state => ({ ...state, loading, error: null }));
  }

  setError(error: string): void {
    this._state.update(state => ({ ...state, error, loading: false }));
  }

  setValidation(validation: SettingsValidation): void {
    this._state.update(state => ({ ...state, validation }));
  }

  setFilters(filters: Partial<SettingsFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({
      searchTerm: '',
      category: null,
      type: null,
      isReadOnly: null
    });
  }

  // Data loading actions
  loadSettings(): void {
    this.setLoading(true);

    this.settingsService.getAllSettings().subscribe({
      next: (settings) => {
        this._state.update(state => ({
          ...state,
          settings,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load settings');
      }
    });
  }

  loadCategories(): void {
    this.setLoading(true);

    this.settingsService.getSettingsCategories().subscribe({
      next: (categories) => {
        this._state.update(state => ({
          ...state,
          categories,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load settings categories');
      }
    });
  }

  loadBackups(): void {
    this.setLoading(true);

    this.settingsService.getBackups().subscribe({
      next: (backups) => {
        this._state.update(state => ({
          ...state,
          backups,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load backups');
      }
    });
  }

  // CRUD operations
  updateSetting(key: string, value: any): Observable<AppSettings> {
    return this.settingsService.updateSetting(key, value).pipe(
      switchMap((updatedSetting) => {
        this.loadSettings();
        return of(updatedSetting);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to update setting');
        throw error;
      })
    );
  }

  updateMultipleSettings(settings: Record<string, any>): Observable<AppSettings[]> {
    return this.settingsService.updateMultipleSettings(settings).pipe(
      switchMap((updatedSettings) => {
        this.loadSettings();
        return of(updatedSettings);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to update settings');
        throw error;
      })
    );
  }

  deleteSetting(key: string): Observable<void> {
    return this.settingsService.deleteSetting(key).pipe(
      switchMap(() => {
        this.loadSettings();
        return of(void 0);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to delete setting');
        throw error;
      })
    );
  }

  // Backup operations
  createBackup(name: string, description?: string): Observable<SettingsBackup> {
    return this.settingsService.createBackup(name, description).pipe(
      switchMap((backup) => {
        this.loadBackups();
        return of(backup);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to create backup');
        throw error;
      })
    );
  }

  restoreBackup(id: string): Observable<void> {
    return this.settingsService.restoreBackup(id).pipe(
      switchMap(() => {
        this.loadSettings();
        return of(void 0);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to restore backup');
        throw error;
      })
    );
  }

  deleteBackup(id: string): Observable<void> {
    return this.settingsService.deleteBackup(id).pipe(
      switchMap(() => {
        this.loadBackups();
        return of(void 0);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to delete backup');
        throw error;
      })
    );
  }

  // Validation operations
  validateSettings(settings?: AppSettings[]): Observable<SettingsValidation> {
    return this.settingsService.validateSettings(settings).pipe(
      switchMap((validation) => {
        this.setValidation(validation);
        return of(validation);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to validate settings');
        throw error;
      })
    );
  }

  validateSetting(key: string, value: any): Observable<SettingsValidation> {
    return this.settingsService.validateSetting(key, value).pipe(
      switchMap((validation) => {
        this.setValidation(validation);
        return of(validation);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to validate setting');
        throw error;
      })
    );
  }

  // Reset operations
  resetToDefaults(category?: string): Observable<void> {
    return this.settingsService.resetToDefaults(category).pipe(
      switchMap(() => {
        this.loadSettings();
        return of(void 0);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to reset settings');
        throw error;
      })
    );
  }

  resetSetting(key: string): Observable<AppSettings> {
    return this.settingsService.resetSetting(key).pipe(
      switchMap((resetSetting) => {
        this.loadSettings();
        return of(resetSetting);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to reset setting');
        throw error;
      })
    );
  }

  // Search operations
  searchSettings(query: string, category?: string): Observable<AppSettings[]> {
    return this.settingsService.searchSettings(query, category);
  }

  // Cache management
  clearCache(): void {
    this._state.update(state => ({
      ...state,
      settings: [],
      categories: [],
      backups: [],
      lastUpdated: null,
      validation: null
    }));
  }

  refreshData(): void {
    this.loadSettings();
    this.loadCategories();
    this.loadBackups();
  }

  // Private methods
  private setupEffects(): void {
    // Auto-refresh data every 15 minutes if there's no error
    effect(() => {
      const lastUpdated = this.lastUpdated();
      const error = this.error();

      if (!error && lastUpdated) {
        const timeSinceUpdate = Date.now() - lastUpdated.getTime();
        const fifteenMinutes = 15 * 60 * 1000;

        if (timeSinceUpdate > fifteenMinutes) {
          this.refreshData();
        }
      }
    });
  }
}
