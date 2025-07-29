import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

export interface ActionButton {
  label: string;
  icon?: string;
  color?: 'primary' | 'accent' | 'warn';
  disabled?: boolean;
  action: string;
}

@Component({
  selector: 'opena3xx-page-layout',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-title">
            <mat-icon *ngIf="icon" class="header-icon">{{icon}}</mat-icon>
            <h1>{{title}}</h1>
          </div>
          <div class="header-subtitle" *ngIf="subtitle">
            <p>{{subtitle}}</p>
          </div>
        </div>

        <div class="header-actions" *ngIf="actions && actions.length > 0">
          <button
            *ngFor="let action of actions"
            mat-raised-button
            [color]="action.color || 'primary'"
            [disabled]="action.disabled"
            (click)="onActionClick(action.action)"
            class="action-button">
            <mat-icon *ngIf="action.icon">{{action.icon}}</mat-icon>
            {{action.label}}
          </button>
        </div>
      </div>

      <!-- Page Content -->
      <div class="page-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() actions: ActionButton[] = [];

  @Output() actionClick = new EventEmitter<string>();

  onActionClick(action: string): void {
    this.actionClick.emit(action);
  }
}
