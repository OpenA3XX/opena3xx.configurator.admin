import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'opena3xx-console-statistics',
  templateUrl: './console-statistics.component.html',
  styleUrls: ['./console-statistics.component.scss']
})
export class ConsoleStatisticsComponent implements OnInit, OnDestroy {
  @Input() totalEvents: number = 0;
  @Input() eventsPerMinute: number = 0;
  @Input() connectedBoards: number = 0;
  @Input() activeSelectors: number = 0;
  @Input() showCharts: boolean = false;
  @Output() toggleCharts = new EventEmitter<void>();
  @Output() openSettings = new EventEmitter<void>();
  @Output() openEventHistory = new EventEmitter<void>();
  @Output() openPerformance = new EventEmitter<void>();

  isDarkMode: boolean = false;
  private themeSubscription: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
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
