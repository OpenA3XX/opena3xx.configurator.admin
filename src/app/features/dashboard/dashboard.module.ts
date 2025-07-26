import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

// Dashboard Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardHeaderComponent } from './components/dashboard/dashboard-header/dashboard-header.component';
import { SystemOverviewComponent } from './components/dashboard/system-overview/system-overview.component';
import { QuickAccessComponent } from './components/dashboard/quick-access/quick-access.component';
import { ActivityStatusComponent } from './components/dashboard/activity-status/activity-status.component';

// Settings Component
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    // Dashboard Components
    DashboardComponent,
    DashboardHeaderComponent,
    SystemOverviewComponent,
    QuickAccessComponent,
    ActivityStatusComponent,

    // Settings Component
    SettingsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    DashboardComponent,
    SettingsComponent
  ]
})
export class DashboardModule { }
