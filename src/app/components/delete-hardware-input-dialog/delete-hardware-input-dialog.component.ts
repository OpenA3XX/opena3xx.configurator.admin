import { Component, Input, OnInit } from '@angular/core';
import { HardwareInputDto } from 'src/app/models/models';

@Component({
  selector: 'opena3xx-delete-hardware-input-dialog-confirm',
  template: './delete-hardware-input-dialog.component.html',
  styleUrls: ['./delete-hardware-input-dialog.component.scss'],
})
export class DeleteHardwareInputDialog implements OnInit {
  disabled: boolean = true;
  hardwareInputName: String = '';

  @Input() hardwareInput!: HardwareInputDto;

  ngOnInit() {
    this.hardwareInputName = this.hardwareInput.name;
  }
  onInputChange(target: { value: String }) {
    target.value === this.hardwareInputName ? (this.disabled = false) : (this.disabled = true);
  }
}
