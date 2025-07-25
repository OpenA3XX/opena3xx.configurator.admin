import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'opena3xx-console-charts',
  templateUrl: './console-charts.component.html',
  styleUrls: ['./console-charts.component.scss']
})
export class ConsoleChartsComponent {
  @Input() chartData: any[] = [];
  @Input() boardActivity: any[] = [];
  @Input() showCharts: boolean = false;

  getChartData(): any[] {
    return this.chartData;
  }

  getBoardActivity(): any[] {
    return this.boardActivity;
  }
}
