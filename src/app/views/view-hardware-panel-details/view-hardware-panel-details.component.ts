import {Component, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'opena3xx-view-hardware-panel-details',
  templateUrl: './view-hardware-panel-details.component.html',
  styleUrls: ['./view-hardware-panel-details.component.scss']
})

export class ViewHardwarePanelDetailsComponent implements OnInit {
    ngOnInit(): void {
      const inputs = [{
        id: 1,
        name: "LSK 1",
        hardwareInputType: "Push to Make Button"
      },{
        id: 2,
        name: "LSK 2",
        hardwareInputType: "Push to Make Button"
      },{
        id: 3,
        name: "LSK 3",
        hardwareInputType: "Push to Make Button"
      }];
      this.inputsDataSource = new MatTableDataSource<HardwareInputDto>(inputs);

      const outputs = [{
        id: 1,
        name: "Power LED",
        hardwareOutputType: "LED"
      }];
      this.outputsDataSource = new MatTableDataSource<HardwareOutputDto>(outputs);
    }
    
    public displayedInputColumns: string[] = ['id', 'name', 'hardwareInputType'];
    public displayedOutputColumns: string[] = ['id', 'name', 'hardwareOutputType'];
    inputsDataSource = new MatTableDataSource<HardwareInputDto>();
    outputsDataSource = new MatTableDataSource<HardwareOutputDto>();


}

export interface HardwareInputDto{
  id: number,
  name: string,
  hardwareInputType: string
}

export interface HardwareOutputDto{
  id: number,
  name: string,
  hardwareOutputType: string
}