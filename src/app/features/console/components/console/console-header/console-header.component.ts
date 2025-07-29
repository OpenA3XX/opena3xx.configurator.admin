import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

export interface ConsoleStatus {
  isConnected: boolean;
  connectionCount: number;
  eventCount: number;
  lastEvent: Date;
  uptime: string;
}

@Component({
  selector: 'opena3xx-console-header',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './console-header.component.html',
  styleUrls: ['./console-header.component.scss']
})
export class ConsoleHeaderComponent {
  @Input() title = 'Console';
  @Input() subtitle = 'Real-time event monitoring';
  @Input() status: ConsoleStatus = {
    isConnected: false,
    connectionCount: 0,
    eventCount: 0,
    lastEvent: new Date(),
    uptime: '0h 0m'
  };
  @Input() showActions = true;
  @Output() connect = new EventEmitter<void>();
  @Output() disconnect = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
  @Output() settings = new EventEmitter<void>();

  // Computed properties
  statusClass = computed(() => {
    const classes = ['opena3xx-console-header__status'];
    if (this.status.isConnected) {
      classes.push('opena3xx-console-header__status--connected');
    } else {
      classes.push('opena3xx-console-header__status--disconnected');
    }
    return classes.join(' ');
  });

  statusIcon = computed(() => {
    return this.status.isConnected ? 'check_circle' : 'cancel';
  });

  statusText = computed(() => {
    return this.status.isConnected ? 'Connected' : 'Disconnected';
  });

  lastEventText = computed(() => {
    if (!this.status.lastEvent) return 'No events';

    const now = new Date();
    const diff = now.getTime() - this.status.lastEvent.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  });

  onConnect(): void {
    this.connect.emit();
  }

  onDisconnect(): void {
    this.disconnect.emit();
  }

  onClear(): void {
    this.clear.emit();
  }

  onExport(): void {
    this.export.emit();
  }

  onSettings(): void {
    this.settings.emit();
  }

  // Getters for template
  get headerClasses(): string {
    return this.statusClass();
  }

  get statusIconName(): string {
    return this.statusIcon();
  }

  get statusDisplayText(): string {
    return this.statusText();
  }

  get lastEventDisplay(): string {
    return this.lastEventText();
  }

  get hasConnections(): boolean {
    return this.status.connectionCount > 0;
  }

  get hasEvents(): boolean {
    return this.status.eventCount > 0;
  }

  get isConnectedState(): boolean {
    return this.status.isConnected;
  }
}
