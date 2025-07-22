import { CUSTOM_ELEMENTS_SCHEMA, NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
// Core Services
import { DataService } from './core/services/data.service';
import { ConfigurationService } from './core/services/configuration.service';
import { RealTimeService } from './core/services/realtime.service';
import { CoreHelper } from './core/core-helper';
import { initializeApp } from './core/app-initializer';

// Feature Modules
import { HardwareModule } from './features/hardware/hardware.module';
import { SimulatorModule } from './features/simulator/simulator.module';
import { DashboardModule } from './features/dashboard/dashboard.module';

// Shared Module
import { SharedModule } from './shared/shared.module';

// Core Components
import { ExitAppDialogComponent } from './core/components/exit-app-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ExitAppDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    // Feature Modules
    HardwareModule,
    SimulatorModule,
    DashboardModule,

    // Shared Module
    SharedModule
  ],
  providers: [
    DataService,
    CoreHelper,
    ConfigurationService,
    RealTimeService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigurationService],
      multi: true
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
