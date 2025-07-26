import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  HardwareBoardDto,
  MapExtenderBitToHardwareInputSelectorDto,
  MapExtenderBitToHardwareOutputSelectorDto
} from 'src/app/shared/models/models';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface HardwareBoardDetails {
  id: number;
  name: string;
  hardwareBusExtendersCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MappingResponse {
  success: boolean;
  message: string;
}

interface AssociationResponse {
  hardwareBoardId: number;
  hardwareBoardName: string;
  associationType: 'input' | 'output';
}

@Injectable({
  providedIn: 'root'
})
export class HardwareBoardService {
  private BASE_URL: string;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {
    this.BASE_URL = this.configurationService.getApiBaseUrl();
  }

  /**
   * Get all hardware boards
   */
  getAllHardwareBoards(): Observable<HardwareBoardDto[]> {
    return this.http.get<HardwareBoardDto[]>(`${this.BASE_URL}/hardware-boards`);
  }

  /**
   * Add a new hardware board
   */
  addHardwareBoard(hardwareBoard: HardwareBoardDto): Observable<ApiResponse<HardwareBoardDto>> {
    return this.http.post<ApiResponse<HardwareBoardDto>>(`${this.BASE_URL}/hardware-boards`, hardwareBoard);
  }

  /**
   * Get hardware board details by ID
   */
  getHardwareBoardDetails(id: number): Observable<HardwareBoardDetails> {
    return this.http.get<HardwareBoardDetails>(`${this.BASE_URL}/hardware-boards/${id}`);
  }

  /**
   * Map extender bit to hardware input selector
   */
  mapExtenderBitToHardwareInputSelector(
    mapping: MapExtenderBitToHardwareInputSelectorDto
  ): Observable<MappingResponse> {
    return this.http.post<MappingResponse>(`${this.BASE_URL}/hardware-board/map-input-selector`, mapping);
  }

  /**
   * Map extender bit to hardware output selector
   */
  mapExtenderBitToHardwareOutputSelector(
    mapping: MapExtenderBitToHardwareOutputSelectorDto
  ): Observable<MappingResponse> {
    return this.http.post<MappingResponse>(`${this.BASE_URL}/hardware-board/map-output-selector`, mapping);
  }

  /**
   * Get hardware board association for hardware input selector
   */
  getHardwareBoardAssociationForHardwareInputSelector(
    hardwareInputSelectorId: number
  ): Observable<AssociationResponse> {
    return this.http.get<AssociationResponse>(`${this.BASE_URL}/hardware-board/input-selector/${hardwareInputSelectorId}`);
  }

  /**
   * Get hardware board association for hardware output selector
   */
  getHardwareBoardAssociationForHardwareOutputSelector(
    hardwareOutputSelectorId: number
  ): Observable<AssociationResponse> {
    return this.http.get<AssociationResponse>(`${this.BASE_URL}/hardware-board/output-selector/${hardwareOutputSelectorId}`);
  }
}
