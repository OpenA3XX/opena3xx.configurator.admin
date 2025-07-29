import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';

// Simulator Services
import { SimulatorEventService } from './services/simulator-event.service';

@NgModule({
  declarations: [
    // All components are now standalone
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
    // All components are now standalone
  ],
  providers: [
    SimulatorEventService
  ]
})
export class SimulatorModule { }
