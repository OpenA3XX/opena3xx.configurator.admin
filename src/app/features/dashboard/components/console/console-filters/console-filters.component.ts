import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HardwareBoardDto } from 'src/app/shared/models/models';

@Component({
  selector: 'opena3xx-console-filters',
  templateUrl: './console-filters.component.html',
  styleUrls: ['./console-filters.component.scss']
})
export class ConsoleFiltersComponent implements OnInit {
  @Input() hardwareBoards: HardwareBoardDto[] = [];
  @Output() filterChange = new EventEmitter<any>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  filterForm: FormGroup;
  searchValue: string = '';

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      boardIdFilter: [''],
      eventTypeFilter: [''],
      timeRangeFilter: ['']
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.onFilterChange();
    });
  }

  onSearchChange(event: Event): void {
    this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchChange.emit(this.searchValue);
  }

  onFilterChange(): void {
    const filters = this.filterForm.value;
    this.filterChange.emit(filters);
  }

  onClearFilters(): void {
    this.filterForm.reset();
    this.searchValue = '';
    this.clearFilters.emit();
  }

  onApplyFilters(): void {
    this.onFilterChange();
  }
}
