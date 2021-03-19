import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { HardwareBoardDto } from "src/app/models/hardware.board.dto";
import { DataService } from "src/app/services/data.service";


@Component({
    templateUrl: "./manage-hardware-board.component.html",
    styleUrls: ["./manage-hardware-board.component.scss"],
    selector:"opena3xx-manage-hardware-boards"
})
export class ManageHardwareBoardsComponent{

    public displayedColumns: string[] = ['id', 'name', 'hardwareBusExtendersCount', 'totalInputOutputs', 'details'];
    dataSource = new MatTableDataSource<HardwareBoardDto>();
    public data: any;
    public data_loaded: boolean = false;


    
    constructor(private router: Router, private dataService: DataService){
        this.dataService.getAllHardwareBoards().toPromise().then((data)=>{
            this.data = data;
            this.dataSource = new MatTableDataSource<HardwareBoardDto>(this.data)
            this.data_loaded = true;
        });
    }
    registerHardwareBoard(){
        this.router.navigateByUrl("/register/hardware-board")
    }

    onEditClick(id: number){

    }
}