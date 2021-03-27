import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddHardwareInputTypeComponent } from './views/add-hardware-input-type/add-hardware-input-type.component';
import { AddHardwareOutputTypeComponent } from './views/add-hardware-output-type/add-hardware-output-type.component';
import { AddHardwarePanelComponent } from './views/add-hardware-panel/add-hardware-panel.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EditHardwareInputTypeComponent } from './views/edit-hardware-input-type/edit-hardware-input-type.component';
import { EditHardwareOutputTypeComponent } from './views/edit-hardware-output-type/edit-hardware-output-type.component';
import { ManageHardwareBoardsComponent } from './views/manage-hardware-boards/manage-hardware-board.component';
import { ManageHardwareInputTypesComponent } from './views/manage-hardware-input-types/manage-hardware-input-types.component';
import { ManageHardwareOutputTypesComponent } from './views/manage-hardware-output-types/manage-hardware-output-types.component';
import { ManageHardwarePanelsComponent } from './views/manage-hardware-panels/manage-hardware-panels.component';
import { ManageSimulatorEventsComponent } from './views/manage-simulator-events/manage-simulator-events.component';
import { RegisterHardwareBoardComponent } from './views/register-hardware-board/register-hardware-board.component';
import { SettingsComponent } from './views/settings/settings.component';
import { ViewHardwarePanelDetailsComponent } from './views/view-hardware-panel-details/view-hardware-panel-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'manage/hardware-panels',
    component: ManageHardwarePanelsComponent,
  },
  {
    path: 'add/hardware-panel',
    component: AddHardwarePanelComponent,
  },
  {
    path: 'view/hardware-panel-details',
    component: ViewHardwarePanelDetailsComponent,
  },
  {
    path: 'manage/hardware-input-types',
    component: ManageHardwareInputTypesComponent,
  },
  {
    path: 'edit/hardware-input-type',
    component: EditHardwareInputTypeComponent,
  },
  {
    path: 'add/hardware-input-type',
    component: AddHardwareInputTypeComponent,
  },
  {
    path: 'manage/hardware-output-types',
    component: ManageHardwareOutputTypesComponent,
  },
  {
    path: 'edit/hardware-output-type',
    component: EditHardwareOutputTypeComponent,
  },
  {
    path: 'add/hardware-output-type',
    component: AddHardwareOutputTypeComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'manage/simulator-events',
    component: ManageSimulatorEventsComponent,
  },
  {
    path: 'manage/hardware-boards',
    component: ManageHardwareBoardsComponent,
  },
  {
    path: 'register/hardware-board',
    component: RegisterHardwareBoardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
