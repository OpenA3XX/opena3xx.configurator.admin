import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ManageHardwarePanelsComponent } from './components/manage-hardware-panels/manage-hardware-panels.component';
import { HttpService } from './services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { ManageHardwareInputTypesComponent } from './components/manage-hardware-input-types/manage-hardware-input-types.component';
import { ViewHardwarePanelDetailsComponent } from './components/view-hardware-panel-details/view-hardware-panel-details.component';
import { EditHardwareInputTypeComponent, SaveSuccessDialog } from './components/edit-hardware-input-type/edit-hardware-input-type.component';

@NgModule({
  declarations: [
    AppComponent,
    SaveSuccessDialog,
    ManageHardwarePanelsComponent,
    ViewHardwarePanelDetailsComponent,
    ManageHardwareInputTypesComponent,
    EditHardwareInputTypeComponent
    
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
