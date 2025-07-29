import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Modules
import { MaterialModule } from './material.module';

// Core Modules
import { SharedModule } from './shared/shared.module';

// Feature Modules
import { HardwareModule } from './features/hardware/hardware.module';
import { ConnectivityModule } from './features/connectivity/connectivity.module';
import { SimulatorModule } from './features/simulator/simulator.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { ConsoleModule } from './features/console/console.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { AircraftModelsModule } from './features/aircraft-models/aircraft-models.module';

// App Component
import { AppComponent } from './app.component';

// Routing
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    // AppComponent is now standalone, so it's not declared here
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    SharedModule,
    HardwareModule,
    ConnectivityModule,
    SimulatorModule,
    DashboardModule,
    ConsoleModule,
    NotificationsModule,
    AircraftModelsModule,
    AppRoutingModule,
    // Standalone components are imported directly where needed
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
