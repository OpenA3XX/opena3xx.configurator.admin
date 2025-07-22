import {Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { map} from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FieldConfig, FormConfiguration } from 'src/app/shared/models/field.interface';
import { MatSnackBar} from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { DynamicFormComponent } from 'src/app/shared/components/ui/dynamic-form/dynamic-form.component';

@Component({
  selector: 'opena3xx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent{

  @ViewChild(DynamicFormComponent) form!: DynamicFormComponent;

  dataLoaded: boolean = false;
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

  onFormSubmit(configuration: FormConfiguration) {
    firstValueFrom(this.dataService.updateAllConfiguration(configuration)).then(()=>{
      this._snackBar.open("Settings Saved Successfully", "Ok", {
        duration: 5000
      });
    });
  }
}
