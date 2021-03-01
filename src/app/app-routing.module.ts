import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EditHardwareInputTypeComponent } from './views/edit-hardware-input-type/edit-hardware-input-type.component';
import { EditHardwareOutputTypeComponent } from './views/edit-hardware-output-type/edit-hardware-output-type.component';
import { ManageHardwareInputTypesComponent } from './views/manage-hardware-input-types/manage-hardware-input-types.component';
import { ManageHardwareOutputTypesComponent } from './views/manage-hardware-output-types/manage-hardware-output-types.component';
import { ManageHardwarePanelsComponent } from './views/manage-hardware-panels/manage-hardware-panels.component';
import { SettingsComponent } from './views/settings/settings.component';
import { ViewHardwarePanelDetailsComponent } from './views/view-hardware-panel-details/view-hardware-panel-details.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'dashboard',
  pathMatch: 'full'
},
{
  path: 'dashboard',
  component: DashboardComponent
},
{
  path: 'manage/hardware-panels',
  component: ManageHardwarePanelsComponent
},
{
  path: 'view/hardware-panel-details',
  component: ViewHardwarePanelDetailsComponent
},
{
  path: 'manage/hardware-input-types',
  component: ManageHardwareInputTypesComponent
},
{
  path: 'edit/hardware-input-type',
  component: EditHardwareInputTypeComponent
},
{
  path: 'manage/hardware-output-types',
  component: ManageHardwareOutputTypesComponent
},
{
  path: 'edit/hardware-output-type',
  component: EditHardwareOutputTypeComponent
},
{
  path: 'settings',
  component: SettingsComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
