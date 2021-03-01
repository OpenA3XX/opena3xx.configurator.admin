import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HardwareInputTypeDto } from 'src/app/models/hardware.input.type.dto';
import { HttpService } from 'src/app/services/http.service';
import { filter, map, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'opena3xx-manage-hardware-input-types',
  templateUrl: './manage-hardware-input-types.component.html',
  styleUrls: ['./manage-hardware-input-types.component.scss']
})

export class ManageHardwareInputTypesComponent implements OnInit {
    public displayedColumns: string[] = ['id', 'name', 'details'];
    dataSource = new MatTableDataSource<HardwareInputTypeDto>();
    public data: any;
    
  
    constructor(
      private httpService: HttpService,
      public router: Router
    ){
  
    }
  
    onEditClick(id: Number)
    {
      this.router.navigateByUrl(`/edit/hardware-input-type?id=${id}`);
    }
  
    ngOnInit(): void {
      this.httpService.getAllHardwareInputTypes()
      .pipe(
        tap(data => console.log('Data received', data)),
        filter(x => !!x),
        map(data_received => {
          this.data = data_received
          this.dataSource = new MatTableDataSource<HardwareInputTypeDto>(this.data)
        })
      ).subscribe();
    }
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  }
