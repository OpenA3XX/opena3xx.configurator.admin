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
import { AddAircraftModelComponent } from './components/add-aircraft-model/add-aircraft-model.component';
import { EditAircraftModelComponent } from './components/edit-aircraft-model/edit-aircraft-model.component';
import { ViewAircraftModelDetailsComponent } from './components/view-aircraft-model-details/view-aircraft-model-details.component';

@NgModule({
  declarations: [
    // Aircraft Models Components
    ManageAircraftModelsComponent,
    AddAircraftModelComponent,
    EditAircraftModelComponent,
    ViewAircraftModelDetailsComponent
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
    AddAircraftModelComponent,
    EditAircraftModelComponent,
    ViewAircraftModelDetailsComponent
  ],
  providers: [
    AircraftModelService
  ]
})
export class AircraftModelsModule { }
