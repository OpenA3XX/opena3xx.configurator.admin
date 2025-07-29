import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'opena3xx-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() type: 'primary' | 'secondary' | 'accent' | 'warn' = 'primary';
  @Input() variant: 'raised' | 'stroked' | 'flat' | 'icon' = 'raised';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Output() clicked = new EventEmitter<void>();

  // Computed properties for responsive behavior
  buttonClass = computed(() => {
    const classes = ['opena3xx-button'];
    classes.push(`opena3xx-button--${this.type}`);
    classes.push(`opena3xx-button--${this.variant}`);
    classes.push(`opena3xx-button--${this.size}`);
    if (this.fullWidth) classes.push('opena3xx-button--full-width');
    if (this.disabled) classes.push('opena3xx-button--disabled');
    if (this.loading) classes.push('opena3xx-button--loading');
    return classes.join(' ');
  });

  iconClass = computed(() => {
    const classes = ['opena3xx-button__icon'];
    if (this.loading) classes.push('opena3xx-button__icon--loading');
    return classes.join(' ');
  });

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }

  // Getters for template
  get buttonClasses(): string {
    return this.buttonClass();
  }

  get iconClasses(): string {
    return this.iconClass();
  }

  get hasIcon(): boolean {
    return !!this.icon;
  }

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  get showSpinner(): boolean {
    return this.loading;
  }
}
