import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    action: string;
    data?: any;
  };
  category?: 'system' | 'hardware' | 'connectivity' | 'user';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  expiresAt?: Date;
}

export interface NotificationFilter {
  types?: Notification['type'][];
  categories?: Notification['category'][];
  priorities?: Notification['priority'][];
  read?: boolean;
  search?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

@Injectable({
  providedIn: 'root'
})
export class RealTimeNotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);
  private connectionStatus = new BehaviorSubject<'connected' | 'disconnected' | 'connecting'>('disconnected');
  private destroy$ = new Subject<void>();

  // WebSocket connection
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;

  constructor() {
    this.initializeNotifications();
  }

  // Public API
  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount.asObservable();
  }

  getConnectionStatus(): Observable<'connected' | 'disconnected' | 'connecting'> {
    return this.connectionStatus.asObservable();
  }

  getFilteredNotifications(filter: NotificationFilter): Observable<Notification[]> {
    return this.notifications.pipe(
      map(notifications => this.applyFilter(notifications, filter))
    );
  }

  // Notification management
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notifications.value;
    const updatedNotifications = [newNotification, ...currentNotifications];

    // Keep only last 100 notifications
    if (updatedNotifications.length > 100) {
      updatedNotifications.splice(100);
    }

    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  markAsRead(notificationId: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );

    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      read: true
    }));

    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  removeNotification(notificationId: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== notificationId
    );

    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  clearAllNotifications(): void {
    this.notifications.next([]);
    this.updateUnreadCount();
  }

  // WebSocket connection management
  connect(url: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.connectionStatus.next('connecting');
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.connectionStatus.next('connected');
      this.reconnectAttempts = 0;
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      this.connectionStatus.next('disconnected');
      console.log('WebSocket disconnected');
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatus.next('disconnected');
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connectionStatus.next('disconnected');
  }

  sendMessage(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  // System notifications
  addSystemNotification(message: string, type: Notification['type'] = 'info'): void {
    this.addNotification({
      type,
      title: 'System',
      message,
      category: 'system',
      priority: 'medium'
    });
  }

  addHardwareNotification(message: string, type: Notification['type'] = 'info'): void {
    this.addNotification({
      type,
      title: 'Hardware',
      message,
      category: 'hardware',
      priority: 'medium'
    });
  }

  addConnectivityNotification(message: string, type: Notification['type'] = 'info'): void {
    this.addNotification({
      type,
      title: 'Connectivity',
      message,
      category: 'connectivity',
      priority: 'high'
    });
  }

  addUserNotification(message: string, type: Notification['type'] = 'info'): void {
    this.addNotification({
      type,
      title: 'User',
      message,
      category: 'user',
      priority: 'low'
    });
  }

  // Private methods
  private initializeNotifications(): void {
    // Add some initial notifications for testing
    this.addSystemNotification('Application started successfully', 'success');
    this.addHardwareNotification('Hardware panel "Main Panel" is online', 'success');
    this.addConnectivityNotification('Connection to simulator established', 'success');
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notifications.value.filter(n => !n.read).length;
    this.unreadCount.next(unreadCount);
  }

  private applyFilter(notifications: Notification[], filter: NotificationFilter): Notification[] {
    return notifications.filter(notification => {
      if (filter.types && !filter.types.includes(notification.type)) {
        return false;
      }
      if (filter.categories && !filter.categories.includes(notification.category!)) {
        return false;
      }
      if (filter.priorities && !filter.priorities.includes(notification.priority!)) {
        return false;
      }
      if (filter.read !== undefined && notification.read !== filter.read) {
        return false;
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesSearch =
          notification.title.toLowerCase().includes(searchLower) ||
          notification.message.toLowerCase().includes(searchLower);
        if (!matchesSearch) {
          return false;
      }
      }
      return true;
    });
  }

  private handleWebSocketMessage(data: any): void {
    switch (data.type) {
      case 'notification':
        this.addNotification({
          type: data.notification.type || 'info',
          title: data.notification.title || 'System',
          message: data.notification.message,
          category: data.notification.category || 'system',
          priority: data.notification.priority || 'medium',
          action: data.notification.action
        });
        break;
      case 'hardware_status':
        this.addHardwareNotification(
          `Hardware ${data.hardware.name} is ${data.hardware.status}`,
          data.hardware.status === 'online' ? 'success' : 'warning'
        );
        break;
      case 'connectivity_status':
        this.addConnectivityNotification(
          `Connection ${data.connection.name}: ${data.connection.status}`,
          data.connection.status === 'connected' ? 'success' : 'error'
        );
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    timer(this.reconnectInterval).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        this.connect(this.ws?.url || 'ws://localhost:8080');
      }
    });
  }

  // Cleanup
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}
