import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from '../../services/notification.service';

@Component({
    selector: 'app-notification-item',
    templateUrl: './notification-item.component.html',
    styleUrls: ['./notification-item.component.scss'],
    standalone: false
})
export class NotificationItemComponent {
  @Input() notification!: Notification;
  @Input() showActions = true;
  @Output() markAsRead = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'check_circle';
      case 'info':
      default:
        return 'info';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'primary';
    }
  }

  getServiceIcon(service?: string): string {
    if (!service) return 'help';

    const serviceLower = service.toLowerCase();
    if (serviceLower.includes('msfs') || serviceLower.includes('flight')) {
      return 'flight';
    }
    if (serviceLower.includes('rabbitmq')) {
      return 'compare_arrows';
    }
    if (serviceLower.includes('seq')) {
      return 'list_alt';
    }
    if (serviceLower.includes('coordinator') || serviceLower.includes('api')) {
      return 'hub';
    }
    return 'settings';
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  }

  onMarkAsRead(): void {
    this.markAsRead.emit(this.notification.id);
  }

  onDelete(): void {
    this.delete.emit(this.notification.id);
  }
}
