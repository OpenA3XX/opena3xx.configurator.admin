import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HardwareOutputTypeDto } from 'src/app/models/hardware.output.type.dto';
import { HttpService } from 'src/app/services/http.service';
import { filter, map, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'opena3xx-manage-hardware-output-types',
  templateUrl: './manage-hardware-output-types.component.html',
  styleUrls: ['./manage-hardware-output-types.component.scss']
})
export class ManageHardwareOutputTypesComponent implements OnInit {
    public displayedColumns: string[] = ['id', 'name', 'details'];
    dataSource = new MatTableDataSource<HardwareOutputTypeDto>();
    public data: any;
  
    constructor(
      private httpService: HttpService,
      public router: Router
    ){
  
    }
  
    onEditClick(id: Number)
    {
      this.router.navigateByUrl(`/edit/hardware-output-type?id=${id}`);
    }
  
    ngOnInit(): void {
      this.httpService.getAllHardwareOutputTypes()
      .pipe(
        tap(data => console.log('Data received', data)),
        filter(x => !!x),
        map(data_received => {
          this.data = data_received
          this.dataSource = new MatTableDataSource<HardwareOutputTypeDto>(this.data)
        })
      ).subscribe();
    }
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  }