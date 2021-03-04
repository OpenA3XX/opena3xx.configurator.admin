import {Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { map} from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormComponent } from 'src/app/components/opena3xx-form-components/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/models/field.interface';
import { MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'opena3xx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent{

  @ViewChild(DynamicFormComponent) form!: DynamicFormComponent;

  dataLoaded: Boolean = false;
  settingsConfig: FieldConfig[] = []

  constructor
  (
    public dialog: MatDialog,
    private httpService: HttpService,
    private router: Router,
    private _snackBar: MatSnackBar
  ){

    this.httpService.getSettingsForm()
    .pipe(
      map(data_received => {
        this.settingsConfig = data_received as FieldConfig[];
        this.dataLoaded = true;
      })
    ).subscribe();
  }

  goBack(){
    this.router.navigateByUrl(`/`)
  }

  submit(configuration: any) {
    this.httpService.updateAllConfiguration(configuration).toPromise().then(()=>{
      this._snackBar.open("Settings Saved Successfully", "Ok", {
        duration: 5000
      });
    });
  }
}
