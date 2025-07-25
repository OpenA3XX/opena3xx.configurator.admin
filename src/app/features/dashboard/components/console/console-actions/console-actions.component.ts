import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'opena3xx-console-actions',
  templateUrl: './console-actions.component.html',
  styleUrls: ['./console-actions.component.scss']
})
export class ConsoleActionsComponent {
  @Output() clearEvents = new EventEmitter<void>();
  @Output() exportEvents = new EventEmitter<void>();
  @Output() openSettings = new EventEmitter<void>();
  @Output() openEventHistory = new EventEmitter<void>();
  @Output() openPerformance = new EventEmitter<void>();

  onClearEvents(): void {
    this.clearEvents.emit();
  }

  onExportEvents(): void {
    this.exportEvents.emit();
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
