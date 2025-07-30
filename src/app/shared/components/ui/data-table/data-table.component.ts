import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataTableConfig, TableColumnConfig, DataTableEvent, TableAction } from 'src/app/shared/models/data-table.interface';

@Component({
  selector: 'opena3xx-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  standalone: false
})
export class DataTableComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() config: DataTableConfig;
  @Output() event = new EventEmitter<DataTableEvent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];

  ngOnInit() {
    this.initializeTable();
  }

  ngAfterViewInit() {
    this.connectDataSourceFeatures();
    // Ensure sort is properly initialized
    setTimeout(() => {
      if (this.sort) {
        this.sort.sortChange.emit();
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && this.config) {
      console.log('DataTableComponent config changed:', this.config);
      this.initializeTable();
      // Reconnect features after data source is updated
      setTimeout(() => {
        this.connectDataSourceFeatures();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  private initializeTable() {
    if (this.config && this.config.columns) {
      console.log('Initializing table with config:', this.config);
      this.displayedColumns = this.config.columns.map(col => col.key);
      this.dataSource = new MatTableDataSource<any>(this.config.data || []);
      console.log('Displayed columns:', this.displayedColumns);
      console.log('DataSource data:', this.dataSource.data);
      console.log('Sortable columns:', this.config.columns.filter(col => col.sortable !== false).map(col => col.key));
    }
  }

  private connectDataSourceFeatures() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('Connected paginator and sort to data source');

      // Force sort to initialize
      if (this.sort) {
        this.sort.sortChange.emit();
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.event.emit({
      type: 'search',
      data: filterValue
    });
  }

  onActionClick(action: TableAction, item: any) {
    if (action.disabled && action.disabled(item)) {
      return;
    }

    this.event.emit({
      type: 'action',
      data: item,
      action: action
    });

    action.action(item);
  }

  onRowClick(item: any) {
    this.event.emit({
      type: 'rowClick',
      data: item
    });
  }

  onEmptyActionClick() {
    if (this.config.emptyAction) {
      this.config.emptyAction.action();
    }
  }

  onSortChange(event: any) {
    console.log('Sort change event:', event);
    this.event.emit({
      type: 'sortChange',
      data: event
    });
  }

  isColumnSortable(column: TableColumnConfig): boolean {
    return column.sortable !== false && this.config.sortEnabled !== false;
  }

  getColumnWidth(column: TableColumnConfig): string {
    return column.width || 'auto';
  }

  getColumnMaxWidth(column: TableColumnConfig): string {
    return column.maxWidth || 'none';
  }

  getColumnClass(column: TableColumnConfig): string {
    return `mat-column-${column.key}`;
  }

  isActionDisabled(action: TableAction, item: any): boolean {
    return action.disabled ? action.disabled(item) : false;
  }
}
