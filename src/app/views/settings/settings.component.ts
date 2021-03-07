import {Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { map} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FieldConfig } from 'src/app/models/field.interface';
import { MatSnackBar} from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { DynamicFormComponent } from 'src/app/components/generic-ui/opena3xx-form-components/dynamic-form/dynamic-form.component';

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
    private dataService: DataService,
    private router: Router,
    private _snackBar: MatSnackBar
  ){

    this.dataService.getSettingsForm()
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
    this.dataService.updateAllConfiguration(configuration).toPromise().then(()=>{
      this._snackBar.open("Settings Saved Successfully", "Ok", {
        duration: 5000
      });
    });
  }
}
