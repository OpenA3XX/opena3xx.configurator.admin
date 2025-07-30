import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SimulatorEventDto } from 'src/app/shared/models/models';
import { DataService } from 'src/app/core/services/data.service';
import { DataTableConfig, TableColumnConfig, DataTableEvent } from 'src/app/shared/models/data-table.interface';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';

@Component({
    selector: 'opena3xx-manage-simulator-events',
    templateUrl: './manage-simulator-events.component.html',
    styleUrls: ['./manage-simulator-events.component.scss'],
    standalone: false
})
export class ManageSimulatorEventsComponent implements OnInit {
  tableConfig: DataTableConfig;
  data_loaded: boolean = false;
  headerActions: PageHeaderAction[] = [];

  constructor(
    private dataService: DataService,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeTableConfig();
    this.initializeHeaderActions();
    this.loadData();
  }

  private initializeTableConfig(): void {
    const columns: TableColumnConfig[] = [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
        width: '60px',
        type: 'number'
      },
      {
        key: 'friendlyName',
        label: 'Friendly Name',
        sortable: true,
        width: '180px',
        type: 'text'
      },
      {
        key: 'eventName',
        label: 'Event Name',
        sortable: true,
        width: '200px',
        type: 'text'
      },
      {
        key: 'simulatorEventTypeName',
        label: 'Simulator Event Type',
        sortable: true,
        width: '150px',
        type: 'text'
      },
      {
        key: 'simulatorSoftwareName',
        label: 'Simulator Software',
        sortable: true,
        width: '130px',
        type: 'text'
      },
      {
        key: 'simulatorEventSdkTypeName',
        label: 'SDK Type',
        sortable: true,
        width: '150px',
        type: 'text'
      },
      {
        key: 'actions',
        label: 'Actions',
        width: '100px',
        type: 'actions',
        actions: [
          {
            label: 'Edit',
            icon: 'edit',
            color: 'primary',
            tooltip: 'Edit',
            action: (item) => this.onEditClick(item.id)
          }
        ]
      },
      {
        key: 'info',
        label: 'Info',
        width: '60px',
        type: 'info',
        infoIcon: 'info',
        infoTooltip: (item) => item.eventCode
      }
    ];

    this.tableConfig = {
      columns: columns,
      data: [],
      loading: !this.data_loaded,
      loadingMessage: 'Loading simulator events...',
      emptyMessage: 'No simulator events found',
      emptyIcon: 'laptop_off',
      emptyAction: {
        label: 'Add First Simulator Event',
        action: () => this.addSimulatorEvent()
      },
      searchPlaceholder: 'Search by friendly name, event name...',
      searchEnabled: true,
      paginationEnabled: true,
      pageSizeOptions: [5, 10, 25, 100],
      sortEnabled: true,
      rowHover: true,
      elevation: 8
    };
  }

  private loadData() {
    this.data_loaded = false;
    this.tableConfig = { ...this.tableConfig, loading: true };

    this.dataService
      .getAllSimulatorEvents()
      .pipe(
        filter((x) => !!x),
        map((data_received) => {
          this.tableConfig = {
            ...this.tableConfig,
            data: data_received as SimulatorEventDto[],
            loading: false
          };
          this.data_loaded = true;

          this._snackBar.open('Data Loading Completed', 'Ok', {
            duration: 1000,
          });
        })
      )
      .subscribe();
  }

  private initializeHeaderActions() {
    this.headerActions = [
      {
        label: 'Add Simulator Event',
        icon: 'add',
        color: 'primary',
        onClick: () => this.addSimulatorEvent()
      }
    ];
  }

  onEditClick(id: number) {
    this.router.navigateByUrl(`/edit/simulator-event?id=${id}`);
  }

  addSimulatorEvent() {
    // TODO: Implement add simulator event functionality
    console.log('Add simulator event clicked');
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
