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

// Console Sub-Components
import { ConsoleHeaderComponent } from './components/console/console-header/console-header.component';
import { ConsoleStatisticsComponent } from './components/console/console-statistics/console-statistics.component';
import { ConsoleFiltersComponent } from './components/console/console-filters/console-filters.component';
import { FlightEventsTerminalComponent } from './components/console/flight-events-terminal/flight-events-terminal.component';
import { KeepAliveEventsTerminalComponent } from './components/console/keep-alive-events-terminal/keep-alive-events-terminal.component';
import { ConsoleActionsComponent } from './components/console/console-actions/console-actions.component';
import { ConsoleChartsComponent } from './components/console/console-charts/console-charts.component';

@NgModule({
  declarations: [
    ConsoleComponent,
    DashboardComponent,
    SettingsComponent,
    // Console Sub-Components
    ConsoleHeaderComponent,
    ConsoleStatisticsComponent,
    ConsoleFiltersComponent,
    FlightEventsTerminalComponent,
    KeepAliveEventsTerminalComponent,
    ConsoleActionsComponent,
    ConsoleChartsComponent
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
