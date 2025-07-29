import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'opena3xx-dashboard-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {
  @Input() title = 'Dashboard';
  @Input() subtitle = '';
  @Input() status = 'online';
  @Input() lastUpdate?: Date;
  @Input() showActions = true;
  @Output() refresh = new EventEmitter<void>();
  @Output() settings = new EventEmitter<void>();
  @Output() notifications = new EventEmitter<void>();

  // Computed properties
  headerClass = computed(() => {
    const classes = ['opena3xx-dashboard-header'];
    if (this.status === 'offline') classes.push('opena3xx-dashboard-header--offline');
    if (this.status === 'warning') classes.push('opena3xx-dashboard-header--warning');
    return classes.join(' ');
  });

  statusClass = computed(() => {
    const classes = ['opena3xx-dashboard-header__status'];
    classes.push(`opena3xx-dashboard-header__status--${this.status}`);
    return classes.join(' ');
  });

  onRefresh(): void {
    this.refresh.emit();
  }

  onSettings(): void {
    this.settings.emit();
  }

  onNotifications(): void {
    this.notifications.emit();
  }

  // Getters for template
  get headerClasses(): string {
    return this.headerClass();
  }

  get statusClasses(): string {
    return this.statusClass();
  }

  get hasSubtitle(): boolean {
    return !!this.subtitle;
  }

  get hasLastUpdate(): boolean {
    return !!this.lastUpdate;
  }

  get statusText(): string {
    return this.status.charAt(0).toUpperCase() + this.status.slice(1);
  }

  get lastUpdateText(): string {
    if (!this.lastUpdate) return '';
    return this.lastUpdate.toLocaleTimeString();
  }
}
