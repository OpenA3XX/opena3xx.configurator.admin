import { Component, Output, EventEmitter, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'opena3xx-quick-access',
    templateUrl: './quick-access.component.html',
    styleUrls: ['./quick-access.component.scss'],
    standalone: false
})
export class QuickAccessComponent {
  @Input() isDarkMode: boolean = false;

  @Output() navigateToHardwareEvent = new EventEmitter<void>();
  @Output() navigateToPanelsEvent = new EventEmitter<void>();
  @Output() navigateToConsoleEvent = new EventEmitter<void>();
  @Output() navigateToSettingsEvent = new EventEmitter<void>();

  @HostBinding('class.dark-theme') get darkThemeClass() {
    return this.isDarkMode;
  }

  navigateToHardware(): void {
    this.navigateToHardwareEvent.emit();
  }

  navigateToPanels(): void {
    this.navigateToPanelsEvent.emit();
  }

  navigateToConsole(): void {
    this.navigateToConsoleEvent.emit();
  }

  navigateToSettings(): void {
    this.navigateToSettingsEvent.emit();
  }
}
