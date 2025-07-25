import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HardwareBoardDto } from 'src/app/shared/models/models';
import { DataService } from 'src/app/core/services/data.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'opena3xx-console-filters',
  templateUrl: './console-filters.component.html',
  styleUrls: ['./console-filters.component.scss']
})
export class ConsoleFiltersComponent implements OnInit, OnDestroy {
  @Input() hardwareBoards: HardwareBoardDto[] = [];
  @Output() filterChange = new EventEmitter<any>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  filterForm: FormGroup;
  searchValue: string = '';
  loadedHardwareBoards: HardwareBoardDto[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {
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

    // Load hardware boards from backend
    this.loadHardwareBoards();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private async loadHardwareBoards(): Promise<void> {
    this.isLoading = true;
    try {
      this.loadedHardwareBoards = await firstValueFrom(this.dataService.getAllHardwareBoards()) as HardwareBoardDto[];
      console.log('Console Filters - Hardware Boards loaded:', this.loadedHardwareBoards);
    } catch (error: any) {
      console.error('Console Filters - Error fetching hardware boards:', error);
      // Fallback to input data if available
      if (this.hardwareBoards && this.hardwareBoards.length > 0) {
        this.loadedHardwareBoards = this.hardwareBoards;
      }
    } finally {
      this.isLoading = false;
    }
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

  // Get the hardware boards to display in the dropdown
  getHardwareBoardsForFilter(): HardwareBoardDto[] {
    // Use loaded data first, fallback to input data
    return this.loadedHardwareBoards.length > 0 ? this.loadedHardwareBoards : this.hardwareBoards;
  }
}
