import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FieldConfig } from "src/app/models/field.interface";
import { HardwareInputDto } from "src/app/models/hardware.panel.dto";
import { HttpService } from "src/app/services/http.service";
import { map } from 'rxjs/operators';

@Component({
    selector: 'opena3xx-map-hardware-input-selectors-dialog',
    templateUrl: "./map-hardware-input-selectors-dialog.component.html",
    styleUrls: ["./map-hardware-input-selectors-dialog.component.scss"]
  })
  export class MapHardwareInputSelectorsDialogComponent implements OnInit {

    
    public hardwareInputSelector : any
    public hardwareBoardSelectorFields: FieldConfig[] = [];
    dataLoaded: Boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: {data: HardwareInputDto}, private httpService: HttpService) { 
        this.hardwareInputSelector = data;
        console.log("Dialog Component", data);
    }

    ngOnInit(): void {
      this.httpService.getHardwareBoardForHardwareInputSelectorForm(this.hardwareInputSelector.id)
      .pipe(
        map(data_received => {
          this.hardwareBoardSelectorFields = data_received as FieldConfig[];
          this.dataLoaded = true;
        })
      ).subscribe();
    }

    submit(formData: any) {
      console.log(formData)
    }
    
  }