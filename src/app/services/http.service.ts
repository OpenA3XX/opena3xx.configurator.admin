import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HardwareInputTypeDto } from "../models/hardware.input.type.dto";
import { HardwareOutputTypeDto } from "../models/hardware.output.type.dto";

@Injectable()
export class HttpService {

  private BASE_URL = "http://localhost:5000";

  constructor(private http: HttpClient) {
  }

  get(url: string) {
    return this.http.get(url);
  }

  getAllHardwarePanelOverviewDetails(){
      return this.http.get(`${this.BASE_URL}/hardware-panel/overview/all`)
  }

  getAllHardwarePanelDetails(id: Number){
    return this.http.get(`${this.BASE_URL}/hardware-panel/details/${id}`)
}

  getAllHardwareInputTypes(){
    return this.http.get(`${this.BASE_URL}/hardware-input-types`)
  }

  getHardwareInputTypeById(id: Number){
    return this.http.get(`${this.BASE_URL}/hardware-input-types/${id}`)
  }

  updateHardwareInputType(hardwareInputTypeDto: HardwareInputTypeDto){
    return this.http.patch(`${this.BASE_URL}/hardware-input-types`, hardwareInputTypeDto);
  }


  getAllHardwareOutputTypes(){
    return this.http.get(`${this.BASE_URL}/hardware-output-types`)
  }

  getHardwareOutputTypeById(id: Number){
    return this.http.get(`${this.BASE_URL}/hardware-output-types/${id}`)
  }

  updateHardwareOutputType(hardwareOutputTypeDto: HardwareOutputTypeDto){
    return this.http.patch(`${this.BASE_URL}/hardware-output-types`, hardwareOutputTypeDto);
  }

  getAllSimulatorEvents(){
    return this.http.get(`${this.BASE_URL}/simulator-event/all`)
  }
}
