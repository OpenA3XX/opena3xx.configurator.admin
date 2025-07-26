import {
  AfterViewInit,
  Component,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HardwarePanelOverviewDto } from 'src/app/shared/models/models';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'opena3xx-manage-hardware-panels',
  templateUrl: './manage-hardware-panels.component.html',
  styleUrls: ['./manage-hardware-panels.component.scss'],
})
export class ManageHardwarePanelsComponent implements AfterViewInit, OnDestroy {
  public displayedColumns: string[] = [
    'id',
    'name',
    'aircraftModel',
    'manufacturer',
    'cockpitArea',
    'owner',
    'details',
  ];
  dataSource = new MatTableDataSource<HardwarePanelOverviewDto>();
  public data: any;
  public dataLoaded: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dataService: DataService,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    // Clean up ViewChild references
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onViewDetailsClick(id: number) {
    this.router.navigateByUrl(`/view/hardware-panel-details?id=${id}`);
  }

  ngAfterViewInit() {
    this.connectDataSourceFeatures();
    this.loadData();
  }

  private connectDataSourceFeatures() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadData() {
    this.dataService
      .getAllHardwarePanelOverviewDetails()
      .toPromise()
      .then((data: HardwarePanelOverviewDto[]) => {
        this.data = data;
        this.dataSource = new MatTableDataSource<HardwarePanelOverviewDto>(this.data);
        this.dataLoaded = true;

        // Connect features to new data source
        this.connectDataSourceFeatures();

        this._snackBar.open('Data Loading Completed', 'Ok', {
          duration: 1000,
        });
      });
  }

  addHardwarePanel() {
    this.router.navigateByUrl('/add/hardware-panel');
  }
}
