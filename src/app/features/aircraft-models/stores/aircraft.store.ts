import { Injectable, signal, computed, effect } from '@angular/core';
import { Observable, switchMap, catchError, of } from 'rxjs';
import { AircraftModelDto, AddAircraftModelDto, UpdateAircraftModelDto } from '../../../shared/models/models';
import { AircraftService } from '../services/aircraft.service';

export interface AircraftState {
  aircraftModels: AircraftModelDto[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface AircraftFilters {
  searchTerm: string;
  manufacturer: string | null;
  type: string | null;
  isActive: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class AircraftStore {
  // State signals
  private _state = signal<AircraftState>({
    aircraftModels: [],
    loading: false,
    error: null,
    lastUpdated: null
  });

  private _filters = signal<AircraftFilters>({
    searchTerm: '',
    manufacturer: null,
    type: null,
    isActive: null
  });

  // Public state signals
  readonly state = this._state.asReadonly();
  readonly filters = this._filters.asReadonly();

  // Computed selectors
  readonly aircraftModels = computed(() => this.state().aircraftModels);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly lastUpdated = computed(() => this.state().lastUpdated);

  // Filtered data
  readonly filteredAircraftModels = computed(() => {
    const aircraftModels = this.aircraftModels();
    const filters = this.filters();

    return aircraftModels.filter(aircraft => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!aircraft.name.toLowerCase().includes(searchLower) &&
            !aircraft.manufacturer.toLowerCase().includes(searchLower) &&
            !aircraft.type.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.manufacturer && aircraft.manufacturer !== filters.manufacturer) {
        return false;
      }

      if (filters.type && aircraft.type !== filters.type) {
        return false;
      }

      if (filters.isActive !== null && aircraft.isActive !== filters.isActive) {
        return false;
      }

      return true;
    });
  });

  // Statistics
  readonly stats = computed(() => {
    const aircraftModels = this.aircraftModels();

    return {
      totalAircraft: aircraftModels.length,
      activeAircraft: aircraftModels.filter(a => a.isActive).length,
      inactiveAircraft: aircraftModels.filter(a => !a.isActive).length,
      manufacturers: new Set(aircraftModels.map(a => a.manufacturer)).size,
      types: new Set(aircraftModels.map(a => a.type)).size
    };
  });

  // Grouped data
  readonly aircraftByManufacturer = computed(() => {
    const aircraftModels = this.aircraftModels();
    const grouped = new Map<string, AircraftModelDto[]>();

    aircraftModels.forEach(aircraft => {
      const manufacturer = aircraft.manufacturer;
      if (!grouped.has(manufacturer)) {
        grouped.set(manufacturer, []);
      }
      grouped.get(manufacturer)!.push(aircraft);
    });

    return grouped;
  });

  readonly aircraftByType = computed(() => {
    const aircraftModels = this.aircraftModels();
    const grouped = new Map<string, AircraftModelDto[]>();

    aircraftModels.forEach(aircraft => {
      const type = aircraft.type;
      if (!grouped.has(type)) {
        grouped.set(type, []);
      }
      grouped.get(type)!.push(aircraft);
    });

    return grouped;
  });

  constructor(private aircraftService: AircraftService) {
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

  setFilters(filters: Partial<AircraftFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({
      searchTerm: '',
      manufacturer: null,
      type: null,
      isActive: null
    });
  }

  // Data loading actions
  loadAircraftModels(): void {
    this.setLoading(true);

    this.aircraftService.getAllAircraftModels().subscribe({
      next: (aircraftModels) => {
        this._state.update(state => ({
          ...state,
          aircraftModels,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load aircraft models');
      }
    });
  }

  loadActiveAircraftModels(): void {
    this.setLoading(true);

    this.aircraftService.getActiveAircraftModels().subscribe({
      next: (aircraftModels) => {
        this._state.update(state => ({
          ...state,
          aircraftModels,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load active aircraft models');
      }
    });
  }

  // CRUD operations
  addAircraftModel(aircraftModel: AddAircraftModelDto): Observable<AircraftModelDto> {
    return this.aircraftService.addAircraftModel(aircraftModel).pipe(
      switchMap((newAircraft) => {
        this.loadAircraftModels();
        return of(newAircraft);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to add aircraft model');
        throw error;
      })
    );
  }

  updateAircraftModel(id: number, aircraftModel: UpdateAircraftModelDto): Observable<AircraftModelDto> {
    return this.aircraftService.updateAircraftModel(id, aircraftModel).pipe(
      switchMap((updatedAircraft) => {
        this.loadAircraftModels();
        return of(updatedAircraft);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to update aircraft model');
        throw error;
      })
    );
  }

  deleteAircraftModel(id: number): Observable<void> {
    return this.aircraftService.deleteAircraftModel(id).pipe(
      switchMap(() => {
        this.loadAircraftModels();
        return of(void 0);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to delete aircraft model');
        throw error;
      })
    );
  }

  toggleAircraftModelStatus(id: number, isActive: boolean): Observable<AircraftModelDto> {
    return this.aircraftService.toggleAircraftModelStatus(id, isActive).pipe(
      switchMap((updatedAircraft) => {
        this.loadAircraftModels();
        return of(updatedAircraft);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to toggle aircraft model status');
        throw error;
      })
    );
  }

  // Search operations
  searchAircraftModels(query: string): Observable<AircraftModelDto[]> {
    return this.aircraftService.searchAircraftModels(query);
  }

  getAircraftModelsByManufacturer(manufacturer: string): Observable<AircraftModelDto[]> {
    return this.aircraftService.getAircraftModelsByManufacturer(manufacturer);
  }

  getAircraftModelsByType(type: string): Observable<AircraftModelDto[]> {
    return this.aircraftService.getAircraftModelsByType(type);
  }

  // Cache management
  clearCache(): void {
    this._state.update(state => ({
      ...state,
      aircraftModels: [],
      lastUpdated: null
    }));
  }

  refreshData(): void {
    this.loadAircraftModels();
  }

  // Private methods
  private setupEffects(): void {
    // Auto-refresh data every 10 minutes if there's no error
    effect(() => {
      const lastUpdated = this.lastUpdated();
      const error = this.error();

      if (!error && lastUpdated) {
        const timeSinceUpdate = Date.now() - lastUpdated.getTime();
        const tenMinutes = 10 * 60 * 1000;

        if (timeSinceUpdate > tenMinutes) {
          this.loadAircraftModels();
        }
      }
    });
  }
}
