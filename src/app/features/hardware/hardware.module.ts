import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';

// Hardware Services
import { HardwarePanelService } from './services/hardware-panel.service';
import { HardwareBoardService } from './services/hardware-board.service';
import { HardwareInputService } from './services/hardware-input.service';
import { HardwareOutputService } from './services/hardware-output.service';

// Hardware Components











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
    HardwarePanelService,
    HardwareBoardService,
    HardwareInputService,
    HardwareOutputService
  ]
})
export class HardwareModule { }
