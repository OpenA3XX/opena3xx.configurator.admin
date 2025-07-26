import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'opena3xx-activity-status',
  templateUrl: './activity-status.component.html',
  styleUrls: ['./activity-status.component.scss']
})
export class ActivityStatusComponent {
  @Input() recentActivities: any[] = [];
  @Input() apiStatus: any = {
    status: 'online',
    icon: 'wifi'
  };
  @Input() databaseStatus: any = {
    status: 'online',
    icon: 'storage'
  };
  @Input() realtimeStatus: any = {
    status: 'online',
    icon: 'sync'
  };
  @Input() systemStatus: any = {
    status: 'online',
    icon: 'memory'
  };
  @Input() isDarkMode: boolean = false;

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }
}
