import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HardwareInputDto } from "src/app/models/hardware.panel.dto";
import { HttpService } from "src/app/services/http.service";
import { filter, map, tap } from 'rxjs/operators';
import {FormGroup, NgForm} from '@angular/forms';
@Component({
    selector: 'opena3xx-link-hardware-input-selectors-dialog',
    templateUrl: "./link-hardware-input-selectors-dialog.component.html",
    styleUrls: ["./link-hardware-input-selectors-dialog.component.scss"]
  })
export class LinkHardwareInputSelectorsDialogComponent implements OnInit {

  selected = "1";
  
  public simEvents :any;
  public simEventGroups: any;

  public hardwareInputSelector : any
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: {data: HardwareInputDto}, private httpService: HttpService) { 
      this.hardwareInputSelector = data;
      console.log("Dialog Component", data);
  }

  ngOnInit(): void {
    this.httpService.getAllSimulatorEvents()
    .pipe(
      tap(data => console.log('Data received', data)),
      filter(x => !!x),
      map(data_received => {
        this.simEvents = data_received;
      })
    ).subscribe();
  }

  saveInputSelectorSimMapping(f: NgForm){
    console.log(f);
  }
}

