import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { LinkHardwareInputSelectorsDialogComponent } from 'src/app/components/link-hardware-input-selectors-dialog/link-hardware-input-selectors-dialog.component';
import { MapHardwareInputSelectorsDialogComponent } from 'src/app/components/map-hardware-input-selectors-dialog/map-hardware-input-selectors-dialog.component';
import { MapHardwareOutputSelectorsDialogComponent } from 'src/app/components/map-hardware-output-selectors-dialog/map-hardware-output-selectors-dialog.component';
import { ViewHardwareInputSelectorsDialogComponent } from 'src/app/components/view-hardware-input-selectors-dialog/view-hardware-input-selectors-dialog.component';
import { ViewHardwareOutputSelectorsDialogComponent } from 'src/app/components/view-hardware-output-selectors-dialog/view-hardware-output-selectors-dialog.component';
import { HardwareInputDto, HardwareOutputDto, HardwarePanelDto } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { DeleteHardwareInputDialogComponent } from '../../components/delete-hardware-input-dialog/delete-hardware-input-dialog.component';

@Component({
  selector: 'opena3xx-view-hardware-panel-details',
  templateUrl: './view-hardware-panel-details.component.html',
  styleUrls: ['./view-hardware-panel-details.component.scss'],
})
export class ViewHardwarePanelDetailsComponent implements OnInit {
  idParam!: number;
  public hardwarePanelDto: HardwarePanelDto;
  public displayedInputColumns: string[] = ['id', 'name', 'hardwareInputType', 'action'];
  public displayedOutputColumns: string[] = ['id', 'name', 'hardwareOutputType', 'action'];
  inputsDataSource = new MatTableDataSource<HardwareInputDto>();
  outputsDataSource = new MatTableDataSource<HardwareOutputDto>();

  showHardwareInputs: boolean = false;
  showHardwareOutputs: boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    public viewHardwareInputOutputSelectorsDialog: MatDialog,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe((params) => {
      console.log('Received Query Params', params);
      this.idParam = params['id'];
    });
    this.fetchData();
  }

  fetchData() {
    this.dataService
      .getAllHardwarePanelDetails(this.idParam)
      .pipe(
        filter((x) => !!x),
        map((data_received: HardwarePanelDto) => {
          this.hardwarePanelDto = data_received;
          this.inputsDataSource = new MatTableDataSource<HardwareInputDto>(
            this.hardwarePanelDto.hardwareInputs
          );
          this.outputsDataSource = new MatTableDataSource<HardwareOutputDto>(
            this.hardwarePanelDto.hardwareOutputs
          );

          if (this.hardwarePanelDto.hardwareInputs.length > 0) {
            this.showHardwareInputs = true;
          }
          if (this.hardwarePanelDto.hardwareOutputs.length > 0) {
            this.showHardwareOutputs = true;
          }
        })
      )
      .subscribe();
    return;
  }

  onEditHardwareDetails() {
    this.router.navigateByUrl(`/edit/hardware-panel?id=${this.hardwarePanelDto.id}`);
  }

  showInputSelectorDetails(data: HardwareInputDto): void {
    this.viewHardwareInputOutputSelectorsDialog.open(ViewHardwareInputSelectorsDialogComponent, {
      data: data,
      width: '600px',
    });
  }

  mapInputSelector(data: HardwareInputDto): void {
    const dialogRef = this.viewHardwareInputOutputSelectorsDialog.open(
      MapHardwareInputSelectorsDialogComponent,
      {
        data: data,
        width: '900px',
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }

  linkInputSelector(data: HardwareInputDto) {
    const dialogRef = this.viewHardwareInputOutputSelectorsDialog.open(
      LinkHardwareInputSelectorsDialogComponent,
      {
        data: data,
        width: '900px',
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      this.fetchData();
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

  deleteHardwareInput(hardwareInput: HardwareInputDto) {
    const dialogRef = this.dialog.open(DeleteHardwareInputDialogComponent);
    dialogRef.componentInstance.hardwareInput = hardwareInput;
  }
}
