import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditHardwareInputTypeComponent } from './components/edit-hardware-input-type/edit-hardware-input-type.component';
import { ManageHardwareInputTypesComponent } from './components/manage-hardware-input-types/manage-hardware-input-types.component';
import { ManageHardwarePanelsComponent } from './components/manage-hardware-panels/manage-hardware-panels.component';
import { ViewHardwarePanelDetailsComponent } from './components/view-hardware-panel-details/view-hardware-panel-details.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'manage/hardware-panels',
  pathMatch: 'full'
},
{
  path: 'manage/hardware-panels',
  component: ManageHardwarePanelsComponent
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
  path: 'view/hardware-panel-details',
  component: ViewHardwarePanelDetailsComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
