import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HardwareInputTypeDto } from 'src/app/shared/models/models';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class HardwareInputService {
  private BASE_URL: string;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {
    this.BASE_URL = this.configurationService.getApiBaseUrl();
  }

  /**
   * Get all hardware input types
   */
  getAllHardwareInputTypes(): Observable<HardwareInputTypeDto[]> {
    return this.http.get<HardwareInputTypeDto[]>(`${this.BASE_URL}/hardware-input-types`);
  }

  /**
   * Get hardware input type by ID
   */
  getHardwareInputTypeById(id: number): Observable<HardwareInputTypeDto> {
    return this.http.get<HardwareInputTypeDto>(`${this.BASE_URL}/hardware-input-types/${id}`);
  }

  /**
   * Add a new hardware input type
   */
  addHardwareInputType(hardwareInputType: HardwareInputTypeDto): Observable<any> {
    return this.http.post(`${this.BASE_URL}/hardware-input-types`, hardwareInputType);
  }

  /**
   * Update hardware input type
   */
  updateHardwareInputType(hardwareInputType: HardwareInputTypeDto): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/hardware-input-types`, hardwareInputType);
  }

  /**
   * Delete hardware input type
   */
  deleteHardwareInputType(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/hardware-input-types/${id}`);
  }

  /**
   * Get hardware input selector details
   */
  getHardwareInputSelectorDetails(hardwareInputSelectorId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/hardware-input-selectors/${hardwareInputSelectorId}`);
  }
}
