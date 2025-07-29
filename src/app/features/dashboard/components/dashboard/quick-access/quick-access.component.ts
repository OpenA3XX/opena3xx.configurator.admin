import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

export interface QuickAccessItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color?: 'primary' | 'accent' | 'warn' | 'default';
  badge?: string;
  disabled?: boolean;
}

@Component({
  selector: 'opena3xx-quick-access',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss']
})
export class QuickAccessComponent {
  @Input() title = 'Quick Access';
  @Input() items: QuickAccessItem[] = [];
  @Input() layout: 'grid' | 'list' = 'grid';
  @Input() maxItems = 8;
  @Output() itemClick = new EventEmitter<QuickAccessItem>();

  // Computed properties
  displayedItems = computed(() => {
    return this.items.slice(0, this.maxItems);
  });

  containerClass = computed(() => {
    const classes = ['opena3xx-quick-access'];
    classes.push(`opena3xx-quick-access--${this.layout}`);
    if (this.items.length === 0) classes.push('opena3xx-quick-access--empty');
    return classes.join(' ');
  });

  itemClass = (item: QuickAccessItem) => {
    const classes = ['opena3xx-quick-access__item'];
    if (item.disabled) classes.push('opena3xx-quick-access__item--disabled');
    if (item.color && item.color !== 'default') {
      classes.push(`opena3xx-quick-access__item--${item.color}`);
    }
    return classes.join(' ');
  };

  constructor(private router: Router) {}

  onItemClick(item: QuickAccessItem): void {
    if (!item.disabled) {
      this.itemClick.emit(item);
      this.router.navigate([item.route]);
    }
  }

  // Getters for template
  get containerClasses(): string {
    return this.containerClass();
  }

  get hasItems(): boolean {
    return this.items.length > 0;
  }

  get hasMoreItems(): boolean {
    return this.items.length > this.maxItems;
  }

  get isGridLayout(): boolean {
    return this.layout === 'grid';
  }

  get isListLayout(): boolean {
    return this.layout === 'list';
  }
}
