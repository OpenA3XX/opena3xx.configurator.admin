import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Data } from "@angular/router";
import { HardwareInputTypeDto } from "../models/hardware.input.type.dto";

@Injectable()
export class HttpService {

  private BASE_URL = "http://localhost:5000";

  constructor(private http: HttpClient) {
  }

  get(url: string) {
    return this.http.get(url);
  }

  getAllHardwarePanelDetails(){
      return this.http.get(`${this.BASE_URL}/hardware-panel/details/all`)
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
}
