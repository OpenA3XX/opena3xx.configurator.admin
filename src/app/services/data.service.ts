import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HardwareBoardDto,
  HardwareInputTypeDto,
  HardwareOutputTypeDto,
  MapExtenderBitToHardwareInputSelectorDto,
} from '../models/models';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class DataService {
  private BASE_URL;

  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private configurationService: ConfigurationService) {
    this.BASE_URL = configurationService.getApiBaseUrl();
  }

  get(url: string) {
    return this.http.get(url);
  }

  getAllHardwarePanelOverviewDetails() {
    return this.http.get(`${this.BASE_URL}/hardware-panel/overview/all`);
  }

  getAllHardwarePanelDetails(id: Number) {
    return this.http.get(`${this.BASE_URL}/hardware-panel/details/${id}`);
  }

  getAllHardwareInputTypes() {
    return this.http.get(`${this.BASE_URL}/hardware-input-types`);
  }

  getHardwareInputTypeById(id: Number) {
    return this.http.get(`${this.BASE_URL}/hardware-input-types/${id}`);
  }

  updateHardwareInputType(hardwareInputTypeDto: HardwareInputTypeDto) {
    return this.http.patch(`${this.BASE_URL}/hardware-input-types`, hardwareInputTypeDto);
  }

  getAllHardwareOutputTypes() {
    return this.http.get(`${this.BASE_URL}/hardware-output-types`);
  }

  getHardwareOutputTypeById(id: Number) {
    return this.http.get(`${this.BASE_URL}/hardware-output-types/${id}`);
  }

  updateHardwareOutputType(hardwareOutputTypeDto: HardwareOutputTypeDto) {
    return this.http.patch(`${this.BASE_URL}/hardware-output-types`, hardwareOutputTypeDto);
  }

  getAllSimulatorEvents() {
    return this.http.get(`${this.BASE_URL}/simulator-event/all`);
  }

  getAllSimulatorEventsByIntegrationType(integrationTypeId: number) {
    return this.http.get(`${this.BASE_URL}/simulator-event?integrationTypeId=${integrationTypeId}`);
  }

  getAllIntegrationTypes() {
    return this.http.get(`${this.BASE_URL}/simulator-event/integration-types/all`);
  }

  getSettingsForm() {
    return this.http.get(`${this.BASE_URL}/forms/settings`);
  }
  getSimLinkInputSelectorForm(hardwareInputSelectorId: number) {
    return this.http.get(
      `${this.BASE_URL}/forms/sim-link/input-selector/${hardwareInputSelectorId}`
    );
  }
  getHardwareBoardForHardwareInputSelectorForm(hardwareInputSelectorId: number) {
    return this.http.get(
      `${this.BASE_URL}/forms/hardware-board-link/input-selector/${hardwareInputSelectorId}`
    );
  }

  getAllConfiguration() {
    return this.http.get(`${this.BASE_URL}/configuration`);
  }

  updateAllConfiguration(data: any) {
    console.log(data);
    return this.http.post<any>(`${this.BASE_URL}/configuration`, data);
  }

  linkSimulatorEventToHardwareInputSelector(
    hardwareInputSelectorId: number,
    simulatorEventId: number
  ) {
    return this.http.post<any>(
      `${this.BASE_URL}/simulator-event/link/hardware-input-selector/${hardwareInputSelectorId}/${simulatorEventId}`,
      {}
    );
  }

  getHardwareInputSelectorDetails(hardwareInputSelectorId: number) {
    return this.http.get(`${this.BASE_URL}/hardware-input-selectors/${hardwareInputSelectorId}`);
  }

  sendSimulatorTestEvent(simulatorEventId: number) {
    return this.http.put<any>(`${this.BASE_URL}/simulator-event/test/${simulatorEventId}`, {});
  }

  async checkApiHealth() {
    try {
      const data = await this.http
        .get(`${this.BASE_URL}/core/heartbeat/ping`, {
          responseType: 'text',
        })
        .toPromise();
      if (data === 'Pong from OpenA3XX') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  addHardwareInputType(hardwareInputTypeDto: HardwareInputTypeDto) {
    return this.http.post<HardwareInputTypeDto>(
      `${this.BASE_URL}/hardware-input-types`,
      hardwareInputTypeDto
    );
  }

  addHardwareOutputType(hardwareInputTypeDto: HardwareInputTypeDto) {
    return this.http.post<HardwareInputTypeDto>(
      `${this.BASE_URL}/hardware-output-types`,
      hardwareInputTypeDto
    );
  }

  getAllHardwareBoards() {
    return this.http.get(`${this.BASE_URL}/hardware-boards/all`);
  }

  addHardwareBoards(harwareBoardDto: HardwareBoardDto) {
    return this.http.post<HardwareBoardDto>(
      `${this.BASE_URL}/hardware-boards/add`,
      harwareBoardDto
    );
  }

  getHardwareBoardDetails(id: number) {
    return this.http.get(`${this.BASE_URL}/hardware-boards/${id}`);
  }

  mapExtenderBitToHardwareInputSelector(
    linkExtenderBitToHardwareInputSelectorDto: MapExtenderBitToHardwareInputSelectorDto
  ) {
    return this.http.post<MapExtenderBitToHardwareInputSelectorDto>(
      `${this.BASE_URL}/hardware-boards/link/hardware-input-selector`,
      linkExtenderBitToHardwareInputSelectorDto
    );
  }

  getHardwareBoardAssociationForHardwareInputSelector(hardwareInputSelectorId: number) {
    return this.http.get(
      `${this.BASE_URL}/hardware-boards/hardware-input-selector/${hardwareInputSelectorId}`
    );
  }
}
