import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfigurationService } from './configuration.service';
import { AppConfig } from '../models/app-config.interface';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let httpMock: HttpTestingController;

  const mockConfig: AppConfig = {
    api: {
      baseUrl: 'http://test.api.com'
    },
    app: {
      name: 'Test App',
      version: '1.0.0-test'
    },
    features: {
      enableDebugMode: true,
      enableConsoleLogging: false
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [ConfigurationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(ConfigurationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadConfiguration', () => {
    it('should load configuration from JSON file', async () => {
      const configPromise = service.loadConfiguration();

      const req = httpMock.expectOne('assets/config/app-config.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockConfig);

      const result = await configPromise;
      expect(result).toEqual(mockConfig);
    });

    it('should return cached config on subsequent calls', async () => {
      // First call
      const firstPromise = service.loadConfiguration();
      const req = httpMock.expectOne('assets/config/app-config.json');
      req.flush(mockConfig);
      await firstPromise;

      // Second call should not make HTTP request
      const secondResult = await service.loadConfiguration();
      expect(secondResult).toEqual(mockConfig);
      httpMock.expectNone('assets/config/app-config.json');
    });

    it('should return fallback config on HTTP error', async () => {
      const configPromise = service.loadConfiguration();

      const req = httpMock.expectOne('assets/config/app-config.json');
      req.error(new ErrorEvent('Network error'));

      const result = await configPromise;
      expect(result.api.baseUrl).toBe('http://localhost:5000');
      expect(result.app.name).toBe('OpenA3XX Flight Deck');
    });
  });

  describe('configuration getters', () => {
    beforeEach(async () => {
      const configPromise = service.loadConfiguration();
      const req = httpMock.expectOne('assets/config/app-config.json');
      req.flush(mockConfig);
      await configPromise;
    });

    it('should return API base URL', () => {
      expect(service.getApiBaseUrl()).toBe('http://test.api.com');
    });

    it('should return app name', () => {
      expect(service.getAppName()).toBe('OpenA3XX Flight Deck');
    });

    it('should return app version', () => {
      expect(service.getAppVersion()).toBe('1.0.0-test');
    });

    it('should return debug mode status', () => {
      expect(service.isDebugModeEnabled()).toBe(true);
    });

    it('should return console logging status', () => {
      expect(service.isConsoleLoggingEnabled()).toBe(false);
    });

    it('should return full config', () => {
      expect(service.getConfig()).toEqual(mockConfig);
    });
  });

  describe('fallback behavior', () => {
    it('should return fallback API URL when config not loaded', () => {
      expect(service.getApiBaseUrl()).toBe('http://localhost:5000');
    });

    it('should return fallback app name when config not loaded', () => {
      expect(service.getAppName()).toBe('OpenA3XX Flight Deck');
    });
  });
});
