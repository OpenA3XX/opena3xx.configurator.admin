import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DataService } from 'src/app/core/services/data.service';
import { RealTimeService } from 'src/app/core/services/realtime.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { HardwareBoardDto, HardwarePanelOverviewDto } from 'src/app/shared/models/models';

interface ActivityItem {
  icon: string;
  description: string;
  timestamp: Date;
}

@Component({
    selector: 'opena3xx-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Quick stats
  totalBoards: number = 0;
  totalPanels: number = 0;
  connectedSystems: number = 0;
  lastUpdated: Date = new Date();

  // System overview
  activeBoards: number = 0;
  configuredPanels: number = 0;
  recentEvents: number = 0;

  // System health
  systemHealth = {
    status: 'healthy',
    icon: 'check_circle',
    message: 'All systems operational'
  };

  // Recent activities
  recentActivities: ActivityItem[] = [];

  // System status
  apiStatus = {
    status: 'online',
    icon: 'wifi'
  };

  databaseStatus = {
    status: 'online',
    icon: 'storage'
  };

  realtimeStatus = {
    status: 'online',
    icon: 'sync'
  };

  systemStatus = {
    status: 'online',
    icon: 'memory'
  };

  // Theme support
  isDarkMode: boolean = false;
  private themeSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private dataService: DataService,
    public realtimeService: RealTimeService,
    private themeService: ThemeService
  ) {}

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }

  ngOnInit(): void {
    try {
      this.loadDashboardData();
      this.updateLastUpdated();

      // Subscribe to theme changes
      if (this.themeService) {
        this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
          this.isDarkMode = isDark;
        });
      }

      // Update every 30 seconds
      setInterval(() => {
        this.updateLastUpdated();
      }, 30000);
    } catch (error) {
      console.error('Error in dashboard ngOnInit:', error);
    }
  }

  ngOnDestroy(): void {
    try {
      if (this.themeSubscription) {
        this.themeSubscription.unsubscribe();
      }
    } catch (error) {
      console.error('Error in dashboard ngOnDestroy:', error);
    }
  }

  private async loadDashboardData(): Promise<void> {
    try {
      // Load hardware boards
      const boards = await firstValueFrom(this.dataService.getAllHardwareBoards()) as HardwareBoardDto[];
      this.totalBoards = boards.length;
      // Since HardwareBoardDto doesn't have isActive, we'll assume all boards are active for now
      this.activeBoards = boards.length;

      // Load hardware panels - now as an array
      try {
        const panelOverviews = await firstValueFrom(this.dataService.getAllHardwarePanelOverviewDetails()) as HardwarePanelOverviewDto[];
        this.totalPanels = panelOverviews.length;
        this.configuredPanels = panelOverviews.length; // If you have a property to filter configured, use it here
      } catch (panelError) {
        console.warn('Panel overview not available:', panelError);
        this.totalPanels = 0;
        this.configuredPanels = 0;
      }

      // Update connected systems
      this.connectedSystems = this.realtimeService && this.realtimeService.isConnected ? 1 : 0;

      // Update real-time status
      this.realtimeStatus.status = this.realtimeService && this.realtimeService.isConnected ? 'online' : 'offline';
      this.realtimeStatus.icon = this.realtimeService && this.realtimeService.isConnected ? 'sync' : 'sync_disabled';

      // Load recent activities (mock data for now)
      this.loadRecentActivities();

      // Update system health
      this.updateSystemHealth();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.systemHealth = {
        status: 'error',
        icon: 'error',
        message: 'Unable to load system data'
      };
    }
  }

  private loadRecentActivities(): void {
    // Mock recent activities - replace with real data from service
    this.recentActivities = [
      {
        icon: 'hardware',
        description: 'Hardware board "MCDU Co Pilot" registered',
        timestamp: new Date(Date.now() - 300000) // 5 minutes ago
      },
      {
        icon: 'dashboard',
        description: 'Panel "Main Flight Deck" configured',
        timestamp: new Date(Date.now() - 900000) // 15 minutes ago
      },
      {
        icon: 'settings',
        description: 'System settings updated',
        timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
      }
    ];
  }

  private updateSystemHealth(): void {
    const allOnline = this.apiStatus.status === 'online' &&
                     this.databaseStatus.status === 'online' &&
                     this.realtimeStatus.status === 'online' &&
                     this.systemStatus.status === 'online';

    if (allOnline) {
      this.systemHealth = {
        status: 'healthy',
        icon: 'check_circle',
        message: 'All systems operational'
      };
    } else if (this.apiStatus.status === 'offline' || this.databaseStatus.status === 'offline') {
      this.systemHealth = {
        status: 'error',
        icon: 'error',
        message: 'Critical systems offline'
      };
    } else {
      this.systemHealth = {
        status: 'warning',
        icon: 'warning',
        message: 'Some systems may be offline'
      };
    }
  }

  private updateLastUpdated(): void {
    this.lastUpdated = new Date();
  }

  // Navigation methods
  navigateToHardware(): void {
    try {
      this.router.navigateByUrl('/manage/hardware-boards');
    } catch (error) {
      console.error('Error navigating to hardware:', error);
    }
  }

  navigateToPanels(): void {
    try {
      this.router.navigateByUrl('/manage/hardware-panels');
    } catch (error) {
      console.error('Error navigating to panels:', error);
    }
  }

  navigateToConsole(): void {
    try {
      this.router.navigateByUrl('/console');
    } catch (error) {
      console.error('Error navigating to console:', error);
    }
  }

  navigateToSettings(): void {
    try {
      this.router.navigateByUrl('/settings');
    } catch (error) {
      console.error('Error navigating to settings:', error);
    }
  }
}
