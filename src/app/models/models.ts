export interface HardwareBoardDto{
    id : number
    name : string
    hardwareBusExtendersCount : number
    totalInputOutputs: number
}

export interface HardwareBoardDetailsDto{
    id: number,
    name: string
    ioExtenderBuses: IOExtenderBusDto[]
  }
  
  export interface IOExtenderBusDto{
    id: number,
    name: string
    ioExtenderBusBits: IOExtenderBitDto[]
  }
  
  export interface IOExtenderBitDto{
    id: number,
    name: string,
    hardwareInputSelectorFullName: string,
    hardwareOutputSelectorFullName: string
  }
  
  export interface HardwareInputTypeDto {
    id?: number;
    name: string;
  }
  
  
  export interface HardwareOutputTypeDto {
    id?: number;
    name: string;
  }

  export interface HardwarePanelOverviewDto {
    id: number;
    name: string;
    aircraftModel: string;
    manufacturer: string;
    cockpitArea: string;
    owner: string;
    detailsUrl?: string;
  }
  
  
  export interface HardwarePanelDto{
    id: Number,
    name: String,
    aircraftModel: String,
    manufacturer: String,
    cockpitArea: String,
    owner: String,
    totalInputs: Number,
    totalOutputs: Number,
    hardwareInputs: HardwareInputDto[],
    hardwareOutputs: HardwareOutputDto[]
  }
  
  export interface HardwareInputDto{
    id: Number,
    name: String,
    hardwareInputType: String
    inputSelectors: HardwareInputSelectorDto[]
  
  }

  export interface HardwareInputSelectorDto{
    id: Number,
    name: String
  }
  
  export interface HardwareOutputDto{
    id: Number,
    name: String,
    hardwareOutputType: String
    outputSelectors: HardwareOutputSelectorDto[]
  }
  
  export interface HardwareOutputSelectorDto{
    id: Number,
    name: String
  }
  
  export interface SimulatorEventDto{
    id: Number,
    friendlyName: String,
    eventName: String,
    simulatorEventType: Number,
    simulatorEventTypeName: String,
    simulatorSoftware: Number,
    simulatorSoftwareName: String,
    simulatorEventSdkType: Number,
    simulatorEventSdkTypeName: String,
    eventCode: String
  }
  
  export interface IntegrationType{
    id: Number,
    name: String
  }
  
  export enum SimulatorEventType{
    OutputFromSimulator,
    InputToSimulator
  }
  
  export enum SimulatorSoftware{
    MsFs2020
  }
  
  export enum SimulatorEventSdkType{
    OpenA3XXWasmGauge,
    SimConnectDirect,
    FSUIPC,
    WebSockets
  }

  export interface MapExtenderBitToHardwareInputSelectorDto{
    hardwareInputSelectorId : number,
    hardwareBoardId : number,
    hardwareExtenderBusId : number,
    hardwareExtenderBusBitId : number
  }