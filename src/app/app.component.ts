import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from './services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { CoreHelper } from './helpers/core-helper';
import { ExitAppDialog } from './views/exit-app-dialog.component';

/**
 * @title Autosize sidenav
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isElectron: boolean = false;
  isExpanded: boolean = true;
  isRightMenuExpanded: boolean = true;
  showSubmenu: boolean = false;
  isShowing: boolean = false;
  isRightMenuShowing: boolean = false;
  showSubSubMenu: boolean = false;
  isFullscreen: boolean = false;
  apiAvailabilityStatus: boolean = false;

  private apiHealthPollingTime: number = 5000;

  fullscreen() {
    var element = document.documentElement;
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
  constructor(
    public router: Router,
    private cookieService: CookieService,
    private dataService: DataService,
    private dialog: MatDialog,
    private coreHelper: CoreHelper
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
    this.dialog.open(ExitAppDialog);
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
}
