import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'opena3xx-system-overview',
  templateUrl: './system-overview.component.html',
  styleUrls: ['./system-overview.component.scss']
})
export class SystemOverviewComponent {
  @Input() systemHealth: any = {
    status: 'healthy',
    icon: 'check_circle',
    message: 'All systems operational'
  };
  @Input() activeBoards: number = 0;
  @Input() totalBoards: number = 0;
  @Input() totalPanels: number = 0;
  @Input() configuredPanels: number = 0;
  @Input() recentEvents: number = 0;
  @Input() isDarkMode: boolean = false;

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }
}
