import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';

// Connectivity Components
import { ConnectivityComponent } from './components/connectivity/connectivity.component';
import { ConnectionStatusDashboardComponent } from './components/connection-status-dashboard/connection-status-dashboard.component';
import { HardwarePanelMatrixComponent } from './components/hardware-panel-matrix/hardware-panel-matrix.component';
import { DiagnosticToolsComponent } from './components/diagnostic-tools/diagnostic-tools.component';
import { ConfigurationValidationComponent } from './components/configuration-validation/configuration-validation.component';
import { SystemHealthOverviewComponent } from './components/system-health-overview/system-health-overview.component';
import { NetworkTopologyMapComponent } from './components/network-topology-map/network-topology-map.component';
import { ConnectionLogsComponent } from './components/connection-logs/connection-logs.component';
import { SharedModule } from "src/app/shared/shared.module";

const routes = [
  {
    path: '',
    component: ConnectivityComponent
  }
];

@NgModule({
  declarations: [
    ConnectivityComponent,
    ConnectionStatusDashboardComponent,
    HardwarePanelMatrixComponent,
    DiagnosticToolsComponent,
    ConfigurationValidationComponent,
    SystemHealthOverviewComponent,
    NetworkTopologyMapComponent,
    ConnectionLogsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    SharedModule
]
})
export class ConnectivityModule { }
