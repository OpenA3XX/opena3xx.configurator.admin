import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { filter, map, tap } from "rxjs/operators";
import { SimulatorEventDto } from "src/app/models/simulator.event.dto";
import { DataService } from "src/app/services/data.service";

@Component({
    selector: "opena3xx-manage-simulator-events",
    templateUrl: "./manage-simulator-events.component.html",
    styleUrls: ["./manage-simulator-events.component.scss"]
})
export class ManageSimulatorEventsComponent  implements OnInit {
    public displayedColumns: string[] = ['id', 'friendlyName', 'eventName', 'simulatorEventTypeName', 'simulatorSoftwareName','simulatorEventSdkTypeName', 'details', 'info'];
    dataSource = new MatTableDataSource<SimulatorEventDto>();
    public data: any;
    public data_loaded: boolean = false;

    constructor(
      private dataService: DataService,
      public router: Router,
      private _snackBar: MatSnackBar
    ){
  
    }
  
    onEditClick(id: Number)
    {
      this.router.navigateByUrl(`/edit/simulator-event?id=${id}`);
    }
  
    ngOnInit(): void {
      this.dataService.getAllSimulatorEvents()
      .pipe(
        filter(x => !!x),
        map(data_received => {
          this.data = data_received
          this.dataSource = new MatTableDataSource<SimulatorEventDto>(this.data)
          this.data_loaded = true
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
