import {Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { map} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FieldConfig, FormConfiguration } from 'src/app/shared/models/field.interface';
import { MatSnackBar} from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/data.service';
import { DynamicFormComponent } from 'src/app/shared/components/ui/dynamic-form/dynamic-form.component';

@Component({
    selector: 'opena3xx-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: false
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
        // Make all fields readonly by setting disabled to true and remove submit buttons
        this.settingsConfig = (data_received as FieldConfig[]).map(field => ({
          ...field,
          disabled: true
        }));
        this.dataLoaded = true;
      })
    ).subscribe();
  }

  goBack(){
    this.router.navigateByUrl(`/`)
  }

  // Remove form submission functionality since settings are now readonly
  onFormSubmit() {
    // Form submission is disabled for readonly settings
    this._snackBar.open("Settings are read-only and cannot be modified", "Ok", {
      duration: 5000
    });
  }
}
