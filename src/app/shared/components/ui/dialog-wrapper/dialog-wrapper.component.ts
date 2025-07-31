import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface DialogWrapperConfig {
  title: string;
  subtitle?: string;
  icon?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  customClass?: string;
  showFooter?: boolean;
}

@Component({
  selector: 'opena3xx-dialog-wrapper',
  templateUrl: './dialog-wrapper.component.html',
  styleUrls: ['./dialog-wrapper.component.scss'],
  standalone: false
})
export class DialogWrapperComponent {
  @Input() config: DialogWrapperConfig;
  @Input() showLoading = false;
  @Input() showError = false;
  @Input() errorMessage = '';

  @Output() close = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onRetry(): void {
    this.retry.emit();
  }
}
