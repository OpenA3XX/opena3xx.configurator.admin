/* eslint-disable max-len */
import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {filter, map, tap} from 'rxjs/operators';
import {LinkHardwareInputSelectorsDialogComponent} from 'src/app/components/link-hardware-input-selectors-dialog/link-hardware-input-selectors-dialog.component';
import {MapHardwareInputSelectorsDialogComponent} from 'src/app/components/map-hardware-input-selectors-dialog/map-hardware-input-selectors-dialog.component';
import {MapHardwareOutputSelectorsDialogComponent} from 'src/app/components/map-hardware-output-selectors-dialog/map-hardware-output-selectors-dialog.component';
import {ViewHardwareInputSelectorsDialogComponent} from 'src/app/components/view-hardware-input-selectors-dialog/view-hardware-input-selectors-dialog.component';
import {ViewHardwareOutputSelectorsDialogComponent} from 'src/app/components/view-hardware-output-selectors-dialog/view-hardware-output-selectors-dialog.component';
import {HardwareInputDto, HardwareOutputDto} from 'src/app/models/models';
import {DataService} from 'src/app/services/data.service';


@Component({
  selector: 'opena3xx-view-hardware-panel-details',
  templateUrl: './view-hardware-panel-details.component.html',
  styleUrls: ['./view-hardware-panel-details.component.scss'],
})

export class ViewHardwarePanelDetailsComponent implements OnInit {
  idParam!: Number;
  public hardwarePanelDto: any;
  public displayedInputColumns: string[] = ['id', 'name', 'hardwareInputType', 'action'];
  public displayedOutputColumns: string[] = ['id', 'name', 'hardwareOutputType', 'action'];
  inputsDataSource = new MatTableDataSource<HardwareInputDto>();
  outputsDataSource = new MatTableDataSource<HardwareOutputDto>();


  constructor(
      private dataService: DataService,
      private router: Router,
      public viewHardwareInputOutputSelectorsDialog: MatDialog,
      public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe((params) => {
      console.log('Received Query Params', params);
      this.idParam = params.id;
    });

    this.dataService.getAllHardwarePanelDetails(this.idParam)
        .pipe(
            tap((data) => console.log('Data received', data)),
            filter((x) => !!x),
            map((data_received) => {
              this.hardwarePanelDto = data_received;
              this.inputsDataSource = new MatTableDataSource<HardwareInputDto>(this.hardwarePanelDto.hardwareInputs);
              this.outputsDataSource = new MatTableDataSource<HardwareOutputDto>(this.hardwarePanelDto.hardwareOutputs);
            }),
        ).subscribe();
  }

  showInputSelectorDetails(data: HardwareInputDto) {
    this.viewHardwareInputOutputSelectorsDialog.open(ViewHardwareInputSelectorsDialogComponent, {
      data: data,
      width: '600px',
    });
  }

  mapInputSelector(data: HardwareInputDto) {
    this.viewHardwareInputOutputSelectorsDialog.open(MapHardwareInputSelectorsDialogComponent, {
      data: data,
      width: '900px',
    });
  }

  linkInputSelector(data: HardwareInputDto) {
    this.viewHardwareInputOutputSelectorsDialog.open(LinkHardwareInputSelectorsDialogComponent, {
      data: data,
      width: '900px',
    });
  }

  showOutputSelectorDetails(data: HardwareInputDto) {
    this.viewHardwareInputOutputSelectorsDialog.open(ViewHardwareOutputSelectorsDialogComponent, {
      data: data,
      width: '600px',
    });
  }

  mapOutputSelector(data: HardwareInputDto) {
    this.viewHardwareInputOutputSelectorsDialog.open(MapHardwareOutputSelectorsDialogComponent, {
      data: data,
      width: '900px',
    });
  }

  deleteHardwareInput(hardwareInput) {
    const dialogRef = this.dialog.open(DeleteHardwareInputDialog);
    dialogRef.componentInstance.hardwareInput = hardwareInput;
  }
}


@Component({
  selector: 'opena3xx-delete-hardware-input-dialog-confirm',
  template: `
<h1 mat-dialog-title>Confirmation</h1>
  <div mat-dialog-content>Are you sure you want to delete {{hardwareInputName}} Hardware Input?</div>
  <form autocomplete="off">
  <mat-form-field class="example-full-width">
  <input  (input)="onInputChange($event.target)" matInput placeholder="Enter the word {{hardwareInputName}} to confirm" value="">
  </mat-form-field>
  </form>
  <div mat-dialog-actions>
  <button mat-button [disabled]="disabled" >Yes</button>
  <button mat-button mat-flat-button color="primary" mat-dialog-close>No</button>
</div>
  `,
  styles: [`

    mat-form-field{
      width:100%;
      margin-top:15px;
    }
  `],
})
export class DeleteHardwareInputDialog implements OnInit {
  disabled: boolean = true;
  hardwareInputName: String = '';

  @Input() hardwareInput: HardwareInputDto;

  ngOnInit() {
    this.hardwareInputName = this.hardwareInput.name;
  }
  onInputChange(target) {
    target.value === this.hardwareInputName ? this.disabled = false : this.disabled = true;
  }
}
