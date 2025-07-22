import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';

// Simulator Services
import { SimulatorEventService } from './services/simulator-event.service';

// Simulator Components
import { ManageSimulatorEventsComponent } from './components/manage-simulator-events/manage-simulator-events.component';

@NgModule({
  declarations: [
    ManageSimulatorEventsComponent
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
    ManageSimulatorEventsComponent
  ],
  providers: [
    SimulatorEventService
  ]
})
export class SimulatorModule { }
