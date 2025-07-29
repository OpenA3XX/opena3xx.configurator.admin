import { Component, Input, Output, EventEmitter, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'opena3xx-floating-back-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './floating-back-button.component.html',
  styleUrls: ['./floating-back-button.component.scss']
})
export class FloatingBackButtonComponent {
  private router = inject(Router);
  private location = inject(Location);

  @Input() tooltip = 'Go Back';
  @Input() icon = 'arrow_back';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'bottom-right';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();

  // Track current route to determine visibility
  currentRoute = signal<string>('');

  constructor() {
    // Subscribe to router events to track current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute.set(event.url);
    });

    // Set initial route
    this.currentRoute.set(this.router.url);
  }

  // Show button when not on dashboard/home routes
  showButton = computed(() => {
    const route = this.currentRoute();
    const isDashboard = route === '/' || route === '/dashboard' || route.startsWith('/dashboard');
    return !isDashboard;
  });

  // Computed properties
  buttonClass = computed(() => {
    const classes = ['opena3xx-floating-back-button'];
    classes.push(`opena3xx-floating-back-button--${this.color}`);
    classes.push(`opena3xx-floating-back-button--${this.size}`);
    classes.push(`opena3xx-floating-back-button--${this.position}`);
    if (this.disabled) classes.push('opena3xx-floating-back-button--disabled');
    return classes.join(' ');
  });

  onClick(): void {
    if (!this.disabled) {
      this.goBack();
      this.clicked.emit();
    }
  }

  goBack(): void {
    // Try to go back in browser history first
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // Fallback to dashboard if no history
      this.router.navigate(['/dashboard']);
    }
  }

  // Getters for template
  get buttonClasses(): string {
    return this.buttonClass();
  }

  get isDisabled(): boolean {
    return this.disabled;
  }

  get hasTooltip(): boolean {
    return !!this.tooltip;
  }

  get buttonIcon(): string {
    return this.icon;
  }

  get shouldShow(): boolean {
    return this.showButton();
  }
}
