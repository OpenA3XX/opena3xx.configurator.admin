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
