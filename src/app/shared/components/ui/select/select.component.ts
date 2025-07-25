import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from 'src/app/shared/models/field.interface';
@Component({
  selector: 'opena3xx-forms-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Output() selectChange: EventEmitter<{value: string}> = new EventEmitter<{value: string}>();

  @Input() field!: FieldConfig;

  @Input() group!: FormGroup;

  ngOnInit() {
    // Component initialized
  }

  ngOnChanges() {
    // Field configuration changed
  }

  onSelectComponentChange(event: {value: string}) {
    this.selectChange.emit(event);
  }
}
