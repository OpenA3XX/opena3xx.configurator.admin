import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { HardwareInputDto } from "src/app/models/hardware.panel.dto";

@Component({
    selector: 'opena3xx-view-hardware-input-selectors-dialog',
    templateUrl: "./view-hardware-input-selectors-dialog.component.html",
    styleUrls: ["./view-hardware-input-selectors-dialog.component.scss"]
  })
  export class ViewHardwareInputSelectorsDialogComponent {

    public displayedInputColumns: string[] = ['id', 'name'];
    inputSelectorsDataSource = new MatTableDataSource<HardwareInputDto>();

    public hardwareInputSelector : any
    constructor(@Inject(MAT_DIALOG_DATA) public data: {data: HardwareInputDto}) { 
        this.hardwareInputSelector = data;
        console.log("Dialog Component", data);
        this.inputSelectorsDataSource = new MatTableDataSource<HardwareInputDto>(this.hardwareInputSelector.hardwareInputSelectors);
    }
  }