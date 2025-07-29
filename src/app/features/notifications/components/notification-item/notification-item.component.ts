import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  actions?: { label: string; action: string }[];
}

@Component({
  selector: 'opena3xx-notification-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent {
  @Input() notification!: Notification;
  @Input() showActions = true;
  @Output() action = new EventEmitter<{ notification: Notification; action: string }>();
  @Output() click = new EventEmitter<Notification>();

  // Computed properties
  notificationClass = computed(() => {
    const classes = ['opena3xx-notification-item'];
    classes.push(`opena3xx-notification-item--${this.notification.type}`);
    classes.push(`opena3xx-notification-item--${this.notification.priority}`);
    if (this.notification.read) classes.push('opena3xx-notification-item--read');
    return classes.join(' ');
  });

  priorityClass = computed(() => {
    const classes = ['opena3xx-notification-item__priority'];
    classes.push(`opena3xx-notification-item__priority--${this.notification.priority}`);
    return classes.join(' ');
  });

  onAction(action: string): void {
    this.action.emit({ notification: this.notification, action });
  }

  onClick(): void {
    this.click.emit(this.notification);
  }

  // Getters for template
  get notificationClasses(): string {
    return this.notificationClass();
  }

  get priorityClasses(): string {
    return this.priorityClass();
  }

  get typeIcon(): string {
    switch (this.notification.type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  }

  get priorityIcon(): string {
    switch (this.notification.priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'remove';
      default: return 'low_priority';
    }
  }

  get timeAgo(): string {
    const now = new Date();
    const diff = now.getTime() - this.notification.timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  get hasActions(): boolean {
    return this.showActions && !!this.notification.actions && this.notification.actions.length > 0;
  }

  get hasCategory(): boolean {
    return !!this.notification.category;
  }

  get isRead(): boolean {
    return this.notification.read;
  }
}
