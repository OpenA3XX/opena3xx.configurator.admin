import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'opena3xx-console-statistics',
  templateUrl: './console-statistics.component.html',
  styleUrls: ['./console-statistics.component.scss']
})
export class ConsoleStatisticsComponent {
  @Input() totalEvents: number = 0;
  @Input() eventsPerMinute: number = 0;
  @Input() connectedBoards: number = 0;
  @Input() activeSelectors: number = 0;
  @Input() showCharts: boolean = false;
  @Input() isDarkMode: boolean = false;
  @Output() toggleCharts = new EventEmitter<void>();
  @Output() openSettings = new EventEmitter<void>();
  @Output() openEventHistory = new EventEmitter<void>();
  @Output() openPerformance = new EventEmitter<void>();

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }

  onToggleCharts(): void {
    this.toggleCharts.emit();
  }

  onOpenSettings(): void {
    this.openSettings.emit();
  }

  onOpenEventHistory(): void {
    this.openEventHistory.emit();
  }

  onOpenPerformance(): void {
    this.openPerformance.emit();
  }
}
