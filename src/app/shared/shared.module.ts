import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

// Pipes
import { FormatDatePipe } from './pipes/format-date.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

// Directives
import { ClickOutsideDirective } from './directives/click-outside.directive';

@NgModule({
  declarations: [
    // Pipes
    FormatDatePipe,
    TruncatePipe,

    // Directives
    ClickOutsideDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MaterialModule,

    // Pipes
    FormatDatePipe,
    TruncatePipe,

    // Directives
    ClickOutsideDirective
  ]
})
export class SharedModule { }
