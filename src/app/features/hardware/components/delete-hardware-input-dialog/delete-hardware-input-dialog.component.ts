import { Component, Input, OnInit } from '@angular/core';
import { HardwareInputDto } from 'src/app/shared/models/models';

@Component({
    selector: 'opena3xx-delete-hardware-input-dialog-confirm',
    templateUrl: './delete-hardware-input-dialog.component.html',
    styleUrls: ['./delete-hardware-input-dialog.component.scss'],
    standalone: false
})
export class DeleteHardwareInputDialogComponent implements OnInit {
  disabled: boolean = true;
  hardwareInputName: string = '';

  @Input() hardwareInput: HardwareInputDto;

  ngOnInit() {
    this.hardwareInputName = this.hardwareInput.name;
  }
  onInputChange(target) {
    target.value === this.hardwareInputName ? (this.disabled = false) : (this.disabled = true);
  }
}
