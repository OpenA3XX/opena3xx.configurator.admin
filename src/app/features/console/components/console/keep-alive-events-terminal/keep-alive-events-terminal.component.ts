import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { KeepAliveEvent } from 'src/app/core/services/realtime.service';

@Component({
  selector: 'opena3xx-keep-alive-events-terminal',
  templateUrl: './keep-alive-events-terminal.component.html',
  styleUrls: ['./keep-alive-events-terminal.component.scss']
})
export class KeepAliveEventsTerminalComponent {
  @Input() events: KeepAliveEvent[] = [];
  @Input() isConnected: boolean = false;
  @Input() isDarkMode: boolean = false;
  @Output() copyEvent = new EventEmitter<KeepAliveEvent>();
  @Output() exportEvent = new EventEmitter<KeepAliveEvent>();

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }

  onCopyEvent(event: KeepAliveEvent): void {
    this.copyEvent.emit(event);
  }

  onExportEvent(event: KeepAliveEvent): void {
    this.exportEvent.emit(event);
  }

  trackByEvent(index: number, event: KeepAliveEvent): string {
    return `${event.timestamp}_${event.hardware_board_id}`;
  }
}
