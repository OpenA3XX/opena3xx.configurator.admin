import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HardwareOutputDto } from 'src/app/shared/models/models';
import { DataTableConfig, TableColumnConfig, DataTableEvent } from 'src/app/shared/models/data-table.interface';

@Component({
    selector: 'opena3xx-view-hardware-output-selectors-dialog',
    templateUrl: './view-hardware-output-selectors-dialog.component.html',
    styleUrls: ['./view-hardware-output-selectors-dialog.component.scss'],
    standalone: false
})
export class ViewHardwareOutputSelectorsDialogComponent {
  tableConfig: DataTableConfig;
  public hardwareOutputSelector: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { data: HardwareOutputDto }) {
    this.hardwareOutputSelector = data;
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
      data: this.hardwareOutputSelector.hardwareOutputSelectors || [],
      loading: false,
      emptyMessage: 'No output selectors found',
      emptyIcon: 'logout_off',
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
