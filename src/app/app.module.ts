import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, ExitAppDialog } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ManageHardwarePanelsComponent } from './views/manage-hardware-panels/manage-hardware-panels.component';
import { DataService } from './services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { ManageHardwareInputTypesComponent } from './views/manage-hardware-input-types/manage-hardware-input-types.component';
import { ViewHardwarePanelDetailsComponent } from './views/view-hardware-panel-details/view-hardware-panel-details.component';
import { DeleteHardwareInputDialog } from './components/delete-hardware-input-dialog/delete-hardware-input-dialog.component';
import { EditHardwareInputTypeComponent } from './views/edit-hardware-input-type/edit-hardware-input-type.component';
import { ManageHardwareOutputTypesComponent } from './views/manage-hardware-output-types/manage-hardware-output-types.component';
import { EditHardwareOutputTypeComponent } from './views/edit-hardware-output-type/edit-hardware-output-type.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ViewHardwareInputSelectorsDialogComponent } from './components/view-hardware-input-selectors-dialog/view-hardware-input-selectors-dialog.component';
import { MapHardwareInputSelectorsDialogComponent } from './components/map-hardware-input-selectors-dialog/map-hardware-input-selectors-dialog.component';
import { MapHardwareOutputSelectorsDialogComponent } from './components/map-hardware-output-selectors-dialog/map-hardware-output-selectors-dialog.component';
import { ViewHardwareOutputSelectorsDialogComponent } from './components/view-hardware-output-selectors-dialog/view-hardware-output-selectors-dialog.component';
import { LinkHardwareInputSelectorsDialogComponent } from './components/link-hardware-input-selectors-dialog/link-hardware-input-selectors-dialog.component';
import { SettingsComponent } from './views/settings/settings.component';
import { InputComponent } from './components/generic-ui/opena3xx-form-components/input/input.component';
import { ButtonComponent } from './components/generic-ui/opena3xx-form-components/button/button.component';
import { SelectComponent } from './components/generic-ui/opena3xx-form-components/select/select.component';
import { DateComponent } from './components/generic-ui/opena3xx-form-components/date/date.component';
import { CheckboxComponent } from './components/generic-ui/opena3xx-form-components/checkbox/checkbox.component';
import { DynamicFieldDirective } from './components/generic-ui/opena3xx-form-components/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './components/generic-ui/opena3xx-form-components/dynamic-form/dynamic-form.component';
import { RadiobuttonComponent } from './components/generic-ui/opena3xx-form-components/radiobutton/radiobutton.component';
import { HeadingComponent } from './components/generic-ui/opena3xx-form-components/heading/heading.component';
import { SlideToggleComponent } from './components/generic-ui/opena3xx-form-components/slide-toggle/slide-toggle.component';
import { SliderComponent } from './components/generic-ui/opena3xx-form-components/slider/slider.component';
import { LinkHardwareInputSelectorsFormComponent } from './components/forms/link-hardware-input-selectors-form/link-hardware-input-selectors-form.component';
import { ConfigurationService } from './services/configuration.service';
import { ManageSimulatorEventsComponent } from './views/manage-simulator-events/manage-simulator-events.component';
import { AddHardwareInputTypeComponent } from './views/add-hardware-input-type/add-hardware-input-type.component';
import { AddHardwareOutputTypeComponent } from './views/add-hardware-output-type/add-hardware-output-type.component';
import { RegisterHardwareBoardComponent } from './views/register-hardware-board/register-hardware-board.component';
import { ManageHardwareBoardsComponent } from './views/manage-hardware-boards/manage-hardware-board.component';
import { MapHardwareInputSelectorsFormComponent } from './components/forms/map-hardware-input-selectors-form/map-hardware-input-selectors-form.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ViewHardwareInputSelectorsDialogComponent,
    ViewHardwareOutputSelectorsDialogComponent,
    MapHardwareInputSelectorsDialogComponent,
    MapHardwareOutputSelectorsDialogComponent,
    LinkHardwareInputSelectorsDialogComponent,
    ManageHardwarePanelsComponent,
    ViewHardwarePanelDetailsComponent,
    ManageHardwareInputTypesComponent,
    AddHardwareInputTypeComponent,
    EditHardwareInputTypeComponent,
    ManageHardwareOutputTypesComponent,
    AddHardwareOutputTypeComponent,
    EditHardwareOutputTypeComponent,
    SettingsComponent,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    HeadingComponent,
    SlideToggleComponent,
    SliderComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    LinkHardwareInputSelectorsFormComponent,
    ManageSimulatorEventsComponent,
    RegisterHardwareBoardComponent,
    ManageHardwareBoardsComponent,
    MapHardwareInputSelectorsFormComponent,
    DeleteHardwareInputDialog,
    ExitAppDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    DataService,
    ConfigurationService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent],
  entryComponents: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
