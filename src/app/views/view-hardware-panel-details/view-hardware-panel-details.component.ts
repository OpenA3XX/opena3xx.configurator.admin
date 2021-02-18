import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { MapHardwareInputSelectorsDialogComponent } from 'src/app/components/map-hardware-input-selectors-dialog/map-hardware-input-selectors-dialog.component';
import { MapHardwareOutputSelectorsDialogComponent } from 'src/app/components/map-hardware-output-selectors-dialog/map-hardware-output-selectors-dialog.component';
import { ViewHardwareInputSelectorsDialogComponent } from 'src/app/components/view-hardware-input-selectors-dialog/view-hardware-input-selectors-dialog.component';
import { ViewHardwareOutputSelectorsDialogComponent } from 'src/app/components/view-hardware-output-selectors-dialog/view-hardware-output-selectors-dialog.component';
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
    public displayedInputColumns: string[] = ['id', 'name', 'hardwareInputType', 'action'];
    public displayedOutputColumns: string[] = ['id', 'name', 'hardwareOutputType', 'action'];
    inputsDataSource = new MatTableDataSource<HardwareInputDto>();
    outputsDataSource = new MatTableDataSource<HardwareOutputDto>();
    

    constructor
    (
      private httpService: HttpService, 
      private router: Router,
      public viewHardwareInputOutputSelectorsDialog: MatDialog
    ){

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

    showInputSelectorDetails(data: HardwareInputDto){
        this.viewHardwareInputOutputSelectorsDialog.open(ViewHardwareInputSelectorsDialogComponent, {
          data: data,
          width: '600px'
        });
    }

    mapInputSelector(data: HardwareInputDto){
        this.viewHardwareInputOutputSelectorsDialog.open(MapHardwareInputSelectorsDialogComponent, {
          data: data,
          width: '900px'
        });
    }

    showOutputSelectorDetails(data: HardwareInputDto){
        this.viewHardwareInputOutputSelectorsDialog.open(ViewHardwareOutputSelectorsDialogComponent, {
          data: data,
          width: '600px'
        });
    }

    mapOutputSelector(data: HardwareInputDto){
        this.viewHardwareInputOutputSelectorsDialog.open(MapHardwareOutputSelectorsDialogComponent, {
          data: data,
          width: '900px'
        });
    }
    

}
