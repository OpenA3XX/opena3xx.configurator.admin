import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ManageHardwarePanelsComponent } from './views/manage-hardware-panels/manage-hardware-panels.component';
import { HttpService } from './services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { ManageHardwareInputTypesComponent } from './views/manage-hardware-input-types/manage-hardware-input-types.component';
import { ViewHardwarePanelDetailsComponent } from './views/view-hardware-panel-details/view-hardware-panel-details.component';
import { EditHardwareInputTypeComponent } from './views/edit-hardware-input-type/edit-hardware-input-type.component';
import { ManageHardwareOutputTypesComponent } from './views/manage-hardware-output-types/manage-hardware-output-types.component';
import { EditHardwareOutputTypeComponent } from './views/edit-hardware-output-type/edit-hardware-output-type.component';
import { SaveSuccessDialog } from './components/save-success-dialog/save-success-dialog.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ViewHardwareInputSelectorsDialogComponent } from './components/view-hardware-input-selectors-dialog/view-hardware-input-selectors-dialog.component';
import { MapHardwareInputSelectorsDialogComponent } from './components/map-hardware-input-selectors-dialog/map-hardware-input-selectors-dialog.component';
import { MapHardwareOutputSelectorsDialogComponent } from './components/map-hardware-output-selectors-dialog/map-hardware-output-selectors-dialog.component';
import { ViewHardwareOutputSelectorsDialogComponent } from './components/view-hardware-output-selectors-dialog/view-hardware-output-selectors-dialog.component';
import { LinkHardwareInputSelectorsDialogComponent } from './components/link-hardware-input-selectors-dialog/link-hardware-input-selectors-dialog.component';
import { SettingsComponent } from './views/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SaveSuccessDialog,
    ViewHardwareInputSelectorsDialogComponent,
    ViewHardwareOutputSelectorsDialogComponent,
    MapHardwareInputSelectorsDialogComponent,
    MapHardwareOutputSelectorsDialogComponent,
    LinkHardwareInputSelectorsDialogComponent,
    ManageHardwarePanelsComponent,
    ViewHardwarePanelDetailsComponent,
    ManageHardwareInputTypesComponent,
    EditHardwareInputTypeComponent,
    ManageHardwareOutputTypesComponent,
    EditHardwareOutputTypeComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    HttpService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AppComponent, SaveSuccessDialog],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
