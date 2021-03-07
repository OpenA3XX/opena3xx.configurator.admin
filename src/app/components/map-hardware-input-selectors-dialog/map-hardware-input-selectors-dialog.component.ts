import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FieldConfig } from "src/app/models/field.interface";
import { HardwareInputDto } from "src/app/models/hardware.panel.dto";
import { map } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { DataService } from "src/app/services/data.service";

@Component({
    selector: 'opena3xx-map-hardware-input-selectors-dialog',
    templateUrl: "./map-hardware-input-selectors-dialog.component.html",
    styleUrls: ["./map-hardware-input-selectors-dialog.component.scss"]
  })
  export class MapHardwareInputSelectorsDialogComponent implements OnInit {

    
    public hardwareInputSelector : any
    public hardwareBoardSelectorFields: FieldConfig[] = [];
    dataLoaded: Boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: {data: HardwareInputDto}, 
    private dataService: DataService,
    private _snackBar: MatSnackBar
    ) { 
        this.hardwareInputSelector = data;
        console.log("Dialog Component", data);
    }

    ngOnInit(): void {
      this.dataService.getHardwareBoardForHardwareInputSelectorForm(this.hardwareInputSelector.id)
      .pipe(
        map(data_received => {
          this.hardwareBoardSelectorFields = data_received as FieldConfig[];
          this.dataLoaded = true;
        })
      ).subscribe();
    }

    submit(formData: any) {
      var index = _.find(this.hardwareInputSelector.hardwareInputSelectors, (o) => {
        return o.id == formData.identifier
      });
      this._snackBar.open(`Mapping for ${this.hardwareInputSelector.name} => State ${index.name} saved successfully`, "Ok", {
        duration: 5000
      });
    }

  }