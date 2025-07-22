import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimulatorEventItemDto } from 'src/app/shared/models/models';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class SimulatorEventService {
  private BASE_URL: string;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {
    this.BASE_URL = this.configurationService.getApiBaseUrl();
  }

  /**
   * Get all simulator events
   */
  getAllSimulatorEvents(): Observable<SimulatorEventItemDto[]> {
    return this.http.get<SimulatorEventItemDto[]>(`${this.BASE_URL}/simulator-event/all`);
  }

  /**
   * Get simulator events by integration type
   */
  getAllSimulatorEventsByIntegrationType(integrationTypeId: number): Observable<SimulatorEventItemDto[]> {
    return this.http.get<SimulatorEventItemDto[]>(`${this.BASE_URL}/simulator-event?integrationTypeId=${integrationTypeId}`);
  }

  /**
   * Get all integration types
   */
  getAllIntegrationTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/simulator-event/integration-types/all`);
  }

  /**
   * Send simulator test event
   */
  sendSimulatorTestEvent(simulatorEventId: number): Observable<any> {
    return this.http.post(`${this.BASE_URL}/simulator-event/test/${simulatorEventId}`, {});
  }

  /**
   * Link simulator event to hardware input selector
   */
  linkSimulatorEventToHardwareInputSelector(
    hardwareInputSelectorId: number,
    eventCode: string
  ): Observable<any> {
    return this.http.post(`${this.BASE_URL}/simulator-event/link-input-selector`, {
      hardwareInputSelectorId,
      eventCode
    });
  }
}
