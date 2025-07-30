import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';

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
  headerActions: PageHeaderAction[] = [];

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }

  constructor(private router: Router) {
    this.initializeHeaderActions();
  }

  private initializeHeaderActions() {
    this.headerActions = [
      {
        label: () => this.isConnected ? 'Disconnect' : 'Connect',
        icon: () => this.isConnected ? 'wifi_off' : 'wifi',
        color: () => this.isConnected ? 'warn' : 'primary',
        onClick: () => this.isConnected ? this.onDisconnect() : this.onConnect()
      }
    ];
  }

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
