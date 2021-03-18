import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HardwareInputTypeDto } from 'src/app/models/hardware.input.type.dto';

@Component({
  selector: 'opena3xx-add-hardware-input-type',
  templateUrl: './add-hardware-input-type.component.html',
  styleUrls: ['./add-hardware-input-type.component.scss']
})

export class AddHardwareInputTypeComponent {

  public hardwareInputTypeName: string = "";

  private hardwreInputTypeDto : HardwareInputTypeDto = { name : ""}
  constructor
  (
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ){

  }

  addHardwareInputType(f: NgForm){
    if(this.hardwareInputTypeName !== ""){
      this.hardwreInputTypeDto.name = this.hardwareInputTypeName;
    
      this.dataService.addHardwareInputType(this.hardwreInputTypeDto).toPromise().then(()=>{
        this._snackBar.open("Hardware Input Type Saved Successfully", "Ok", {
          duration: 5000
        });
      });
    }
  }

  goBack(){
    this.router.navigateByUrl(`/manage/hardware-input-types`)
  }
}



