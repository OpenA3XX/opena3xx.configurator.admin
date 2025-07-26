import { Component, Input, HostBinding } from '@angular/core';

interface ChartDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
  category?: string;
}

interface BoardActivityData {
  boardId: number;
  boardName: string;
  eventCount: number;
  lastActivity: Date;
  status: 'online' | 'offline' | 'warning';
}

@Component({
    selector: 'opena3xx-console-charts',
    templateUrl: './console-charts.component.html',
    styleUrls: ['./console-charts.component.scss'],
    standalone: false
})
export class ConsoleChartsComponent {
  @Input() chartData: ChartDataPoint[] = [];
  @Input() boardActivity: BoardActivityData[] = [];
  @Input() showCharts: boolean = false;
  @Input() isDarkMode: boolean = false;

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }

  getChartData(): ChartDataPoint[] {
    return this.chartData;
  }

  getBoardActivity(): BoardActivityData[] {
    return this.boardActivity;
  }
}
