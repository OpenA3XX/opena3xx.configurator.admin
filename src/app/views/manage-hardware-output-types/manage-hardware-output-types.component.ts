import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/services/data.service';
import { HardwareOutputTypeDto } from 'src/app/models/models';

@Component({
  selector: 'opena3xx-manage-hardware-output-types',
  templateUrl: './manage-hardware-output-types.component.html',
  styleUrls: ['./manage-hardware-output-types.component.scss'],
})
export class ManageHardwareOutputTypesComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['id', 'name', 'details'];
  dataSource = new MatTableDataSource<HardwareOutputTypeDto>();
  public data: any;

  constructor(private dataService: DataService, public router: Router) {}

  onEditClick(id: number) {
    this.router.navigateByUrl(`/edit/hardware-output-type?id=${id}`);
  }

  ngOnInit(): void {
    this.dataService
      .getAllHardwareOutputTypes()
      .pipe(
        tap((data) => console.log('Data received', data)),
        filter((x) => !!x),
        map((data_received) => {
          this.data = data_received;
          this.dataSource = new MatTableDataSource<HardwareOutputTypeDto>(this.data);
        })
      )
      .subscribe();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addHardwareOutputType() {
    this.router.navigateByUrl(`/add/hardware-output-type`);
  }
}
