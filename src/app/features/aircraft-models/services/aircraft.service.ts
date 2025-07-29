import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/services/base-api.service';
import { ConfigurationService } from '../../../core/services/configuration.service';
import {
  AircraftModelDto,
  AddAircraftModelDto,
  UpdateAircraftModelDto
} from '../../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class AircraftService extends BaseApiService<AircraftModelDto> {
  protected override endpoint = 'aircraft-models';

  constructor(
    protected override http: HttpClient,
    protected override configurationService: ConfigurationService
  ) {
    super(http, configurationService);
  }

  // Aircraft Model Operations
  getAllAircraftModels(): Observable<AircraftModelDto[]> {
    return this.getAll();
  }

  getAircraftModelById(id: number): Observable<AircraftModelDto> {
    return this.getById(id);
  }

  addAircraftModel(aircraftModel: AddAircraftModelDto): Observable<AircraftModelDto> {
    return this.create(aircraftModel);
  }

  updateAircraftModel(id: number, aircraftModel: UpdateAircraftModelDto): Observable<AircraftModelDto> {
    return this.update(id, aircraftModel);
  }

  deleteAircraftModel(id: number): Observable<void> {
    return this.delete(id);
  }

  // Additional aircraft-specific operations
  getActiveAircraftModels(): Observable<AircraftModelDto[]> {
    return this.customGet<AircraftModelDto[]>('/active');
  }

  getAircraftModelsByManufacturer(manufacturer: string): Observable<AircraftModelDto[]> {
    return this.customGet<AircraftModelDto[]>('/manufacturer', { manufacturer });
  }

  toggleAircraftModelStatus(id: number, isActive: boolean): Observable<AircraftModelDto> {
    return this.customPatch<AircraftModelDto>(`/${id}/status`, { isActive });
  }

  // Search and filtering
  searchAircraftModels(query: string): Observable<AircraftModelDto[]> {
    return this.customGet<AircraftModelDto[]>('/search', { q: query });
  }

  getAircraftModelsByType(type: string): Observable<AircraftModelDto[]> {
    return this.customGet<AircraftModelDto[]>('/type', { type });
  }
}
