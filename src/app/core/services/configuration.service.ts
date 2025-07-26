import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppConfig } from '../models/app-config.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private config: AppConfig | null = null;
  private configSubject = new BehaviorSubject<AppConfig | null>(null);
  public config$ = this.configSubject.asObservable();

  private defaultConfig: AppConfig = {
    api: {
      baseUrl: 'http://localhost:5000'
    },
    app: {
      name: 'OpenA3XX Flight Deck',
      version: '1.0.0'
    },
    features: {
      enableDebugMode: false,
      enableConsoleLogging: true
    }
  };

  constructor(private http: HttpClient) {}

  async loadConfiguration(): Promise<AppConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      const config = await firstValueFrom(this.http.get<AppConfig>('assets/config/app-config.json'));
      this.config = config;
      this.configSubject.next(this.config);
      return this.config;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      // Fallback configuration
      this.config = {
        api: {
          baseUrl: 'http://localhost:5000'
        },
        app: {
          name: 'OpenA3XX Flight Deck',
          version: '1.0.0'
        },
        features: {
          enableDebugMode: false,
          enableConsoleLogging: true
        }
      };
      this.configSubject.next(this.config);
      return this.config;
    }
  }

  getApiBaseUrl(): string {
    if (!this.config) {
      console.warn('Configuration not loaded yet. Using fallback URL.');
      return 'http://localhost:5000';
    }
    return this.config.api.baseUrl;
  }

  getAppName(): string {
    return this.config?.app.name || 'OpenA3XX Flight Deck';
  }

  getAppVersion(): string {
    return this.config?.app.version || '1.0.0';
  }

  isDebugModeEnabled(): boolean {
    return this.config?.features.enableDebugMode || false;
  }

  isConsoleLoggingEnabled(): boolean {
    return this.config?.features.enableConsoleLogging || true;
  }

  getConfig(): AppConfig | null {
    return this.config;
  }
}
