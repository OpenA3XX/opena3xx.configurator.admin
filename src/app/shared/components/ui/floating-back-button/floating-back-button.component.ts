import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'opena3xx-floating-back-button',
  templateUrl: './floating-back-button.component.html',
  styleUrls: ['./floating-back-button.component.scss'],
  standalone: false
})
export class FloatingBackButtonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  showButton = false;

  constructor(
    private location: Location,
    private router: Router
  ) {}

    ngOnInit(): void {
    // Subscribe to router events to show/hide button based on navigation history
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateButtonVisibility();
      });

    // Initial check
    this.updateButtonVisibility();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

          private updateButtonVisibility(): void {
    // Show button if we're not on the root/dashboard page
    const currentUrl = this.router.url;

    this.showButton = currentUrl !== '/' &&
                     currentUrl !== '/dashboard' &&
                     currentUrl !== '' &&
                     !currentUrl.includes('dashboard');
  }

  goBack(): void {
    // Check if there's browser history to go back to
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // If no browser history, navigate to dashboard
      this.router.navigateByUrl('/dashboard');
    }
  }
}
