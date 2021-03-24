import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from './services/data.service';

/**
 * @title Autosize sidenav
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isElectron = false;
  isExpanded = true;
  isRightMenuExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  isRightMenuShowing = false;
  showSubSubMenu: boolean = false;
  isFullscreen: boolean = false;
  apiAvailabilityStatus: boolean = false;

  private toBoolean(value?: string): boolean {
    if (!value) {
      return false;
    }

    switch (value.toLocaleLowerCase()) {
      case 'true':
      case '1':
      case 'on':
      case 'yes':
        return true;
      default:
        return false;
    }
  }

  fullscreen() {
    var elem = document.documentElement;
    if (!this.isFullscreen) {
      this.isFullscreen = true;
      elem.requestFullscreen();
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
    private dataService: DataService
  ) {
    this.isExpanded = this.toBoolean(
      this.cookieService.get('opena3xx.sidemenu.left.visibility.state')
    );
    this.isRightMenuExpanded = this.toBoolean(
      this.cookieService.get('opena3xx.sidemenu.right.visibility.state')
    );
    this.checkApiHealth();
    setInterval(() => {
      this.checkApiHealth();
    }, 5000);

    let userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') > -1) {
      this.isElectron = true;
    }
  }

  private checkApiHealth() {
    this.dataService
      .checkApiHealth()
      .toPromise()
      .then((data) => {
        if (data === 'Pong from OpenA3XX') {
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
    window.close();
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
}
