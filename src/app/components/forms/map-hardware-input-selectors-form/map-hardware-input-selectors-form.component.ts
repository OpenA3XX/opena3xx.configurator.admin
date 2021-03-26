import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  HardwareBoardDetailsDto,
  HardwareInputDto,
  MapExtenderBitToHardwareInputSelectorDto,
} from 'src/app/models/models';
import { FieldConfig, OptionList } from 'src/app/models/field.interface';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HardwareBoardDto } from 'src/app/models/models';
@Component({
  selector: 'opena3xx-map-hardware-input-selectors-form',
  templateUrl: './map-hardware-input-selectors-form.component.html',
  styleUrls: ['./map-hardware-input-selectors-form.component.scss'],
})
export class MapHardwareInputSelectorsFormComponent implements OnInit {
  @Input() hardwareInputSelectorId!: number;

  mapHardwareInputSelectorsForm: FormGroup;

  public hardwareInputDto: HardwareInputDto;

  public hardwareBoardsFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Hardware Board Selection',
    name: 'hardwareBoards',
    inputType: 'text',
    options: [],
    hint: 'Select Hardware Board that is responsible for such Hardware Input',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Hardware Board is Required',
      },
    ],
  };

  public ioExtenderFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Hardware Board IO Extender Bus Selection',
    name: 'hardwareBusExtenders',
    inputType: 'text',
    options: [],
    hint: 'Select Hardware Board IO Extender Bus that is responsible for such Hardware Input',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Hardware Board IO Extender is Required',
      },
    ],
  };

  public ioExtenderBitFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Hardware Board IO Extender Bit Selection',
    name: 'hardwareBusExtenderBits',
    inputType: 'text',
    options: [],
    hint: 'Select Hardware Board IO Extender Bit that is responsible for such Hardware Input',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Hardware Board IO Extender Bit is Required',
      },
    ],
  };

  public eventDetails: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: HardwareInputDto,
    formBuilder: FormBuilder,
    private dataService: DataService,
    private _snackBar: MatSnackBar
  ) {
    this.hardwareInputDto = data;

    this.mapHardwareInputSelectorsForm = formBuilder.group({
      hardwareBoards: [, { validators: [Validators.required], updateOn: 'change' }],
      hardwareBusExtenders: [, { validators: [Validators.required], updateOn: 'change' }],
      hardwareBusExtenderBits: [, { validators: [Validators.required], updateOn: 'change' }],
    });
  }
  ngOnInit(): void {
    this.dataService
      .getHardwareBoardAssociationForHardwareInputSelector(this.hardwareInputSelectorId)
      .toPromise()
      .then((data: MapExtenderBitToHardwareInputSelectorDto) => {
        this.fetchHardwareBoards().finally(() => {
          if (
            data.hardwareBoardId != 0 &&
            data.hardwareExtenderBusBitId != 0 &&
            data.hardwareExtenderBusId != 0
          ) {
            this.loadIoExtenderData(data.hardwareBoardId).finally(() => {
              this.loadIoExtenderBitsData(data.hardwareExtenderBusId).finally(() => {
                console.log(this.mapHardwareInputSelectorsForm.controls['hardwareBoards']);
                this.mapHardwareInputSelectorsForm.controls['hardwareBoards'].setValue(
                  data.hardwareBoardId.toString()
                );
                this.mapHardwareInputSelectorsForm.controls['hardwareBusExtenders'].setValue(
                  data.hardwareExtenderBusId.toString()
                );
                this.mapHardwareInputSelectorsForm.controls['hardwareBusExtenderBits'].setValue(
                  data.hardwareExtenderBusBitId.toString()
                );
              });
            });
          }
        });
      });
  }

  fetchHardwareBoards() {
    return this.dataService
      .getAllHardwareBoards()
      .toPromise()
      .then((hardwareBoardList: HardwareBoardDto[]) => {
        this.hardwareBoardsFieldConfig.options = [];
        _.forEach(hardwareBoardList, (item) => {
          var optionList: OptionList = {
            key: item.id.toString(),
            value: item.name,
          };
          this.hardwareBoardsFieldConfig.options.push(optionList);
        });
      });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }

  onSubmit(formData: any) {
    if (this.mapHardwareInputSelectorsForm.valid) {
      var linkExtenderBitToHardwareInputSelector: MapExtenderBitToHardwareInputSelectorDto = {
        hardwareBoardId: this.mapHardwareInputSelectorsForm.value.hardwareBoards,
        hardwareExtenderBusBitId: this.mapHardwareInputSelectorsForm.value.hardwareBusExtenderBits,
        hardwareExtenderBusId: this.mapHardwareInputSelectorsForm.value.hardwareBusExtenders,
        hardwareInputSelectorId: this.hardwareInputSelectorId,
      };

      this.dataService
        .mapExtenderBitToHardwareInputSelector(linkExtenderBitToHardwareInputSelector)
        .toPromise()
        .then(() => {
          this._snackBar.open('Linking Saved Successfully', 'Ok', {
            duration: 3000,
          });
        });
      console.log(this.hardwareInputSelectorId, this.mapHardwareInputSelectorsForm.value);
    } else {
      this.validateAllFormFields(this.mapHardwareInputSelectorsForm);
    }
  }

  onHardwareBoardSelectChange(selectChangeEvent: any) {
    this.loadIoExtenderData(selectChangeEvent.value);
  }

  onIoExtenderSelectChange(selectChangeEvent: any) {
    this.loadIoExtenderBitsData(selectChangeEvent.value);
  }

  loadIoExtenderData(hardwareBoardId: number) {
    this.ioExtenderFieldConfig.options = [];
    return this.dataService
      .getHardwareBoardDetails(hardwareBoardId)
      .toPromise()
      .then((hardwareBoardDetailsDto: HardwareBoardDetailsDto) => {
        console.log(hardwareBoardDetailsDto);
        _.each(hardwareBoardDetailsDto.ioExtenderBuses, (ioExtender) => {
          var optionList: OptionList = {
            key: ioExtender.id.toString(),
            value: ioExtender.name.replace('Bus', 'Bus '),
          };
          this.ioExtenderFieldConfig.options.push(optionList);
        });
        this.mapHardwareInputSelectorsForm.controls['hardwareBusExtenders'].reset();
      });
  }

  loadIoExtenderBitsData(extenderId: number) {
    this.ioExtenderBitFieldConfig.options = [];
    return this.dataService
      .getHardwareBoardDetails(1)
      .toPromise()
      .then((hardwareBoardDetailsDto: HardwareBoardDetailsDto) => {
        _.each(hardwareBoardDetailsDto.ioExtenderBuses, (ioExtender) => {
          if (ioExtender.id == extenderId) {
            _.each(ioExtender.ioExtenderBusBits, (ioExtenderBit) => {
              var optionList: OptionList = {
                key: ioExtenderBit.id.toString(),
                value: `${ioExtenderBit.name} ${
                  ioExtenderBit.hardwareInputSelectorFullName == null
                    ? ' - Not Mapped'
                    : ' - Currently Mapped to ' + ioExtenderBit.hardwareInputSelectorFullName
                }`.replace('Bit', 'Bit '),
              };
              this.ioExtenderBitFieldConfig.options.push(optionList);
            });
            this.ioExtenderBitFieldConfig.options = _.orderBy(
              this.ioExtenderBitFieldConfig.options,
              ['value'],
              ['asc']
            );
          }
        });
        this.mapHardwareInputSelectorsForm.controls['hardwareBusExtenderBits'].reset();
      });
  }
}
