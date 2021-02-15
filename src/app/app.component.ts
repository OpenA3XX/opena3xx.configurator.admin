import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router } from '@angular/router';

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

  constructor(public router: Router){

  }
  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
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
}