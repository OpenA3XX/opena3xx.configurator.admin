import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'opena3xx-console-header',
  templateUrl: './console-header.component.html',
  styleUrls: ['./console-header.component.scss']
})
export class ConsoleHeaderComponent {
  @Input() isConnected: boolean = false;
  @Output() connect = new EventEmitter<void>();
  @Output() disconnect = new EventEmitter<void>();

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
