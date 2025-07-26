import { Component, Input, HostBinding } from '@angular/core';

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'success';
}

interface StatusInfo {
  status: 'online' | 'offline' | 'warning' | 'unknown';
  icon: string;
}

@Component({
    selector: 'opena3xx-activity-status',
    templateUrl: './activity-status.component.html',
    styleUrls: ['./activity-status.component.scss'],
    standalone: false
})
export class ActivityStatusComponent {
  @Input() recentActivities: ActivityItem[] = [];
  @Input() apiStatus: StatusInfo = {
    status: 'online',
    icon: 'wifi'
  };
  @Input() databaseStatus: StatusInfo = {
    status: 'online',
    icon: 'storage'
  };
  @Input() realtimeStatus: StatusInfo = {
    status: 'online',
    icon: 'sync'
  };
  @Input() systemStatus: StatusInfo = {
    status: 'online',
    icon: 'memory'
  };
  @Input() isDarkMode: boolean = false;

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }
}
