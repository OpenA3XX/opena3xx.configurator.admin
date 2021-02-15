import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HardwareOutputTypeDto } from 'src/app/models/hardware.output.type.dto';
import { filter, map, tap } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import {NgForm} from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SaveSuccessDialog } from '../save-success-dialog/save-success-dialog.component';

@Component({
  selector: 'opena3xx-edit-hardware-output-type',
  templateUrl: './edit-hardware-output-type.component.html',
  styleUrls: ['./edit-hardware-output-type.component.scss']
})

export class EditHardwareOutputTypeComponent implements OnInit {

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
    
    this.httpService.getHardwareOutputTypeById(this.idParam)
    .pipe(
      tap(data => console.log('Data received', data)),
      filter(x => !!x),
      map(data => this.data = data)
    ).subscribe();
  }

  updateHardwareOutputType(f: NgForm){
    console.log(this.data);
    this.httpService.updateHardwareOutputType(this.data).subscribe();

    this.dialog.open(SaveSuccessDialog);
  }

  goBack(){
    this.router.navigateByUrl(`/manage/hardware-output-types`)
  }
}
