import { Injectable, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, switchMap, catchError, of } from 'rxjs';
import { HardwarePanelOverviewDto, HardwareInputTypeDto, HardwareOutputTypeDto, HardwareBoardDto } from '../../../shared/models/models';
import { HardwareService } from '../services/hardware.service';

export interface HardwareState {
  panels: HardwarePanelOverviewDto[];
  inputTypes: HardwareInputTypeDto[];
  outputTypes: HardwareOutputTypeDto[];
  boards: HardwareBoardDto[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface HardwareFilters {
  searchTerm: string;
  category: string | null;
  status: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class HardwareStore {
  // State signals
  private _state = signal<HardwareState>({
    panels: [],
    inputTypes: [],
    outputTypes: [],
    boards: [],
    loading: false,
    error: null,
    lastUpdated: null
  });

  private _filters = signal<HardwareFilters>({
    searchTerm: '',
    category: null,
    status: null
  });

  // Public state signals
  readonly state = this._state.asReadonly();
  readonly filters = this._filters.asReadonly();

  // Computed selectors
  readonly panels = computed(() => this.state().panels);
  readonly inputTypes = computed(() => this.state().inputTypes);
  readonly outputTypes = computed(() => this.state().outputTypes);
  readonly boards = computed(() => this.state().boards);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly lastUpdated = computed(() => this.state().lastUpdated);

  // Filtered data
  readonly filteredPanels = computed(() => {
    const panels = this.panels();
    const filters = this.filters();

    return panels.filter(panel => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!panel.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.category && panel.cockpitArea !== filters.category) {
        return false;
      }

      return true;
    });
  });

  readonly filteredInputTypes = computed(() => {
    const inputTypes = this.inputTypes();
    const filters = this.filters();

    return inputTypes.filter(inputType => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!inputType.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  });

  readonly filteredOutputTypes = computed(() => {
    const outputTypes = this.outputTypes();
    const filters = this.filters();

    return outputTypes.filter(outputType => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!outputType.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  });

  readonly filteredBoards = computed(() => {
    const boards = this.boards();
    const filters = this.filters();

    return boards.filter(board => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!board.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Note: HardwareBoardDto doesn't have a status property
      // Filtering by status is not available for boards

      return true;
    });
  });

  // Statistics
  readonly stats = computed(() => {
    const panels = this.panels();
    const inputTypes = this.inputTypes();
    const outputTypes = this.outputTypes();
    const boards = this.boards();

    return {
      totalPanels: panels.length,
      totalInputTypes: inputTypes.length,
      totalOutputTypes: outputTypes.length,
      totalBoards: boards.length,
      // Note: HardwarePanelOverviewDto and HardwareBoardDto don't have status properties
      activePanels: panels.length, // All panels are considered active
      activeBoards: boards.length   // All boards are considered active
    };
  });

  constructor(private hardwareService: HardwareService) {
    // Set up effects for automatic data refresh
    this.setupEffects();
  }

  // Actions
  setLoading(loading: boolean): void {
    this._state.update(state => ({ ...state, loading, error: null }));
  }

  setError(error: string): void {
    this._state.update(state => ({ ...state, error, loading: false }));
  }

  setFilters(filters: Partial<HardwareFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({
      searchTerm: '',
      category: null,
      status: null
    });
  }

  // Data loading actions
  loadAllData(): void {
    this.setLoading(true);

    combineLatest({
      panels: this.hardwareService.getAllPanels(),
      inputTypes: this.hardwareService.getAllInputTypes(),
      outputTypes: this.hardwareService.getAllOutputTypes(),
      boards: this.hardwareService.getAllBoards()
    }).subscribe({
      next: (data) => {
        this._state.update(state => ({
          ...state,
          panels: data.panels,
          inputTypes: data.inputTypes,
          outputTypes: data.outputTypes,
          boards: data.boards,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load hardware data');
      }
    });
  }

  loadPanels(): void {
    this.setLoading(true);
    this.hardwareService.getAllPanels().subscribe({
      next: (panels) => {
        this._state.update(state => ({
          ...state,
          panels,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load panels');
      }
    });
  }

  loadInputTypes(): void {
    this.setLoading(true);
    this.hardwareService.getAllInputTypes().subscribe({
      next: (inputTypes) => {
        this._state.update(state => ({
          ...state,
          inputTypes,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load input types');
      }
    });
  }

  loadOutputTypes(): void {
    this.setLoading(true);
    this.hardwareService.getAllOutputTypes().subscribe({
      next: (outputTypes) => {
        this._state.update(state => ({
          ...state,
          outputTypes,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load output types');
      }
    });
  }

  loadBoards(): void {
    this.setLoading(true);
    this.hardwareService.getAllBoards().subscribe({
      next: (boards) => {
        this._state.update(state => ({
          ...state,
          boards,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load boards');
      }
    });
  }

  // CRUD operations
  addPanel(panel: any): Observable<any> {
    return this.hardwareService.addPanel(panel).pipe(
      switchMap(() => {
        this.loadPanels();
        return of(panel);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to add panel');
        throw error;
      })
    );
  }

  updatePanel(id: number, panel: any): Observable<any> {
    return this.hardwareService.updatePanel(id, panel).pipe(
      switchMap(() => {
        this.loadPanels();
        return of(panel);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to update panel');
        throw error;
      })
    );
  }

  deletePanel(id: number): Observable<void> {
    return this.hardwareService.deletePanel(id).pipe(
      switchMap(() => {
        this.loadPanels();
        return of(void 0);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to delete panel');
        throw error;
      })
    );
  }

  // Cache management
  clearCache(): void {
    this._state.update(state => ({
      ...state,
      panels: [],
      inputTypes: [],
      outputTypes: [],
      boards: [],
      lastUpdated: null
    }));
  }

  refreshData(): void {
    this.loadAllData();
  }

  // Private methods
  private setupEffects(): void {
    // Auto-refresh data every 5 minutes if there's no error
    effect(() => {
      const lastUpdated = this.lastUpdated();
      const error = this.error();

      if (!error && lastUpdated) {
        const timeSinceUpdate = Date.now() - lastUpdated.getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (timeSinceUpdate > fiveMinutes) {
          this.loadAllData();
        }
      }
    });
  }
}
