import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CodeModel } from '@ngstack/code-editor';
import { RealTimeService } from 'src/app/core/services/realtime.service';

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

  theme = 'vs-dark';

  codeModel: CodeModel = {
    language: 'javascript',
    uri: 'main.js',
    value: '',
  };

  options = {
    contextmenu: true,
    lineNumbers: true,
    minimap: {
      enabled: true,
    },
  };

  onCodeChanged(value) {
    console.log('CODE', value);
  }
}
