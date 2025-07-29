import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/services/base-api.service';
import { ConfigurationService } from '../../../core/services/configuration.service';

export interface AppSettings {
  id: string;
  category: string;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  isReadOnly: boolean;
  lastModified: Date;
}

export interface SettingsCategory {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  settings: AppSettings[];
}

export interface SettingsBackup {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  settings: AppSettings[];
  version: string;
}

export interface SettingsValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseApiService<AppSettings> {
  protected override endpoint = 'settings';

  constructor(
    protected override http: HttpClient,
    protected override configurationService: ConfigurationService
  ) {
    super(http, configurationService);
  }

  // Settings Operations
  getAllSettings(): Observable<AppSettings[]> {
    return this.getAll();
  }

  getSettingsByCategory(category: string): Observable<AppSettings[]> {
    return this.customGet<AppSettings[]>(`/category/${category}`);
  }

  getSettingByKey(key: string): Observable<AppSettings> {
    return this.customGet<AppSettings>(`/key/${key}`);
  }

  updateSetting(key: string, value: any): Observable<AppSettings> {
    return this.customPatch<AppSettings>(`/key/${key}`, { value });
  }

  updateMultipleSettings(settings: Record<string, any>): Observable<AppSettings[]> {
    return this.customPatch<AppSettings[]>('/bulk', settings);
  }

  deleteSetting(key: string): Observable<void> {
    return this.customDelete(`/key/${key}`);
  }

  // Categories Operations
  getSettingsCategories(): Observable<SettingsCategory[]> {
    return this.customGet<SettingsCategory[]>('/categories');
  }

  getCategoryByName(name: string): Observable<SettingsCategory> {
    return this.customGet<SettingsCategory>(`/categories/${name}`);
  }

  // Backup and Restore Operations
  createBackup(name: string, description?: string): Observable<SettingsBackup> {
    return this.customPost<SettingsBackup>('/backup', { name, description });
  }

  getBackups(): Observable<SettingsBackup[]> {
    return this.customGet<SettingsBackup[]>('/backup');
  }

  getBackupById(id: string): Observable<SettingsBackup> {
    return this.customGet<SettingsBackup>(`/backup/${id}`);
  }

  restoreBackup(id: string): Observable<void> {
    return this.customPost<void>(`/backup/${id}/restore`, {});
  }

  deleteBackup(id: string): Observable<void> {
    return this.customDelete(`/backup/${id}`);
  }

  // Export and Import Operations
  exportSettings(format: 'json' | 'yaml' | 'xml'): Observable<Blob> {
    return this.customGet<Blob>(`/export/${format}`);
  }

  importSettings(file: File): Observable<AppSettings[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.customPost<AppSettings[]>('/import', formData);
  }

  // Validation Operations
  validateSettings(settings?: AppSettings[]): Observable<SettingsValidation> {
    const data = settings ? { settings } : {};
    return this.customPost<SettingsValidation>('/validate', data);
  }

  validateSetting(key: string, value: any): Observable<SettingsValidation> {
    return this.customPost<SettingsValidation>('/validate/single', { key, value });
  }

  // Reset Operations
  resetToDefaults(category?: string): Observable<void> {
    const data = category ? { category } : {};
    return this.customPost<void>('/reset', data);
  }

  resetSetting(key: string): Observable<AppSettings> {
    return this.customPost<AppSettings>(`/reset/${key}`, {});
  }

  // Search and Filter Operations
  searchSettings(query: string, category?: string): Observable<AppSettings[]> {
    const params: Record<string, string> = { q: query };
    if (category) params['category'] = category;
    return this.customGet<AppSettings[]>('/search', params);
  }

  getSettingsByType(type: AppSettings['type']): Observable<AppSettings[]> {
    return this.customGet<AppSettings[]>(`/type/${type}`);
  }

  // Configuration Operations
  getConfiguration(): Observable<any> {
    return this.customGet<any>('/config');
  }

  updateConfiguration(config: any): Observable<any> {
    return this.customPut<any>('/config', config);
  }

  // System Settings
  getSystemSettings(): Observable<AppSettings[]> {
    return this.customGet<AppSettings[]>('/system');
  }

  updateSystemSettings(settings: Record<string, any>): Observable<AppSettings[]> {
    return this.customPatch<AppSettings[]>('/system', settings);
  }

  // User Settings
  getUserSettings(userId?: string): Observable<AppSettings[]> {
    const params = userId ? { userId } : {};
    return this.customGet<AppSettings[]>('/user', params);
  }

  updateUserSettings(settings: Record<string, any>, userId?: string): Observable<AppSettings[]> {
    const data = { settings, userId };
    return this.customPatch<AppSettings[]>('/user', data);
  }

  // Advanced Operations
  getSettingsHistory(key: string, limit?: number): Observable<AppSettings[]> {
    const params = limit ? { limit: limit.toString() } : {};
    return this.customGet<AppSettings[]>(`/history/${key}`, params);
  }

  revertSetting(key: string, version: string): Observable<AppSettings> {
    return this.customPost<AppSettings>(`/revert/${key}`, { version });
  }

  // Cache Operations
  clearSettingsCache(): Observable<void> {
    return this.customPost<void>('/cache/clear', {});
  }

  refreshSettingsCache(): Observable<void> {
    return this.customPost<void>('/cache/refresh', {});
  }
}
