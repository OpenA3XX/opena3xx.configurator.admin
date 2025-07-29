import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'action' | 'custom';
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: any) => string;
  template?: string;
}

export interface TableAction {
  label: string;
  icon: string;
  action: string;
  color?: 'primary' | 'accent' | 'warn';
  disabled?: (row: any) => boolean;
  visible?: (row: any) => boolean;
}

export interface TableConfig {
  showSearch?: boolean;
  showPagination?: boolean;
  showSorting?: boolean;
  showActions?: boolean;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}

@Component({
  selector: 'opena3xx-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    FormsModule
  ],
  template: `
    <mat-card class="data-table-card">
      <mat-card-content>
        <!-- Search Filter -->
        <div class="search-container" *ngIf="config.showSearch">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search</mat-label>
            <input
              matInput
              [(ngModel)]="searchTerm"
              (input)="onSearchChange($event)"
              [placeholder]="config.searchPlaceholder || 'Search...'"
              #searchInput>
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>

        <!-- Loading State -->
        <div class="loading-container" *ngIf="loading">
          <mat-spinner diameter="40"></mat-spinner>
          <p>{{config.loadingMessage || 'Loading...'}}</p>
        </div>

        <!-- Empty State -->
        <div class="empty-container" *ngIf="!loading && (!dataSource || dataSource.data.length === 0)">
          <mat-icon class="empty-icon">inbox</mat-icon>
          <p>{{config.emptyMessage || 'No data available'}}</p>
        </div>

        <!-- Table -->
        <div class="table-container" *ngIf="!loading && dataSource && dataSource.data.length > 0">
          <table mat-table [dataSource]="dataSource" matSort class="data-table">
            <!-- Dynamic Columns -->
            <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
              <th mat-header-cell *matHeaderCellDef
                  [mat-sort-header]="column.sortable !== false"
                  [style.width]="column.width"
                  [style.text-align]="column.align || 'left'">
                {{column.label}}
              </th>
              <td mat-cell *matCellDef="let element"
                  [style.text-align]="column.align || 'left'">

                <!-- Action Column -->
                <div *ngIf="column.type === 'action'" class="action-cell">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu"
                          [matTooltip]="'Actions'"
                          (click)="$event.stopPropagation()">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item
                            *ngFor="let action of actions"
                            [disabled]="action.disabled && action.disabled(element)"
                            (click)="onActionClick(action.action, element)"
                            [style.color]="action.color === 'warn' ? '#f44336' : ''">
                      <mat-icon>{{action.icon}}</mat-icon>
                      <span>{{action.label}}</span>
                    </button>
                  </mat-menu>
                </div>

                <!-- Custom Template -->
                <ng-container *ngIf="column.template" [ngTemplateOutlet]="getTemplate(column.template)"
                             [ngTemplateOutletContext]="{ $implicit: element, row: element }">
                </ng-container>

                <!-- Default Display -->
                <span *ngIf="column.type !== 'action' && !column.template">
                  {{getCellValue(element, column)}}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                (click)="onRowClick(row)"
                [class.selected-row]="selectedRow === row"
                class="table-row">
            </tr>
          </table>

          <!-- Pagination -->
          <mat-paginator *ngIf="config.showPagination"
                         [pageSizeOptions]="config.pageSizeOptions || [5, 10, 25, 50, 100]"
                         [pageSize]="config.defaultPageSize || 10"
                         showFirstLastButtons>
          </mat-paginator>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T = any> implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() data: T[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() config: TableConfig = {};
  @Input() loading: boolean = false;
  @Input() selectedRow: T | null = null;

  @Output() rowClick = new EventEmitter<T>();
  @Output() actionClick = new EventEmitter<{action: string, row: T}>();
  @Output() searchChange = new EventEmitter<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<T>();
  displayedColumns: string[] = [];
  searchTerm: string = '';

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeTable();
  }

  ngAfterViewInit(): void {
    this.setupTableFeatures();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      console.log('DataTable: Data changed, updating dataSource');
      this.updateDataSource();
    }
    if (changes['columns'] && changes['columns'].currentValue) {
      console.log('DataTable: Columns changed, reinitializing table');
      this.initializeTable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTable(): void {
    this.displayedColumns = this.columns.map(col => col.key);
    this.updateDataSource();
  }

  private updateDataSource(): void {
    console.log('DataTable: updateDataSource called with data:', this.data);
    console.log('DataTable: data length:', this.data?.length);
    this.dataSource.data = this.data;
    console.log('DataTable: dataSource.data set to:', this.dataSource.data);
  }

  private setupTableFeatures(): void {
    if (this.config.showSorting !== false) {
      this.dataSource.sort = this.sort;
    }

    if (this.config.showPagination !== false) {
      this.dataSource.paginator = this.paginator;
    }

    // Setup search filter
    this.dataSource.filterPredicate = (data: T, filter: string) => {
      const searchStr = filter.toLowerCase();
      return this.columns.some(column => {
        if (column.type === 'action') return false;
        const value = this.getCellValue(data, column);
        return value.toString().toLowerCase().includes(searchStr);
      });
    };
  }

  getCellValue(row: T, column: TableColumn): any {
    const value = this.getNestedValue(row, column.key);

    if (column.formatter) {
      return column.formatter(value, row);
    }

    switch (column.type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '';
      default:
        return value || '';
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  onRowClick(row: T): void {
    this.selectedRow = row;
    this.rowClick.emit(row);
  }

  onActionClick(action: string, row: T): void {
    this.actionClick.emit({ action, row });
  }

  onSearchChange(event: any): void {
    const value = event.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
    this.searchChange.emit(value);
  }

  getTemplate(templateName: string): any {
    // This would be implemented to support custom templates
    // For now, we'll return null and handle it in the template
    return null;
  }

  // Public methods for external control
  refresh(): void {
    this.updateDataSource();
  }

  clearSelection(): void {
    this.selectedRow = null;
  }

  getSelectedRows(): T[] {
    return this.selectedRow ? [this.selectedRow] : [];
  }
}
