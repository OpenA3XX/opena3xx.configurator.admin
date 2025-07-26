import { Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'opena3xx-console-charts',
    templateUrl: './console-charts.component.html',
    styleUrls: ['./console-charts.component.scss'],
    standalone: false
})
export class ConsoleChartsComponent {
  @Input() chartData: any[] = [];
  @Input() boardActivity: any[] = [];
  @Input() showCharts: boolean = false;
  @Input() isDarkMode: boolean = false;

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }

  getChartData(): any[] {
    return this.chartData;
  }

  getBoardActivity(): any[] {
    return this.boardActivity;
  }
}
