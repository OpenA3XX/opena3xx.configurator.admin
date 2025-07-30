import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HardwareInputDto } from 'src/app/shared/models/models';
import { DataTableConfig, TableColumnConfig, DataTableEvent } from 'src/app/shared/models/data-table.interface';

@Component({
    selector: 'opena3xx-view-hardware-input-selectors-dialog',
    templateUrl: './view-hardware-input-selectors-dialog.component.html',
    styleUrls: ['./view-hardware-input-selectors-dialog.component.scss'],
    standalone: false
})
export class ViewHardwareInputSelectorsDialogComponent {
  tableConfig: DataTableConfig;
  public hardwareInputSelector: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { data: HardwareInputDto }) {
    this.hardwareInputSelector = data;
    console.log('Dialog Component', data);
    this.initializeTableConfig();
  }

  private initializeTableConfig(): void {
    const columns: TableColumnConfig[] = [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
        width: '80px',
        type: 'number'
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        width: '60%',
        type: 'text'
      }
    ];

    this.tableConfig = {
      columns: columns,
      data: this.hardwareInputSelector.hardwareInputSelectors || [],
      loading: false,
      emptyMessage: 'No input selectors found',
      emptyIcon: 'login_off',
      searchEnabled: false,
      paginationEnabled: false,
      sortEnabled: true,
      rowHover: true,
      elevation: 0
    };
  }

  onTableEvent(event: DataTableEvent): void {
    console.log('Table event:', event);

    switch (event.type) {
      case 'action':
        console.log('Action clicked:', event.action?.label, 'for item:', event.data);
        break;
      case 'rowClick':
        console.log('Row clicked:', event.data);
        break;
      case 'search':
        console.log('Search performed:', event.data);
        break;
      case 'pageChange':
        console.log('Page changed:', event.data);
        break;
      case 'sortChange':
        console.log('Sort changed:', event.data);
        break;
    }
  }
}
