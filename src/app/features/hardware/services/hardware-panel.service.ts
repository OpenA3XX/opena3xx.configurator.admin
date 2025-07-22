import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AddHardwarePanelDto,
  HardwarePanelOverviewDto
} from 'src/app/shared/models/models';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

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
  getAllHardwarePanelOverviewDetails(): Observable<HardwarePanelOverviewDto> {
    return this.http.get<HardwarePanelOverviewDto>(`${this.BASE_URL}/hardware-panel/overview/all`);
  }

  /**
   * Get hardware panel details by ID
   */
  getHardwarePanelDetails(id: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/hardware-panel/details/${id}`);
  }

  /**
   * Add a new hardware panel
   */
  addHardwarePanel(hardwarePanel: AddHardwarePanelDto): Observable<any> {
    return this.http.post(`${this.BASE_URL}/hardware-panel`, hardwarePanel);
  }

  /**
   * Update hardware panel
   */
  updateHardwarePanel(id: number, hardwarePanel: any): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/hardware-panel/${id}`, hardwarePanel);
  }

  /**
   * Delete hardware panel
   */
  deleteHardwarePanel(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/hardware-panel/${id}`);
  }
}
