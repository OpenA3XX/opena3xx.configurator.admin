import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class ManageHardwareInputTypesComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['id', 'name', 'details'];
  dataSource = new MatTableDataSource<HardwareInputTypeDto>();
  public data: any;

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

          // Connect paginator and sort after data is loaded
          this.connectDataSourceFeatures();
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

  addHardwareInputType() {
    this.router.navigateByUrl(`/add/hardware-input-type`);
  }
}
