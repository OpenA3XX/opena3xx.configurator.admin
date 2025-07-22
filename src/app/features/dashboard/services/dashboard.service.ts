import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private BASE_URL: string;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {
    this.BASE_URL = this.configurationService.getApiBaseUrl();
  }

  /**
   * Get dashboard overview data
   */
  getDashboardOverview(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/dashboard/overview`);
  }

  /**
   * Get dashboard statistics
   */
  getDashboardStatistics(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/dashboard/statistics`);
  }

  /**
   * Get recent activities
   */
  getRecentActivities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/dashboard/recent-activities`);
  }

  /**
   * Get system health status
   */
  getSystemHealthStatus(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/dashboard/system-health`);
  }
}
