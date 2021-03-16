import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { filter, map, tap } from 'rxjs/operators';
import { HardwarePanelOverviewDto } from '../../models/hardware.panel.dto';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'opena3xx-manage-hardware-panels',
  templateUrl: './manage-hardware-panels.component.html',
  styleUrls: ['./manage-hardware-panels.component.scss']
})

export class ManageHardwarePanelsComponent implements AfterViewInit, OnInit {

  public displayedColumns: string[] = ['id', 'name', 'aircraftModel', 'manufacturer', 'cockpitArea', 'owner', 'details'];
  dataSource = new MatTableDataSource<HardwarePanelOverviewDto>();
  public data: any;
  public data_loaded: boolean = false;

  constructor(
    private dataService: DataService,
    public router: Router,
    private _snackBar: MatSnackBar
  ){

  }

  onViewDetailsClick(id: Number)
  {
    this.router.navigateByUrl(`/view/hardware-panel-details?id=${id}`);
  }

  ngOnInit(): void {
    this.dataService.getAllHardwarePanelOverviewDetails()
    .pipe(
      tap(data => console.log('Data received', data)),
      filter(x => !!x),
      map(data_received => {
        this.data = data_received
        this.dataSource = new MatTableDataSource<HardwarePanelOverviewDto>(this.data)
        this.data_loaded = true;
        this._snackBar.open("Data Loading Completed", "Ok", {
          duration: 1000
        });
      })
    ).subscribe();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

