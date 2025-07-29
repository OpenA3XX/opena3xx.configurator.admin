import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface ConsoleAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'primary' | 'secondary' | 'danger';
  enabled: boolean;
  loading?: boolean;
  category: 'connection' | 'data' | 'system' | 'export';
}

@Component({
  selector: 'opena3xx-console-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatSlideToggleModule
  ],
  templateUrl: './console-actions.component.html',
  styleUrls: ['./console-actions.component.scss']
})
export class ConsoleActionsComponent {
  @Input() actions: ConsoleAction[] = [];
  @Input() showCategories = true;
  @Input() compact = false;
  @Output() actionClick = new EventEmitter<ConsoleAction>();
  @Output() actionToggle = new EventEmitter<{ action: ConsoleAction; enabled: boolean }>();

  // Computed properties
  enabledActions = computed(() =>
    this.actions.filter(action => action.enabled)
  );

  disabledActions = computed(() =>
    this.actions.filter(action => !action.enabled)
  );

  actionsByCategory = computed(() => {
    const categories: { [key: string]: ConsoleAction[] } = {};
    this.actions.forEach(action => {
      if (!categories[action.category]) {
        categories[action.category] = [];
      }
      categories[action.category].push(action);
    });
    return categories;
  });

  containerClass = computed(() => {
    const classes = ['opena3xx-console-actions'];
    if (this.compact) classes.push('opena3xx-console-actions--compact');
    return classes.join(' ');
  });

  onActionClick(action: ConsoleAction): void {
    if (action.enabled && !action.loading) {
      this.actionClick.emit(action);
    }
  }

  onActionToggle(action: ConsoleAction, enabled: boolean): void {
    this.actionToggle.emit({ action, enabled });
  }

  // Getters for template
  get actionList(): ConsoleAction[] {
    return this.actions;
  }

  get enabledActionList(): ConsoleAction[] {
    return this.enabledActions();
  }

  get disabledActionList(): ConsoleAction[] {
    return this.disabledActions();
  }

  get categorizedActions(): { [key: string]: ConsoleAction[] } {
    return this.actionsByCategory();
  }

  get containerClasses(): string {
    return this.containerClass();
  }

  get showCategoryDisplay(): boolean {
    return this.showCategories;
  }

  get isCompactMode(): boolean {
    return this.compact;
  }

  get categoryIcon(): (category: string) => string {
    return (category: string) => {
      switch (category) {
        case 'connection': return 'link';
        case 'data': return 'data_usage';
        case 'system': return 'settings';
        case 'export': return 'download';
        default: return 'help';
      }
    };
  }

  get categoryLabel(): (category: string) => string {
    return (category: string) => {
      switch (category) {
        case 'connection': return 'Connection';
        case 'data': return 'Data';
        case 'system': return 'System';
        case 'export': return 'Export';
        default: return category;
      }
    };
  }

  get actionColor(): (action: ConsoleAction) => string {
    return (action: ConsoleAction) => {
      if (!action.enabled) return 'default';
      switch (action.type) {
        case 'primary': return 'primary';
        case 'secondary': return 'accent';
        case 'danger': return 'warn';
        default: return 'default';
      }
    };
  }

  get actionDisabled(): (action: ConsoleAction) => boolean {
    return (action: ConsoleAction) => {
      return !action.enabled || action.loading || false;
    };
  }

  get actionLoading(): (action: ConsoleAction) => boolean {
    return (action: ConsoleAction) => {
      return action.loading || false;
    };
  }

  get categoryCount(): number {
    return Object.keys(this.actionsByCategory()).length;
  }

  get totalActionCount(): number {
    return this.actions.length;
  }

  get enabledActionCount(): number {
    return this.enabledActions().length;
  }
}
