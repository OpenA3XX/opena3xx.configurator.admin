import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import {NgForm} from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'opena3xx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

  public rabbitmqhost: any;

  constructor
  (
    public dialog: MatDialog,
    private httpService: HttpService,
    private router: Router
  ){

  }

  ngOnInit(): void {
  }

  goBack(){
    this.router.navigateByUrl(`/manage/hardware-input-types`)
  }

  updateSettings(f: NgForm){
    //console.log(this.data);
   // this.httpService.updateHardwareOutputType(this.data).subscribe();

    //this.dialog.open(SaveSuccessDialog);
  }
}



