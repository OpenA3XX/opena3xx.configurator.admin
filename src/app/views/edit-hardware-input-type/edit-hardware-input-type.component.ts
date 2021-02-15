import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import {NgForm} from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SaveSuccessDialog } from '../../components/save-success-dialog/save-success-dialog.component';

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



