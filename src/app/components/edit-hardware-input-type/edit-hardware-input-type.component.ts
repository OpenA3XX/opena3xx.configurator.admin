import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HardwareInputTypeDto } from 'src/app/models/hardware.input.type.dto';
import { filter, map, tap } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import {NgForm} from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'opena3xx-edit-hardware-input-type',
  templateUrl: './edit-hardware-input-type.component.html',
  styleUrls: ['./edit-hardware-input-type.component.scss']
})

export class EditHardwareInputTypeComponent implements OnInit {

  idParam!: Number;
  public data!: any;

  constructor
  (
    public dialog: MatDialog,
    private httpService: HttpService,
    private router: Router
  ){

  }

  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe(params => {
      console.log('Received Query Params', params)
      this.idParam = params.id;
    });
    
    this.httpService.getHardwareInputTypeById(this.idParam)
    .pipe(
      tap(data => console.log('Data received', data)),
      filter(x => !!x),
      map(data => this.data = data)
    ).subscribe();
  }

  updateHardwareInputType(f: NgForm){
    console.log(this.data);
    this.httpService.updateHardwareInputType(this.data).subscribe();

    this.dialog.open(SaveSuccessDialog);
  }

  goBack(){
    this.router.navigateByUrl(`/manage/hardware-input-types`)
  }
}

@Component({
  selector: 'opena3xx-save-success',
  template: `
  <h1 mat-dialog-title>Save Success</h1>
  <div mat-dialog-content>Operation has been completed successfully</div>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close>Close</button>
  </div>
  `,
})
export class SaveSuccessDialog {}

