import { Injectable } from "@angular/core";

@Injectable()
export class ConfigurationService{

    private API_BASE_URL = "http://localhost:5000";

    constructor(){

    }

    getApiBaseUrl(){
        return this.API_BASE_URL;
    }
}