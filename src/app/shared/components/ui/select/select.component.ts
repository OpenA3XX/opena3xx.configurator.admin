import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from 'src/app/shared/models/field.interface';

@Component({
    selector: 'opena3xx-forms-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    standalone: false
})
export class SelectComponent implements OnInit, OnChanges {
  @Output() selectChange: EventEmitter<{value: string}> = new EventEmitter<{value: string}>();

  @Input() field!: FieldConfig;

  @Input() group!: FormGroup;

  ngOnInit(): void {
    // Component initialized - no additional setup required
  }

  ngOnChanges(): void {
    // Field configuration changed - no additional processing required
  }

  onSelectComponentChange(event: {value: string}) {
    this.selectChange.emit(event);
  }
}
