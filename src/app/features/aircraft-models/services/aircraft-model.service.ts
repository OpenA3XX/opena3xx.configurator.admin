import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/core/services/configuration.service';
import { AircraftModelDto, AddAircraftModelDto, UpdateAircraftModelDto } from 'src/app/shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class AircraftModelService {
  private BASE_URL: string;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {
    this.BASE_URL = this.configurationService.getApiBaseUrl();
  }

  /**
   * Get all aircraft models
   */
  getAllAircraftModels(): Observable<AircraftModelDto[]> {
    return this.http.get<AircraftModelDto[]>(`${this.BASE_URL}/aircraft-models`);
  }

  /**
   * Get aircraft model by ID
   */
  getAircraftModelById(id: number): Observable<AircraftModelDto> {
    return this.http.get<AircraftModelDto>(`${this.BASE_URL}/aircraft-models/${id}`);
  }

  /**
   * Add a new aircraft model
   */
  addAircraftModel(aircraftModel: AddAircraftModelDto): Observable<AircraftModelDto> {
    return this.http.post<AircraftModelDto>(`${this.BASE_URL}/aircraft-models`, aircraftModel);
  }

  /**
   * Update aircraft model
   */
  updateAircraftModel(id: number, aircraftModel: UpdateAircraftModelDto): Observable<AircraftModelDto> {
    return this.http.put<AircraftModelDto>(`${this.BASE_URL}/aircraft-models/${id}`, aircraftModel);
  }

  /**
   * Delete aircraft model
   */
  deleteAircraftModel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/aircraft-models/${id}`);
  }

  /**
   * Get active aircraft models only
   */
  getActiveAircraftModels(): Observable<AircraftModelDto[]> {
    return this.http.get<AircraftModelDto[]>(`${this.BASE_URL}/aircraft-models/active`);
  }
}
