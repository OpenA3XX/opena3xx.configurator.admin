import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { HardwareInputDto } from '../../../models/models';

@Component({
  selector: 'opena3xx-link-hardware-input-selectors-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './link-hardware-input-selectors-form.component.html',
  styleUrls: ['./link-hardware-input-selectors-form.component.scss']
})
export class LinkHardwareInputSelectorsFormComponent {
  @Input() hardwareInput: HardwareInputDto | null = null;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  // Signals for reactive state management
  loading = signal(false);
  submitting = signal(false);

  // Form
  linkForm: FormGroup;

  // Form configuration
  formConfig = computed(() => ({
    title: 'Link Hardware Input Selector',
    subtitle: `Link selector for: ${this.hardwareInput?.name || 'Unknown'}`,
    loading: this.submitting()
  }));

  constructor(private formBuilder: FormBuilder) {
    this.linkForm = this.formBuilder.group({
      selectorId: ['', [Validators.required]],
      linkType: ['direct', [Validators.required]],
      isActive: [true],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.linkForm.valid) {
      this.submitting.set(true);
      this.formSubmit.emit(this.linkForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.linkForm.controls).forEach(key => {
      const control = this.linkForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters for template
  get isSubmitting(): boolean {
    return this.submitting();
  }

  get isFormValid(): boolean {
    return this.linkForm.valid;
  }
}
