import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HardwareInputDto, IntegrationType, SimulatorEventDto } from "src/app/models/hardware.panel.dto";
import * as _ from "lodash";
@Component({
    selector: 'opena3xx-link-hardware-input-selectors-dialog',
    templateUrl: "./link-hardware-input-selectors-dialog.component.html",
    styleUrls: ["./link-hardware-input-selectors-dialog.component.scss"]
  })
export class LinkHardwareInputSelectorsDialogComponent{
 
  public hardwareInputSelector : any;

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: {data: HardwareInputDto}
  ) { 
      this.hardwareInputSelector = data;
  }
}



