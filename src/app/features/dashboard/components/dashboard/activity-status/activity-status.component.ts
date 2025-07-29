import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'warning' | 'error';
  timestamp: Date;
  progress?: number;
  icon?: string;
}

@Component({
  selector: 'opena3xx-activity-status',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './activity-status.component.html',
  styleUrls: ['./activity-status.component.scss']
})
export class ActivityStatusComponent {
  @Input() title = 'Activity Status';
  @Input() activities: ActivityItem[] = [];
  @Input() showProgress = true;
  @Input() maxItems = 10;
  @Output() activityClick = new EventEmitter<ActivityItem>();
  @Output() refresh = new EventEmitter<void>();

  // Computed properties
  displayedActivities = computed(() => {
    return this.activities.slice(0, this.maxItems);
  });

  activityClass = computed(() => {
    const classes = ['opena3xx-activity-status'];
    if (this.activities.length === 0) classes.push('opena3xx-activity-status--empty');
    return classes.join(' ');
  });

  itemClass = (activity: ActivityItem) => {
    const classes = ['opena3xx-activity-status__item'];
    classes.push(`opena3xx-activity-status__item--${activity.status}`);
    return classes.join(' ');
  };

  onActivityClick(activity: ActivityItem): void {
    this.activityClick.emit(activity);
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  // Getters for template
  get activityClasses(): string {
    return this.activityClass();
  }

  get hasActivities(): boolean {
    return this.activities.length > 0;
  }

  get hasMoreActivities(): boolean {
    return this.activities.length > this.maxItems;
  }

  get statusCounts(): { [key: string]: number } {
    return this.activities.reduce((counts, activity) => {
      counts[activity.status] = (counts[activity.status] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });
  }

  get statusIcon(): string {
    const counts = this.statusCounts;
    if (counts.error > 0) return 'error';
    if (counts.warning > 0) return 'warning';
    if (counts.active > 0) return 'check_circle';
    return 'info';
  }
}
