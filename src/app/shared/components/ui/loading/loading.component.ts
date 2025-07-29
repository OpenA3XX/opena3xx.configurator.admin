import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'opena3xx-loading',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() loading = false;
  @Input() message = 'Loading...';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() overlay = false;
  @Input() fullscreen = false;

  // Computed properties for responsive behavior
  spinnerSize = computed(() => {
    switch (this.size) {
      case 'small': return 24;
      case 'large': return 48;
      default: return 36;
    }
  });

  containerClass = computed(() => {
    const classes = ['loading-container'];
    if (this.overlay) classes.push('overlay');
    if (this.fullscreen) classes.push('fullscreen');
    return classes.join(' ');
  });

  // Getters for template
  get isLoading(): boolean {
    return this.loading;
  }

  get loadingMessage(): string {
    return this.message;
  }

  get spinnerDiameter(): number {
    return this.spinnerSize();
  }

  get containerClasses(): string {
    return this.containerClass();
  }
}
