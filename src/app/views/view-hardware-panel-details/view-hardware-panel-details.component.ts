import {Component, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { HardwareInputDto, HardwareOutputDto, HardwarePanelDto } from 'src/app/models/hardware.panel.dto';
import { HttpService } from 'src/app/services/http.service';


@Component({
  selector: 'opena3xx-view-hardware-panel-details',
  templateUrl: './view-hardware-panel-details.component.html',
  styleUrls: ['./view-hardware-panel-details.component.scss']
})

export class ViewHardwarePanelDetailsComponent implements OnInit {

    idParam!: Number;
    public hardwarePanelDto: any;
    public displayedInputColumns: string[] = ['id', 'name', 'hardwareInputType'];
    public displayedOutputColumns: string[] = ['id', 'name', 'hardwareOutputType'];
    inputsDataSource = new MatTableDataSource<HardwareInputDto>();
    outputsDataSource = new MatTableDataSource<HardwareOutputDto>();



    constructor(private httpService: HttpService, private router: Router){

    }

    ngOnInit(): void {

      this.router.routerState.root.queryParams.subscribe(params => {
        console.log('Received Query Params', params)
        this.idParam = params.id;
      });

      this.httpService.getAllHardwarePanelDetails(this.idParam)
      .pipe(
        tap(data => console.log('Data received', data)),
        filter(x => !!x),
        map(data_received => {
          this.hardwarePanelDto = data_received
          this.inputsDataSource = new MatTableDataSource<HardwareInputDto>(this.hardwarePanelDto.hardwareInputs);
          this.outputsDataSource = new MatTableDataSource<HardwareOutputDto>(this.hardwarePanelDto.hardwareOutputs);
        })
      ).subscribe();


    }
    

}
