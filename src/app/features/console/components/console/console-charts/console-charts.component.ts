import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageLayoutComponent, ActionButton } from '../../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
  timestamp?: Date;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  title: string;
  data: ChartData[];
  options?: any;
}

export interface ConsoleChart {
  id: string;
  name: string;
  description: string;
  config: ChartConfig;
  lastUpdate: Date;
  isVisible: boolean;
}

@Component({
  selector: 'opena3xx-console-charts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    PageLayoutComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './console-charts.component.html',
  styleUrls: ['./console-charts.component.scss']
})
export class ConsoleChartsComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  charts = signal<ConsoleChart[]>([]);
  selectedChartType = signal('all');
  autoRefresh = signal(true);
  refreshInterval = signal(5000);

  // Computed properties
  visibleCharts = computed(() =>
    this.charts().filter(chart => chart.isVisible)
  );

  filteredCharts = computed(() => {
    let charts = this.visibleCharts();
    if (this.selectedChartType() !== 'all') {
      charts = charts.filter(chart => chart.config.type === this.selectedChartType());
    }
    return charts;
  });

  isEmpty = computed(() => this.filteredCharts().length === 0 && !this.loading() && !this.error());

  // Page actions
  pageActions = signal<ActionButton[]>([
    {
      label: 'Refresh',
      icon: 'refresh',
      action: 'refresh',
      color: 'primary'
    },
    {
      label: 'Export Charts',
      icon: 'download',
      action: 'export-charts',
      color: 'accent'
    },
    {
      label: 'Settings',
      icon: 'settings',
      action: 'settings',
      color: 'primary'
    }
  ]);

  constructor() {}

  ngOnInit(): void {
    this.loadConsoleCharts();
  }

  async loadConsoleCharts(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const charts: ConsoleChart[] = [
        {
          id: '1',
          name: 'Event Rate',
          description: 'Events per second over time',
          config: {
            type: 'line',
            title: 'Event Rate',
            data: [
              { label: '00:00', value: 12 },
              { label: '00:05', value: 15 },
              { label: '00:10', value: 18 },
              { label: '00:15', value: 14 },
              { label: '00:20', value: 20 }
            ]
          },
          lastUpdate: new Date(),
          isVisible: true
        },
        {
          id: '2',
          name: 'Event Types',
          description: 'Distribution of event types',
          config: {
            type: 'pie',
            title: 'Event Types',
            data: [
              { label: 'Flight Events', value: 45, color: '#2196F3' },
              { label: 'System Events', value: 30, color: '#4CAF50' },
              { label: 'Hardware Events', value: 15, color: '#FF9800' },
              { label: 'Error Events', value: 10, color: '#F44336' }
            ]
          },
          lastUpdate: new Date(),
          isVisible: true
        },
        {
          id: '3',
          name: 'Connection Status',
          description: 'Active connections by type',
          config: {
            type: 'bar',
            title: 'Connection Status',
            data: [
              { label: 'Hardware', value: 8, color: '#2196F3' },
              { label: 'Network', value: 5, color: '#4CAF50' },
              { label: 'Simulator', value: 3, color: '#FF9800' },
              { label: 'Gateway', value: 2, color: '#9C27B0' }
            ]
          },
          lastUpdate: new Date(),
          isVisible: true
        }
      ];

      this.charts.set(charts);
    } catch (err) {
      console.error('Error loading console charts:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onChartTypeChange(chartType: string): void {
    this.selectedChartType.set(chartType);
  }

  toggleChartVisibility(chartId: string): void {
    this.charts.update(charts =>
      charts.map(chart =>
        chart.id === chartId ? { ...chart, isVisible: !chart.isVisible } : chart
      )
    );
  }

  refreshCharts(): void {
    console.log('Refreshing console charts...');
    this.loadConsoleCharts();
  }

  exportCharts(): void {
    console.log('Exporting console charts...');
    // Implement export functionality
  }

  openSettings(): void {
    console.log('Opening chart settings...');
    // Open settings dialog
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'refresh':
        this.refreshCharts();
        break;
      case 'export-charts':
        this.exportCharts();
        break;
      case 'settings':
        this.openSettings();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get chartList(): ConsoleChart[] {
    return this.filteredCharts();
  }

  get pageActionButtons(): ActionButton[] {
    return this.pageActions();
  }

  get isLoading(): boolean {
    return this.loading();
  }

  get hasError(): boolean {
    return this.error();
  }

  get isEmptyState(): boolean {
    return this.isEmpty();
  }

  get selectedChartTypeValue(): string {
    return this.selectedChartType();
  }

  get autoRefreshEnabled(): boolean {
    return this.autoRefresh();
  }

  get refreshIntervalValue(): number {
    return this.refreshInterval();
  }

  get chartTypeOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Charts' },
      { value: 'line', label: 'Line Charts' },
      { value: 'bar', label: 'Bar Charts' },
      { value: 'pie', label: 'Pie Charts' },
      { value: 'doughnut', label: 'Doughnut Charts' }
    ];
  }

  get chartIcon(): (type: string) => string {
    return (type: string) => {
      switch (type) {
        case 'line': return 'show_chart';
        case 'bar': return 'bar_chart';
        case 'pie': return 'pie_chart';
        case 'doughnut': return 'donut_large';
        default: return 'insert_chart';
      }
    };
  }

  get visibleChartCount(): number {
    return this.visibleCharts().length;
  }

  get totalChartCount(): number {
    return this.charts().length;
  }
}
