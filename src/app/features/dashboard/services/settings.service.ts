import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private BASE_URL: string;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {
    this.BASE_URL = this.configurationService.getApiBaseUrl();
  }

  /**
   * Get settings form configuration
   */
  getSettingsForm(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/forms/settings`);
  }

  /**
   * Get all configuration
   */
  getAllConfiguration(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/configuration`);
  }

  /**
   * Update all configuration
   */
  updateAllConfiguration(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/configuration`, data);
  }

  /**
   * Get specific configuration by key
   */
  getConfigurationByKey(key: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/configuration/${key}`);
  }

  /**
   * Update specific configuration by key
   */
  updateConfigurationByKey(key: string, value: any): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/configuration/${key}`, { value });
  }
}
