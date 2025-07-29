import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/services/base-api.service';
import { ConfigurationService } from '../../../core/services/configuration.service';
import {
  HardwarePanelOverviewDto,
  HardwarePanelDto,
  HardwareInputTypeDto,
  HardwareOutputTypeDto,
  HardwareBoardDto,
  AddHardwarePanelDto,
  MapExtenderBitToHardwareInputSelectorDto,
  MapExtenderBitToHardwareOutputSelectorDto
} from '../../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class HardwareService extends BaseApiService<HardwarePanelOverviewDto> {
  protected override endpoint = 'hardware-panel';

  constructor(
    protected override http: HttpClient,
    protected override configurationService: ConfigurationService
  ) {
    super(http, configurationService);
  }

  // Hardware Panel Operations - using custom methods (correct endpoint)
  getAllPanels(): Observable<HardwarePanelOverviewDto[]> {
    return this.customGet<HardwarePanelOverviewDto[]>('/overview/all');
  }

  getPanelById(id: number): Observable<HardwarePanelDto> {
    return this.customGet<HardwarePanelDto>(`/details/${id}`);
  }

  addPanel(panel: AddHardwarePanelDto): Observable<HardwarePanelDto> {
    return this.customPost<HardwarePanelDto>('/add', panel);
  }

  updatePanel(id: number, panel: Partial<HardwarePanelDto>): Observable<HardwarePanelDto> {
    return this.customPatch<HardwarePanelDto>(`/details/${id}`, panel);
  }

  deletePanel(id: number): Observable<void> {
    return this.customDelete(`/details/${id}`);
  }

  // Hardware Input Type Operations - using direct HTTP calls (different endpoint)
  getAllInputTypes(): Observable<HardwareInputTypeDto[]> {
    return this.http.get<HardwareInputTypeDto[]>(`${this.baseUrl}/hardware-input-types`);
  }

  getInputTypeById(id: number): Observable<HardwareInputTypeDto> {
    return this.http.get<HardwareInputTypeDto>(`${this.baseUrl}/hardware-input-types/${id}`);
  }

  addInputType(inputType: HardwareInputTypeDto): Observable<HardwareInputTypeDto> {
    return this.http.post<HardwareInputTypeDto>(`${this.baseUrl}/hardware-input-types`, inputType, this.httpOptions);
  }

  updateInputType(inputType: HardwareInputTypeDto): Observable<HardwareInputTypeDto> {
    return this.http.patch<HardwareInputTypeDto>(`${this.baseUrl}/hardware-input-types/${inputType.id}`, inputType, this.httpOptions);
  }

  deleteInputType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/hardware-input-types/${id}`, this.httpOptions);
  }

  // Hardware Output Type Operations - using direct HTTP calls (different endpoint)
  getAllOutputTypes(): Observable<HardwareOutputTypeDto[]> {
    return this.http.get<HardwareOutputTypeDto[]>(`${this.baseUrl}/hardware-output-types`);
  }

  getOutputTypeById(id: number): Observable<HardwareOutputTypeDto> {
    return this.http.get<HardwareOutputTypeDto>(`${this.baseUrl}/hardware-output-types/${id}`);
  }

  addOutputType(outputType: HardwareOutputTypeDto): Observable<HardwareOutputTypeDto> {
    return this.http.post<HardwareOutputTypeDto>(`${this.baseUrl}/hardware-output-types`, outputType, this.httpOptions);
  }

  updateOutputType(outputType: HardwareOutputTypeDto): Observable<HardwareOutputTypeDto> {
    return this.http.patch<HardwareOutputTypeDto>(`${this.baseUrl}/hardware-output-types/${outputType.id}`, outputType, this.httpOptions);
  }

  deleteOutputType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/hardware-output-types/${id}`, this.httpOptions);
  }

  // Hardware Board Operations - using direct HTTP calls (different endpoint)
  getAllBoards(): Observable<HardwareBoardDto[]> {
    return this.http.get<HardwareBoardDto[]>(`${this.baseUrl}/hardware-boards/all`);
  }

  getBoardById(id: number): Observable<HardwareBoardDto> {
    return this.http.get<HardwareBoardDto>(`${this.baseUrl}/hardware-boards/${id}`);
  }

  addBoard(board: HardwareBoardDto): Observable<HardwareBoardDto> {
    return this.http.post<HardwareBoardDto>(`${this.baseUrl}/hardware-boards/add`, board, this.httpOptions);
  }

  updateBoard(id: number, board: Partial<HardwareBoardDto>): Observable<HardwareBoardDto> {
    return this.http.patch<HardwareBoardDto>(`${this.baseUrl}/hardware-boards/${id}`, board, this.httpOptions);
  }

  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/hardware-boards/${id}`, this.httpOptions);
  }

  // Hardware Mapping Operations
  mapExtenderBitToInputSelector(mapping: MapExtenderBitToHardwareInputSelectorDto): Observable<void> {
    return this.customPost<void>('/mapping/input-selector', mapping);
  }

  mapExtenderBitToOutputSelector(mapping: MapExtenderBitToHardwareOutputSelectorDto): Observable<void> {
    return this.customPost<void>('/mapping/output-selector', mapping);
  }

  getHardwareBoardAssociationForInputSelector(inputSelectorId: number): Observable<any> {
    return this.customGet<any>(`/mapping/input-selector/${inputSelectorId}`);
  }

  getHardwareBoardAssociationForOutputSelector(outputSelectorId: number): Observable<any> {
    return this.customGet<any>(`/mapping/output-selector/${outputSelectorId}`);
  }

  // Form Operations
  getSimLinkInputSelectorForm(hardwareInputSelectorId: number): Observable<any> {
    return this.customGet<any>(`/forms/sim-link/input-selector/${hardwareInputSelectorId}`);
  }

  getHardwareBoardForInputSelectorForm(hardwareInputSelectorId: number): Observable<any> {
    return this.customGet<any>(`/forms/hardware-board/input-selector/${hardwareInputSelectorId}`);
  }

  getHardwareBoardForOutputSelectorForm(hardwareOutputSelectorId: number): Observable<any> {
    return this.customGet<any>(`/forms/hardware-board/output-selector/${hardwareOutputSelectorId}`);
  }
}
