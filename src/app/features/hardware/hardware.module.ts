import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

// Hardware Services
import { HardwarePanelService } from './services/hardware-panel.service';
import { HardwareBoardService } from './services/hardware-board.service';
import { HardwareInputService } from './services/hardware-input.service';
import { HardwareOutputService } from './services/hardware-output.service';

// Hardware Components
import { AddHardwareInputTypeComponent } from './components/add-hardware-input-type/add-hardware-input-type.component';
import { AddHardwareOutputTypeComponent } from './components/add-hardware-output-type/add-hardware-output-type.component';
import { EditHardwareInputTypeComponent } from './components/edit-hardware-input-type/edit-hardware-input-type.component';
import { EditHardwareOutputTypeComponent } from './components/edit-hardware-output-type/edit-hardware-output-type.component';
import { EditHardwarePanelComponent } from './components/edit-hardware-panel/edit-hardware-panel.component';
import { ManageHardwareBoardsComponent } from './components/manage-hardware-boards/manage-hardware-board.component';
import { ManageHardwareInputTypesComponent } from './components/manage-hardware-input-types/manage-hardware-input-types.component';
import { ManageHardwareOutputTypesComponent } from './components/manage-hardware-output-types/manage-hardware-output-types.component';
import { ManageHardwarePanelsComponent } from './components/manage-hardware-panels/manage-hardware-panels.component';
import { RegisterHardwareBoardComponent } from './components/register-hardware-board/register-hardware-board.component';
import { ViewHardwarePanelDetailsComponent } from './components/view-hardware-panel-details/view-hardware-panel-details.component';

// Hardware Dialog Components
import { LinkHardwareInputSelectorsDialogComponent } from './components/link-hardware-input-selectors-dialog/link-hardware-input-selectors-dialog.component';
import { MapHardwareInputSelectorsDialogComponent } from './components/map-hardware-input-selectors-dialog/map-hardware-input-selectors-dialog.component';
import { MapHardwareOutputSelectorsDialogComponent } from './components/map-hardware-output-selectors-dialog/map-hardware-output-selectors-dialog.component';
import { ViewHardwareInputSelectorsDialogComponent } from './components/view-hardware-input-selectors-dialog/view-hardware-input-selectors-dialog.component';
import { ViewHardwareOutputSelectorsDialogComponent } from './components/view-hardware-output-selectors-dialog/view-hardware-output-selectors-dialog.component';
import { DeleteHardwareInputDialogComponent } from './components/delete-hardware-input-dialog/delete-hardware-input-dialog.component';
import { AddHardwarePanelDialogComponent } from './components/add-hardware-panel-dialog/add-hardware-panel-dialog.component';

// Hardware Form Components
import { LinkHardwareInputSelectorsFormComponent } from './components/link-hardware-input-selectors-form/link-hardware-input-selectors-form.component';
import { MapHardwareInputSelectorsFormComponent } from './components/map-hardware-input-selectors-form/map-hardware-input-selectors-form.component';
import { MapHardwareOutputSelectorsFormComponent } from './components/map-hardware-output-selectors-form/map-hardware-output-selectors-form.component';

// Core Services
import { DataService } from 'src/app/core/services/data.service';

@NgModule({
  declarations: [
    AddHardwareInputTypeComponent,
    AddHardwareOutputTypeComponent,
    EditHardwareInputTypeComponent,
    EditHardwareOutputTypeComponent,
    EditHardwarePanelComponent,
    ManageHardwareBoardsComponent,
    ManageHardwareInputTypesComponent,
    ManageHardwareOutputTypesComponent,
    ManageHardwarePanelsComponent,
    RegisterHardwareBoardComponent,
    ViewHardwarePanelDetailsComponent,

    // Hardware Dialog Components
    LinkHardwareInputSelectorsDialogComponent,
    MapHardwareInputSelectorsDialogComponent,
    MapHardwareOutputSelectorsDialogComponent,
    ViewHardwareInputSelectorsDialogComponent,
    ViewHardwareOutputSelectorsDialogComponent,
    DeleteHardwareInputDialogComponent,
    AddHardwarePanelDialogComponent,

    // Hardware Form Components
    LinkHardwareInputSelectorsFormComponent,
    MapHardwareInputSelectorsFormComponent,
    MapHardwareOutputSelectorsFormComponent,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    SharedModule,
    MatDialogModule
  ],
  exports: [
    AddHardwareInputTypeComponent,
    AddHardwareOutputTypeComponent,
    EditHardwareInputTypeComponent,
    EditHardwareOutputTypeComponent,
    EditHardwarePanelComponent,
    ManageHardwareBoardsComponent,
    ManageHardwareInputTypesComponent,
    ManageHardwareOutputTypesComponent,
    ManageHardwarePanelsComponent,
    RegisterHardwareBoardComponent,
    ViewHardwarePanelDetailsComponent,

    // Hardware Dialog Components
    LinkHardwareInputSelectorsDialogComponent,
    MapHardwareInputSelectorsDialogComponent,
    MapHardwareOutputSelectorsDialogComponent,
    ViewHardwareInputSelectorsDialogComponent,
    ViewHardwareOutputSelectorsDialogComponent,
    DeleteHardwareInputDialogComponent,
    AddHardwarePanelDialogComponent,

    // Hardware Form Components
    LinkHardwareInputSelectorsFormComponent,
    MapHardwareInputSelectorsFormComponent,
    MapHardwareOutputSelectorsFormComponent,

  ],
  providers: [
    HardwarePanelService,
    HardwareBoardService,
    HardwareInputService,
    HardwareOutputService,
    DataService
  ]
})
export class HardwareModule { }
