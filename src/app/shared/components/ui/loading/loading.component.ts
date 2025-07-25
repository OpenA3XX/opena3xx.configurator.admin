import { Component } from '@angular/core';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'opena3xx-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
