import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from './http.interceptor';
import { LoadingService } from '../services/loading.service';
import { ConfigurationService } from '../services/configuration.service';

describe('HttpRequestInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let configService: jasmine.SpyObj<ConfigurationService>;

  beforeEach(() => {
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    const configSpy = jasmine.createSpyObj('ConfigurationService', ['isDebugModeEnabled']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpRequestInterceptor,
          multi: true
        },
        { provide: LoadingService, useValue: loadingSpy },
        { provide: ConfigurationService, useValue: configSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    configService = TestBed.inject(ConfigurationService) as jasmine.SpyObj<ConfigurationService>;

    configService.isDebugModeEnabled.and.returnValue(false);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show loading for regular requests', () => {
    httpClient.get('/api/data').subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(loadingService.show).toHaveBeenCalled();

    req.flush({ data: 'test' });
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should NOT show loading for ping requests', () => {
    httpClient.get('/core/heartbeat/ping').subscribe();

    const req = httpMock.expectOne('/core/heartbeat/ping');
    expect(loadingService.show).not.toHaveBeenCalled();

    req.flush('pong');
    expect(loadingService.hide).not.toHaveBeenCalled();
  });

  it('should NOT show loading for requests with X-Skip-Loading header', () => {
    httpClient.get('/api/data', {
      headers: { 'X-Skip-Loading': 'true' }
    }).subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(loadingService.show).not.toHaveBeenCalled();

    req.flush({ data: 'test' });
    expect(loadingService.hide).not.toHaveBeenCalled();
  });

  it('should NOT show loading for health check requests', () => {
    const healthEndpoints = ['/health', '/heartbeat', '/ping', '/status'];

    healthEndpoints.forEach(endpoint => {
      httpClient.get(endpoint).subscribe();
      const req = httpMock.expectOne(endpoint);
      req.flush('ok');
    });

    expect(loadingService.show).not.toHaveBeenCalled();
    expect(loadingService.hide).not.toHaveBeenCalled();
  });
});
