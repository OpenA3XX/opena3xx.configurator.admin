import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HardwareOutputTypeDto } from 'src/app/shared/models/models';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface HardwareOutputSelectorDetails {
  id: number;
  name: string;
  hardwareOutputTypeId: number;
  hardwareOutputTypeName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class HardwareOutputService {
  private BASE_URL: string;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {
    this.BASE_URL = this.configurationService.getApiBaseUrl();
  }

  /**
   * Get all hardware output types
   */
  getAllHardwareOutputTypes(): Observable<HardwareOutputTypeDto[]> {
    return this.http.get<HardwareOutputTypeDto[]>(`${this.BASE_URL}/hardware-output-types`);
  }

  /**
   * Get hardware output type by ID
   */
  getHardwareOutputTypeById(id: number): Observable<HardwareOutputTypeDto> {
    return this.http.get<HardwareOutputTypeDto>(`${this.BASE_URL}/hardware-output-types/${id}`);
  }

  /**
   * Add a new hardware output type
   */
  addHardwareOutputType(hardwareOutputType: HardwareOutputTypeDto): Observable<ApiResponse<HardwareOutputTypeDto>> {
    return this.http.post<ApiResponse<HardwareOutputTypeDto>>(`${this.BASE_URL}/hardware-output-types`, hardwareOutputType);
  }

  /**
   * Update hardware output type
   */
  updateHardwareOutputType(hardwareOutputType: HardwareOutputTypeDto): Observable<ApiResponse<HardwareOutputTypeDto>> {
    return this.http.patch<ApiResponse<HardwareOutputTypeDto>>(`${this.BASE_URL}/hardware-output-types`, hardwareOutputType);
  }

  /**
   * Delete hardware output type
   */
  deleteHardwareOutputType(id: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.BASE_URL}/hardware-output-types/${id}`);
  }

  /**
   * Get hardware output selector details
   */
  getHardwareOutputSelectorDetails(hardwareOutputSelectorId: number): Observable<HardwareOutputSelectorDetails> {
    return this.http.get<HardwareOutputSelectorDetails>(`${this.BASE_URL}/hardware-output-selectors/${hardwareOutputSelectorId}`);
  }
}
