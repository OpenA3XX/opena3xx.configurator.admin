import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'opena3xx-heading',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent {
  @Input() text = '';
  @Input() level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h2';
  @Input() icon = '';
  @Input() color: 'primary' | 'secondary' | 'accent' | 'warn' | 'default' = 'default';
  @Input() align: 'left' | 'center' | 'right' = 'left';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  // Computed properties
  headingClass = computed(() => {
    const classes = ['opena3xx-heading'];
    classes.push(`opena3xx-heading--${this.level}`);
    classes.push(`opena3xx-heading--${this.color}`);
    classes.push(`opena3xx-heading--${this.align}`);
    classes.push(`opena3xx-heading--${this.size}`);
    if (this.icon) classes.push('opena3xx-heading--with-icon');
    return classes.join(' ');
  });

  iconClass = computed(() => {
    const classes = ['opena3xx-heading__icon'];
    classes.push(`opena3xx-heading__icon--${this.size}`);
    return classes.join(' ');
  });

  // Getters for template
  get headingClasses(): string {
    return this.headingClass();
  }

  get iconClasses(): string {
    return this.iconClass();
  }

  get hasIcon(): boolean {
    return !!this.icon;
  }

  get hasText(): boolean {
    return !!this.text;
  }

  get tagName(): string {
    return this.level;
  }
}
