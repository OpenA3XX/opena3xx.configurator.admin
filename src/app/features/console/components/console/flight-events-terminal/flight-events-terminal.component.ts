import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { FlightEvent } from 'src/app/core/services/realtime.service';

@Component({
  selector: 'opena3xx-flight-events-terminal',
  templateUrl: './flight-events-terminal.component.html',
  styleUrls: ['./flight-events-terminal.component.scss']
})
export class FlightEventsTerminalComponent {
  @Input() events: FlightEvent[] = [];
  @Input() isConnected: boolean = false;
  @Input() isDarkMode: boolean = false;
  @Output() copyEvent = new EventEmitter<FlightEvent>();
  @Output() exportEvent = new EventEmitter<FlightEvent>();

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }

  onCopyEvent(event: FlightEvent): void {
    this.copyEvent.emit(event);
  }

  onExportEvent(event: FlightEvent): void {
    this.exportEvent.emit(event);
  }

  trackByEvent(index: number, event: FlightEvent): string {
    return `${event.timestamp}_${event.hardware_board_id}_${event.input_selector_id}`;
  }
}
