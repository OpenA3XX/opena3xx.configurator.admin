import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HardwareInputDto } from "src/app/models/hardware.panel.dto";

@Component({
    selector: 'opena3xx-map-hardware-input-selectors-dialog',
    templateUrl: "./map-hardware-input-selectors-dialog.component.html",
    styleUrls: ["./map-hardware-input-selectors-dialog.component.scss"]
  })
  export class MapHardwareInputSelectorsDialogComponent {

    
    public hardwareInputSelector : any
    
    constructor(@Inject(MAT_DIALOG_DATA) public data: {data: HardwareInputDto}) { 
        this.hardwareInputSelector = data;
        console.log("Dialog Component", data);
    }
  }