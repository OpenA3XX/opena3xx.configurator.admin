import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HardwareInputTypeDto } from 'src/app/shared/models/models';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface HardwareInputSelectorDetails {
  id: number;
  name: string;
  hardwareInputTypeId: number;
  hardwareInputTypeName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  addHardwareInputType(hardwareInputType: HardwareInputTypeDto): Observable<ApiResponse<HardwareInputTypeDto>> {
    return this.http.post<ApiResponse<HardwareInputTypeDto>>(`${this.BASE_URL}/hardware-input-types`, hardwareInputType);
  }

  /**
   * Update hardware input type
   */
  updateHardwareInputType(hardwareInputType: HardwareInputTypeDto): Observable<ApiResponse<HardwareInputTypeDto>> {
    return this.http.patch<ApiResponse<HardwareInputTypeDto>>(`${this.BASE_URL}/hardware-input-types`, hardwareInputType);
  }

  /**
   * Delete hardware input type
   */
  deleteHardwareInputType(id: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.BASE_URL}/hardware-input-types/${id}`);
  }

  /**
   * Get hardware input selector details
   */
  getHardwareInputSelectorDetails(hardwareInputSelectorId: number): Observable<HardwareInputSelectorDetails> {
    return this.http.get<HardwareInputSelectorDetails>(`${this.BASE_URL}/hardware-input-selectors/${hardwareInputSelectorId}`);
  }
}
