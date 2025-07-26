import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Hardware Components
import { AddHardwareInputTypeComponent } from './features/hardware/components/add-hardware-input-type/add-hardware-input-type.component';
import { AddHardwareOutputTypeComponent } from './features/hardware/components/add-hardware-output-type/add-hardware-output-type.component';
import { AddHardwarePanelComponent } from './features/hardware/components/add-hardware-panel/add-hardware-panel.component';
import { EditHardwareInputTypeComponent } from './features/hardware/components/edit-hardware-input-type/edit-hardware-input-type.component';
import { EditHardwareOutputTypeComponent } from './features/hardware/components/edit-hardware-output-type/edit-hardware-output-type.component';
import { EditHardwarePanelComponent } from './features/hardware/components/edit-hardware-panel/edit-hardware-panel.component';
import { ManageHardwareBoardsComponent } from './features/hardware/components/manage-hardware-boards/manage-hardware-board.component';
import { ManageHardwareInputTypesComponent } from './features/hardware/components/manage-hardware-input-types/manage-hardware-input-types.component';
import { ManageHardwareOutputTypesComponent } from './features/hardware/components/manage-hardware-output-types/manage-hardware-output-types.component';
import { ManageHardwarePanelsComponent } from './features/hardware/components/manage-hardware-panels/manage-hardware-panels.component';
import { RegisterHardwareBoardComponent } from './features/hardware/components/register-hardware-board/register-hardware-board.component';
import { ViewHardwarePanelDetailsComponent } from './features/hardware/components/view-hardware-panel-details/view-hardware-panel-details.component';

// Dashboard Components
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';

// Settings Components
import { SettingsComponent } from './features/settings/components/settings/settings.component';

// Console Components
import { ConsoleComponent } from './features/console/components/console/console.component';

// Simulator Components
import { ManageSimulatorEventsComponent } from './features/simulator/components/manage-simulator-events/manage-simulator-events.component';

// Notifications Components
import { NotificationCenterComponent } from './features/notifications/components/notification-center/notification-center.component';

// Aircraft Models Components
import { ManageAircraftModelsComponent } from './features/aircraft-models/components/manage-aircraft-models/manage-aircraft-models.component';
import { AddAircraftModelComponent } from './features/aircraft-models/components/add-aircraft-model/add-aircraft-model.component';
import { EditAircraftModelComponent } from './features/aircraft-models/components/edit-aircraft-model/edit-aircraft-model.component';
import { ViewAircraftModelDetailsComponent } from './features/aircraft-models/components/view-aircraft-model-details/view-aircraft-model-details.component';

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
    path: 'edit/hardware-panel',
    component: EditHardwarePanelComponent,
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
  {
    path: 'console',
    component: ConsoleComponent,
  },
  {
    path: 'manage/aircraft-models',
    component: ManageAircraftModelsComponent,
  },
  {
    path: 'add/aircraft-model',
    component: AddAircraftModelComponent,
  },
  {
    path: 'edit/aircraft-model',
    component: EditAircraftModelComponent,
  },
  {
    path: 'view/aircraft-model-details',
    component: ViewAircraftModelDetailsComponent,
  },
  {
    path: 'notifications',
    loadChildren: () => import('./features/notifications/notifications.module').then(m => m.NotificationsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
