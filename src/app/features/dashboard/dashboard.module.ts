import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';

// Dashboard Services
import { DashboardService } from './services/dashboard.service';
import { SettingsService } from './services/settings.service';
import { CodeEditorModule } from '@ngstack/code-editor';

// Dashboard Components
import { ConsoleComponent } from './components/console/console.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    ConsoleComponent,
    DashboardComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    SharedModule,
    CodeEditorModule.forRoot()
  ],
  exports: [
    ConsoleComponent,
    DashboardComponent,
    SettingsComponent
  ],
  providers: [
    DashboardService,
    SettingsService
  ]
})
export class DashboardModule { }
