import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CodeEditorModule } from '@ngstack/code-editor';

// Console Components
import { ConsoleComponent } from './components/console/console.component';
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
    ConsoleComponent
  ]
})
export class ConsoleModule { }
