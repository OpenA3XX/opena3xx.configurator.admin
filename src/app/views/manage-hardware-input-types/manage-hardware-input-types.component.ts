import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/services/data.service';
import { HardwareInputTypeDto } from "../../models/models";

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
      private dataService: DataService,
      public router: Router
    ){
  
    }
  
    onEditClick(id: Number)
    {
      this.router.navigateByUrl(`/edit/hardware-input-type?id=${id}`);
    }
  
    ngOnInit(): void {
      this.dataService.getAllHardwareInputTypes()
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

    addHardwareInputType(){
      this.router.navigateByUrl(`/add/hardware-input-type`);
    }
  }
