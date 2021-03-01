import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HardwareInputDto, IntegrationType, SimulatorEventDto } from "src/app/models/hardware.panel.dto";
import { HttpService } from "src/app/services/http.service";
import { filter, map, tap } from 'rxjs/operators';
import {FormGroup, NgForm} from '@angular/forms';
@Component({
    selector: 'opena3xx-link-hardware-input-selectors-dialog',
    templateUrl: "./link-hardware-input-selectors-dialog.component.html",
    styleUrls: ["./link-hardware-input-selectors-dialog.component.scss"]
  })
export class LinkHardwareInputSelectorsDialogComponent implements OnInit {
 
  public simEventDtoList: SimulatorEventDto[];
  public hardwareInputSelector : any
  public integrationTypeList: IntegrationType[];
  public defaultIntegration: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: {data: HardwareInputDto}, private httpService: HttpService) { 
      this.hardwareInputSelector = data;
      this.simEventDtoList = [];
      this.integrationTypeList = [];
      this.integrationTypeList.push({
        id: 0,
        name: "SimConnect - Direct"
      });
      this.integrationTypeList.push({
        id: 1,
        name: "SimConnect - WASM Gauge"
      });
      this.integrationTypeList.push({
        id: 2,
        name: "FSUIPC"
      });
      this.integrationTypeList.push({
        id: 3,
        name: "Websockets"
      });
  }

  ngOnInit(): void {
    this.httpService.getAllSimulatorEvents()
    .pipe(
      map(data_received => {
        this.simEventDtoList = data_received as SimulatorEventDto[];
      })
    ).subscribe();
  }

  saveInputSelectorSimMapping(f: NgForm){
    console.log(f);
  }
}



