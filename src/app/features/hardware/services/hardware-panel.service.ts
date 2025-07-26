import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AddHardwarePanelDto,
  HardwarePanelOverviewDto
} from 'src/app/shared/models/models';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface HardwarePanelDetails {
  id: number;
  name: string;
  aircraftModelId: number;
  aircraftModelName: string;
  manufacturer: string;
  cockpitArea: string;
  owner: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UpdateHardwarePanelDto {
  name?: string;
  aircraftModelId?: number;
  manufacturer?: string;
  cockpitArea?: string;
  owner?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HardwarePanelService {
  private BASE_URL: string;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {
    this.BASE_URL = this.configurationService.getApiBaseUrl();
  }

  /**
   * Get all hardware panel overview details
   */
  getAllHardwarePanelOverviewDetails(): Observable<HardwarePanelOverviewDto[]> {
    return this.http.get<HardwarePanelOverviewDto[]>(`${this.BASE_URL}/hardware-panel/overview/all`);
  }

  /**
   * Get hardware panel details by ID
   */
  getHardwarePanelDetails(id: number): Observable<HardwarePanelDetails> {
    return this.http.get<HardwarePanelDetails>(`${this.BASE_URL}/hardware-panel/details/${id}`);
  }

  /**
   * Add a new hardware panel
   */
  addHardwarePanel(hardwarePanel: AddHardwarePanelDto): Observable<ApiResponse<HardwarePanelDetails>> {
    return this.http.post<ApiResponse<HardwarePanelDetails>>(`${this.BASE_URL}/hardware-panel`, hardwarePanel);
  }

  /**
   * Update hardware panel
   */
  updateHardwarePanel(id: number, hardwarePanel: UpdateHardwarePanelDto): Observable<ApiResponse<HardwarePanelDetails>> {
    return this.http.patch<ApiResponse<HardwarePanelDetails>>(`${this.BASE_URL}/hardware-panel/${id}`, hardwarePanel);
  }

  /**
   * Delete hardware panel
   */
  deleteHardwarePanel(id: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.BASE_URL}/hardware-panel/${id}`);
  }
}
