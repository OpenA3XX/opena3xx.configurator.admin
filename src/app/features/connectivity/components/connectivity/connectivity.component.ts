import { Component, OnInit } from '@angular/core';
import { PageHeaderAction } from 'src/app/shared/components/ui/page-header/page-header.component';

@Component({
  selector: 'opena3xx-connectivity',
  templateUrl: './connectivity.component.html',
  styleUrls: ['./connectivity.component.scss'],
  standalone: false
})
export class ConnectivityComponent implements OnInit {

  headerActions: PageHeaderAction[] = [];

  ngOnInit(): void {
    this.initializeHeaderActions();
  }

  private initializeHeaderActions() {
    this.headerActions = [
      {
        label: 'Refresh Status',
        icon: 'refresh',
        color: 'primary',
        onClick: () => this.refreshStatus()
      },
      {
        label: 'Run Diagnostics',
        icon: 'build',
        color: 'primary',
        onClick: () => this.runDiagnostics()
      }
    ];
  }

  private runDiagnostics() {
    console.log('Running diagnostics...');
  }

  private refreshStatus() {
    console.log('Refreshing status...');
  }
}
