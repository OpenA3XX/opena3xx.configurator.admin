import { Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'opena3xx-dashboard-header',
    templateUrl: './dashboard-header.component.html',
    styleUrls: ['./dashboard-header.component.scss'],
    standalone: false
})
export class DashboardHeaderComponent {
  @Input() totalBoards: number = 0;
  @Input() totalPanels: number = 0;
  @Input() connectedSystems: number = 0;
  @Input() lastUpdated: Date = new Date();
  @Input() isDarkMode: boolean = false;

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }
}
