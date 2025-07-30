import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HardwarePanelOverviewDto } from 'src/app/shared/models/models';
import { DataTableConfig, TableColumnConfig, DataTableEvent } from 'src/app/shared/models/data-table.interface';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';

@Component({
    selector: 'opena3xx-manage-hardware-panels',
    templateUrl: './manage-hardware-panels.component.html',
    styleUrls: ['./manage-hardware-panels.component.scss'],
    standalone: false
})
export class ManageHardwarePanelsComponent implements OnInit {
  tableConfig: DataTableConfig;
  public dataLoaded: boolean = false;
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
        width: '80px',
        type: 'number'
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        width: '25%',
        maxWidth: '100px',
        type: 'text'
      },
      {
        key: 'aircraftModel',
        label: 'Aircraft Model',
        sortable: false,
        width: '25%',
        maxWidth: '100px',
        type: 'text'
      },
      {
        key: 'manufacturer',
        label: 'Manufacturer',
        sortable: false,
        width: '15%',
        maxWidth: '100px',
        type: 'text'
      },
      {
        key: 'cockpitArea',
        label: 'Cockpit Area',
        sortable: true,
        width: '15%',
        maxWidth: '100px',
        type: 'text'
      },
      {
        key: 'owner',
        label: 'Cockpit Owner',
        sortable: true,
        width: '15%',
        maxWidth: '100px',
        type: 'text'
      },
      {
        key: 'actions',
        label: 'Actions',
        width: '200px',
        type: 'actions',
        actions: [
          {
            label: 'Manage Details',
            icon: 'visibility',
            color: 'primary',
            tooltip: 'View Details',
            action: (item) => this.onViewDetailsClick(item.id)
          }
        ]
      }
    ];

    this.tableConfig = {
      columns: columns,
      data: [],
      loading: !this.dataLoaded,
      loadingMessage: 'Loading hardware panels...',
      emptyMessage: 'No hardware panels found',
      emptyIcon: 'dashboard_off',
      emptyAction: {
        label: 'Add First Hardware Panel',
        action: () => this.addHardwarePanel()
      },
      searchPlaceholder: 'Search by name, cockpit area, aircraft model...',
      searchEnabled: true,
      paginationEnabled: true,
      pageSizeOptions: [5, 10, 25, 100],
      sortEnabled: true,
      rowHover: true,
      elevation: 8
    };
  }

  private initializeHeaderActions() {
    this.headerActions = [
      {
        label: 'Add Hardware Panel',
        icon: 'add',
        color: 'primary',
        onClick: () => this.addHardwarePanel()
      }
    ];
  }

  private loadData() {
    this.dataLoaded = false;
    this.tableConfig = { ...this.tableConfig, loading: true };

    this.dataService
      .getAllHardwarePanelOverviewDetails()
      .toPromise()
      .then((data: HardwarePanelOverviewDto[]) => {
        this.tableConfig = {
          ...this.tableConfig,
          data: data,
          loading: false
        };
        this.dataLoaded = true;

        this._snackBar.open('Data Loading Completed', 'Ok', {
          duration: 1000,
        });
      });
  }

  onViewDetailsClick(id: number) {
    this.router.navigateByUrl(`/view/hardware-panel-details?id=${id}`);
  }

  addHardwarePanel() {
    this.router.navigateByUrl('/add/hardware-panel');
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
