import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private dataService: DataService,
    private router: Router,
    private _snackBar: MatSnackBar
  ){

  }

  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe(params => {
      console.log('Received Query Params', params)
      this.idParam = params.id;
    });
    
    this.dataService.getHardwareInputTypeById(this.idParam)
    .pipe(
      tap(data => console.log('Data received', data)),
      filter(x => !!x),
      map(data => this.data = data)
    ).subscribe();
  }

  updateHardwareInputType(f: NgForm){
    console.log(this.data);
    this.dataService.updateHardwareInputType(this.data).subscribe();

    this._snackBar.open("Hardware Input Type Saved Successfully", "Ok", {
      duration: 5000
    });
  }

  goBack(){
    this.router.navigateByUrl(`/manage/hardware-input-types`)
  }
}



