import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';
import { NotificationItemComponent } from '../notification-item/notification-item.component';
import { NotificationFiltersComponent } from '../notification-filters/notification-filters.component';
import { NotificationService } from '../../services/notification.service';

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
  selector: 'opena3xx-notification-center',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    PageLayoutComponent,
    LoadingWrapperComponent,
    NotificationItemComponent,
    NotificationFiltersComponent
  ],
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss']
})
export class NotificationCenterComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  notifications = signal<Notification[]>([]);
  filters = signal({
    type: 'all',
    priority: 'all',
    category: 'all',
    read: 'all'
  });

  // Computed properties
  filteredNotifications = computed(() => {
    let filtered = this.notifications();

    if (this.filters().type !== 'all') {
      filtered = filtered.filter(n => n.type === this.filters().type);
    }

    if (this.filters().priority !== 'all') {
      filtered = filtered.filter(n => n.priority === this.filters().priority);
    }

    if (this.filters().category !== 'all') {
      filtered = filtered.filter(n => n.category === this.filters().category);
    }

    if (this.filters().read !== 'all') {
      const read = this.filters().read === 'read';
      filtered = filtered.filter(n => n.read === read);
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  isEmpty = computed(() => this.filteredNotifications().length === 0 && !this.loading() && !this.error());

  // Page actions
  pageActions = signal<ActionButton[]>([
    {
      label: 'Mark All Read',
      icon: 'mark_email_read',
      action: () => this.markAllAsRead(),
      type: 'secondary'
    },
    {
      label: 'Clear All',
      icon: 'clear_all',
      action: () => this.clearAllNotifications(),
      type: 'secondary'
    }
  ]);

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  async loadNotifications(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      const notifications = await this.notificationService.getNotifications();
      this.notifications.set(notifications);
    } catch (err) {
      console.error('Error loading notifications:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onFiltersChange(filters: any): void {
    this.filters.set(filters);
  }

  onNotificationAction(notification: Notification, action: string): void {
    switch (action) {
      case 'read':
        this.markAsRead(notification.id);
        break;
      case 'delete':
        this.deleteNotification(notification.id);
        break;
      default:
        console.log(`Unknown action: ${action} for notification: ${notification.id}`);
    }
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId);
    this.notifications.update(notifications =>
      notifications.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
    this.notifications.update(notifications =>
      notifications.map(n => ({ ...n, read: true }))
    );
  }

  deleteNotification(notificationId: string): void {
    this.notificationService.deleteNotification(notificationId);
    this.notifications.update(notifications =>
      notifications.filter(n => n.id !== notificationId)
    );
  }

  clearAllNotifications(): void {
    this.notificationService.clearAllNotifications();
    this.notifications.set([]);
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'mark-all-read':
        this.markAllAsRead();
        break;
      case 'clear-all':
        this.clearAllNotifications();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get notificationList(): Notification[] {
    return this.filteredNotifications();
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

  get unreadCount(): number {
    return this.notifications().filter(n => !n.read).length;
  }

  get totalCount(): number {
    return this.notifications().length;
  }
}
