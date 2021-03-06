import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HardwareInputTypeDto } from "../models/hardware.input.type.dto";
import { HardwareOutputTypeDto } from "../models/hardware.output.type.dto";

@Injectable()
export class HttpService {

  private BASE_URL = "http://localhost:5000";

  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(private http: HttpClient) {
  }

  get(url: string) {
    return this.http.get(url);
  }

  getAllHardwarePanelOverviewDetails(){
      return this.http.get(`${this.BASE_URL}/hardware-panel/overview/all`);
  }

  getAllHardwarePanelDetails(id: Number){
    return this.http.get(`${this.BASE_URL}/hardware-panel/details/${id}`);
}

  getAllHardwareInputTypes(){
    return this.http.get(`${this.BASE_URL}/hardware-input-types`);
  }

  getHardwareInputTypeById(id: Number){
    return this.http.get(`${this.BASE_URL}/hardware-input-types/${id}`);
  }

  updateHardwareInputType(hardwareInputTypeDto: HardwareInputTypeDto){
    return this.http.patch(`${this.BASE_URL}/hardware-input-types`, hardwareInputTypeDto);
  }


  getAllHardwareOutputTypes(){
    return this.http.get(`${this.BASE_URL}/hardware-output-types`);
  }

  getHardwareOutputTypeById(id: Number){
    return this.http.get(`${this.BASE_URL}/hardware-output-types/${id}`);
  }

  updateHardwareOutputType(hardwareOutputTypeDto: HardwareOutputTypeDto){
    return this.http.patch(`${this.BASE_URL}/hardware-output-types`, hardwareOutputTypeDto);
  }

  getAllSimulatorEvents(){
    return this.http.get(`${this.BASE_URL}/simulator-event/all`);
  }

  getSettingsForm(){
    return this.http.get(`${this.BASE_URL}/forms/settings`);
  }
  getSimLinkInputSelectorForm(hardwareInputSelectorId: number){
    return this.http.get(`${this.BASE_URL}/forms/sim-link/input-selector/${hardwareInputSelectorId}`);
  }
  getHardwareBoardForHardwareInputSelectorForm(hardwareInputSelectorId: number){
    return this.http.get(`${this.BASE_URL}/forms/hardware-board-link/input-selector/${hardwareInputSelectorId}`);
  }

  getAllConfiguration(){
    return this.http.get(`${this.BASE_URL}/configuration`);
  }

  updateAllConfiguration(data: any){
    console.log(data);
    return this.http.post<any>(`${this.BASE_URL}/configuration`, data);
  }
}
