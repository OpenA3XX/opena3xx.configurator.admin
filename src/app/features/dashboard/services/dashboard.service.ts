import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

interface DashboardOverview {
  totalHardwareBoards: number;
  activeConnections: number;
  totalEvents: number;
  systemStatus: string;
}

interface DashboardStatistics {
  eventsPerMinute: number;
  averageResponseTime: number;
  errorRate: number;
  uptime: number;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'success';
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  components: {
    api: { status: string; responseTime: number };
    database: { status: string; responseTime: number };
    hardware: { status: string; responseTime: number };
  };
}

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
  getDashboardOverview(): Observable<DashboardOverview> {
    return this.http.get<DashboardOverview>(`${this.BASE_URL}/dashboard/overview`);
  }

  /**
   * Get dashboard statistics
   */
  getDashboardStatistics(): Observable<DashboardStatistics> {
    return this.http.get<DashboardStatistics>(`${this.BASE_URL}/dashboard/statistics`);
  }

  /**
   * Get recent activities
   */
  getRecentActivities(): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.BASE_URL}/dashboard/recent-activities`);
  }

  /**
   * Get system health status
   */
  getSystemHealthStatus(): Observable<SystemHealth> {
    return this.http.get<SystemHealth>(`${this.BASE_URL}/dashboard/system-health`);
  }

  /**
   * Get all dashboard data
   */
  getDashboardData(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/dashboard/data`);
  }
}
