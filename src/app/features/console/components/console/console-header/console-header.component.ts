import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'opena3xx-console-header',
    templateUrl: './console-header.component.html',
    styleUrls: ['./console-header.component.scss'],
    standalone: false
})
export class ConsoleHeaderComponent {
  @Input() isConnected: boolean = false;
  @Input() isDarkMode: boolean = false;
  @Output() connect = new EventEmitter<void>();
  @Output() disconnect = new EventEmitter<void>();

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigateByUrl('/');
  }

  onConnect(): void {
    this.connect.emit();
  }

  onDisconnect(): void {
    this.disconnect.emit();
  }
}
