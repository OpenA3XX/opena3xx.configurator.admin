import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { DependencyStatusService, DependencyStatusResponse } from '../../../core/services/dependency-status.service';
import { AppStateService } from '../../../core/services/app-state.service';

export interface Notification {
  id: string;
  type: 'service_status' | 'system_alert' | 'user_action';
  severity: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  service?: string;
  timestamp: Date;
  isRead: boolean;
  metadata?: any;
}

export interface NotificationFilters {
  severity?: string[];
  service?: string[];
  isRead?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private filtersSubject = new BehaviorSubject<NotificationFilters>({});
  private unreadCountSubject = new Subject<number>();

  public notifications$ = this.notificationsSubject.asObservable();
  public filters$ = this.filtersSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  public filteredNotifications$ = combineLatest([
    this.notifications$,
    this.filters$
  ]).pipe(
    map(([notifications, filters]) => this.applyFilters(notifications, filters))
  );

  constructor(
    private dependencyStatusService: DependencyStatusService,
    private appStateService: AppStateService
  ) {
    this.initializeNotificationMonitoring();
    // Initialize unread count
    this.updateUnreadCount();
  }

  /**
   * Initialize monitoring of dependency status changes
   */
  private initializeNotificationMonitoring(): void {
    this.dependencyStatusService.status$.subscribe(status => {
      if (status) {
        this.processDependencyStatusChange(status);
      }
    });
  }

    /**
   * Process dependency status changes and create notifications
   */
  private processDependencyStatusChange(status: DependencyStatusResponse): void {
    const currentNotifications = this.notificationsSubject.value;
    const newNotifications: Notification[] = [];

    // Check each dependency for status changes
    Object.entries(status.dependencies).forEach(([serviceKey, dependency]) => {
      if (dependency) {
        const existingNotification = currentNotifications.find(n =>
          n.service === dependency.name &&
          n.type === 'service_status' &&
          !n.isRead
        );

        // Create notification based on status
        if (dependency.status === 'offline' && !existingNotification) {
          newNotifications.push({
            id: this.generateNotificationId(),
            type: 'service_status',
            severity: 'error',
            title: `${dependency.name} Service Offline`,
            message: `${dependency.name} is currently offline. ${dependency.message}`,
            service: dependency.name,
            timestamp: new Date(),
            isRead: false,
            metadata: {
              serviceKey,
              status: dependency.status,
              lastChecked: dependency.lastChecked
            }
          });
        } else if (dependency.status === 'warning' && !existingNotification) {
          newNotifications.push({
            id: this.generateNotificationId(),
            type: 'service_status',
            severity: 'warning',
            title: `${dependency.name} Service Degraded`,
            message: `${dependency.name} is experiencing issues. ${dependency.message}`,
            service: dependency.name,
            timestamp: new Date(),
            isRead: false,
            metadata: {
              serviceKey,
              status: dependency.status,
              lastChecked: dependency.lastChecked
            }
          });
        } else if (dependency.status === 'online' && existingNotification) {
          // Service is back online, mark existing notification as resolved
          this.markNotificationAsRead(existingNotification.id);

          // Add success notification
          newNotifications.push({
            id: this.generateNotificationId(),
            type: 'service_status',
            severity: 'success',
            title: `${dependency.name} Service Restored`,
            message: `${dependency.name} is now back online and functioning normally.`,
            service: dependency.name,
            timestamp: new Date(),
            isRead: false,
            metadata: {
              serviceKey,
              status: dependency.status,
              lastChecked: dependency.lastChecked
            }
          });
        }
      }
    });

    // Add new notifications if any
    if (newNotifications.length > 0) {
      this.addNotifications(newNotifications);
    }
  }

  /**
   * Add new notifications
   */
  addNotifications(notifications: Notification[]): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...notifications, ...currentNotifications]);
    this.updateUnreadCount();
  }

  /**
   * Add a single notification
   */
  addNotification(notification: Omit<Notification, 'id'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateNotificationId()
    };
    this.addNotifications([newNotification]);
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== notificationId
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

    /**
   * Clear all notifications
   */
  clearAllNotifications(): void {
    console.log('Before clearing - notifications count:', this.notificationsSubject.value.length);
    this.notificationsSubject.next([]);
    console.log('After clearing - notifications count:', this.notificationsSubject.value.length);
    console.log('After clearing - unread count:', this.getUnreadCount());
    this.updateUnreadCount();
  }

  /**
   * Update filters
   */
  updateFilters(filters: Partial<NotificationFilters>): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({ ...currentFilters, ...filters });
  }

  /**
   * Clear filters
   */
  clearFilters(): void {
    this.filtersSubject.next({});
  }

  /**
   * Apply filters to notifications
   */
  private applyFilters(notifications: Notification[], filters: NotificationFilters): Notification[] {
    return notifications.filter(notification => {
      // Filter by severity
      if (filters.severity && filters.severity.length > 0) {
        if (!filters.severity.includes(notification.severity)) {
          return false;
        }
      }

      // Filter by service
      if (filters.service && filters.service.length > 0) {
        if (!notification.service || !filters.service.includes(notification.service)) {
          return false;
        }
      }

      // Filter by read status
      if (filters.isRead !== undefined) {
        if (notification.isRead !== filters.isRead) {
          return false;
        }
      }

      // Filter by date range
      if (filters.dateRange) {
        const notificationDate = notification.timestamp;
        if (notificationDate < filters.dateRange.start || notificationDate > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Generate unique notification ID
   */
  private generateNotificationId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current unread count
   */
  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.isRead).length;
  }

  /**
   * Get notifications for a specific service
   */
  getNotificationsForService(serviceName: string): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => n.service === serviceName))
    );
  }

  /**
   * Get notifications by severity
   */
  getNotificationsBySeverity(severity: string): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => n.severity === severity))
    );
  }

  /**
   * Update unread count and emit to subscribers
   */
  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.isRead).length;
    console.log('Emitting unread count:', unreadCount);
    this.unreadCountSubject.next(unreadCount);
    this.appStateService.updateUnreadCount(unreadCount);
  }

  }
