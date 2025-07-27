import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

// Aircraft Models Services
import { AircraftModelService } from './services/aircraft-model.service';

// Aircraft Models Components
import { ManageAircraftModelsComponent } from './components/manage-aircraft-models/manage-aircraft-models.component';

// Aircraft Models Dialog Components
import { ViewAircraftModelDialogComponent } from './components/view-aircraft-model-dialog/view-aircraft-model-dialog.component';
import { EditAircraftModelDialogComponent } from './components/edit-aircraft-model-dialog/edit-aircraft-model-dialog.component';
import { AddAircraftModelDialogComponent } from './components/add-aircraft-model-dialog/add-aircraft-model-dialog.component';

@NgModule({
  declarations: [
    // Aircraft Models Components
    ManageAircraftModelsComponent,

    // Aircraft Models Dialog Components
    ViewAircraftModelDialogComponent,
    EditAircraftModelDialogComponent,
    AddAircraftModelDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    ManageAircraftModelsComponent,

    // Aircraft Models Dialog Components
    ViewAircraftModelDialogComponent,
    EditAircraftModelDialogComponent,
    AddAircraftModelDialogComponent
  ],
  providers: [
    AircraftModelService
  ]
})
export class AircraftModelsModule { }
