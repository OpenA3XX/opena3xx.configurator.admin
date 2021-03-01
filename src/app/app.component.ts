import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

/**
 * @title Autosize sidenav
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;


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

  toggle(){
    this.isExpanded = !this.isExpanded;
    this.cookieService.set("opena3xx.sidemenu.visibility.state", this.isExpanded.toString());
  }
  constructor(public router: Router, private cookieService: CookieService){
    this.isExpanded = this.toBoolean(this.cookieService.get("opena3xx.sidemenu.visibility.state"));
  }
  // mouseenter() {
  //   if (!this.isExpanded) {
  //     this.isShowing = true;
  //   }
  // }

  // mouseleave() {
  //   if (!this.isExpanded) {
  //     this.isShowing = false;
  //   }
  // }

  clickDashboard(){
    this.router.navigateByUrl(`/dashboard`);
  }
  clickManageHardwarePanels(){
    this.router.navigateByUrl(`/manage/hardware-panels`);
  }

  clickManageHardwareInputTypes(){
    this.router.navigateByUrl(`/manage/hardware-input-types`);
  }

  clickManageHardwareOutputTypes(){
    this.router.navigateByUrl(`/manage/hardware-output-types`);
  }
  clickSettings(){
    this.router.navigateByUrl(`/settings`);
  }

}