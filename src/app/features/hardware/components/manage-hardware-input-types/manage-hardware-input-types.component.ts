import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareInputTypeDto } from 'src/app/shared/models/models';

@Component({
  selector: 'opena3xx-manage-hardware-input-types',
  templateUrl: './manage-hardware-input-types.component.html',
  styleUrls: ['./manage-hardware-input-types.component.scss'],
})
export class ManageHardwareInputTypesComponent implements OnInit, AfterViewInit, OnDestroy {
  public displayedColumns: string[] = ['id', 'name', 'details'];
  dataSource = new MatTableDataSource<HardwareInputTypeDto>();
  public data: any;
  dataLoaded = false;

  constructor(private dataService: DataService, public router: Router) {}

  onEditClick(id: number) {
    this.router.navigateByUrl(`/edit/hardware-input-type?id=${id}`);
  }

  ngOnInit(): void {
    this.dataService
      .getAllHardwareInputTypes()
      .pipe(
        tap((data) => console.log('Data received', data)),
        filter((x) => !!x),
        map((data_received) => {
          this.data = data_received;
          this.dataSource = new MatTableDataSource<HardwareInputTypeDto>(this.data);
          this.dataLoaded = true;

          // Connect paginator and sort after data is loaded
          this.connectDataSourceFeatures();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    // Clean up ViewChild references
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
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

  addHardwareInputType() {
    this.router.navigateByUrl(`/add/hardware-input-type`);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
