import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HardwareInputDto, IntegrationType, SimulatorEventDto } from "src/app/models/hardware.panel.dto";
import { HttpService } from "src/app/services/http.service";
import { map } from 'rxjs/operators';
import { FieldConfig } from "src/app/models/field.interface";
@Component({
    selector: 'opena3xx-link-hardware-input-selectors-dialog',
    templateUrl: "./link-hardware-input-selectors-dialog.component.html",
    styleUrls: ["./link-hardware-input-selectors-dialog.component.scss"]
  })
export class LinkHardwareInputSelectorsDialogComponent implements OnInit {
 
  public simEventDtoList: SimulatorEventDto[];
  public hardwareInputSelector : any;
  public simLinkInputSelectorFields:  FieldConfig[] = [];
  dataLoaded: Boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {data: HardwareInputDto}, private httpService: HttpService) { 
      this.hardwareInputSelector = data;
      this.simEventDtoList = [];
  }

  ngOnInit(): void {
    this.httpService.getSimLinkInputSelectorForm(this.hardwareInputSelector.id)
    .pipe(
      map(data_received => {
        this.simLinkInputSelectorFields = data_received as FieldConfig[];
        this.dataLoaded = true;
      })
    ).subscribe();
  }

  submit(formData: any) {
    console.log(formData)
  }
}



