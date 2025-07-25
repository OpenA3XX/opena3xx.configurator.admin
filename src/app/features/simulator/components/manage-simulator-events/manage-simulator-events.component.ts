import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SimulatorEventDto } from 'src/app/shared/models/models';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'opena3xx-manage-simulator-events',
  templateUrl: './manage-simulator-events.component.html',
  styleUrls: ['./manage-simulator-events.component.scss'],
})
export class ManageSimulatorEventsComponent implements OnInit, AfterViewInit, OnDestroy {
  public displayedColumns: string[] = [
    'id',
    'friendlyName',
    'eventName',
    'simulatorEventTypeName',
    'simulatorSoftwareName',
    'simulatorEventSdkTypeName',
    'details',
    'info',
  ];
  dataSource = new MatTableDataSource<SimulatorEventDto>();
  public data: any;
  public data_loaded: boolean = false;

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

  onEditClick(id: number) {
    this.router.navigateByUrl(`/edit/simulator-event?id=${id}`);
  }

  ngOnInit(): void {
    this.dataService
      .getAllSimulatorEvents()
      .pipe(
        filter((x) => !!x),
        map((data_received) => {
          this.data = data_received;
          this.dataSource = new MatTableDataSource<SimulatorEventDto>(this.data);
          this.data_loaded = true;

          // Connect paginator and sort after data is loaded
          this.connectDataSourceFeatures();

          this._snackBar.open('Data Loading Completed', 'Ok', {
            duration: 1000,
          });
        })
      )
      .subscribe();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.connectDataSourceFeatures();
  }

  private connectDataSourceFeatures() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
