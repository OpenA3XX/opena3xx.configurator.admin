import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from './core/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { CoreHelper } from './core/core-helper';
import { ExitAppDialogComponent } from './core/components/exit-app-dialog.component';
import { ThemeService } from './core/services/theme.service';
import { DependencyStatusService, DependencyStatusResponse } from './core/services/dependency-status.service';
import { Subscription } from 'rxjs';

/**
 * @title Autosize sidenav
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy
{
  isElectron: boolean = false;
  isExpanded: boolean = true;
  isRightMenuExpanded: boolean = true;
  showSubmenu: boolean = false;
  isShowing: boolean = false;
  isRightMenuShowing: boolean = false;
  showSubSubMenu: boolean = false;
  isFullscreen: boolean = false;
  apiAvailabilityStatus: boolean = false;
  isDarkMode: boolean = false;
  dependencyStatus: DependencyStatusResponse | null = null;
  private themeSubscription: Subscription = new Subscription();
  private dependencyStatusSubscription: Subscription = new Subscription();

  private apiHealthPollingTime: number = 5000;

  fullscreen() {
    const element = document.documentElement;
    if (!this.isFullscreen) {
      this.isFullscreen = true;
      element.requestFullscreen();
    } else {
      this.isFullscreen = false;
      document.exitFullscreen();
    }
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.cookieService.set('opena3xx.sidemenu.left.visibility.state', this.isExpanded.toString());
  }

  toggleRight() {
    this.isRightMenuExpanded = !this.isRightMenuExpanded;
    this.cookieService.set(
      'opena3xx.sidemenu.right.visibility.state',
      this.isRightMenuExpanded.toString()
    );
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
  constructor(
    public router: Router,
    private cookieService: CookieService,
    private dataService: DataService,
    private dialog: MatDialog,
    private coreHelper: CoreHelper,
    private renderer: Renderer2,
    private themeService: ThemeService,
    private dependencyStatusService: DependencyStatusService,
    @Inject(DOCUMENT) private document: Document

  ) {
    this.isExpanded = this.coreHelper.toBoolean(
      this.cookieService.get('opena3xx.sidemenu.left.visibility.state')
    );
    this.isRightMenuExpanded = this.coreHelper.toBoolean(
      this.cookieService.get('opena3xx.sidemenu.right.visibility.state')
    );

    this.checkApiHealth();
    setInterval(() => {
      this.checkApiHealth();
    }, this.apiHealthPollingTime);

    this.isElectron = this.coreHelper.isRunningAsApp();
  }

  ngOnInit() {
    this.isElectron = this.coreHelper.isRunningAsApp();

    if (this.isElectron) {
      // Add electron-app class to body
      this.renderer.addClass(this.document.body, 'electron-app');
    }

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Subscribe to dependency status updates
    this.dependencyStatusSubscription = this.dependencyStatusService.status$.subscribe(status => {
      this.dependencyStatus = status;
    });

    // Start polling for dependency status
    this.dependencyStatusService.startPolling();
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
    this.dependencyStatusSubscription.unsubscribe();
  }

  private checkApiHealth() {
    this.dataService
      .checkApiHealth()
      .then((state: boolean) => {
        if (state) {
          this.apiAvailabilityStatus = true;
        } else {
          this.apiAvailabilityStatus = false;
        }
      })
      .catch(() => {
        this.apiAvailabilityStatus = false;
      });
  }
  exit() {
    this.dialog.open(ExitAppDialogComponent);
  }
  clickDashboard() {
    this.router.navigateByUrl(`/dashboard`);
  }
  clickManageHardwarePanels() {
    this.router.navigateByUrl(`/manage/hardware-panels`);
  }

  clickManageHardwareInputTypes() {
    this.router.navigateByUrl(`/manage/hardware-input-types`);
  }

  clickManageHardwareOutputTypes() {
    this.router.navigateByUrl(`/manage/hardware-output-types`);
  }
  clickSettings() {
    this.router.navigateByUrl(`/settings`);
  }
  clickManageSimulatorEvents() {
    this.router.navigateByUrl(`/manage/simulator-events`);
  }
  clickManageHardwareBoards() {
    this.router.navigateByUrl(`/manage/hardware-boards`);
  }
  clickConsole() {
    this.router.navigateByUrl(`/console`);
  }

  // Dependency Status Helper Methods
  getStatusIcon(dependencyName: string): string {
    return this.dependencyStatusService.getStatusIcon(dependencyName);
  }

  getStatusClass(status: string): string {
    return this.dependencyStatusService.getStatusClass(status);
  }

  getDependencyTooltip(dependency: any): string {
    if (!dependency) return 'Status unknown';

    const lastChecked = new Date(dependency.lastChecked).toLocaleTimeString();
    const serviceDescription = this.getServiceDescription(dependency.name);

    return `${dependency.name} (${serviceDescription}): ${dependency.message} (Last checked: ${lastChecked})`;
  }

  getServiceDescription(serviceName: string): string {
    const name = serviceName?.toLowerCase() || '';

    if (name.includes('msfs') || name.includes('flight simulator')) {
      return 'Flight Simulator';
    }

    if (name.includes('rabbitmq')) {
      return 'Message Broker';
    }

    if (name.includes('seq')) {
      return 'Logging Service';
    }

    return 'Service';
  }

  getFormattedTimestamp(timestamp: string | Date): string {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  }
}
