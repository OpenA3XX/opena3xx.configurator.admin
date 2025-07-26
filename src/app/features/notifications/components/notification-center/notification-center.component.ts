import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { NotificationService, Notification, NotificationFilters } from '../../services/notification.service';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss']
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'severity',
    'title',
    'service',
    'timestamp',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Notification>([]);
  loading = false;
  totalNotifications = 0;
  unreadCount = 0;

  private subscriptions = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    // Clean up ViewChild references
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  ngAfterViewInit(): void {
    // Add safety checks for table components
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }, 0);
  }

  private setupSubscriptions(): void {
    // Subscribe to filtered notifications
    this.subscriptions.add(
      this.notificationService.filteredNotifications$.subscribe(notifications => {
        if (this.dataSource) {
          this.dataSource.data = notifications;
        }
        this.totalNotifications = notifications.length;
      })
    );

    // Subscribe to unread count
    this.subscriptions.add(
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  private loadNotifications(): void {
    this.loading = true;
    // The service handles the loading automatically through observables
    this.loading = false;
  }

  applyFilter(event: Event): void {
    if (!event || !event.target) return;

    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    if (this.dataSource && this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markNotificationAsRead(notification.id);
    this.showSnackBar('Notification marked as read');
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
    this.showSnackBar('All notifications marked as read');
  }

  deleteNotification(notification: Notification): void {
    this.notificationService.deleteNotification(notification.id);
    this.showSnackBar('Notification deleted');
  }

  clearAllNotifications(): void {
    this.notificationService.clearAllNotifications();
    // Force update the app component's unread count
    const currentUnreadCount = this.notificationService.getUnreadCount();
    console.log('Notification center - current unread count after clearing:', currentUnreadCount);
    this.showSnackBar('All notifications cleared');
  }



  updateFilters(filters: Partial<NotificationFilters>): void {
    this.notificationService.updateFilters(filters);
  }

  clearFilters(): void {
    this.notificationService.clearFilters();
  }

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

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
