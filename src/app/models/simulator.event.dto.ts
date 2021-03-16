export interface SimulatorEventDto{
    id: number;
  
    friendlyName: string;
  
    eventName: string;
  
    simulatorEventType: SimulatorEventType;
  
    simulatorEventTypeName: string;
  
    simulatorSoftware: SimulatorSoftware;
  
    simulatorSoftwareName: string;
  
    simulatorEventSdkType: SimulatorEventSdkType;
  
    simulatorEventSdkTypeName: string;
  
    eventCode: string;
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