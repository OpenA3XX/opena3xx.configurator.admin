import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RealTimeService } from 'src/app/services/realtime.service';

@Component({
  selector: 'opena3xx-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit, OnDestroy {
  constructor(public realtimeService: RealTimeService, public router: Router) {}
  ngOnDestroy(): void {
    this.realtimeService.disconnect();
  }
  ngOnInit(): void {
    this.realtimeService.connect();
  }

  goBack() {
    this.router.navigateByUrl('/');
  }
}
